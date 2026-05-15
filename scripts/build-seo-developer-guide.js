// SEO Developer Guide — Technijian Marketing Automation Platform
// Generates a brand-compliant DOCX combining:
//   - Platform overview + 4-layer architecture
//   - Per-platform setup procedures (SEO-team executable)
//   - Operating cadence + strategic playbooks
//   - "Tasks to Fully Operational" — the gap-closure backlog
//
// Output: c:\vscode\seo-sdlc\docs\google-marketing-platform\_docx\
//         SEO-Developer-Guide-Technijian-Marketing-Automation.docx
//
// Run from: c:\vscode\tech-branding\tech-branding
//   node scripts/build-seo-developer-guide.js

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak,
} = require("docx");
const fs = require("fs");
const path = require("path");

// ─────────────────────────────────────────────────────────────────────────────
// Brand
// ─────────────────────────────────────────────────────────────────────────────
const CORE_BLUE = "006DB6";
const CORE_ORANGE = "F67D4B";
const TEAL = "1EAAC8";
const DARK_CHARCOAL = "1A1A2E";
const BRAND_GREY = "59595B";
const OFF_WHITE = "F8F9FA";
const WHITE = "FFFFFF";
const LIGHT_GREY = "E9ECEF";
const GREEN = "28A745";
const RED = "CC0000";

const logoPath = path.resolve(__dirname, "..", "assets", "logos", "png", "technijian-logo-full-color-600x125.png");
const logoData = fs.readFileSync(logoPath);
const logoWhitePath = path.resolve(__dirname, "..", "assets", "logos", "png", "technijian-logo-reverse-white-834x278.png");
const logoWhiteData = fs.existsSync(logoWhitePath) ? fs.readFileSync(logoWhitePath) : logoData;

const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const noBorders = {
  top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
};
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// ─────────────────────────────────────────────────────────────────────────────
// Visual helpers
// ─────────────────────────────────────────────────────────────────────────────

function colorBar(color, height = 40) {
  return new Table({
    width: { size: 12240, type: WidthType.DXA },
    columnWidths: [12240],
    rows: [new TableRow({
      children: [new TableCell({
        borders: noBorders,
        width: { size: 12240, type: WidthType.DXA },
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        shading: { fill: color, type: ShadingType.CLEAR },
        children: [new Paragraph({ spacing: { before: height / 2, after: height / 2 }, children: [] })],
      })],
    })],
  });
}

function sectionHeader(title) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [120, 9240],
    rows: [new TableRow({
      children: [
        new TableCell({
          borders: noBorders,
          width: { size: 120, type: WidthType.DXA },
          shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [] })],
        }),
        new TableCell({
          borders: noBorders,
          width: { size: 9240, type: WidthType.DXA },
          margins: { top: 100, bottom: 100, left: 200, right: 0 },
          children: [new Paragraph({
            children: [new TextRun({ text: title, font: "Open Sans", size: 32, bold: true, color: CORE_BLUE })],
          })],
        }),
      ],
    })],
  });
}

function partHeader(partNumber, title) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: noBorders,
        width: { size: 9360, type: WidthType.DXA },
        margins: { top: 200, bottom: 200, left: 240, right: 240 },
        shading: { fill: DARK_CHARCOAL, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            children: [new TextRun({ text: `PART ${partNumber}`, font: "Open Sans", size: 18, bold: true, color: CORE_ORANGE, characterSpacing: 100 })],
          }),
          new Paragraph({
            spacing: { before: 60 },
            children: [new TextRun({ text: title, font: "Open Sans", size: 36, bold: true, color: WHITE })],
          }),
        ],
      })],
    })],
  });
}

function h2(text) {
  return new Paragraph({
    spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, font: "Open Sans", size: 28, bold: true, color: CORE_BLUE })],
  });
}

function h3(text) {
  return new Paragraph({
    spacing: { before: 240, after: 100 },
    children: [new TextRun({ text, font: "Open Sans", size: 24, bold: true, color: DARK_CHARCOAL })],
  });
}

function h4(text) {
  return new Paragraph({
    spacing: { before: 180, after: 80 },
    children: [new TextRun({ text, font: "Open Sans", size: 20, bold: true, color: BRAND_GREY })],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({
      text, font: "Open Sans", size: 22, color: opts.color || BRAND_GREY,
      bold: opts.bold, italics: opts.italics,
    })],
  });
}

function inline(runs, opts = {}) {
  return new Paragraph({
    spacing: { after: 100 },
    children: runs.map(r => new TextRun({
      text: r.t, font: r.code ? "Consolas" : "Open Sans",
      size: r.code ? 20 : 22,
      bold: r.b, italics: r.i,
      color: r.color || (r.code ? "C7254E" : BRAND_GREY),
    })),
  });
}

function bullet(text, lvl = 0) {
  return new Paragraph({
    spacing: { after: 60 },
    indent: { left: 360 + lvl * 360, hanging: 360 },
    children: [
      new TextRun({ text: lvl === 0 ? "• " : "– ", font: "Open Sans", size: 22, color: CORE_ORANGE, bold: true }),
      new TextRun({ text, font: "Open Sans", size: 22, color: BRAND_GREY }),
    ],
  });
}

function codeBlock(lines) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY },
                   bottom: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY },
                   left: { style: BorderStyle.SINGLE, size: 12, color: CORE_BLUE },
                   right: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY } },
        width: { size: 9360, type: WidthType.DXA },
        margins: { top: 120, bottom: 120, left: 200, right: 120 },
        shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
        children: lines.map(l => new Paragraph({
          spacing: { after: 20 },
          children: [new TextRun({ text: l, font: "Consolas", size: 18, color: DARK_CHARCOAL })],
        })),
      })],
    })],
  });
}

function calloutBox(title, body, accentColor) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY },
                   bottom: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY },
                   left: { style: BorderStyle.SINGLE, size: 16, color: accentColor || CORE_ORANGE },
                   right: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY } },
        margins: { top: 160, bottom: 160, left: 200, right: 200 },
        shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            spacing: { after: 80 },
            children: [new TextRun({ text: title, font: "Open Sans", size: 22, bold: true, color: accentColor || CORE_ORANGE })],
          }),
          ...(Array.isArray(body) ? body : [body]).map(t =>
            new Paragraph({
              spacing: { after: 60 },
              children: [new TextRun({ text: t, font: "Open Sans", size: 20, color: BRAND_GREY })],
            })
          ),
        ],
      })],
    })],
  });
}

function metricCard(number, label, color, width) {
  return new TableCell({
    borders: noBorders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 160, bottom: 160, left: 80, right: 80 },
    shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { after: 40 },
        children: [new TextRun({ text: number, font: "Open Sans", size: 56, bold: true, color: color || CORE_BLUE })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: label, font: "Open Sans", size: 16, color: BRAND_GREY })],
      }),
    ],
  });
}

function metricsRow(cards) {
  const width = Math.floor(9360 / cards.length);
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: cards.map(() => width),
    rows: [new TableRow({
      children: cards.map(c => metricCard(c.n, c.l, c.color, width)),
    })],
  });
}

