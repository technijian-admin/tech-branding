# Chat.AI Billing Templates

Technijian-branded HTML templates for the Chat.AI billing module. These are
the **source of truth** for the two PDFs the Chat.AI server generates:

- **[assets/client-invoice.html](assets/client-invoice.html)** — outbound
  client-facing invoice. Auto-charged to card on file; includes multi-state
  tax handling and "PAID / PROCESSING / PAST DUE" status badges.
- **[assets/billing-report.html](assets/billing-report.html)** — internal
  tenant billing rollup. Confidential — not for client distribution.

## How the Chat.AI server uses these files

Both HTMLs use `{{TOKEN}}` placeholders. At render time:

1. Server loads the template via `File.ReadAllText(...)`.
2. For line items / records (repeating sections), the server finds the
   `<!-- LINE_ITEMS_START --> ... <!-- LINE_ITEMS_END -->` / `<!-- ROWS_START -->
   ... <!-- ROWS_END -->` markers, treats the content between them as a
   per-row sub-template, and emits one copy per record with tokens replaced.
3. For all remaining `{{TOKEN}}` placeholders, perform plain string replace.
4. Hand the resulting HTML to the Playwright PDF renderer (same setup as
   `generate_pdfs.py` in this folder).

Missing tokens should be replaced with empty strings so the document still
renders cleanly.

## Token reference — client-invoice.html

| Token | Example | Notes |
|---|---|---|
| `{{INVOICE_NUMBER}}` | `SAMPLE-2026-06-001` | Derived from tenant code + period + sequence |
| `{{INVOICE_DATE}}` | `2026-06-01` | ISO date |
| `{{PERIOD}}` | `2026-06` | Billing period |
| `{{TRANSACTION_ID}}` | `ch_3P7xYz8M1K2jN4v8` | Stripe charge ID; hide when null |
| `{{STATUS}}` | `Complete` | Human-readable |
| `{{STATUS_CLASS}}` | `paid` | One of: `paid` / `processing` / `past-due` |
| `{{STATUS_LABEL}}` | `PAID` | Uppercase badge label |
| `{{CLIENT_NAME}}` | `Sample Client, Inc.` | Legal tenant name |
| `{{CLIENT_CONTACT}}` | `Accounts Payable` | Optional contact role |
| `{{CLIENT_EMAIL}}` | `billing@sampleclient.com` | Billing email of record |
| `{{CLIENT_ADDRESS_LINE}}` | `1 Sample Way, Irvine, CA 92618` | Single-line address |
| `{{DESCRIPTION}}` | `Chat.AI Platform Subscription` | Line item description |
| `{{ITEM_PERIOD}}` | `2026-06` | Line item period |
| `{{PLAN_TYPE}}` | `Quarterly` | Subscription tier / cadence |
| `{{TOKENS_USED}}` | `7,754` | LLM tokens consumed |
| `{{API_CALLS}}` | `14` | Platform API request count |
| `{{AMOUNT}}` | `$284.05` | Line item total |
| `{{SUBTOTAL}}` | `$284.05` | Sum of line items |
| `{{TAX}}` | `$0.00` | Calculated tax |
| `{{TAX_RATE}}` | `0.00%` | Rate applied |
| `{{TAX_JURISDICTION}}` | `California · SaaS not taxed` | Human-readable jurisdiction + reason |
| `{{TOTAL}}` | `$284.05` | Subtotal + tax |
| `{{PAYMENT_METHOD}}` | `Visa ending in 4242` | Card on file description |

## Token reference — billing-report.html

