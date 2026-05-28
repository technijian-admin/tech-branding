# My Jian — Pricing & Packaging Specification

**Version:** 3.1 (Final — Hybrid Resource-Based, Confusion-Reduced)
**Date:** 2026-05-28
**Owner:** rjain@technijian.com
**Scope:** Pricing for the V1 capability set (autonomous monitoring, diagnose, activity, branded reports, `@Jian` Teams Self-Service bot). Auto-Remediation, Jian Voice, and Jian Remote Agent are V2 and priced separately when they ship.

V3.1 supersedes V3 (2026-05-28 morning). Same underlying hybrid model, with seven confusion-reduction fixes applied: two parallel tiers (not "+upgrade"), simplified discount stack (two mechanics not four), glossary of per-resource definitions, explicit backup-exception callout, retained bot-only SKU for the small buyer, optional flat-price Starter bundles, and a published pricing calculator path.

---

## 1. The Core Pricing Rule — "40% of Name Brand"

Mirrors the Technijian private-cloud pricing playbook against AWS / Azure: every Jian line item lists at ~40% (or less) of the equivalent name-brand competitor.

We're a challenger brand. We don't have Arctic Wolf marketing budgets or Vanta analyst coverage. We win on (1) consolidation (one platform vs. their five), (2) integration (cross-platform MITRE correlation that no comp does end-to-end), and (3) **transparent value math** — every buyer can verify per-line.

When Jian has 100+ reference customers + analyst coverage, we tighten to 50–60% of name-brand. Not before.

---

## 2. The Pricing Model — Hybrid (Per-User + Per-Resource)

Two axes:

| Axis | Unit | Why this unit |
|---|---|---|
| **Per-user** | Licensed M365 user | Value scales with users — Teams `@Jian` bot deflections, license waste, M365 monitoring, compliance touchpoints |
| **Per-resource** | Per firewall / per Meraki org / per backup environment / per vCenter / etc. | Value scales with infrastructure complexity — multi-site clients pay proportionally |

Matches existing Technijian PriceList (Sophos per-firewall + per-endpoint, Microsoft per-user, Veeam per-VM, Pax8 per-SKU). Familiar buyer mental model = lower sales friction.

---

## 3. Per-User Pricing — Jian for M365 (Two Parallel Tiers)

| Tier | Price | Annual (2 mo free) | Best for |
|---|---|---|---|
| **Standard** | **$9/user/mo** | **$90/user/yr** | General SMB; full platform: M365 monitoring + license audit + `@Jian` Teams bot + HIPAA/SOC 2/PCI compliance + branded monthly M365 report + SIEM correlation + MITRE tagging |
| **Compliance Pro** | **$24/user/mo** | **$240/user/yr** | Regulated / DoD / multi-site / M&A; everything in Standard PLUS CMMC + custom frameworks (SOX/GLBA/FINRA/NIST 800-171/FedRAMP) + dedicated CISSP-certified CSM + cross-client correlator (gated) + Service Level Agreement on bot availability (terms in MSA) + custom `@Jian` skills deployed to your Microsoft Teams workspace + CISSP-led audit-firm liaison + on-demand reports |

**Minimum:** 25 seats on Standard ($225/mo floor).

**Why parallel tiers, not an "upgrade":** Two prices on the page is cleaner than "+$15 add-on." Buyers see "two products" instead of "is the base incomplete?" Standard is fully featured; Compliance Pro is for clients who need additional regulatory scope and white-glove service.

### What every Jian for M365 tier includes

- M365 monitoring (sign-in risk, risky users, license waste, mailbox/OneDrive/SharePoint storage)
- M365 Apps Service Health monitoring (22 workloads: Exchange, OneDrive, SharePoint, Teams, Power BI, Power Automate, Intune, Defender, Entra, Purview, Stream, Forms, Viva, Yammer, Planner, Project, Skype, Universal Print, Windows 365, Dynamics 365, Microsoft 365 Apps)
- `@Jian` Teams Self-Service bot for ALL user seats (RAG over CP tickets + Teams files + Obsidian KB)
- Channel-per-ticket Teams workflow (synced via CP poller every 2 min)
- Compliance evidence: HIPAA, SOC 2, PCI, Technijian baseline (31 evaluators run continuously)
- Branded monthly M365 DOCX report
- MITRE ATT&CK tagging on all M365 events
- Cross-vendor SIEM correlation (real-time + 7-day retrospective)
- Shift-aware ticket routing (India/US/L2-L3 cap)
- Append-only audit log