function headerRow(cols, widths, color) {
  return new TableRow({
    tableHeader: true,
    children: cols.map((h, i) =>
      new TableCell({
        borders, width: { size: widths[i], type: WidthType.DXA }, margins: cellMargins,
        shading: { fill: color || CORE_BLUE, type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: WHITE, size: 20, font: "Open Sans" })] })],
      })
    ),
  });
}

function dataRow(cols, widths, shaded) {
  return new TableRow({
    children: cols.map((t, i) =>
      new TableCell({
        borders, width: { size: widths[i], type: WidthType.DXA }, margins: cellMargins,
        shading: shaded ? { fill: OFF_WHITE, type: ShadingType.CLEAR } : undefined,
        children: [new Paragraph({ children: [new TextRun({ text: t, size: 20, color: BRAND_GREY, font: "Open Sans" })] })],
      })
    ),
  });
}

function statusRow(cols, widths, shaded, statusIdx, statusColor) {
  return new TableRow({
    children: cols.map((t, i) =>
      new TableCell({
        borders, width: { size: widths[i], type: WidthType.DXA }, margins: cellMargins,
        shading: shaded ? { fill: OFF_WHITE, type: ShadingType.CLEAR } : undefined,
        children: [new Paragraph({ children: [new TextRun({
          text: t, size: 20, font: "Open Sans",
          color: (i === statusIdx && statusColor) ? statusColor : BRAND_GREY,
          bold: i === statusIdx,
        })] })],
      })
    ),
  });
}