| Token | Example | Notes |
|---|---|---|
| `{{PERIOD_RANGE}}` | `2026-01 through 2026-04` | Human-readable window |
| `{{GENERATED_AT}}` | `2026-04-17 00:14:38 IST` | Report generation timestamp |
| `{{TENANT_NAME}}` | `Technijian` | Human-readable tenant |
| `{{RECORDS_COUNT}}` | `4` | Billing rows in scope |
| `{{TOTAL_BILLED}}` | `$39,529.23` | Gross before tax |
| `{{LATEST_INVOICE_DATE}}` | `2026-04-01` | Most recent invoice |
| `{{TOTAL_TOKENS}}` | `79,686` | Sum across period |
| `{{TOTAL_API_CALLS}}` | `158` | Sum across period |
| `{{STORAGE_GB}}` | `0.00` | Current tenant file store |
| `{{PAYMENT_METHOD}}` | `Card on file` | Default method |
| `{{TOTAL_TAX_COLLECTED}}` | `$0.00` | Tax rollup across jurisdictions |
| `{{ROW_PERIOD}}` | `2026-04` | Per-record period |
| `{{ROW_INVOICE_NUMBER}}` | `TCHN-2026-04-001` | Per-record invoice number |
| `{{ROW_PLAN_TYPE}}` | `Enterprise` | Per-record plan |
| `{{ROW_TOKENS}}` | `7,754` | Per-record tokens |
| `{{ROW_API_CALLS}}` | `14` | Per-record API calls |
| `{{ROW_COST}}` | `$7,882.29` | Per-record cost |
| `{{ROW_TAX}}` | `$0.00` | Per-record tax |
| `{{ROW_JURISDICTION}}` | `California` | State or "N/A" |
| `{{ROW_STATUS}}` | `Complete` | Human-readable status |
| `{{ROW_STATUS_CLASS}}` | `complete` | One of: `complete` / `processing` / `past-due` |
| `{{ROW_INVOICE_DATE}}` | `2026-04-01` | ISO date |
| `{{ROW_DUE_DATE}}` | `2026-04-16` | ISO date |
| `{{ROW_TXN_ID}}` | `ch_3P7abc...` | Truncated Stripe charge ID |
| `{{ROW_PAYMENT_METHOD}}` | `Card on file` | Per-record method |

## Multi-state tax handling

The server's `dbo.spu_BillingRecords_CalculateTax` SP should drive the
`{{TAX}}`, `{{TAX_RATE}}`, and `{{TAX_JURISDICTION}}` values:

- **California tenants** — tax = `$0.00`, jurisdiction label =
  `California · SaaS not taxed`. SaaS subscriptions are not subject to CA
  sales tax per CDTFA guidance on Cal. Code Regs. tit. 18 § 1502.
- **States that tax SaaS** (NY, TX, WA, PA, CT, OH, TN, and others) — apply
  the state's statutory rate from `dbo.TaxJurisdictions`; jurisdiction label
  shows the state name (e.g., `New York · 8.875%`).
- **States that don't tax SaaS** — tax = `$0.00`, jurisdiction label shows the
  state name with `· exempt` suffix.

## Previewing changes locally

```bash
cd c:/VSCode/tech-branding/tech-branding
python "Services/Chat.AI-pre-release/templates/generate_pdfs.py"
```

Only `*-sample.html` files render — the tokenized templates
(`client-invoice.html`, `billing-report.html`) are skipped because they
contain unreplaced `{{TOKEN}}` placeholders.

To verify the samples fit one letter page with no in-body clipping:

```bash
python "Services/Chat.AI-pre-release/templates/verify_pages.py"
```

The verify script checks both total page height AND per-page
`body.scrollHeight` vs `body.clientHeight` — the latter catches content that
`overflow:hidden` would clip silently (which looks like the CTA bleeding into
metric tiles).

## Anonymization policy (for any sample/demo PDF)

Sample templates — including anything committed here as a visual preview —
**must not contain real tenant data**. Use the anonymized defaults:

| Field | Sample value |
|---|---|
| Tenant name | `Sample Client, Inc.` |
| Tenant contact | `Accounts Payable` |
| Tenant email | `billing@sampleclient.com` |
| Tenant address | `1 Sample Way, Irvine, CA 92618` |
| Invoice number prefix | `SAMPLE-...` |
| Transaction ID | `ch_3P7xYz8M1K2jN4v8` (fictional) |
| Tenant GUID | Never render in a sample; replace with `SAMPLE` in footer |

See [feedback_no_client_names.md](../../../../.claude/projects/c--VSCode-tech-branding/memory/feedback_no_client_names.md)
— Chat.AI is a pre-release service, no real client names should appear in
templates shipped alongside marketing materials.

## File layout

```text
templates/
├── README.md                          (this file)
├── generate_pdfs.py                   (renders *-sample.html to PDF)
├── verify_pages.py                    (page height + body clipping check)
├── client-invoice-sample.pdf          (generated preview)
├── billing-report-sample.pdf          (generated preview)
├── orx-client-invoice-sample.pdf      (legacy unbranded — kept for comparison)
├── technijian-billing-report.pdf      (legacy unbranded — kept for comparison)
└── assets/
    ├── client-invoice.html            (★ template — Chat.AI server consumes)
    ├── client-invoice-sample.html     (populated preview)
    ├── billing-report.html            (★ template — Chat.AI server consumes)
    └── billing-report-sample.html     (populated preview)
```

The `★` files are the contract with the Chat.AI billing module. Changing
them (adding/removing tokens, restructuring layout) requires a coordinated
change on the server side.