### What Compliance Pro adds (human + advanced scope, never "platform features turned off")

- **CMMC** compliance framework + custom frameworks (SOX, GLBA, FINRA, NIST 800-171, FedRAMP)
- **Dedicated CISSP-certified Customer Success Manager** (Ravi Jain, CISSP, fills this role for Compliance Pro clients)
- **Cross-client correlator** (gated, opt-in — multi-tenant pattern detection at MITRE-tactic level)
- **Learning consolidator** (weekly playbook + false-positive mining)
- **Morning summary briefing** (daily Adaptive Card + email)
- **Quarterly executive briefing**
- **Custom `@Jian` skills deployed to your Microsoft Teams workspace** (per-client workflow automation in your own Teams tenant)
- **Service Level Agreement on bot availability** (specific uptime % stated in MSA at contract signing)
- **On-demand report generation**
- **CISSP-led audit-firm liaison** (Ravi Jain, CISSP, talks to your auditor directly)

---

## 4. Per-Resource Pricing — Jian for [Infrastructure]

| Service | Jian Price | Annual | Name-Brand Comp | % of Comp |
|---|---|---|---|---|
| **Jian for Firewall** (per firewall) | **$99/firewall/mo** | $990/yr | Arctic Wolf MDR $300–$500/site, Sophos My Sophos $99–$299 | **20–33%** |
| **Jian for Meraki Network** (per Meraki org) | **$79/org/mo** | $790/yr | Auvik $250/site | **32%** |
| **Jian for Backup** (per Veeam VBR / 365 / ONE / **NAKIVO** env — vendor-agnostic) | **$59/env/mo** | $590/yr | Liongard $50–$100/client (no NAKIVO) | **59–118%** *(see exception note below)* |
| **Jian for DNS** (per Cisco Umbrella tenant) | **$39/tenant/mo** | $390/yr | Cisco Umbrella reporting add-ons ~$80+ | **49%** |
| **Jian for Endpoint EDR — Workstation** (overlay your EDR vendor) | **$1.50/workstation/mo** | $15/yr | Huntress $6/desktop | **25%** |
| **Jian for Endpoint EDR — Server** (overlay your EDR vendor) | **$3.50/server/mo** | $35/yr | Huntress $6/server, CrowdStrike $10–$15 | **23–58%** |
| **Jian for vCenter** (per vCenter Server) | **$99/vCenter/mo** | $990/yr | VMware vROps Premium ~$150+ | **66%** |
| **Jian for Web / Cloudflare** (per Cloudflare zone) | **$29/zone/mo** | $290/yr | Cloudflare paid + manual labor | **~40%** |

### Backup line exception (transparent)

Jian for Backup at $59 vs. Liongard at $50–$100 = **59–118% of comp**, which breaks our 40% promise. We hold $59 because:

1. **Liongard is already a discount product** — pricing Jian at 40% would mean $20/mo, below cost-to-serve.
2. **NAKIVO support is unique** — Liongard doesn't cover NAKIVO. Veeam ONE Reporter only covers Veeam. Jian bridges both at one rate.
3. **We win on integration**, not raw price, on this one line.

This exception is **stated explicitly in the brochure** so a procurement audit doesn't catch us being inconsistent.

---

## 5. Bot-Only SKU (For Buyers Who Just Want `@Jian` in Teams)

| Tier | Price | Cap | Best for |
|---|---|---|---|
| **Jian Teams Bot Only** | **$99/mo flat** | Up to 25 users | The 5–25-seat client who wants the `@Jian` Microsoft Teams bot and nothing else. No platform monitoring, no compliance evidence, no branded reports. |

Above 25 users, the math forces a move to Jian for M365 Standard (25 × $9 = $225, which is bigger than $99). This is the bot-only "entry SKU" for the truly small SMB. Replaces the V1 $49 IT Self-Service Agent (which is grandfathered for existing customers — see §9).

---

## 6. Starter Bundles (For "Just Give Me One Number" Buyers)

For SMBs who don't want to think about line items. Flat monthly price, small discount vs. itemized.

| Bundle | What's in it | Flat price | vs. itemized |
|---|---|---|---|
| **Jian Starter** | Standard 25 seats + 1 firewall + 1 backup environment | **$349/mo flat** | itemized $383 (saves $34, –9%) |
| **Jian Pro Bundle** | Compliance Pro 50 seats + 2 firewalls + 1 backup + 1 Meraki org | **$1,495/mo flat** | itemized $1,615 (saves $120, –7%) |
| **Jian Enterprise Bundle** | Compliance Pro 100 seats + 3 firewalls + 1 backup + 2 Meraki orgs + 1 DNS | **$2,695/mo flat** | itemized $2,953 (saves $258, –8.7%) |

