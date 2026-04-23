"""
Classify the 3,406 leads by industry, pair each with a suggested Technijian
service bundle, and emit:
  - leads-classified.csv (enriched export for the call-ops team)
  - leads-classified.json (same data, machine-readable)
  - industry-summary.md (counts per industry + service-bundle rationale)

Run:
    python "Clients/Leads/classify_leads.py"
"""
import csv
import json
import re
from collections import defaultdict
from pathlib import Path

import openpyxl

HERE = Path(__file__).resolve().parent
SRC = HERE / "Technijian Report for AI Talking Points Sent To Client.xlsx"

# Industry → keywords (first-match wins, so order the list with specific
# categories before generic fallback categories).
INDUSTRIES = [
    ("Healthcare", [
        "medical", "dental", "ortho", "health", "hospital", "clinic", "pharma",
        "physical therapy", "chiropract", "psych", "oncology", "dermat", "veterin",
        "cardio", "neuro", "surgery", "rehab", "hospice", "nurs", "pediatric",
        "urgent care", "wellness", "recover", "biotech", "diagnostic", "therapeutic",
        "medispa", "dermato",
    ]),
    ("Financial Services", [
        "insurance", "financial", "lending", "capital", "fund", "bank", "cpa",
        "accounting", "tax ", "wealth", "advisor", "credit", "mortgage", "escrow",
        "payroll", "benefits",
    ]),
    ("Legal", [
        "law firm", "lawyer", "attorney", "legal", " counsel", "litigation",
        "paralegal", "esquire", " llp", "law office", "law group", "law offices",
        " law ", " law,",
    ]),
    ("Real Estate", [
        "real estate", "realty", "apartments", "property management", "brokerage",
        " homes", "realtors", "leasing", "property ", "residential ",
    ]),
    ("Construction", [
        "construction", "contractor", "builders", " build ", "roofing", "hvac",
        "plumbing", "electric ", "remodel", "drywall", "concrete", "landscap",
        "fencing", "paving", "framing", "general contr", "glazing", "masonry",
    ]),
    ("Manufacturing", [
        "manufactur", "industries", " mfg", "fabric", "precision", "aerospace",
        "composite", "metalwork", "plastics", "tooling", "coating", "machining",
        "castings",
    ]),
    ("Logistics & Transport", [
        "logistics", "shipping", "transport", "trucking", "freight", "cargo",
        "distribution", "delivery", "haul", "fulfillment",
    ]),
    ("Hospitality & F&B", [
        "restaurant", "pizza", "cafe", "bistro", "catering", "hotel", "inn ",
        " spa", "resort", "winery", "brewery", "bakery", "kitchen", " grill",
        "foodservice",
    ]),
    ("Non-Profit", [
        "foundation", "ministry", "ministries", "church", "outreach", "charity",
        "nonprofit", "non-profit", " mission", "community services",
    ]),
    ("Technology & AI", [
        " ai ", ".ai ", "software", "systems", "solutions", "digital", "cyber",
        "cloud", "analytics", "platform", " labs", "saas", "technologies",
    ]),
    ("Marketing & Media", [
        "marketing", "advertising", " media", "creative", "studios", "production",
        "branding", "public relations", " pr ",
    ]),
    ("Automotive", [
        "auto ", "dealership", " motor", "automotive", " tires", "body shop",
        "mechanic", "collision",
    ]),
    ("Education", [
        "school", "academy", "college", "university", "tutoring", "childcare",
        "preschool", "learning center",
    ]),
    ("Professional Services", [
        "consulting", "consultants", "associates", "partners", "group ", "advisory",
        " services",
    ]),
]

