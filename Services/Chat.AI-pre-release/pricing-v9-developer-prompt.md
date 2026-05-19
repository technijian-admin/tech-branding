# Developer Prompt — Chat.ai v9 Pricing System + Resource Lockdown & Auto-Upgrade

> Hand this whole file to the developer. It is the implementation brief for (1) the configuration-driven pricing/billing subsystem, (2) enforcement ("lockdown") on **storage**, **MCP servers (connectors)**, and **memory/RAG databases**, and (3) the continuous metrics + warn-then-upgrade behavior so a customer who outgrows a limit gets warned and then upgraded rather than having their knowledge base break.

---

## 0. Context & conventions (non-negotiable)

The Chat.ai repo currently has **multiple conflicting plan definitions** — `dbo.Plans` (3+ incompatible schemas across seed files), `dbo.PlanTiers` (2 incompatible schemas), `dbo.ClientPlans` / `ClientPlanItems` / `ClientInvoices`, `dbo.LlmModelPricing`, and several `plan_change_requests` / `PlanChanges` tables. **Consolidate all of this into one coherent `pricing.*` schema. Do not add another competing `Plans` table.** Leave the old tables in place, renamed `*_deprecated`, for one release; drop them the release after.

Follow the platform conventions (from `tech-web-shared`):

- **.NET 9, ASP.NET Core** (minimal APIs + controllers as the repo already uses).
- **Dapper with stored procedures only** — no EF query generation, no inline SQL, no LINQ-to-SQL.
- **SQL Server**, multi-tenant via a **`TenantId` column in a shared database** (per ADR-0005 — one DB, `TenantId` on every tenant-scoped table; never a connection-string selector).
- **React 18 + Fluent UI v9** frontend (the repo's existing component library).
- **Every new feature behind a `Microsoft.FeatureManagement` flag** — use `pricing.v9PricingSystem` for the pricing rework and `pricing.resourceEnforcement` for the lockdown/auto-upgrade behavior. Old billing screens stay live until the flags flip.
- **Emit an audit event for every state-changing operation** (plan change, subscription change, discount, tier change, soft-block, auto-upgrade) — to `pricing.AuditLog` *and* the platform audit bus (these are SOC 2 change-management evidence).
- Idempotent migrations (`IF OBJECT_ID(...) IS NULL` / `MERGE`), with rollback. Migration files in `db/migrations/`, SPs in `db/stored-procedures/`, seeds in `db/seeds/`, matching the repo's existing layout.
- **Ask before deleting any existing table.**

The pricing model itself is specified in `docs/pricing/Chat-ai-Pricing-for-Marketing.docx` (the marketing brief) — that document's numbers are the source of truth. Key facts you need here are restated below.

---

## 1. The `pricing.*` schema (consolidated)

Create schema `pricing`. All tables `TenantId`-scoped where applicable; catalog tables (`ModelClass`, `ModelClassAssignment`, `UsageModifier`, `RateCard`, `CreditPriceTier`, `Edition`, `EditionInclusion`, `ResourceSku`) are global (operator-owned, `TenantId` = the platform tenant).

| Table | Purpose / key columns |
|---|---|
| `pricing.ModelClass` | global, versioned. `ModelClassId, Code (Economy/Standard/Frontier), CreditMultiplier (0.5 / 1.0 / 2.5), DisplayName, Description, EffectiveFrom, EffectiveTo, IsActive` |
| `pricing.ModelClassAssignment` | maps `(Provider, ModelId) → ModelClassId`. `IsBaaEligible (bit)`, `EffectiveFrom, EffectiveTo`. This is how "Bedrock-Opus = Frontier, BAA-eligible" / "GPT-5 mini = Economy" gets encoded. Operator-editable; adding a new model = a row here. |
| `pricing.UsageModifier` | global. `Code (CachedInput / Batch / ...), CreditMultiplier (0.25 / 0.6 / ...), Description, IsActive` |
| `pricing.RateCard` | operator-owned, versioned. `RateCardId, Name, Status (Draft/Active/Superseded), EffectiveFrom, EffectiveTo, Currency, CreatedBy, PublishedAt` |
| `pricing.CreditPriceTier` | child of `RateCard`. `CreditPriceTierId, RateCardId, CommitmentMonthlyUsd (0 = PAYG, 2500, 10000, 40000, 100000), PricePerMillionCreditsUsd (18 / 15 / 13 / 11 / 9), FrontierFloorPerMillionEffectiveUsd (30), SortOrder` |
| `pricing.Edition` | operator catalog. `EditionId, Code (Team / Business / EnterpriseCompliant / OnPremiseTeam / OnPremiseBusiness / OnPremiseEnterprise), DisplayName, Description, DeploymentModel (SharedCloud / DedicatedCloud / OnPremise), BasePriceMonthlyUsd, BasePriceAnnualUsd, MinPriceMonthlyUsd (operator floor), IsBaaIncluded (bit), IsModelRoutingLocked (bit), AllowedProviders (JSON array; NULL = all public; ["bedrock","azure_openai"] = locked), SupportTier, SlaPercent, AuditRetentionDays, IsPublished (bit), IsListedPublicly (bit — true only for Team at launch), SortOrder, EffectiveFrom, EffectiveTo` |
| `pricing.EditionInclusion` | child of `Edition`. `EditionInclusionId, EditionId, InclusionType (Credits / StorageTb / McpServers / Assistants / Workflows / KnowledgeBases / Users), IncludedQuantity (use -1 for "unlimited"), Unit, Notes`. Team: 30000000 credits, 1 StorageTb, 3 McpServers, 10 Assistants, 25 Workflows, 1 KnowledgeBase(shared). Business: 300000000 credits, 5 StorageTb, 10 McpServers, -1 Assistants/Workflows. Enterprise/OnPrem: 1000000000+ credits or custom, -1 most things. |
| `pricing.ResourceSku` | operator catalog of metered resources. `ResourceSkuId, Category (DedicatedVectorDb / Storage / McpServer / Addon / Service), SubType (e.g. for DedicatedVectorDb: Small/Medium/Large/XLarge/LicensedSurcharge; for McpServer: PublicCatalog/TechnijianCatalog/BespokeCustom/Byo/PassThrough), Code, DisplayName, Description, BillingUnit (per_instance_month / per_tb_month / per_mcp_server_month / one_time / per_hour), UnitPriceUsd, MinUnitPriceUsd (operator floor), OneTimeFeeMinUsd, OneTimeFeeMaxUsd (for bespoke MCP builds), ComplexityBand (nullable), CapacityMetadata (JSON — for DedicatedVectorDb: {pricedCapacityVectors, physicalCapacityVectors, pricedCapacityQps, physicalCapacityQps, ram, replicas}), NextTierSkuId (nullable — the SKU this auto-upgrades to; NULL = top of ladder), IsActive, EffectiveFrom, EffectiveTo`. Seed: DedicatedVectorDb Small $500 (priced 10M / physical ~13M vectors, NextTier = Medium), Medium $1200 (priced 50M / physical ~62M, NextTier = Large), Large $2500 (priced 200M / physical ~245M, NextTier = XLarge), XLarge $5000 (priced custom / NextTier = NULL → custom dedicated cluster, requires approval); Storage `per_tb_month` $50; McpServer PublicCatalog $50–$75, TechnijianCatalog $150–$250 (use `ComplexityBand`), BespokeCustom maintenance $150–$500/mo + `OneTimeFeeMin/Max` $8000/$25000, Byo $0, PassThrough = pass-through+20%. |
| `pricing.Plan` | the actual assignable plan — a catalog edition as-is OR a tenant-customized clone. `PlanId, TenantId (owner; operator catalog plans = platform tenant; reseller-custom plans = the reseller's TenantId), BasedOnEditionId, Name, Status (Draft/Active/Archived), DeploymentModel, BasePriceMonthlyUsd (>= BasedOnEdition.MinPriceMonthlyUsd — SP-enforced), BasePriceAnnualUsd, RateCardId, IsModelRoutingLocked, AllowedProviders (JSON), ByoKeysAllowed (bit), ByoKeysOrchestrationFeePerMillionUsd (default 2.00), Notes, CreatedBy, CreatedAt, UpdatedBy, UpdatedAt` |
| `pricing.PlanInclusion` | child of `Plan` (cloned from `EditionInclusion`, then editable within bounds — can raise included quantities, can't price below operator floor). Same shape as `EditionInclusion`. |
| `pricing.PlanResourceSku` | which resource SKUs are available/bundled on a plan and at what (possibly tenant-adjusted) price. `PlanResourceSkuId, PlanId, ResourceSkuId, OverridePriceUsd (nullable; if set must be >= ResourceSku.MinUnitPriceUsd — SP-enforced), IsIncluded (bit), IncludedQuantity` |
| `pricing.Subscription` | a client's active subscription. `SubscriptionId, TenantId, ClientId, PlanId, Status (Trialing/Active/PastDue/Cancelled/Paused), BillingCycle (Monthly/Annual), CommitmentTierId (nullable → which CreditPriceTier they've committed to), CommittedMonthlyUsd, DeploymentModel, ByoKeysEnabled (bit), CurrentPeriodStart, CurrentPeriodEnd, SpendCapUsd (nullable — hard cap for credits this period), TrialEndsAt, StartedAt, CancelledAt, GrandfatheredRateCardId (nullable — founding customers keep an old rate card), GrandfatherExpiresAt` |
| `pricing.SubscriptionResource` | provisioned metered resources on a subscription (dedicated vector DBs, purchased extra storage blocks, MCP servers beyond included, add-ons). `SubscriptionResourceId, SubscriptionId, TenantId, ClientId, ResourceSkuId, ResourceType (mirror of ResourceSku.Category for fast filtering), CurrentTierSkuId (for tiered resources like vector DBs — starts = ResourceSkuId, changes on upgrade), Quantity (e.g. # of storage TB blocks, or 1 for a vector DB instance, or 1 per MCP server), UnitPriceUsd (snapshotted at provision/upgrade time), OneTimeBuildFeeUsd (nullable — bespoke MCP), ReferencedEntityId (nullable — for McpServer rows, the McpServerId from the platform MCP catalog; for DedicatedVectorDb rows, the knowledge-base/vector-DB instance id), IsCustomerHosted (bit — BYO MCP / BYO vector DB → no charge), WriteBlocked (bit — set by enforcement when over grace), ProvisionedAt, DeprovisionedAt, Status (Provisioning/Active/Upgrading/Suspended/Deprovisioned)` |
| `pricing.AutoUpgradePolicy` | per subscription, per resource type. `AutoUpgradePolicyId, SubscriptionId, TenantId, ClientId, ResourceType (DedicatedVectorDb / Storage / McpServers / Credits), IsAutoUpgradeEnabled (bit — default 0 = warn-only), MaxAutoUpgradeTierSkuId (nullable — auto-upgrade up to but not past this SKU; NULL with enabled = no ceiling but still stops at top of ladder), GraceDays (default 7 — how long a resource stays writable past 100% before soft-block when auto-upgrade is off/exhausted), AllowForcedUpgradeToPreventDataLoss (bit — default 1; the absolute last-resort path), UpdatedBy, UpdatedAt` |
| `pricing.PlanChangeRequest` | the plan-change / commit-change / edition-upgrade workflow (consolidates v8's `plan_change_requests` / `PlanChanges`). `PlanChangeRequestId, SubscriptionId, TenantId, ClientId, RequestedPlanId, RequestedCommitmentTierId (nullable), Reason (nullable), Origin (UserRequested / TenantAdmin / SystemRecommendedEditionUpgrade), RequestedBy, RequestedAt, Status (Pending/Approved/Rejected/Applied), ApprovedBy, EffectiveAt (next billing cycle, or immediate for upgrades), AppliedAt, Notes` |
| `pricing.ResourceTierChange` | every auto- or manual tier change of a `SubscriptionResource`. `ResourceTierChangeId, SubscriptionResourceId, SubscriptionId, TenantId, ClientId, FromSkuId, ToSkuId, FromUnitPriceUsd, ToUnitPriceUsd, ChangeType (AutoUpgrade / ManualUpgrade / ForcedUpgradeDataLossPrevention / Downgrade), TriggerMetric (VectorCount / StorageBytes / Qps / Latency / McpServerCount / ManualRequest), TriggeredAt, AppliedAt, ProratedChargeUsd, InvoiceLineItemId (nullable), ApprovedBy (nullable — NULL for auto/forced), Notes` |
| `pricing.UsageLedger` | raw AI-usage meter, one row per LLM call (or hourly rollup). `UsageLedgerId, TenantId, ClientId, SubscriptionId, OccurredAt, UsageType (LlmTokens / VectorDbHosting / Storage / McpServerSync), Provider, ModelId, ModelClassId, RawInputTokens, CachedInputTokens, RawOutputTokens, IsBatch (bit), CreditsConsumed (computed — see §2), DeploymentModel, CorrelationId`. Indexes: `(TenantId, ClientId, SubscriptionId, OccurredAt)`, `(SubscriptionId, OccurredAt)`. |
| `pricing.ResourceUsageSample` | the meter for **non-AI metered resources** (storage, MCP-server count, RAG-DB capacity). One row per resource per sample interval. `ResourceUsageSampleId, SubscriptionResourceId, SubscriptionId, TenantId, ClientId, ResourceType, MeasuredAt, CurrentValue (the headline metric: bytes for Storage, count for McpServers, vector count for DedicatedVectorDb), AllowanceValue (included + purchased), UtilizationPercent (the max across all dimensions for this resource), SecondaryMetricsJson (for DedicatedVectorDb: {vectorCount, collectionCount, indexSizeBytes, storageBytes, ingestRateLast24h, queriesLast24h, currentQps, p50LatencyMs, p95LatencyMs, p99LatencyMs, pricedCapacityVectors, physicalCapacityVectors, pricedCapacityQps, physicalCapacityQps, projectedDaysToCapacity}), HealthState (Healthy / Warning / Critical / AtCapacity / Exceeded / Upgrading)`. Sampled every 15 min for vector DBs and storage; hourly for MCP-server counts. |
| `pricing.ResourceUsageRollup` | daily/monthly aggregates per `SubscriptionResource` for dashboards & invoicing (peak utilization, average, days-in-grace, etc.). |
| `pricing.ResourceAlert` | every alert fired for a metered resource. `ResourceAlertId, SubscriptionResourceId, SubscriptionId, TenantId, ClientId, ResourceType, ThresholdPercent (80 / 90 / 95 / 100 / GraceExceeded / ProjectedCapacitySoon), Severity (Info / Warning / Critical / Urgent), Message, FiredAt, NotifiedChannels (JSON — InApp / Email / Sms / TenantAdmin), AcknowledgedAt, AcknowledgedBy, ResolutionAction (None / AutoUpgraded / ManualUpgraded / ForcedUpgraded / SoftBlocked / DataFreed)`. Debounce: at most one alert per (resource, threshold) per period unless utilization drops below the threshold and rises again. |
| `pricing.UsageRollup` | daily/monthly AI-credit aggregates per subscription for fast billing & dashboards (`CreditsConsumed, CreditsIncluded, CreditsOverage, breakdown by ModelClass`). |
| `pricing.Invoice` + `pricing.InvoiceLineItem` | generated per billing cycle. Invoice: `InvoiceId, TenantId, ClientId, SubscriptionId, InvoiceNumber, PeriodStart, PeriodEnd, Currency, SubtotalUsd, DiscountUsd, TaxUsd, TotalUsd, Status (Draft/Issued/Paid/Overdue/Void), IssuedAt, DueAt, PaidAt`. LineItem: `InvoiceLineItemId, InvoiceId, LineType (PlatformFee / CreditCommitment / CreditOverage / DedicatedVectorDb / DedicatedVectorDbProratedUpgrade / Storage / StorageProratedUpgrade / McpServerMonthly / McpServerBuildOneTime / Addon / Service / ByoKeysOrchestration / Discount / Tax), Description, Quantity, UnitPriceUsd, AmountUsd, ResourceSkuId (nullable), SubscriptionResourceId (nullable), ResourceTierChangeId (nullable), Metadata (JSON)`. |
| `pricing.Discount` | `DiscountId, SubscriptionId, TenantId, ClientId, DiscountType (AnnualPrepay / MultiYear / FoundingCustomer / Startup / Migration / Volume / Manual), Description, AppliesTo (PlatformFee / Credits / All), PercentOff (nullable), AmountOffUsd (nullable), ValidFrom, ValidUntil, ApprovedBy, MaxPercentAllowedByOperator (the guardrail — SP-enforced)` |
| `pricing.AuditLog` | every mutation to Plan / Subscription / RateCard / Edition / Discount / ResourceSku / SubscriptionResource / AutoUpgradePolicy. `AuditLogId, TenantId, EntityType, EntityId, Action (Create / Update / Publish / Archive / AssignPlan / ApplyDiscount / ProvisionResource / UpgradeTier / DowngradeTier / SoftBlock / Unblock / ForcedUpgrade / ...), ChangedBy, ChangedAt, BeforeJson, AfterJson`. Also emit each to the platform audit bus. |

**Data migration**: write a script that moves existing `dbo.Plans` / `dbo.PlanTiers` / `dbo.ClientPlans*` / `plan_change_requests` / `PlanChanges` data into the new schema (pick the most recent seed as the source of truth — confirm which with the product owner), re-points `dbo.LlmModelPricing` as the **cost reference** behind `pricing.ModelClassAssignment` (it's COGS data, not customer pricing), and renames the old tables `*_deprecated`.

**Seed data**: the 3 hosted + 3 on-prem editions with inclusions and floors; one Active `RateCard` with the five `CreditPriceTier` rows and the $30 frontier floor; the 3 `ModelClass` rows; `ModelClassAssignment` rows for every current OpenAI / Anthropic / Google / Bedrock / Azure / Amazon-Nova model (use `dbo.LlmModelPricing` to sanity-check classifications — Economy = cheapest, Frontier = Opus/GPT-5.4/o3/Gemini-3-Pro); the `UsageModifier` rows (CachedInput 0.25, Batch 0.6); the `ResourceSku` rows (the 4 vector-DB sizes with their `CapacityMetadata` and `NextTierSkuId` chain, Storage per-TB, the MCP-server sub-types, dedicated-infra add-on); and a default `AutoUpgradePolicy` template (warn-only, GraceDays 7, AllowForcedUpgradeToPreventDataLoss = 1) created automatically when a subscription is created.

---

## 2. Credit computation (the meter math)

Every LLM call goes through the existing model-routing service. On completion it emits `{tenantId, clientId, subscriptionId, provider, modelId, inputTokens, cachedInputTokens, outputTokens, isBatch, correlationId}`. `usp_Usage_RecordEvent` does:

```
classMult   = ModelClass.CreditMultiplier  for ModelClassAssignment(provider, modelId)   -- 0.5 / 1.0 / 2.5
batchMult   = isBatch ? 0.6 : 1.0
billableNonCachedTokens = (inputTokens - cachedInputTokens) + outputTokens
creditsConsumed = billableNonCachedTokens * classMult * batchMult
                + cachedInputTokens * 0.25 * classMult
```

Write the row to `pricing.UsageLedger`. Maintain a real-time per-subscription counter in Redis (`creditsThisPeriod`). On each event: if `creditsThisPeriod >= spendCapCredits` → block further billable LLM calls (return a clear `429`-style error: "AI spend cap reached — raise it in Settings → Billing"), notify the client admin, fire a `ResourceAlert(ResourceType=Credits, ThresholdPercent=GraceExceeded)`. Fire alerts at 80 / 90 / 100% of the *included credit allowance* and at 80 / 90 / 100% of the *spend cap*.

**Invoicing**: `usp_Invoice_Generate` at period close = platform fee (from `Plan`) + `max(0, creditsOverage) × tierPrice` (from the subscription's `CommitmentTierId` or PAYG, **with the frontier-floor clamp applied before any discount** — frontier-class credits never bill below `FrontierFloorPerMillionEffectiveUsd / 2.5` per credit) + each `SubscriptionResource` not `IsCustomerHosted` (dedicated vector DBs at their `CurrentTierSkuId` price; storage = TB-over-included × $50; MCP servers beyond included at their sub-type price; bespoke MCP build fees in the delivery period; pass-through MCP at cost+20%) + any `ResourceTierChange.ProratedChargeUsd` rows from this period + add-ons + `ByoKeysOrchestrationFeePerMillionUsd × creditsThisPeriod/1e6` (only if `ByoKeysEnabled`) − discounts (each capped at `MaxPercentAllowedByOperator`) + tax. Write `Invoice` + `InvoiceLineItem` rows; each prorated upgrade gets its own line item linked to the `ResourceTierChange`.

---

## 3. Resource enforcement state machine ("lockdown") — storage, MCP servers, RAG databases

This is the core of the new behavior. **One state machine, three resource types.** The invariant the customer cares about: **reads/queries are NEVER blocked by a limit** — only *new writes* (new document ingestion, new storage uploads, enabling new MCP servers) can be paused, and only as a last resort, and only when auto-upgrade is off or exhausted.

### 3.1 States (per `SubscriptionResource`, stored in `ResourceUsageSample.HealthState` and a fast cache)

| State | When | Behavior |
|---|---|---|
| `Healthy` | utilization < 80% | normal |
| `Warning` | 80–94% | normal; fire `ThresholdPercent=80` / `90` alerts (Info / Warning) on entry, debounced |
| `Critical` | 95–99% | normal; fire `ThresholdPercent=95` alert (Critical): "Action needed — upgrade, or enable auto-upgrade." If `projectedDaysToCapacity < GraceDays`, also fire `ProjectedCapacitySoon`. |
| `AtCapacity` | utilization ≥ 100% **but within physical headroom** | **writes still allowed** (you sized the underlying resource above the priced capacity). Start a `GraceDays` timer. **If `AutoUpgradePolicy.IsAutoUpgradeEnabled` and `NextTierSkuId` exists and `NextTierSkuId <= MaxAutoUpgradeTierSkuId`** → transition to `Upgrading` immediately (don't wait out the grace period). Else → daily escalating reminders to client admin + tenant admin. |
| `Upgrading` | a tier change is in flight | writes still allowed (old resource keeps serving); UI shows "upgrading your knowledge base…" |
| `Exceeded` | grace expired without an upgrade, OR physical headroom about to be exhausted with `AllowForcedUpgradeToPreventDataLoss = 0` | **soft-block new writes only** (`SubscriptionResource.WriteBlocked = 1`); reads/queries fully functional; urgent escalation to client admin + tenant admin; new ingestion jobs are *queued*, not failed (they run automatically once unblocked/upgraded). |
| (forced upgrade) | physical headroom about to be exhausted **and** `AllowForcedUpgradeToPreventDataLoss = 1` (default) | force a tier upgrade even without policy opt-in (`ResourceTierChange.ChangeType = ForcedUpgradeDataLossPrevention`). Notify prominently with the new cost; make it explicitly reversible/refundable on request within 30 days. This is the absolute "we won't break your knowledge base" guarantee. |

State is (re)evaluated by `usp_ResourceLimit_Evaluate(@SubscriptionResourceId)` on **every metric sample** and **before every write** that touches the resource.

### 3.2 Per-resource-type specifics

**Dedicated vector / RAG database** (`ResourceType = DedicatedVectorDb`):
- Track (sampled every 15 min, written to `ResourceUsageSample.SecondaryMetricsJson`): `vectorCount`, `collectionCount`, `indexSizeBytes`, `storageBytes`, `ingestRateLast24h`, `queriesLast24h`, `currentQps`, `p50/p95/p99LatencyMs`. Pull these from the vector-DB engine's stats API (Qdrant/Weaviate/Milvus/pgvector/OpenSearch each expose collection size, point count, and request metrics).
- `UtilizationPercent` = `max( vectorCount / pricedCapacityVectors , currentQps / pricedCapacityQps , p95LatencyMs / p95LatencySloMs )` — i.e., a knowledge base can hit its limit on *data size*, *query throughput*, or *latency degradation*, whichever comes first.
- `projectedDaysToCapacity` = linear extrapolation of `vectorCount` from `ingestRateLast24h` (and similarly for QPS) → `min(...)`. Drives early `ProjectedCapacitySoon` warnings ("at your current rate you'll hit capacity in ~9 days").
- The write that's gated: **document ingestion / embedding insertion**. Before inserting vectors, the ingestion path calls `usp_RagDatabase_CanIngest(@SubscriptionResourceId, @estimatedNewVectors)` → returns `Ok` / `WarnApproaching` / `BlockedNeedsUpgrade` (only when `HealthState = Exceeded` and not customer-hosted). On `BlockedNeedsUpgrade`: enqueue the ingestion job, return a `409`-style response with a clear message + an "Upgrade now" CTA, fire the alert.
- **Queries / retrieval are never gated.** A full knowledge base stays fully searchable.
- Auto-upgrade ladder: Small → Medium → Large → XLarge → (NULL = custom dedicated cluster, requires approval via a `PlanChangeRequest` of `Origin = SystemRecommendedEditionUpgrade`-style flow). Each step roughly 4× the capacity.

**Storage** (`ResourceType = Storage`, the $50/TB pool — documents, embeddings on shared infra, conversation history, audit logs, exports):
- Track `storageBytesUsed` per subscription (sum across the tenant's objects). `AllowanceValue` = `(EditionInclusion.StorageTb + Σ purchased SubscriptionResource Storage blocks) × 1 TB`.
- The write that's gated: **new uploads / new ingestion that would exceed the pool**. Before accepting a large upload, check; warn approaching; `Exceeded` → queue/reject new uploads with a clear message. **Downloads/reads of existing objects are never gated.**
- Auto-upgrade unit: **+1 TB block ($50/mo)**. `usp_SubscriptionResource_AddStorageBlock` adds a `SubscriptionResource` row of `Quantity += 1`; prorated line item; notify.
- `GraceDays` applies the same way.

**MCP servers** (`ResourceType = McpServers`):
- Track `enabledMcpServerCount` per subscription = count of `SubscriptionResource` rows with `Category = McpServer` and `Status = Active` and `IsCustomerHosted = 0` (BYO and customer-hosted don't count). `AllowanceValue` = `EditionInclusion.McpServers + Σ purchased extra McpServer slots`.
- The action that's gated: **enabling a new MCP server when at/over the allowance**. Existing enabled servers *always keep working* — only enabling additional ones is gated. On the enable action: if under allowance → just enable. If at allowance and `AutoUpgradePolicy.IsAutoUpgradeEnabled` → auto-add a paid slot at the server's sub-type price ($50–$250/mo), notify with the cost, then enable. If at allowance and auto-upgrade off → require explicit confirmation of the add-on charge, OR offer an edition upgrade; until confirmed, the new server stays in `Provisioning`/`PendingPayment`. Disabling a server frees a slot.
- No "grace period" needed here — nothing breaks; we just don't let them add more without paying.

### 3.3 Auto-upgrade execution (`usp_SubscriptionResource_UpgradeTier`)

1. Validate: `NextTierSkuId` exists; for auto/forced, `NextTierSkuId <= MaxAutoUpgradeTierSkuId` (or policy allows no ceiling); for manual, the requesting user has permission.
2. Update the `SubscriptionResource`: `CurrentTierSkuId = NextTierSkuId`, `UnitPriceUsd = NextTier.UnitPriceUsd`, `Status = Upgrading`.
3. Insert a `pricing.ResourceTierChange` row (`ChangeType`, `TriggerMetric`, `From/To` SKU & price, `ProratedChargeUsd` = `(newPrice − oldPrice) × remainingDaysInPeriod / daysInPeriod`).
4. Insert a `pricing.InvoiceLineItem` (or a pending charge) for the prorated amount, linked to the `ResourceTierChange`.
5. Audit (`pricing.AuditLog` + platform audit bus). Emit a `ResourceUpgradeRequested` integration event with `{subscriptionResourceId, referencedEntityId, fromSku, toSku}`.
6. The provisioning service (the existing vector-DB provisioning service for `DedicatedVectorDb`; trivial for `Storage`/`McpServers`) resizes the underlying resource — **online where the engine supports it** (more RAM / disk / replicas); if a reindex is unavoidable, do it as a background migration with the **old instance still serving reads**. On completion → emit `ResourceUpgradeCompleted` → set `SubscriptionResource.Status = Active`, recompute `HealthState` (now `Healthy` at the bigger tier), clear any `WriteBlocked`, drain queued ingestion jobs, notify the customer: "Done — your knowledge base now holds up to {capacity}; new monthly cost {price}; effective {date}."
7. **Downgrade** (`usp_SubscriptionResource_DowngradeTier`): allowed only if current usage fits the smaller tier's *priced* capacity with margin; takes effect at the next billing cycle (creates a `PlanChangeRequest`-style scheduled change); never automatic.

### 3.4 Enforcement hook points (where the checks actually live)

| Path | Check | Can it block? |
|---|---|---|
| Document ingestion / embedding insert (RAG) | `usp_RagDatabase_CanIngest` | Yes — only in `Exceeded` state and only for non-customer-hosted; otherwise it queues, never hard-fails |
| File / object upload (storage) | storage-pool check | Yes — only when over the pool past grace; queues |
| Enable a new MCP server | MCP-count check | Yes — requires paid slot or confirmation when at allowance; existing servers unaffected |
| LLM call (credits) | Redis `creditsThisPeriod` vs spend cap | Yes — at the spend cap; clear "raise it in Settings" message |
| Query / retrieval against a knowledge base | **none** | **Never** |
| Reading / downloading existing stored objects | **none** | **Never** |
| Calling an already-enabled MCP server's tools | **none** (tool calls just consume credits) | **Never** (subject only to the credit spend cap) |

---

## 4. Stored procedures

`usp_Edition_GetCatalog` · `usp_Plan_CreateFromEdition` (enforces operator floors) · `usp_Plan_Update` (validates ≥ floors, `RAISERROR` on violation) · `usp_Plan_GetForTenant` / `usp_Plan_GetById` · `usp_Subscription_Create` (also creates default `AutoUpgradePolicy` rows) · `usp_Subscription_ChangePlan` · `usp_Subscription_SetSpendCap` · `usp_Subscription_Cancel` · `usp_PlanChangeRequest_Create` / `usp_PlanChangeRequest_Approve` / `usp_PlanChangeRequest_Apply` · `usp_Discount_Apply` (caps at `MaxPercentAllowedByOperator`) · `usp_Usage_RecordEvent` (the credit math) · `usp_Usage_Rollup` (nightly) · `usp_Usage_GetCurrentPeriod` · `usp_ResourceUsage_RecordSample` (writes a `ResourceUsageSample`, recomputes `UtilizationPercent` & `HealthState`, calls `usp_ResourceLimit_Evaluate`) · `usp_ResourceLimit_Evaluate` (the state machine: compares util vs thresholds, fires `ResourceAlert`s debounced, triggers auto-upgrade or grace or soft-block per `AutoUpgradePolicy`, handles the forced-upgrade-to-prevent-data-loss path) · `usp_RagDatabase_RecordMetrics` (the vector-DB-specific metric snapshot) · `usp_RagDatabase_CanIngest` (the ingestion gate) · `usp_Storage_CanWrite` · `usp_McpServer_CanEnable` · `usp_SubscriptionResource_Provision` · `usp_SubscriptionResource_UpgradeTier` / `usp_SubscriptionResource_DowngradeTier` · `usp_SubscriptionResource_AddStorageBlock` · `usp_SubscriptionResource_SetWriteBlocked` · `usp_AutoUpgradePolicy_Set` · `usp_McpServer_PromoteToCatalog` (bespoke → Technijian catalog: reassigns the billing SKU, sets catalog status, makes it tenant-selectable; audit-logged) · `usp_ResourceAlert_Acknowledge` · `usp_Invoice_Generate` (frontier-floor clamp before discounts; includes prorated tier-change line items) · `usp_RateCard_Publish` · `usp_ModelClassAssignment_Upsert` · `usp_ResourceSku_Upsert` · `usp_PricingAudit_Insert`.

Every mutating SP calls `usp_PricingAudit_Insert` and the calling service emits a platform audit event.

---

## 5. Backend

- **Controllers**: `PricingCatalogController` (operator: editions, rate cards, model classes, resource SKUs, discount policy), `PlansController` (tenant admin: clone/edit plans within floors, assign to clients), `SubscriptionsController`, `UsageController`, `ResourceUsageController` (current samples, history, capacity dashboards), `InvoicesController`, `AutoUpgradePolicyController`, `ResourceUpgradeController` (manual upgrade/downgrade requests, confirm a pending paid-slot/tier change), `BillingTelemetryController` (on-prem ingest: `POST /api/v1/billing/usage-telemetry` — accepts batched `{usageEvents[], resourceSamples[], seatCount, version}`; runs `usp_Usage_RecordEvent` with `DeploymentModel = OnPremise` so only the $2/1M orchestration fee applies, and `usp_ResourceUsage_RecordSample` for any Technijian-maintained on-prem resources; no DB/storage charges for customer-hosted resources).
- **Background jobs** (Hangfire/Quartz or whatever the repo uses): `ResourceMeterSamplerJob` (every 15 min — pulls vector-DB stats, storage totals, MCP counts → `usp_ResourceUsage_RecordSample`), `ResourceUsageRollupJob` (nightly), `UsageRollupJob` (nightly), `GraceTimerJob` (hourly — for any resource in `AtCapacity` past `GraceDays`, transitions to `Exceeded` / soft-block, escalates), `InvoiceGenerationJob` (at period close → `usp_Invoice_Generate`), `IngestionQueueDrainJob` (re-runs queued ingestion jobs once a resource is unblocked/upgraded).
- **Services**: `UsageMeteringService` (hooks the model-routing service; the Redis counter; spend-cap enforcement; the credit-allowance alerts), `ResourceEnforcementService` (the C# side of the state machine — orchestrates `usp_ResourceLimit_Evaluate`, fires notifications, kicks off `usp_SubscriptionResource_UpgradeTier`, listens for `ResourceUpgradeCompleted`), `ResourceProvisioningService` (resizes vector-DB clusters online; resize-with-old-instance-still-serving-reads for reindex cases — coordinate with the existing vector-DB provisioning code), `BillingService` (`usp_Invoice_Generate`; payment-provider integration unchanged), `NotificationService` (see §6).
- **OpenAPI**: update the spec; regenerate the typed client.

---

## 6. Notifications

A single alert pipeline driven by `pricing.ResourceAlert` rows. Channels per severity:
- `Info` (80%) → in-app toast/badge + included in the weekly usage email digest.
- `Warning` (90%) → in-app banner (dismissible) + email to the **client admin**.
- `Critical` (95%) → in-app modal (must acknowledge) + email to the client admin + (optional, configurable) SMS.
- `Urgent` (100% w/o auto-upgrade entering grace; `GraceExceeded`; `ForcedUpgradeDataLossPrevention`) → in-app modal + email to the **client admin AND the tenant/MSP admin** + daily reminder until acknowledged/resolved.
- `AutoUpgraded` / `ManualUpgraded` / `ForcedUpgraded` → confirmation email + in-app notice with the new capacity, new monthly cost, effective date, and (for forced) the 30-day reversal/refund note.

All notification copy lives in a localizable resource file (the platform is English-only at v1 but strings are externalized — keep that). Reuse the existing notification infrastructure if the repo has one.

---

## 7. Frontend (React 18 + Fluent UI v9)

- **Operator pricing console** `/admin/pricing/*`: edition catalog editor (inclusions, floors, BAA/routing-lock flags, `AllowedProviders`) · rate-card editor (credit tiers + frontier floor, versioned, publish workflow) · **model-class manager** (assign each `(provider, model)` to Economy/Standard/Frontier, mark BAA-eligible — *this is where new models get added & classified*) · resource-SKU catalog (vector-DB sizes + `CapacityMetadata` + `NextTierSkuId` chain, storage rate, MCP-server sub-type rates + complexity bands, dedicated-infra add-on; with operator floors) · MCP-server pricing panel (incl. "Promote bespoke → catalog") · discount policy (max % per type, approvers) · pricing audit log.
- **Tenant Admin console** `/admin/plans/*` and `/admin/clients/{id}/billing`: "Plans" list + "Create plan from edition" wizard (clone → adjust within floors; UI shows the floor inline and blocks below it) · assign/change a client's plan (→ `PlanChangeRequest`, applied next cycle) · apply approved discounts · per-client usage & resource dashboards · per-client spend caps · per-client `AutoUpgradePolicy` editor · per-client **MCP Servers** panel (browse the platform MCP catalog with Public vs Technijian-built badges, enable/disable for the client, see the monthly cost per server, flag customer-hosted = free, see the included-quota counter, "request a bespoke build" → creates a quote/work item) · review & approve/reject system-recommended edition upgrades.
- **Client Admin billing** `/settings/billing/*`:
  - **Current plan & inclusions** — what's included, what's used.
  - **AI usage dashboard** — credits this period (sparkline + projected month-end), breakdown by model class, vs. allowance, vs. spend cap; the spend-cap control.
  - **Resource capacity dashboards** — for each dedicated knowledge base: a capacity gauge (vector count / priced capacity, plus QPS and latency gauges), `projectedDaysToCapacity` ("~9 days at your current rate"), the `HealthState` badge, ingestion-queue status if any; for storage: a TB-used gauge; for MCP servers: an enabled/allowance counter.
  - **Auto-upgrade settings** — per resource type: toggle "auto-upgrade enabled", pick the ceiling tier (dropdown of SKUs up to which auto-upgrade is allowed), grace-days display, the "allow forced upgrade to prevent data loss" toggle (default on, with an explanation). Default state on every new subscription: **off (warn-only)** for tiered resources, with a prominent prompt to opt in.
  - **Upgrade flows** — when a `Critical`/`Urgent` alert is active: an in-app modal showing "Your '{KB name}' knowledge base is at 96% capacity. Options: (1) Enable auto-upgrade — we'll move it to {NextTier} ({price}/mo) automatically and it never stops working; (2) Upgrade now to {NextTier} ({price}/mo, prorated {amount} this period); (3) Free up space; (4) Remind me later." When a pending paid MCP slot or pending tier change needs confirmation: a clear confirmation modal with the cost.
  - **Invoices & history** — including prorated upgrade line items clearly labeled.
  - Reuse existing hooks (`useBillingOverviewQuery` etc.); add `useUsageQuery`, `useResourceUsageQuery`, `usePlansQuery`, `usePricingCatalogQuery`, `useAutoUpgradePolicyQuery`.

---

## 8. Feature flags, audit, tests

- Flags: `pricing.v9PricingSystem` (the whole pricing rework), `pricing.resourceEnforcement` (the lockdown + auto-upgrade behavior). Old billing screens remain until both flip.
- Audit: every mutating operation → `pricing.AuditLog` + platform audit bus.
- **Tests** (must cover):
  - Credit math: every `ModelClass` × cached/non-cached × batch/non-batch combination → expected `CreditsConsumed`.
  - Frontier-floor clamp in `usp_Invoice_Generate` — frontier credits never bill below the floor; clamp applied *before* discounts.
  - Operator-floor enforcement — `usp_Plan_Update` / `usp_Plan_CreateFromEdition` reject below-floor prices; `usp_Discount_Apply` rejects over-cap discounts.
  - Spend cap: at the cap, billable LLM calls are blocked with the right error; reads/queries unaffected.
  - **Resource state machine**: a RAG DB walking 80 → 90 → 95 → 100% fires exactly the right `ResourceAlert`s (debounced); with auto-upgrade on and within the ceiling → `usp_SubscriptionResource_UpgradeTier` is called and the DB ends `Healthy` at the next tier with a prorated line item; with auto-upgrade off → grace period, daily reminders, then `Exceeded` + `WriteBlocked` + queued ingestion + escalation to tenant admin.
  - **Reads-always-work invariant**: in `Exceeded` state, `usp_RagDatabase_CanIngest` blocks ingestion but a retrieval/query call succeeds; a storage download succeeds; an already-enabled MCP server's tool call succeeds (subject only to the credit cap).
  - **Forced-upgrade path**: physical headroom about to be exhausted with `AllowForcedUpgradeToPreventDataLoss = 1` → a `ResourceTierChange(ChangeType=ForcedUpgradeDataLossPrevention)` is created, the customer is notified, and the change is reversible within 30 days.
  - **MCP server enablement gate**: enabling a server under allowance just works; at allowance with auto-upgrade on → auto-adds a paid slot at the right sub-type price; at allowance with auto-upgrade off → server stays pending until the charge is confirmed; disabling frees a slot.
  - **MCP promotion**: `usp_McpServer_PromoteToCatalog` reassigns the SKU from `BespokeCustom` to `TechnijianCatalog` and makes the server tenant-selectable.
  - **On-prem telemetry**: `POST /api/v1/billing/usage-telemetry` with `DeploymentModel = OnPremise` records credits at the orchestration rate ($2/1M), accrues no DB/storage charges for customer-hosted resources, and keeps support entitlement current.
  - **Tenancy isolation**: no cross-tenant access to any pricing/usage/invoice/resource row (run the platform's tenancy-isolation test pattern over the new SPs).
  - **Invoice end-to-end**: the worked example (a Business-edition customer with overage credits + a mid-period auto-upgrade of a dedicated DB + extra storage + 2 extra MCP servers + an annual-prepay discount) produces the expected `Invoice` + `InvoiceLineItem` set.

---

## 9. Definition of done

1. Single `pricing.*` schema; old plan tables renamed `*_deprecated`; data migrated; seeds in place (editions, rate card, model classes & assignments, modifiers, resource SKUs with capacity metadata + tier chains, default auto-upgrade policy template).
2. All SPs implemented, SP-only data access, every mutation audited.
3. Backend controllers/services/jobs implemented incl. the on-prem telemetry ingest; OpenAPI updated; typed client regenerated.
4. The three-resource enforcement state machine works end to end: continuous metrics → threshold alerts → grace → soft-block (writes only, reads never) → auto-upgrade (when opted in / within ceiling) → forced upgrade to prevent data loss (last resort) → prorated billing.
5. Operator, Tenant-Admin, and Client-Admin UIs implemented incl. the capacity dashboards, the auto-upgrade policy editor, and the upgrade-confirmation flows.
6. Feature-flagged; old billing UI still works with the flags off.
7. All tests above passing, including the reads-always-work invariant and the forced-upgrade path.
8. No customer scenario results in a broken knowledge base, a silent cut-off, or a surprise invoice: limits are warned early, reads never blocked, upgrades prorated and clearly communicated, spend caps default-on.

---

*Confirm with the product owner before deleting any existing table or finalizing the model-class assignments. The numbers in `docs/pricing/Chat-ai-Pricing-for-Marketing.docx` are the source of truth — if anything here disagrees with that document, that document wins.*