These are NOT replacement of the line-item pricing — they're an *alternative path* for the buyer who wants one number. Sales rep offers either: "You can quote line-by-line, or we have these three bundles." Most buyers will choose the bundle that fits, especially in the SMB segment.

---

## 7. Simplified Discount Structure (Two Mechanics Only)

V3 originally had four stacking discounts (bundle, annual, MSP volume, seat volume). V3.1 simplifies to two:

| Mechanic | Discount |
|---|---|
| **Annual prepay** (any service, any tier, any bundle) | **17% off** (2 months free; effectively monthly × 10 = annual) |
| **Volume tier** (based on total monthly invoice, auto-applied) | 0% under $1,000/mo; **10%** at $1,000–$4,999; **15%** at $5,000–$14,999; **20%** at $15,000–$49,999; **25%** at $50,000+/mo |

**Discounts stack multiplicatively.** Worked example: a $5,000/mo client on annual prepay pays $5,000 × 0.85 (15% volume) × 0.83 (17% annual) = $3,528/mo effective. CFO can verify the math in 10 seconds.

**What was dropped from V3:**
- The "4+ services bundle = 10% off" — value folded into the per-line list prices instead. Cleaner.
- Separate MSP-volume vs. seat-volume schedules — collapsed into one volume schedule based on monthly invoice total. One discount lookup, one rule.

---

## 8. Resource Definitions (Glossary)

Pre-empts every "wait, what counts as a..." conversation at quote time.

| Term | Definition |
|---|---|
| **Firewall** | One managed Sophos or Meraki firewall appliance. HA pair = 1 unit. Multi-WAN on one appliance = 1 unit. |
| **Meraki organization** | One Meraki dashboard organization, regardless of number of networks or devices within it. |
| **Backup environment** | One Veeam VBR Server, OR one Veeam 365 tenant, OR one Veeam ONE Reporter Server, OR one NAKIVO Director instance. Mix and match within a client at $59 each. |
| **Cloudflare zone** | One apex domain (e.g., `example.com`). All subdomains (`*.example.com`) included free. |
| **vCenter** | One vCenter Server instance. vCenter Enhanced Linked Mode counts as 1 unit per Platform Services Controller. |
| **Umbrella tenant** | One Cisco Umbrella organization (child org under a parent partner relationship). |
| **vSphere / VMware site** | One vCenter Server datacenter (charged via the vCenter SKU). |
| **Workstation** | One desktop, laptop, or VDI session. Must be running a real OS with an EDR agent (Huntress / CrowdStrike). |
| **Server** | One server endpoint (physical or virtual) with an EDR agent. |
| **Licensed user** | One Microsoft 365 paid license assignment (not shared mailboxes, room/equipment accounts, or guest users). |

---

## 9. Grandfathering — Existing $49 IT Self-Service Agent Customers

Customers currently paying $49/mo flat for the original IT Self-Service Agent SKU stay at $49 for the original bot-only feature set for **a defined grandfathering period** (specified at contract renewal) from V3.1 launch (2026-05-28).

If they want any platform monitoring (Jian for M365 Standard or higher, or any per-resource service), they upgrade to V3.1 pricing for that scope. The bot itself continues at $49 within the grandfathering window. After the defined grandfathering period (specified at contract renewal), they convert to current pricing.

**For new customers,** $49 is no longer available — the entry SKU is Jian Teams Bot Only at $99/mo flat. See §5.

---

## 10. Legacy Standalone Report SKUs (Report-Only Buyers)

For buyers who only want a single branded monthly report and don't want the platform:

| Report | Price |
|---|---|
| My M365 Report | $15–$129/tenant/mo (5 user-count bands XS–XL) |
| My Meraki Report | $150/Meraki org/mo flat |
| My Sophos Report | $99 / $199 / $299/tenant/mo (Essentials / Advanced / Enterprise) |

Retained from the 2026-05-04 brochure. **Platform subscribers (Jian for M365 + any per-resource service) get equivalent reports auto-included** at no additional charge — these standalone SKUs are only for buyers who don't want the platform.

---

## 11. Cost-to-Serve and Margin Discipline

Per `state/cost_reports/2026-05-27.json`:

| Line | Per client per month |
|---|---|
| LLM (Gemini Flash primary; includes safety multiple) | $5 |
| Infrastructure (SQL/n8n/IIS/LiteLLM/Azure App Service amortized) | $7 |
| Engineering maintenance (amortized; drops fast as client count grows) | $150–$300 |
| **Cost to serve (one client)** | **~$165–$315/mo** |

No Jian SKU sells below cost-to-serve at the 25-seat minimum (Standard at 25 users = $225/mo). At year-3 projected mix (100+ clients, average client paying $1,500–$3,500/mo), blended gross margin is **85–92%** — premium SaaS economics.

---

## 12. Worked Examples — Three Real Client Profiles

### Small SMB — 20-user law firm, 1 office, 1 firewall, 1 backup

| Path | Calculation | Monthly |
|---|---|---|
| **Itemized** | Standard 25-seat min × $9 = $225, + 1 firewall × $99, + 1 backup × $59 | **$383** |
| **Annual prepay** | $383 × 10 | $3,830/yr |
| **OR Jian Starter Bundle** | flat | **$349** |
| **vs. comp stack** | Huntress + Vanta + Arctic Wolf entry + Liongard + reporting labor | ~$960/mo |
| **Jian = 40% of comp** (or 36% with Starter Bundle) | | |

### Medium regulated — 50-user dental group, HIPAA + SOC 2, 2 sites, 2 firewalls, 2 Meraki orgs, 1 backup

| Path | Calculation | Monthly |
|---|---|---|
| **Itemized** | Compliance Pro 50 × $24 = $1,200, + 2 × $99 = $198, + 2 × $79 = $158, + 1 × $59 = $59 | $1,615 |
| Volume tier ($1,000–$4,999) | × 0.90 | **$1,453** |
| **Annual prepay** | $1,453 × 10 | $14,530/yr |
| **OR Jian Pro Bundle** | flat (includes everything above) | **$1,495** |
| **vs. comp stack** | Drata + M365 + Aisera + Arctic Wolf × 2 + Auvik × 2 + Liongard | ~$5,550/mo |
| **Jian = 26% of comp** (or 27% with Pro Bundle) | | |

### Mid-market — 250-user multi-site, 5 firewalls, 3 Meraki orgs, 2 backups, regulated

| Path | Calculation | Monthly |
|---|---|---|
| **Itemized** | Compliance Pro 250 × $24 = $6,000, + 5 × $99 = $495, + 3 × $79 = $237, + 2 × $59 = $118 | $6,850 |
| Volume tier ($5,000–$14,999) | × 0.85 | **$5,822** |
| **Annual prepay** | $5,822 × 10 | $58,220/yr |
| **vs. comp stack** | Drata Business + M365 + Aisera + Arctic Wolf × 5 + Auvik × 3 + Liongard + custom-framework consultant | ~$28,350/mo |
| **Jian = 21% of comp** | | |

*(Note: V3 worked examples used additive discount stacking which produced $5,265 at this profile; V3.1 uses cleaner multiplicative stacking on the volume-tier % which produces $5,822. The V3.1 number is what gets quoted.)*

---

## 13. Revenue Modeling — V3.1 vs. Prior

Same 57-client base, realistic year-2 mix:

| Segment | # clients | Avg seats | Profile | Per-client/mo | Total/mo |
|---|---|---|---|---|---|
| Small (Jian Starter or itemized) | 30 | 20 | $349 bundle or $383 itemized | $360 | $10,800 |
| Medium (Pro Bundle or itemized) | 22 | 50 | $1,495 bundle or $1,453 itemized | $1,470 | $32,340 |
| Large (itemized only, multi-site) | 5 | 200 | $5,822 itemized w/ volume disc | $5,822 | $29,110 |
| **Total monthly** | | | | | **$72,250** |
| **Annualized ARR** | | | | | **~$867K/year** |

Marginal vs. V3 ($832K): +$35K/year — small uplift from cleaner volume tier and Compliance Pro framing reaching slightly more 50-user regulated clients.

At 100 clients (year 3 target): **~$2.1M/year ARR**.

---

## 14. Why V3.1 Will Convert Clients (The Conversion Argument)

Six built-in conversion levers:

### Lever 1 — "Tell us your stack, we'll quote in 60 seconds"

Sales rep asks six questions:
1. How many M365 users?
2. How many firewalls?
3. How many Meraki organizations?
4. How many backup environments (Veeam OR NAKIVO)?
5. Want Standard or Compliance Pro?
6. Annual or monthly?

Plug into calculator → quote in 5 minutes. **Speed-to-quote is a closing weapon.** Most competitors take a week for an MDR quote.