function table(header, rows, widths, opts = {}) {
  const all = [headerRow(header, widths, opts.headerColor)];
  rows.forEach((r, i) => {
    if (opts.statusIdx !== undefined && opts.statusMap) {
      const status = r[opts.statusIdx];
      const color = opts.statusMap[status] || BRAND_GREY;
      all.push(statusRow(r, widths, i % 2 === 0, opts.statusIdx, color));
    } else {
      all.push(dataRow(r, widths, i % 2 === 0));
    }
  });
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: widths, rows: all,
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function space(units = 1) {
  const out = [];
  for (let i = 0; i < units; i++) out.push(new Paragraph({ children: [] }));
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Document
// ─────────────────────────────────────────────────────────────────────────────

const today = new Date();
const dateStr = today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
const versionStr = "1.0";

const doc = new Document({
  creator: "Technijian",
  title: "SEO Developer Guide — Technijian Marketing Automation Platform",
  description: "Technical guide for the four-layer marketing automation stack: setup, operations, playbooks, and gap-closure roadmap.",
  styles: {
    default: { document: { run: { font: "Open Sans", size: 22, color: BRAND_GREY } } },
  },
  sections: [
    // ═══════════════════════════════════════════════════════════════════════
    // COVER PAGE
    // ═══════════════════════════════════════════════════════════════════════
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 0, right: 0, bottom: 0, left: 0 } },
      },
      children: [
        colorBar(CORE_BLUE, 80),

        ...space(8),

        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 800 },
          children: [new ImageRun({
            type: "png", data: logoData,
            transformation: { width: 320, height: 67 },
            altText: { title: "Technijian", description: "Logo", name: "logo" },
          })],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 400 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: CORE_ORANGE, space: 1 } },
          indent: { left: 4000, right: 4000 },
          children: [],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 240 },
          children: [new TextRun({ text: "SEO DEVELOPER GUIDE", font: "Open Sans", size: 22, color: CORE_ORANGE, bold: true, characterSpacing: 200 })],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [new TextRun({ text: "Marketing Automation Platform", font: "Open Sans", size: 48, bold: true, color: DARK_CHARCOAL })],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 1600 },
          children: [new TextRun({ text: "Four-Layer Architecture · Setup, Operations & Roadmap", font: "Open Sans", size: 24, color: BRAND_GREY, italics: true })],
        }),

        // Metric strip
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2340, 2340, 2340, 2340],
          rows: [new TableRow({
            children: [
              metricCard("11", "Platforms wired", CORE_BLUE, 2340),
              metricCard("5", "Python harnesses", CORE_ORANGE, 2340),
              metricCard("18", "Skills + commands", TEAL, 2340),
              metricCard("11", "Sub-agents", DARK_CHARCOAL, 2340),
            ],
          })],
        }),

        ...space(4),

        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: `Version ${versionStr}  ·  ${dateStr}`, font: "Open Sans", size: 22, color: BRAND_GREY })],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "CONFIDENTIAL — Internal Technijian Document", font: "Open Sans", size: 18, color: BRAND_GREY, characterSpacing: 150 })],
        }),

        ...space(2),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8500  |  technijian.com", font: "Open Sans", size: 16, color: BRAND_GREY })],
        }),

        ...space(2),

        colorBar(CORE_ORANGE, 60),
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CONTENT
    // ═══════════════════════════════════════════════════════════════════════
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 } },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            spacing: { after: 60 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: CORE_BLUE, space: 6 } },
            children: [
              new ImageRun({ type: "png", data: logoData, transformation: { width: 160, height: 33 },
                altText: { title: "Technijian", description: "Logo", name: "logo" } }),
              new TextRun({ text: "       SEO Developer Guide", font: "Open Sans", size: 18, color: BRAND_GREY, italics: true }),
            ],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY, space: 6 } },
            children: [
              new TextRun({ text: "Technijian  ·  Marketing Automation Platform  ·  v" + versionStr + "  —  Page ", font: "Open Sans", size: 16, color: BRAND_GREY }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Open Sans", size: 16, color: BRAND_GREY }),
            ],
          })],
        }),
      },
      children: [
        // ─────────────────────────────────────────────────────────────────
        // TABLE OF CONTENTS
        // ─────────────────────────────────────────────────────────────────
        sectionHeader("Table of Contents"),
        ...space(1),
        table(
          ["Part", "Section", "Page focus"],
          [
            ["—", "Executive Summary", "What's built, what works, what's missing"],
            ["1", "System Overview", "Why the platform exists, the 4-layer model"],
            ["2", "The Eleven Platforms", "Google×4, Semrush, HeyGen, InVideo, NotebookLM, 11 social"],
            ["3", "Setup Procedures", "Workstation + per-client steps the SEO team executes"],
            ["4", "Operating Cadence", "Daily, weekly, monthly, event-driven SOPs"],
            ["5", "Strategic Playbooks", "Organic, Local, Conversion Tracking, Reputation"],
            ["6", "Tasks to Fully Operational", "The gap-closure backlog — what blocks production today"],
            ["A", "CLI Cheat Sheet", "Every command + flag"],
            ["B", "Glossary", "Terms, acronyms, metric definitions"],
            ["C", "Source Documents", "Where each section is sourced from in the repo"],
          ],
          [800, 4000, 4560]
        ),

        pageBreak(),

        // ─────────────────────────────────────────────────────────────────
        // EXECUTIVE SUMMARY
        // ─────────────────────────────────────────────────────────────────
        sectionHeader("Executive Summary"),
        ...space(1),

        body("This guide consolidates everything an SEO developer or operator needs to run Technijian's marketing automation platform — a four-layer system spanning eleven platforms, five Python harnesses, eighteen skills + slash commands, and eleven sub-agents."),

        h3("What is built"),
        bullet("Google Marketing Platform harness: GBP, GA4, GSC, GTM — unified CLI, snapshot to disk, drift detection."),
        bullet("Semrush harness: rank, organic/paid keywords, backlinks, toxic-link scan, competitor analysis."),
        bullet("Content harnesses: HeyGen (avatar video), InVideo (prompt-to-video), NotebookLM (research synthesis + audio overview)."),
        bullet("Social distribution toolkit: 11 platforms (LinkedIn, Facebook, Instagram, Threads, Pinterest, X, YouTube, TikTok, Bluesky, Medium, Quora)."),
        bullet("Marketing Director orchestrator + per-platform analysts, all spawnable via the Agent tool."),
        bullet("Weekly scheduled task pulls fresh data Sunday 5am PT; daily scheduled task pulls social analytics 4am PT."),

        h3("What this guide covers"),
        bullet("Architecture and design rationale (Part 1)"),
        bullet("Each platform's role and snapshot contract (Part 2)"),
        bullet("Step-by-step setup with copy-pastable client access email templates (Part 3)"),
        bullet("Daily, weekly, monthly cadences and event-driven SOPs (Part 4)"),
        bullet("Strategic playbooks tying tools to outcomes (Part 5)"),
        bullet("The gap-closure roadmap — every task that stands between the current state and a fully operational deployment (Part 6)"),

        h3("Operational readiness"),
        body("At the date of this guide, the codebase is feature-complete on the core surface but production deployment requires a finite list of setup, credential, and configuration tasks. Part 6 enumerates them with owners, time estimates, and dependencies."),

        calloutBox(
          "How to use this guide",
          [
            "If you are setting up the platform for the first time, read Parts 1–3 then jump to Part 6 and execute the OPEN tasks in order.",
            "If you are operating the platform week-to-week, Parts 4–5 are your reference.",
            "If you are extending the platform, the source-document map in Appendix C points to every spec in c:\\vscode\\seo-sdlc\\docs\\google-marketing-platform\\.",
          ],
          CORE_BLUE
        ),

        pageBreak(),

        // ─────────────────────────────────────────────────────────────────
        // PART 1 — SYSTEM OVERVIEW
        // ─────────────────────────────────────────────────────────────────
        partHeader(1, "System Overview"),
        ...space(1),

        h2("Why the platform exists"),
        body("Before this platform, a small SEO team had to log into the Google UI for every client, every Monday morning, paste screenshots into decks, and chase changes in Tag Manager that broke tracking weeks after the fact. The platform replaces that friction with a single CLI, structured disk snapshots, and sub-agents that read the snapshots and produce briefs."),

        h3("Core principles"),
        bullet("Read-heavy by default. Reads are cheap, automated, and run daily/weekly. Writes are gated and intentional."),
        bullet("Disk is the contract. Every pull writes a stable JSON/CSV layout under sdlc/clients/<CODE>/<platform>/YYYY-MM-DD/."),
        bullet("One CLI per platform. A single Python entry point talks to each vendor. Skills, agents, and slash commands wrap it. No other code path bypasses it."),
        bullet("Service account where possible, OAuth where required. GA4 + GSC run unattended via service account. GBP + GTM require user OAuth because that is what the APIs support."),
        bullet("Drift detection is a first-class output. GTM container fingerprint, GA4 Unassigned channel, GSC sitemap delta — all routinely sampled and flagged."),

        h2("The four-layer architecture"),

        codeBlock([
          "LAYER 4 — HARNESS (when and how to trigger)",
          "  • Slash commands     (.claude/commands/<name>.md)",
          "  • Scheduled tasks    (sdlc/scripts/schedule/marketing-weekly.ps1)",
          "  • n8n workflows      (sdlc/n8n_workflows/)",
          "",
          "LAYER 3 — AGENTS (judgment + multi-tool orchestration)",
          "  sdlc/.agents/",
          "  ├── google/    seo-strategist + 4 platform analysts",
          "  ├── semrush/   semrush-analyst",
          "  ├── content/   notebooklm-researcher, heygen-producer, invideo-producer",
          "  └── marketing-director.md     top-of-chain orchestrator",
          "",
          "LAYER 2 — SKILLS (capability instructions + run patterns)",
          "  .claude/skills/",
          "  ├── google-*           5 skills (GBP, GA4, GSC, GTM, seo-weekly-pull)",
          "  ├── semrush",
          "  ├── heygen-video, invideo-video, notebooklm-source",
          "  └── (user-level)       11 social-publish skills + 2 orchestrators",
          "",
          "LAYER 1 — HARNESS CODE (Python wrappers — single source of truth)",
          "  sdlc/scripts/",
          "  ├── google/      auth.py, gbp.py, ga4.py, gsc.py, gtm.py, cli.py",
          "  ├── semrush/     client.py, cli.py",
          "  ├── heygen/      client.py, cli.py",
          "  ├── invideo/     client.py, cli.py",
          "  ├── notebooklm/  client.py, cli.py",
          "  └── schedule/    marketing-weekly.ps1",
          "  sdlc/_agency_assets/scripts/social/   (11-platform toolkit)",
        ]),

        h3("Why three layers above the harness"),
        body("Skills run in the parent Claude context — fast, cheap, but the trigger description is what selects them. Agents run in a fresh sub-context — expensive but isolated; ideal for analysis that produces a structured brief without polluting the main thread. Slash commands are explicit operator triggers. The harness is the foundation everything depends on."),

        h3("The snapshot contract"),
        body("Every system writes to sdlc/clients/<CODE>/<source>/YYYY-MM-DD/ and follows the rule: read disk only in agents, never API. This decouples analysis from API failures and lets agents run on stale data when needed."),

        table(
          ["Source", "Owner system", "Default files"],
          [
            ["gbp/", "Google harness", "performance.json, reviews.json"],
            ["ga4/", "Google harness", "traffic.*, acquisition.*, landing.*, events.*, conversions.*, unassigned_audit.*, manifest.json"],
            ["gsc/<host>/", "Google harness", "queries.*, pages.*, countries.*, devices.*, query_page.*, sitemaps.json, manifest.json"],
            ["gtm/", "Google harness", "audit.json, drift.json"],
            ["semrush/<domain>/", "Semrush harness", "domain_overview.*, organic.*, backlinks_*, competitors.*, manifest.json"],
            ["videos/heygen/<date>/", "HeyGen harness", "<slug>.mp4 + <slug>.json"],
            ["videos/invideo/<date>/", "InVideo harness", "<slug>.mp4 + <slug>.json"],
            ["notebooklm/<slug>/", "NotebookLM harness", "metadata.json, audio_overview.mp3, mind_map.json, quiz.{json,md}"],
            ["social/<platform>/<date>/", "Social toolkit", "snapshot.json"],
          ],
          [1800, 2400, 5160]
        ),

        pageBreak(),

        // ─────────────────────────────────────────────────────────────────
        // PART 2 — THE PLATFORMS
        // ─────────────────────────────────────────────────────────────────
        partHeader(2, "The Eleven Platforms"),
        ...space(1),

        h2("Google Marketing Platform — 4 platforms"),
        body("The original harness. Pulled together in the Google Cloud project Technijian-AI with one OAuth client + one service account."),

        table(
          ["Platform", "Module", "Auth", "Default pull window"],
          [
            ["Business Profile (GBP)", "gbp.py", "OAuth user (mandatory)", "30 days"],
            ["Analytics 4 (GA4)", "ga4.py", "Service account preferred", "7 days"],
            ["Search Console (GSC)", "gsc.py", "Service account preferred", "28 days"],
            ["Tag Manager (GTM)", "gtm.py", "OAuth user (mandatory)", "Snapshot + drift"],
          ],
          [2800, 1600, 2900, 2060]
        ),

        h2("Semrush — keyword, rank, and backlink intelligence"),
        body("Wraps the Semrush Analytics API + Projects API behind the same shape as the Google modules. Per-call cost is reported in manifest.json so daily quota is observable."),

        body("Daily budget guidance for 20 active client domains:"),
        bullet("domain_overview: 10 units per call"),
        bullet("backlinks_overview: 40 units per call"),
        bullet("Standard pull per domain: ~150 units"),
        bullet("Toxic scan per domain: ~5,000 units (run weekly)"),
        bullet("Total expected: ~26k units/month — fits the 100k Business tier"),

        h2("HeyGen — avatar-led video generation"),
        body("Submits a script + avatar ID to HeyGen, polls until rendered, downloads the MP4 plus metadata. The harness bypasses the broken get_voices API route by using a verified default voice."),
        body("Use HeyGen when you have a script and want consistent brand face; cost ~$0.30 per minute."),

        h2("InVideo — prompt-to-video for short-form social"),
        body("Generates text-on-video with stock footage and AI-written narration from a prompt. Auto-picks aspect ratio and duration from the target platform (YouTube Shorts, LinkedIn, TikTok, IG Reels, Facebook)."),
        body("Use InVideo when you want variety over brand consistency; cost ~$0.50 per video."),

        h2("NotebookLM — research synthesis + audio overview"),
        body("Wraps the notebooklm-py library to programmatically create notebooks, ask synthesis questions, generate audio overviews (two-host podcast format), mind maps, and quizzes. Free service, rate-limited."),
        body("Pipeline pattern: notebooklm-source create + ask → script.txt on disk → heygen-video render → cross-platform-publisher."),

        h2("Social distribution — 11 platforms"),
        body("Library at sdlc/_agency_assets/scripts/social/. Each platform has an atomic publish skill plus the cross-platform-publisher orchestrator and the social-analytics-pull daily harness."),

        table(
          ["Tier", "Platform", "CTA rule", "Caption style"],
          [
            ["1", "LinkedIn", "Link in first comment", "ProperCase, 3-5 tags"],
            ["2", "Facebook", "Link in bio", "lowercase, 3-5 tags"],
            ["2", "Instagram", "Link in bio", "lowercase, 20-30 tags"],
            ["3", "Threads", "Link in bio", "lowercase, 1-3 tags"],
            ["SEO", "Pinterest", "Link on the Pin (--link)", "noun-phrase, 5-10 tags"],
            ["4", "X (Twitter)", "In-tweet link", "lowercase, 2-3 tags"],
            ["4", "YouTube", "Description link", "title-cased, 3-8 tags"],
            ["4", "TikTok", "Bio link (review-gated)", "lowercase, 3-5 tags"],
            ["4", "Bluesky", "Inline link (Google-indexed)", "lowercase, 2-4 tags"],
            ["4", "Medium", "Canonical-back to blog", "title-cased, 3-5 tags"],
            ["4", "Quora", "In-answer link", "no hashtags"],
          ],
          [700, 1800, 3260, 3600]
        ),

        h3("Strategy rules baked in code"),
        bullet("LinkedIn destination link goes in the first comment, never the post body. UTM medium = comment."),
        bullet("Facebook, Instagram, Threads captions never contain clickable links. UTM medium = bio."),
        bullet("Pinterest destination link is set on the Pin itself via the --link flag. UTM medium = pin."),
        bullet("Hashtag counts and caption styles enforced in code via hashtag.PLATFORM_LIMITS and hashtag._style()."),
        bullet("Idempotency: SHA-256 fingerprint of (caption, asset) prevents duplicate publishes per platform."),
        bullet("Golden Hour: first 60 min after a LinkedIn or YouTube publish are critical; entry added to state/golden_hour_watch.json."),

        pageBreak(),

        // ─────────────────────────────────────────────────────────────────
        // PART 3 — SETUP PROCEDURES
        // ─────────────────────────────────────────────────────────────────
        partHeader(3, "Setup Procedures"),
        ...space(1),

        body("This section condenses the per-platform setup steps. The full version with screenshots and copy-pastable email templates lives at docs/google-marketing-platform/03-platform-setup/ in the seo-sdlc repo."),

        h2("Workstation-level setup (one-time)"),

        table(
          ["Step", "Owner", "Deliverable"],
          [
            ["1. Google Cloud project + 6 APIs", "Engineering (Ravi)", "technijian-ai project with My Business + GA4 Data + Search Console + Tag Manager APIs enabled"],
            ["2. OAuth Desktop client", "Engineering", "keys/google-oauth-client.json"],
            ["3. Service account + JSON key", "Engineering", "keys/google-sa.json + SA email recorded"],
            ["4. Semrush API key", "Engineering", "keys/semrush.key"],
            ["5. HeyGen API key", "Engineering", "keys/heygen.key"],
            ["6. InVideo API key", "Engineering", "keys/invideo.key"],
            ["7. NotebookLM browser login", "Engineering", "notebooklm login → cookie stored in OS keychain"],
            ["8. Python deps installed", "Engineering", "pip install -r each harness requirements.txt"],
            ["9. First-run OAuth (gbp + gtm)", "SEO Lead (Puneet)", "state/oauth_token_gbp.json + state/oauth_token_gtm.json"],
            ["10. Scheduled task installed", "Engineering", "Sunday 5am task + daily 4am social task"],
          ],
          [600, 2100, 6660]
        ),

        h2("Per-client setup (one-time per client)"),

        table(
          ["Step", "Owner", "Action", "Output captured"],
          [
            ["A. Client Agreement folder", "Puneet", "Run New-Client.ps1 → sdlc/clients/<CODE>/", "_Agreements/services.json populated from SOW"],
            ["B. GBP Manager grant", "Puneet → client", "Client adds puneet@technijian.com as Manager", "GBP account + location IDs"],
            ["C. GA4 viewer grant", "Puneet → client", "Client adds the SA email at Property Access Mgmt", "GA4 numeric Property ID"],
            ["D. GSC user grant", "Puneet → client", "Client adds SA + Puneet at Settings → Users", "GSC site URL(s)"],
            ["E. GTM user grant", "Puneet → client", "Client adds Puneet as User at Admin → User Mgmt", "GTM account + container IDs"],
            ["F. Profile JSON populated", "Saroj/Vaishali", "Fill sdlc/scripts/google/clients/<CODE>.json", "All IDs in place"],
            ["G. First pull validation", "Saroj/Vaishali", "python3 -m sdlc.scripts.google.cli pull-all --client <CODE>", "All 4 snapshot directories populated"],
            ["H. Baseline document", "Puneet", "Write sdlc/clients/<CODE>/08_Status_Review/baseline.md", "Captured metrics + tracking gaps"],
            ["I. Vault client page", "Puneet", "Create knowledge/clients/client-<code>.md in Obsidian", "Cross-session memory"],
          ],
          [600, 1700, 3760, 3300]
        ),

        h2("Email templates for client access"),
        body("Full templates with subject lines and step-by-step instructions are in docs/google-marketing-platform/03-platform-setup/04..07-*.md. Each template is designed to be sent to the client's platform admin and answered in under 5 minutes."),

        h3("Critical addresses to capture"),
        bullet("Google Service Account email: marketing-harness@technijian-ai.iam.gserviceaccount.com — paste into GA4 + GSC user grants."),
        bullet("Puneet's GBP/GTM working email: puneet@technijian.com — used for OAuth user flow and as the GBP Manager + GTM User invite recipient."),

        pageBreak(),

        // ─────────────────────────────────────────────────────────────────
        // PART 4 — OPERATING CADENCE
        // ─────────────────────────────────────────────────────────────────
        partHeader(4, "Operating Cadence"),
        ...space(1),

        h2("The weekly loop"),

        codeBlock([
          "Sunday 5am PT    → marketing-weekly.ps1 scheduled task",
          "                    └─ for each client: pull-all (Google) + pull (Semrush)",
          "",
          "Monday 9am PT    → /marketing-weekly-brief <CODE>",
          "                    └─ spawns seo-strategist + semrush-analyst in parallel",
          "                    └─ writes marketing-brief-<DATE>.md",
          "",
          "Monday 11am PT   → /status-review consumes the brief",
          "                    └─ produces the Technijian-branded PPTX deck",
          "",
          "Monday 2pm PT    → /weekly-review-batch --commit",
          "                    └─ creates next-week tickets in Client Portal",
          "                    └─ Puneet's 3 standing tickets + load-balanced fixes",
          "",
          "Tuesday          → Client review meeting (selected clients)",
          "                    └─ deck attached to email by /send-email",
          "",
          "Thurs-Friday     → Team executes the next-week tickets",
        ]),

        h2("Daily routine"),

        table(
          ["Time", "Who", "Action"],
          [
            ["4am PT auto", "Scheduler", "social/daily_pull.py — 24h + 7d analytics per connected platform"],
            ["5am PT auto", "Scheduler (Sun)", "marketing-weekly.ps1 — Google + Semrush pull-all (Sunday only)"],
            ["9am PT", "Puneet", "Check unreplied reviews older than 24h (sdlc/clients/*/gbp/<today>/reviews.json)"],
            ["9-10am", "Mohit", "Scan GTM drift.json + GA4 unassigned_audit.csv across clients"],
            ["All day", "Saroj + Vaishali", "Execute next-week tickets (content briefs, title rewrites, GBP posts)"],
          ],
          [1400, 1600, 6360]
        ),

        h2("Event-driven SOPs"),

        table(
          ["Signal", "Workflow", "Owner"],
          [
            ["New blog/page published", "content-launch — inspect URL, request indexing, GBP mirror post, cross-platform-publisher", "Saroj + Mohit"],
            ["GA4 Unassigned > 15%", "tracking-fix — diagnose Consent Mode, GTM tag, UTM stripping", "Mohit → Ravi"],
            ["GTM drift detected", "tracking-fix [C] — diff snapshots, triage by risk, email client owner", "Mohit"],
            ["GBP review sentiment risk", "review-management — same-day reply, escalate to Puneet", "Puneet"],
            ["GSC bot country signal", "negative-seo-defense — disavow gen, Cloudflare WAF, fake-review flag", "Mohit + Ravi"],
            ["Conversion drop > 30% wow", "tracking-fix [B] — verify tags in DebugView", "Mohit"],
          ],
          [2400, 5160, 1800]
        ),

        h2("Monthly retrospective"),
        body("First Monday of each month, ~90 min per client. Pull 30-day data, compute MoM deltas, document what worked, refresh services.json upsell_candidates[], schedule client review call. Output: sdlc/clients/<CODE>/08_Status_Review/monthly-YYYY-MM.md."),

        pageBreak(),

        // ─────────────────────────────────────────────────────────────────
        // PART 5 — STRATEGIC PLAYBOOKS
        // ─────────────────────────────────────────────────────────────────
        partHeader(5, "Strategic Playbooks"),
        ...space(1),

        h2("Organic SEO playbook (GSC + GA4)"),
        body("North-star metric: non-branded organic clicks plus organic-attributed conversions."),

        h3("Five plays, prioritized"),
        table(
          ["#", "Play", "Trigger signal", "Effort"],
          [
            ["1", "Position-cliff push", "Query at position 8-15 with high impressions", "2-4h per query"],
            ["2", "CTR leak rescue", "Page at pos 5-10 with CTR <1.5%", "30 min per page"],
            ["3", "Topic cluster build", "Single ranking query has whole intent cluster uncovered", "6-12h per cluster"],
            ["4", "Page consolidation", "Multiple pages compete for the same query (cannibalization)", "4-8h"],
            ["5", "Indexing recovery", "Sitemap shows submitted - indexed > 10%", "15 min – 4h per URL"],
          ],
          [400, 2400, 4160, 2400]
        ),

        h2("Local SEO playbook (GBP-first)"),
        body("North-star metric: action ratio = (calls + website + directions) / impressions. Target 3-6%."),

        h3("The local loop"),
        bullet("Weekly pulse: post update mirroring blog + 3 geotagged photos."),
        bullet("Daily guard: reply to reviews within 24h, answer new Q&A."),
        bullet("Monthly audit: NAP consistency across Yelp, Bing, Apple Maps, BBB."),

        h3("Five plays"),
        bullet("Discovery vs. Direct rebalance — fix categories, service list, post weekly with keywords."),
        bullet("Action ratio rescue — cover photo, 25+ photos, accurate hours, keyword description."),
        bullet("Review generation — personalized requests within 24h of service, never gate or incentivize."),
        bullet("Citation NAP audit — tier 1 (Yelp/Bing/Apple/Facebook) then tier 2-3."),
        bullet("Service area expansion — GBP service area + per-metro landing pages."),

        h2("Conversion tracking playbook (GTM + GA4)"),
        body("North-star: every meaningful action is a GA4 key event with attribution, and Unassigned stays < 15%."),

        h3("Standard tag stack per client"),
        bullet("GA4 Configuration on All Pages."),
        bullet("GA4 Form Submit on Form Submission listener."),
        bullet("GA4 Phone Click on Click - Just Links, URL contains tel:"),
        bullet("GA4 Outbound Click on links leaving the domain."),
        bullet("GA4 Scroll Depth at 25/50/75/90."),
        bullet("Consent Default (highest priority, on Consent Initialization)."),
        bullet("Consent Update (on custom event from CMP)."),
        bullet("Plus business-model-specific: ecommerce (purchase), SaaS (demo_request), local (booking_request)."),

        h2("Reputation management playbook"),
        body("North-star: maintain ≥ 4.5 stars with ≥ 30 reviews, reply 100% within 24h, convert 5★ reviewers into referrals."),

        h3("Reply tone matrix"),
        table(
          ["Class", "Action time", "Tone"],
          [
            ["5★ promoter", "Within 24h", "Warm + named staff acknowledgment + keyword inject"],
            ["5★ generic", "Within 24h", "Brief, warm, no overshoot"],
            ["4★ with critique", "Within 24h", "Acknowledge + offer follow-up"],
            ["3★", "Same day", "Apologize + take offline"],
            ["1-2★ legit", "Same day", "Sincere apology + path forward, Puneet drafts"],
            ["1-2★ troll", "Same day", "Brief professional response, flag for negative SEO playbook"],
          ],
          [1900, 2000, 5460]
        ),

        pageBreak(),

        // ─────────────────────────────────────────────────────────────────
        // PART 6 — TASKS TO FULLY OPERATIONAL
        // ─────────────────────────────────────────────────────────────────
        partHeader(6, "Tasks to Fully Operational"),
        ...space(1),

        body("This is the gap-closure backlog. Each task has an ID, status, owner, effort estimate, and the dependency chain. Status legend: OPEN = not started; IN-PROGRESS = partly done; DONE = complete; BLOCKED = waiting on external dependency."),

        calloutBox(
          "Critical path",
          "Tasks T-101 → T-115 form the critical path to first production run. Until these are complete the harness exists but cannot pull live data for any client.",
          RED
        ),

        h2("6.1 — Credentials & Cloud Project (critical path)"),
        table(
          ["ID", "Task", "Owner", "Effort", "Status"],
          [
            ["T-101", "Confirm Google Cloud project 'technijian-ai' exists and billing is linked", "Ravi", "15 min", "OPEN"],
            ["T-102", "Enable the 6 Google APIs (Business Information, Account Management, Business Profile Performance, GA4 Data, Search Console, Tag Manager)", "Ravi", "10 min", "OPEN"],
            ["T-103", "Configure OAuth consent screen (app name, support email, test users for Puneet/Saroj/Vaishali/Mohit/Ravi)", "Ravi", "15 min", "OPEN"],
            ["T-104", "Create Desktop OAuth client, download JSON, save to keys/google-oauth-client.json", "Ravi", "5 min", "OPEN"],
            ["T-105", "Create service account 'marketing-harness', generate JSON key, save to keys/google-sa.json", "Ravi", "10 min", "OPEN"],
            ["T-106", "Record SA email (marketing-harness@technijian-ai.iam.gserviceaccount.com) in vault", "Ravi", "2 min", "OPEN"],
            ["T-107", "Semrush API key obtained from Business subscription, saved to keys/semrush.key", "Ravi", "30 min", "OPEN"],
            ["T-108", "HeyGen API key (from app.heygen.com/settings/api) saved to keys/heygen.key", "Ravi", "10 min", "OPEN"],
            ["T-109", "InVideo API key saved to keys/invideo.key", "Ravi", "10 min", "OPEN"],
            ["T-110", "NotebookLM one-time browser login via 'notebooklm login'", "Ravi", "10 min", "OPEN"],
            ["T-111", "Install Python deps for all 5 harnesses (pip install -r each requirements.txt)", "Ravi", "10 min", "OPEN"],
            ["T-112", "Verify auth wiring via 'python3 -m sdlc.scripts.google.cli auth whoami'", "Ravi", "5 min", "OPEN"],
            ["T-113", "First-run OAuth flow for GBP (--purpose gbp) using Puneet's account", "Puneet", "10 min", "OPEN"],
            ["T-114", "First-run OAuth flow for GTM (--purpose gtm) using Puneet's account", "Puneet", "10 min", "OPEN"],
            ["T-115", "Smoke-test: pull-all for a sandbox client and confirm 4 snapshot directories appear", "Ravi", "10 min", "OPEN"],
          ],
          [700, 4900, 1100, 900, 1760],
          { statusIdx: 4, statusMap: { "OPEN": RED, "IN-PROGRESS": CORE_ORANGE, "DONE": GREEN, "BLOCKED": DARK_CHARCOAL } }
        ),

        h2("6.2 — Social platform credentials (Tier 1-3)"),
        body("Existing credential vault files: linkedin.md, meta-graph.md, threads.md, pinterest.md."),

        table(
          ["ID", "Task", "Owner", "Effort", "Status"],
          [
            ["T-201", "LinkedIn OAuth app (id, secret, refresh tokens) — confirm 60-day refresh auto-cycles", "Ravi", "30 min", "IN-PROGRESS"],
            ["T-202", "Meta long-lived user/page token (60-day, manual re-exchange) — set 50-day calendar reminder", "Ravi", "20 min", "IN-PROGRESS"],
            ["T-203", "Threads OAuth + th_refresh_token — confirm graph.threads.net (separate from Meta)", "Ravi", "20 min", "IN-PROGRESS"],
            ["T-204", "Pinterest OAuth + refresh token — record board IDs per client (currently hardcoded)", "Ravi", "30 min", "OPEN"],
          ],
          [700, 5400, 1100, 900, 1260],
          { statusIdx: 4, statusMap: { "OPEN": RED, "IN-PROGRESS": CORE_ORANGE, "DONE": GREEN, "BLOCKED": DARK_CHARCOAL } }
        ),

        h2("6.3 — Social platform credentials (Tier 4 — schemas in social/README.md, vault files pending)"),

        table(
          ["ID", "Task", "Owner", "Effort", "Status"],
          [
            ["T-301", "Create keys/x.md (OAuth 2.0 user-context, 2h access + 30d refresh)", "Ravi", "30 min", "OPEN"],
            ["T-302", "Create keys/youtube.md (Google OAuth Desktop client, refresh-token based)", "Ravi", "20 min", "OPEN"],
            ["T-303", "Create keys/tiktok.md (TikTok OAuth, 24h access + 365d refresh; SELF_ONLY until app review)", "Ravi", "45 min", "BLOCKED"],
            ["T-304", "Create keys/bluesky.md (handle + app password; AT-Proto rich-text facets)", "Ravi", "15 min", "OPEN"],
            ["T-305", "Playwright storage state for Medium (no public write API since 2023)", "Ravi", "30 min", "OPEN"],
            ["T-306", "Playwright storage state for Quora (no API at all)", "Ravi", "30 min", "OPEN"],
          ],
          [700, 5400, 1100, 900, 1260],
          { statusIdx: 4, statusMap: { "OPEN": RED, "IN-PROGRESS": CORE_ORANGE, "DONE": GREEN, "BLOCKED": DARK_CHARCOAL } }
        ),

        h2("6.4 — Per-client setup (multiply by number of clients)"),

        table(
          ["ID", "Task", "Owner", "Effort/client", "Status"],
          [
            ["T-401", "_Agreements/services.json populated for every active client from signed SOW", "Puneet", "15 min", "IN-PROGRESS"],
            ["T-402", "GBP Manager invite sent → accepted → IDs recorded", "Puneet", "10 min + wait", "OPEN"],
            ["T-403", "GA4 service account viewer grant sent → confirmed → Property ID captured", "Puneet", "5 min + wait", "OPEN"],
            ["T-404", "GSC service account user grant sent → confirmed → site URLs captured", "Puneet", "5 min + wait", "OPEN"],
            ["T-405", "GTM user invite sent → accepted → IDs recorded", "Puneet", "5 min + wait", "OPEN"],
            ["T-406", "sdlc/scripts/google/clients/<CODE>.json populated with real IDs", "Saroj/Vaishali", "3 min", "OPEN"],
            ["T-407", "First weekly pull verified, baseline.md documented", "Saroj/Vaishali", "20 min", "OPEN"],
            ["T-408", "Vault client page created at knowledge/clients/client-<code>.md", "Puneet", "10 min", "OPEN"],
            ["T-409", "Per-client semrush_domains[] added to profile JSON for non-default markets", "Saroj/Vaishali", "5 min", "OPEN"],
          ],
          [700, 4900, 1100, 1300, 1360],
          { statusIdx: 4, statusMap: { "OPEN": RED, "IN-PROGRESS": CORE_ORANGE, "DONE": GREEN, "BLOCKED": DARK_CHARCOAL } }
        ),

        h2("6.5 — Scheduled tasks + monitoring"),

        table(
          ["ID", "Task", "Owner", "Effort", "Status"],
          [
            ["T-501", "Register Windows Scheduled Task 'SEO-SDLC Marketing Weekly Pull' (Sundays 5am PT)", "Ravi", "10 min", "OPEN"],
            ["T-502", "Register daily social-analytics scheduled task (4am PT) via sdlc/_agency_assets/scripts/social/daily_pull.py", "Ravi", "10 min", "OPEN"],
            ["T-503", "Verify scheduled-task logs land at sdlc/scripts/schedule/logs/", "Ravi", "5 min", "OPEN"],
            ["T-504", "Hook task-failure email alerts to support@technijian.com (post-task PowerShell + M365 Graph)", "Ravi", "30 min", "OPEN"],
            ["T-505", "Daily-pulse sanity script: cross-platform anomaly digest emailed by 9am", "Ravi", "2 hours", "OPEN"],
          ],
          [700, 5500, 1100, 800, 1260],
          { statusIdx: 4, statusMap: { "OPEN": RED, "IN-PROGRESS": CORE_ORANGE, "DONE": GREEN, "BLOCKED": DARK_CHARCOAL } }
        ),

        h2("6.6 — Build remaining capabilities (deferred or partially built)"),

        table(
          ["ID", "Task", "Owner", "Effort", "Status"],
          [
            ["T-601", "social-engagement-monitor skill — polls golden_hour_watch.json every 5 min, DMs on-call", "Ravi", "1 day", "OPEN"],
            ["T-602", "social-content-calendar agent — generates Mon-Sat publishing calendar from strategy doc", "Ravi", "1 day", "OPEN"],
            ["T-603", "LinkedIn video upload helper via Assets API (currently manual asset_url)", "Ravi", "4 hours", "OPEN"],
            ["T-604", "Pinterest board ID auto-mapping (currently hardcoded per client)", "Ravi", "2 hours", "OPEN"],
            ["T-605", "Analytics pull coverage for Tier-4 platforms (extended but partial)", "Ravi", "1 day", "IN-PROGRESS"],
            ["T-606", "GSC disavow upload via multipart v3 endpoint (not yet wired)", "Ravi", "4 hours", "OPEN"],
            ["T-607", "Semrush toxic-link drift baseline state file (parallels GTM drift pattern)", "Ravi", "2 hours", "OPEN"],
            ["T-608", "cp-scripts _CLIENTS_ROOT path mismatch fix (clients/ vs sdlc/clients/)", "Ravi", "1 hour", "OPEN"],
          ],
          [700, 5500, 1100, 800, 1260],
          { statusIdx: 4, statusMap: { "OPEN": RED, "IN-PROGRESS": CORE_ORANGE, "DONE": GREEN, "BLOCKED": DARK_CHARCOAL } }
        ),

        h2("6.7 — Documentation & training"),

        table(
          ["ID", "Task", "Owner", "Effort", "Status"],
          [
            ["T-701", "Convert this guide to a published artifact (PDF + web micro-site)", "Marketing", "1 day", "OPEN"],
            ["T-702", "Cheat sheet (1-page laminate) for each team member (Part A of this guide)", "Puneet", "30 min", "OPEN"],
            ["T-703", "Live walkthrough: run end-to-end weekly cycle with Saroj/Vaishali/Mohit observing", "Ravi + Puneet", "2 hours", "OPEN"],
            ["T-704", "Update Obsidian vault knowledge/clients/ pages for every onboarded client", "Puneet", "10 min/client", "IN-PROGRESS"],
            ["T-705", "Record Loom for each event-driven workflow (content-launch, tracking-fix, negative-seo-defense)", "Mohit", "3 hours", "OPEN"],
          ],
          [700, 5500, 1100, 800, 1260],
          { statusIdx: 4, statusMap: { "OPEN": RED, "IN-PROGRESS": CORE_ORANGE, "DONE": GREEN, "BLOCKED": DARK_CHARCOAL } }
        ),

        h2("6.8 — Definition of Done"),

        calloutBox(
          "The platform is FULLY OPERATIONAL when:",
          [
            "1. All T-1xx tasks complete (credentials + cloud project).",
            "2. At least one client has finished all T-4xx tasks and produced a green pull-all.",
            "3. T-501 + T-502 scheduled tasks are running with healthy logs for 7 consecutive days.",
            "4. Marketing Director brief has been generated end-to-end for that client without manual fix-up.",
            "5. Status-review PPTX deck has shipped to the client successfully via /send-email.",
            "6. Vault and conversation logs are populated so the next operator can resume cold.",
          ],
          GREEN
        ),

        pageBreak(),

        // ─────────────────────────────────────────────────────────────────
        // APPENDIX A — CLI CHEAT SHEET
        // ─────────────────────────────────────────────────────────────────
        partHeader("A", "CLI Cheat Sheet"),
        ...space(1),

        h2("Google Marketing Platform"),
        codeBlock([
          "$env:PYTHONIOENCODING = \"utf-8\"",
          "",
          "# Auth",
          "python3 -m sdlc.scripts.google.cli auth login --purpose gbp",
          "python3 -m sdlc.scripts.google.cli auth login --purpose gtm",
          "python3 -m sdlc.scripts.google.cli auth whoami",
          "",
          "# Business Profile",
          "python3 -m sdlc.scripts.google.cli gbp list-accounts",
          "python3 -m sdlc.scripts.google.cli gbp list-locations --account accounts/<id>",
          "python3 -m sdlc.scripts.google.cli gbp pull --client TECH --account accounts/<id> --location <id> --days 30",
          "python3 -m sdlc.scripts.google.cli gbp reviews --account accounts/<id> --location <id>",
          "python3 -m sdlc.scripts.google.cli gbp reply --account accounts/<id> --location <id> --review <id> --comment \"…\"",
          "python3 -m sdlc.scripts.google.cli gbp post --account accounts/<id> --location <id> --summary \"…\" --cta-url \"…\" --cta-type LEARN_MORE",
          "",
          "# Analytics 4",
          "python3 -m sdlc.scripts.google.cli ga4 pull --client TECH --property <id> --days 7",
          "python3 -m sdlc.scripts.google.cli ga4 pull --client TECH --property <id> --report unassigned_audit --days 14",
          "",
          "# Search Console",
          "python3 -m sdlc.scripts.google.cli gsc list-sites",
          "python3 -m sdlc.scripts.google.cli gsc pull --client TECH --site sc-domain:technijian.com --days 28",
          "python3 -m sdlc.scripts.google.cli gsc inspect --site sc-domain:technijian.com --url https://technijian.com/…",
          "python3 -m sdlc.scripts.google.cli gsc sitemaps --site sc-domain:technijian.com",
          "",
          "# Tag Manager",
          "python3 -m sdlc.scripts.google.cli gtm list-accounts",
          "python3 -m sdlc.scripts.google.cli gtm list-containers --account <id>",
          "python3 -m sdlc.scripts.google.cli gtm audit --client TECH --account <id> --container <id>",
          "",
          "# Composite",
          "python3 -m sdlc.scripts.google.cli pull-all --client TECH --days 7",
        ]),

        h2("Adjacent harnesses"),
        codeBlock([
          "# Semrush",
          "python3 -m sdlc.scripts.semrush.cli pull --client TECH --domain technijian.com",
          "python3 -m sdlc.scripts.semrush.cli pull --client TECH --domain technijian.com --toxic-scan",
          "python3 -m sdlc.scripts.semrush.cli competitors --domain technijian.com",
          "",
          "# HeyGen",
          "python3 -m sdlc.scripts.heygen.cli avatar-groups",
          "python3 -m sdlc.scripts.heygen.cli render --client TECH --avatar <id> --title \"…\" --script-file …",
          "",
          "# InVideo",
          "python3 -m sdlc.scripts.invideo.cli render --client TECH --title \"…\" --platform youtube_shorts --prompt \"…\"",
          "",
          "# NotebookLM",
          "python3 -m sdlc.scripts.notebooklm.cli create --client TECH --name \"SOC2 research\" --url … --url …",
          "python3 -m sdlc.scripts.notebooklm.cli ask --client TECH --notebook \"SOC2 research\" --question \"…\"",
          "python3 -m sdlc.scripts.notebooklm.cli audio --client TECH --notebook \"SOC2 research\"",
        ]),

        h2("Slash commands"),
        codeBlock([
          "/google-pull-all TECH 7              # Google × 4 only",
          "/google-weekly-brief TECH            # SEO Strategist over Google × 4",
          "/marketing-weekly-brief TECH         # Marketing Director — full stack",
          "/cross-platform-publisher video.mp4 \"…\" --link https://technijian.com/blog/x",
          "/social-analytics-pull               # daily snapshot",
          "/status-review TECH                  # PPTX deck",
          "/weekly-review-batch --commit        # batch decks + create tickets",
        ]),

        pageBreak(),

        // ─────────────────────────────────────────────────────────────────
        // APPENDIX B — GLOSSARY (condensed)
        // ─────────────────────────────────────────────────────────────────
        partHeader("B", "Glossary"),
        ...space(1),

        table(
          ["Term", "Meaning"],
          [
            ["GBP", "Google Business Profile — formerly Google My Business"],
            ["GA4", "Google Analytics 4 — replaced Universal Analytics 2023"],
            ["GSC", "Google Search Console — organic search performance"],
            ["GTM", "Google Tag Manager"],
            ["Session", "Group of user interactions within a 30-min window"],
            ["Engaged session", ">10s OR >1 page view OR conversion"],
            ["Key event", "What GA4 calls a conversion (a tracked outcome)"],
            ["Unassigned", "Channel group GA4 couldn't categorize — tracking gap signal"],
            ["Property ID", "GA4 numeric ID (distinct from the G-prefixed measurement ID)"],
            ["Position", "Average rank in SERP (1.0 = top of page 1)"],
            ["CTR", "Click-through rate, 0.0-1.0"],
            ["Domain property", "GSC property type covering all subdomains/protocols (preferred)"],
            ["Action ratio", "GBP: (calls + website + directions) / impressions, target 3-6%"],
            ["NAP", "Name / Address / Phone — must be consistent across the web"],
            ["Container", "GTM: one per site, holds tags + triggers + variables"],
            ["Fingerprint", "16-char hash of GTM names — used for drift detection"],
            ["Drift", "Change in GTM fingerprint between snapshots"],
            ["OAuth 2.0", "User-consent flow; browser-based"],
            ["Service account", "Non-human identity with an email; for unattended auth"],
            ["Position cliff", "Query at position 8-15 — close to page 1, worth pushing"],
            ["CTR leak", "Page ranking but not earning clicks — title/meta rewrite candidate"],
            ["Tier 1/2/3/4", "Social-platform priority bucketing in Technijian strategy"],
            ["Golden Hour", "First 60 min after LinkedIn/YouTube publish — critical for reach"],
            ["UTM", "Urchin Tracking Module — link parameters for source attribution"],
          ],
          [2400, 6960]
        ),

        pageBreak(),

        // ─────────────────────────────────────────────────────────────────
        // APPENDIX C — SOURCE DOCUMENTS
        // ─────────────────────────────────────────────────────────────────
        partHeader("C", "Source Documents"),
        ...space(1),

        body("This guide is consolidated from the spec pack at c:\\vscode\\seo-sdlc\\docs\\google-marketing-platform\\. Open the source for full detail."),

        table(
          ["Part of this guide", "Source file"],
          [
            ["Executive Summary", "README.md, 01-platform-overview.md"],
            ["Part 1 — System Overview", "01-platform-overview.md, 02-architecture.md, 14-adjacent-systems.md"],
            ["Part 2 — The Platforms", "02-architecture.md, 14-adjacent-systems.md"],
            ["Part 3 — Setup Procedures", "03-platform-setup/00..08-*.md"],
            ["Part 4 — Operating Cadence", "08-workflows/daily-pulse.md, weekly-status-review.md, monthly-review.md, content-launch.md, tracking-fix.md, review-management.md, negative-seo-defense.md"],
            ["Part 5 — Strategic Playbooks", "09-playbooks/organic-seo.md, local-seo.md, conversion-tracking.md, reputation-management.md"],
            ["Part 6 — Tasks to Operational", "(this report — gap analysis based on full repo survey)"],
            ["Appendix A — CLI Cheat Sheet", "04-cli-reference.md, 13-guide-outline.md"],
            ["Appendix B — Glossary", "12-glossary.md"],
            ["Vault knowledge layer", "C:\\Users\\rjain\\OneDrive…\\obsidian\\seo-sdlc\\knowledge\\"],
            ["Tech-branding skills", "C:\\vscode\\tech-branding\\tech-branding\\skills\\"],
          ],
          [3500, 5860]
        ),

        h2("How to rebuild this report"),
        codeBlock([
          "# From c:\\vscode\\tech-branding\\tech-branding",
          "node scripts/build-seo-developer-guide.js",
          "",
          "# Output:",
          "# c:\\vscode\\seo-sdlc\\docs\\google-marketing-platform\\_docx\\",
          "#   SEO-Developer-Guide-Technijian-Marketing-Automation.docx",
        ]),

        ...space(2),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: CORE_ORANGE, space: 6 } },
          indent: { left: 3000, right: 3000 },
          children: [],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "Technology as a Solution", font: "Open Sans", size: 22, color: CORE_BLUE, italics: true })],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "End of Guide  ·  Version " + versionStr + "  ·  " + dateStr, font: "Open Sans", size: 16, color: BRAND_GREY })],
        }),
      ],
    },
  ],
});

// ─────────────────────────────────────────────────────────────────────────────
// Save
// ─────────────────────────────────────────────────────────────────────────────
const outDir = "C:/vscode/seo-sdlc/docs/google-marketing-platform/_docx";
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outPath = path.join(outDir, "SEO-Developer-Guide-Technijian-Marketing-Automation.docx");

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outPath, buf);
  const kb = Math.round(buf.length / 1024);
  console.log(`Generated: ${outPath} (${kb} KB)`);
});