# Industry → suggested Technijian service bundle + MSP-interim wedges.
SERVICE_BUNDLE = {
    "Healthcare": {
        "primary_pitch": "HIPAA-ready managed IT + 3CX telephony platform ops",
        "core": ["My IT", "My Security", "My Compliance (HIPAA)", "My Office (M365)", "My Continuity"],
        "msp_interim": [
            "My Compliance — HIPAA Technical-Safeguards audit (run alongside their MSP)",
            "Chat.AI — private-tenant AI that does NOT train on patient data (PHI-safe)",
            "My AI — AI strategy session: where AI helps scheduling, auth, intake without touching PHI",
            "Nexus Assess Pulse — external vulnerability + pen-test report for cyber insurance renewal",
            "My AI Lead Gen — patient-acquisition lead gen from public data (not PHI)",
        ],
    },
    "Financial Services": {
        "primary_pitch": "Compliance-aware managed IT + 3CX + documented audit trail",
        "core": ["My IT", "My Security", "My Compliance (SOC 2 / PCI)", "My Continuity", "My Office"],
        "msp_interim": [
            "My Compliance — SOC 2 Type II readiness assessment",
            "My Security — quarterly pen test with reporting (SEC/FINRA ready)",
            "Chat.AI — private AI for advisor workflows (Reg-BI friendly, never trains on client data)",
            "My AI — AI assistant for underwriting, claims, loan processing",
            "Nexus Assess Pulse — cyber-insurance renewal-ready vuln report",
        ],
    },
    "Legal": {
        "primary_pitch": "M365 + secure file management + privileged-communications protection",
        "core": ["My Office", "My Security", "My IT", "My Compliance", "My Continuity"],
        "msp_interim": [
            "Chat.AI — private AI for legal research, drafting, and doc review (attorney-client privilege preserved; no training on firm data)",
            "My AI — legal workflow automation (intake triage, matter summarization, e-discovery)",
            "My Compliance — client-data protection review (state bar, HIPAA for med-mal, PCI for retainer processing)",
            "My Security — email security + BEC wire-fraud prevention (top legal-sector risk)",
            "Nexus Assess Pulse — pen test for cyber insurance",
        ],
    },
    "Real Estate": {
        "primary_pitch": "Portfolio-wide 3CX VoIP + endpoint security + hybrid identity",
        "core": ["My Sip (3CX)", "My Security", "My IT", "My Office", "My Continuity"],
        "msp_interim": [
            "My Sip — 3CX rollout across properties (single dial plan, unified admin)",
            "My AI Lead Gen — AI-driven acquisition leads from permits, HOAs, just-sold signals",
            "My AI — tenant-service AI (maintenance triage, lease renewal automation)",
            "My SEO — property-listing SEO + local search optimization",
            "My Compliance — data-privacy review (tenant PII + background-check data)",
        ],
    },
    "Construction": {
        "primary_pitch": "Jobsite + HQ managed IT + CrowdStrike endpoint + datacenter migration",
        "core": ["My IT", "My Security", "My Continuity", "My Cloud", "My Office"],
        "msp_interim": [
            "Nexus Assess Pulse — cyber-insurance renewal + GC security questionnaire evidence",
            "My AI Lead Gen — AI-driven construction lead gen from permits, DRB agendas, HOA filings (3-6 mo earlier than competitors)",
            "My AI — project-management automation, RFI/submittal triage, estimating assist",
            "My Cloud — hosted datacenter + Azure AD hybrid (retire aging on-prem servers)",
            "My Compliance — CMMC-aware posture for federal/defense-adjacent work",
        ],
    },
    "Manufacturing": {
        "primary_pitch": "Shop-floor + engineering IT + verified backup + network resilience",
        "core": ["My IT", "My Continuity", "My Security", "My Cloud", "My Office"],
        "msp_interim": [
            "My Continuity — verified-restore backup program (protect production schedules)",
            "My AI — OT/IT data analytics, predictive maintenance, quality-control AI",
            "Nexus Assess Pulse — OT-aware vulnerability assessment + pen test",
            "My Compliance — ITAR / CMMC posture for defense-adjacent manufacturing",
            "My Dev — custom MES / ERP integrations and modernization",
        ],
    },
    "Logistics & Transport": {
        "primary_pitch": "Fleet / dispatch IT + VoIP + hosted infrastructure",
        "core": ["My IT", "My Sip", "My Cloud", "My Security", "My Continuity"],
        "msp_interim": [
            "My AI — route optimization, demand forecasting, predictive ETA",
            "My Dev — TMS / dispatch integrations, EDI automation",
            "Chat.AI — private AI for ops / dispatch playbook automation",
            "Nexus Assess Pulse — cyber-insurance-ready vuln report",
            "My AI Lead Gen — shipper / broker lead gen from public trade data",
        ],
    },
    "Hospitality & F&B": {
        "primary_pitch": "Restaurant / hotel IT + POS + WiFi + SEO + content",
        "core": ["My IT", "My SEO", "My Sip", "My Security", "My Office"],
        "msp_interim": [
            "My SEO — restaurant SEO + WordPress program (proven 213 entries / 340 hrs / 4 mo YTD)",
            "My AI — reservation triage, review-response automation, menu personalization",
            "Chat.AI — guest-facing AI concierge (private, no customer-data training)",
            "My AI Lead Gen — event / corporate catering lead gen",
            "My Compliance — PCI-DSS payment-card compliance review",
        ],
    },
    "Non-Profit": {
        "primary_pitch": "M365 Nonprofit + mailbox migration + B2B partner collaboration",
        "core": ["My Office", "My IT", "My Security", "My Continuity", "My Compliance"],
        "msp_interim": [
            "My Office — mailbox migration off reseller-hosted O365 + B2B cross-tenant setup with partner agencies",
            "Chat.AI — donor-communication AI (private, grant-reporting-safe)",
            "My AI — grant-writing, impact-report automation, donor segmentation",
            "My SEO — donation-page conversion optimization + SEO for cause awareness",
            "My Compliance — HIPAA (for health non-profits), FERPA (for education), donor-PII review",
        ],
    },
    "Technology & AI": {
        "primary_pitch": "SOC 2 readiness + DevOps + IT ops for tech SMBs",
        "core": ["My Compliance (SOC 2)", "My Security", "My IT", "My Dev", "My Cloud"],
        "msp_interim": [
            "My Compliance — SOC 2 Type II program (often the blocker for enterprise deals)",
            "My Security — SaaS security review + pen test",
            "My Dev — SDLC v7.0 AI-assisted dev acceleration (3-5× faster delivery)",
            "Chat.AI — internal team AI (private, IP-safe; never trains on code)",
            "Nexus Assess Pulse — continuous vuln intelligence",
        ],
    },
    "Marketing & Media": {
        "primary_pitch": "Creative-studio IT + M365 + Adobe CC + render/storage",
        "core": ["My IT", "My Cloud", "My Office", "My Security", "My SEO"],
        "msp_interim": [
            "My AI Lead Gen — agency prospect gen from public business signals",
            "Chat.AI — creative-brief and copy AI (private; no client-IP training)",
            "My AI — content production pipeline automation",
            "My SEO — agency's own SEO (practice what you preach)",
            "My Dev — custom creative ops tooling / CMS integrations",
        ],
    },
    "Automotive": {
        "primary_pitch": "Dealership IT + DMS integration + compliance",
        "core": ["My IT", "My Security", "My Compliance", "My Office", "My Continuity"],
        "msp_interim": [
            "My Compliance — Safeguards Rule (GLBA) program for auto dealers",
            "My AI — service-advisor automation, inventory pricing AI, lead-scoring",
            "Chat.AI — private AI for sales / service workflows",
            "My SEO — local dealer SEO + review management",
            "My AI Lead Gen — local auto-service lead gen from public signals",
        ],
    },
    "Education": {
        "primary_pitch": "School / academy IT + M365 Education + FERPA + device management",
        "core": ["My IT", "My Office", "My Security", "My Compliance (FERPA)", "My Continuity"],
        "msp_interim": [
            "My Compliance — FERPA + COPPA review",
            "Chat.AI — private AI for staff (never trains on student data)",
            "My AI — curriculum / admin automation, tutoring augmentation",
            "My SEO — enrollment-driving SEO",
            "My Security — ransomware-specific hardening (schools are a top target)",
        ],
    },
    "Professional Services": {
        "primary_pitch": "Managed M365 + secure file collaboration + client-data protection",
        "core": ["My Office", "My IT", "My Security", "My Compliance", "My Continuity"],
        "msp_interim": [
            "Chat.AI — private AI for client-facing teams (confidentiality-safe)",
            "My AI — proposal generation, research automation, client-brief drafting",
            "My Compliance — client-data handling review (often driven by client security questionnaires)",
            "My AI Lead Gen — B2B services prospecting from public signals",
            "My Dev — custom client portals / client-ops tooling",
        ],
    },
    "Other": {
        "primary_pitch": "Universal SMB managed IT + security + M365",
        "core": ["My IT", "My Security", "My Office", "My Continuity", "My Compliance"],
        "msp_interim": [
            "Chat.AI — private-tenant enterprise AI",
            "My AI — AI strategy session: 30-min assessment of where AI moves the needle",
            "Nexus Assess Pulse — external vuln + pen-test for cyber insurance",
            "My AI Lead Gen — AI-driven outbound lead generation",
            "My SEO — digital presence + search visibility",
        ],
    },
}