### Lever 2 — Worked-example self-identification

Brochure shows Small / Medium / Mid-market profiles with the math done. Buyer reads "I'm like the medium dental group" → trusts the math → moves to close.

### Lever 3 — Per-line "you'd pay X for [vendor], we're Y" — sticky and memorable

"Arctic Wolf is $300/site. Jian for Firewall is $99." Buyer remembers ONE such line and trusts the whole brochure.

### Lever 4 — Bundle option for SMBs who want one number

Jian Starter at $349/mo flat removes the "10 SKUs is too much" objection. SMB closes faster on a clean bundle.

### Lever 5 — Compliance Pro tier for regulated buyers

Healthcare / financial / DoD clients see CMMC + custom-frameworks + dedicated CISSP-certified CSM as a clear premium offering. Compliance Pro at $24/user is below Drata Business ($40-100/user) and the procurement department understands the upgrade. Easier sale than V3's "+$15 upgrade" framing.

### Lever 6 — Backup vendor agnosticism

The NAKIVO callout in Jian for Backup is a unique differentiator. Sales line: *"Veeam ONE doesn't cover NAKIVO. We do. One price, any vendor."* M&A scenarios with mixed backup vendors close instantly.

---

## 15. Conversion Tactics by Segment

### Sub-25-seat SMB (5–24 users)

- Lead with **Jian Teams Bot Only** at $99/mo. Easy approval.
- Discovery question 6 months in: "Want us to add the SOC layer? Switch to Jian Starter Bundle, $349 flat — adds firewall + backup monitoring + the full M365 platform." Lever to expand.

### 25–100-seat SMB (the sweet spot)

- Lead with **Jian Starter Bundle** ($349) if they have 1 firewall + 1 backup. One-number sale.
- If they have multi-site or regulated, lead with **Compliance Pro** at $24/user (or **Jian Pro Bundle** at $1,495 flat for the typical 50-user regulated profile).
- Annual prepay closes the conversation: "Pay annually, save 17% — first month free while we connect APIs."

### 100–250-seat regulated mid-market

- Lead with **Compliance Pro itemized**. Show the worked-example math on page 7. Procurement loves the per-line transparency.
- Bundle math: $1,453–$5,822/mo with volume tier; annual saves another 17%.
- CSM-led sale; pilot first 30 days free on Standard, upgrade to Compliance Pro at month 2 once compliance team validates evidence chain.

### 250–1,000-seat enterprise

- Itemized only; no flat bundle.
- Custom NDA-protected quote built in 24 hours.
- Co-sell: anchor against Arctic Wolf Enterprise + Drata + Aisera comp stack ($30,000–$50,000/mo). Jian at $10,000–$15,000/mo is genuinely transformative.

### MSP channel (10+ clients reselling Jian)

- White-label license + 20% off list at 25+ clients with annual commit.
- MSP-specific brochure (not in this V3.1 — Q3 deliverable).
- Pax8 listing required for friction-free billing.

---

## 16. Open Pricing Decisions (Future Adjustments)

1. **Starter Bundle pricing.** Three bundles published at $349 / $1,495 / $3,295. After 6 months of sales data, may need to adjust based on attach rates.
2. **MSP wholesale tier.** Currently informal at "negotiate 20% off list at 50+ clients." Formalize once two reference MSPs are live.
3. **Compliance Pro pricing.** $24/user might be low for the regulated mid-market — could go to $29 once we have 5 reference customers. Wait and see.
4. **V2 add-on pricing.** Voice +$5/user, Remediation +$10/user, Remote Agent $99/agent. Finalized at V2 launch.

---

## 17. Source-of-Truth Files

| File | Owns |
|---|---|
| `docs/my-jian-pricing-spec.md` (this file) | V3.1 pricing strategy |
| `docs/jian-system-overview.md` §18a | Embedded V3.1 pricing |
| `docs/My-Jian-Specification.docx` | Formal external spec |
| `Services/My Jian AI Agent/My Jian AI Agent Brochure.html/.pdf` | 7-page suite brochure |
| `Services/My Jian AI Agent/My Jian AI Agent One-Pager.html/.pdf` | Single-page summary |
| `Services/My Jian AI Agent/My Jian AI Agent Price Sheet.html/.pdf` | Comprehensive standalone reference |

---

## 18. Brand Promise

**Tagline:** *"40% of name-brand price. Same protection. One platform."*

Every per-line comp callout backs it. Every worked-example client profile demonstrates it. Every sales conversation lands on it.

---

*End of pricing specification v3.1.*