def classify(name: str, website: str) -> str:
    t = (" " + (name or "").lower() + " " + (website or "").lower() + " ").replace("/", " ")
    t = re.sub(r"\s+", " ", t)
    for label, kws in INDUSTRIES:
        for k in kws:
            if k in t:
                return label
    return "Other"


def main():
    wb = openpyxl.load_workbook(SRC, data_only=True)
    ws = wb["Sheet1"]
    rows = list(ws.iter_rows(values_only=True))
    header = [
        "Company", "Phone", "Website", "Street", "City", "State", "Zip",
        "Industry", "Primary Pitch", "Core Service Bundle", "MSP-Interim Wedges",
    ]
    out_rows = []
    industry_counts: dict[str, int] = defaultdict(int)
    for r in rows[1:]:
        if not r[0]:
            continue
        name, phone, website, street, city, state, zipc = [("" if c is None else str(c)).strip() for c in r[:7]]
        ind = classify(name, website)
        bundle = SERVICE_BUNDLE.get(ind, SERVICE_BUNDLE["Other"])
        industry_counts[ind] += 1
        out_rows.append([
            name, phone, website, street, city, state, zipc,
            ind,
            bundle["primary_pitch"],
            " · ".join(bundle["core"]),
            " | ".join(bundle["msp_interim"]),
        ])

    # CSV
    csv_path = HERE / "leads-classified.csv"
    with csv_path.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(out_rows)
    print(f"Wrote {csv_path.name} — {len(out_rows)} rows")

    # JSON
    json_path = HERE / "leads-classified.json"
    with json_path.open("w", encoding="utf-8") as f:
        json.dump([dict(zip(header, r)) for r in out_rows], f, indent=2)
    print(f"Wrote {json_path.name}")

    # Summary markdown
    summary_path = HERE / "industry-summary.md"
    total = len(out_rows)
    lines = [
        "# Leads — Industry Summary",
        "",
        f"Source: `Technijian Report for AI Talking Points Sent To Client.xlsx`  ",
        f"Total companies: **{total:,}**  ",
        f"California-based: ~99%. Top metros: Los Angeles, Irvine, San Diego.",
        "",
        "## Counts by industry",
        "",
        "| Industry | Count | % | Primary Pitch |",
        "|---|---:|---:|---|",
    ]
    for ind, n in sorted(industry_counts.items(), key=lambda x: -x[1]):
        pct = n / total * 100
        pitch = SERVICE_BUNDLE.get(ind, SERVICE_BUNDLE["Other"])["primary_pitch"]
        lines.append(f"| {ind} | {n:,} | {pct:.1f}% | {pitch} |")
    lines.extend([
        "",
        "## MSP-interim wedges (when prospect has an existing MSP)",
        "",
        "When the prospect says \"we already have an MSP,\" do **not** try to",
        "replace. Offer parallel-running services the MSP does not deliver.",
        "Per industry, the highest-yield interim wedges are:",
        "",
    ])
    for ind in sorted(industry_counts, key=lambda x: -industry_counts[x]):
        bundle = SERVICE_BUNDLE.get(ind, SERVICE_BUNDLE["Other"])
        lines.append(f"### {ind} ({industry_counts[ind]:,} leads)")
        lines.append("")
        for w in bundle["msp_interim"]:
            lines.append(f"- {w}")
        lines.append("")
    summary_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {summary_path.name}")


if __name__ == "__main__":
    main()
