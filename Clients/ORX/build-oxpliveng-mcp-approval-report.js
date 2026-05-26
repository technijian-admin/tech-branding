// OrthoKinetix (powered by OrthoXpress) — OXPLiveNG MCP Server: Solution Overview & Approval
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// SCOPE: OXPLiveNG database ONLY (the .NET Claims Dashboard platform, repo orx-web-claims).
//   This is DISTINCT from the "OXP Live" / OrthoXpressDB (legacy ColdFusion) effort, which is
//   a SEPARATE session/repo (orx-web-oxplive). Do not merge the two. Distinct filenames are
//   intentional to avoid clobbering that parallel session.
// Facts verified live against the OXPLiveNG production database on 2026-05-22 (sqlcmd).
// Pattern adapted from Clients/ORX/build-orx-report.js.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType,
  TableOfContents, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak
} = require('docx');

// ---------- Brand constants ----------
const tokens = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'
));
const strip = (h) => (h || '').replace('#', '');
const CORE_BLUE     = strip(tokens.color.primary.blue.$value);
const CORE_ORANGE   = strip(tokens.color.primary.orange.$value);
const TEAL          = strip(tokens.color.secondary.teal.$value);
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);
const BRAND_GREY    = strip(tokens.color.secondary.grey.$value);
const OFF_WHITE     = strip(tokens.color.neutral.off_white.$value);
const WHITE         = 'FFFFFF';
const LIGHT_GREY    = strip(tokens.color.neutral.light_grey.$value);
const CRITICAL      = strip(tokens.color.status.critical.$value);

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const TODAY = '2026-05-26';
const HEADER_TITLE = 'OXPLiveNG MCP Server — Solution & Approval';

// ---------- Layout constants ----------
const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder  = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W   = 12240;
const MARGIN   = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2; // 9360

// ---------- Helpers ----------
function spacer(size = 200) {
  return new Paragraph({ spacing: { before: size, after: 0 }, children: [new TextRun('')] });
}
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false,
    align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before: spaceBefore, after: spaceAfter, line: 320 },
    children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })],
  });
}

// Each section starts on its own page (pageBreakBefore on the heading paragraph).
function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  const headingPara = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    keepNext: true,
    pageBreakBefore: true,
    spacing: { before: 0, after: 120, line: 240 },
    children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })],
  });
  const visualTable = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [120, CONTENT_W - 120],
    borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: 120, type: WidthType.DXA },
        shading: { fill: color, type: ShadingType.CLEAR },
        borders: noBorders,
        children: [new Paragraph({ children: [new TextRun('')] })],
      }),
      new TableCell({
        width: { size: CONTENT_W - 120, type: WidthType.DXA },
        borders: noBorders,
        margins: { top: 100, bottom: 100, left: 200, right: 0 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [new TextRun({ text: label, size: 34, bold: true, color, font: FONT_HEAD })] })],
      }),
    ]})],
  });
  return [headingPara, visualTable];
}

function subHeader(text, opts = {}) {
  const { color = CORE_BLUE, size = 26 } = opts;
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    keepNext: true, keepLines: true,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, size, bold: true, color, font: FONT_HEAD })],
  });
}

const NUM_BULLETS = 'bullets';
function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: NUM_BULLETS, level: 0 },
    spacing: { before: 40, after: 80, line: 300 },
    children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...opts })],
  });
}

function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({
    keepNext: true, keepLines: true,
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })],
  });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({
    keepNext: i < bodyArr.length - 1, keepLines: true,
    spacing: { before: 40, after: 60, line: 300 },
    children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })],
  }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({
        width: { size: 80, type: WidthType.DXA },
        shading: { fill: color, type: ShadingType.CLEAR },
        borders: noBorders,
        children: [new Paragraph({ children: [new TextRun('')] })],
      }),
      new TableCell({
        width: { size: CONTENT_W - 80, type: WidthType.DXA },
        shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
        borders: noBorders,
        margins: { top: 160, bottom: 160, left: 240, right: 200 },
        children: [titleP, ...bodyParas],
      }),
    ]})],
  });
}

function kpiCell(number, label, color = CORE_BLUE, w = 0) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
    borders: noBorders,
    margins: { top: 200, bottom: 200, left: 100, right: 100 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 48, bold: true, color, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: label, size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
    ],
  });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: items.map(() => w),
    borders: noBorders,
    rows: [new TableRow({ children: items.map(it => kpiCell(it.number, it.label, it.color || CORE_BLUE, w)) })],
  });
}

function buildTable(columns, rows, opts = {}) {
  const { headerColor = CORE_BLUE, zebra = true } = opts;
  const totalWeight = columns.reduce((s, c) => s + c.weight, 0);
  let colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalWeight)));
  const diff = CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  colWidths[colWidths.length - 1] += diff;

  const headerCells = columns.map((c, i) => new TableCell({
    width: { size: colWidths[i], type: WidthType.DXA },
    shading: { fill: headerColor, type: ShadingType.CLEAR },
    borders: cellBorders,
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })],
  }));

  const dataRows = rows.map((row, ri) => new TableRow({
    cantSplit: true,
    children: row.map((cell, i) => {
      const cellObj = typeof cell === 'string' ? { text: cell } : cell;
      const fill = zebra && ri % 2 === 1 ? OFF_WHITE : WHITE;
      return new TableCell({
        width: { size: colWidths[i], type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR },
        borders: cellBorders,
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: columns[i].align || AlignmentType.LEFT,
          children: [new TextRun({ text: cellObj.text || '', size: 20, color: cellObj.color || BRAND_GREY, bold: cellObj.bold || false, font: FONT_BODY })],
        })],
      });
    }),
  }));

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [new TableRow({ cantSplit: true, tableHeader: true, children: headerCells }), ...dataRows],
  });
}

function colorBanner(color, height = 200) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    borders: noBorders,
    rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: height, after: 0 }, children: [new TextRun('')] })] })] })],
  });
}

// ---------- Architecture layer card + connector ----------
function layerCard(tag, title, desc, color) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2200, CONTENT_W - 2200],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({
        width: { size: 2200, type: WidthType.DXA },
        shading: { fill: color, type: ShadingType.CLEAR },
        borders: noBorders,
        margins: { top: 140, bottom: 140, left: 160, right: 120 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: tag, size: 22, bold: true, color: WHITE, font: FONT_HEAD })] })],
      }),
      new TableCell({
        width: { size: CONTENT_W - 2200, type: WidthType.DXA },
        shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
        borders: noBorders,
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: title, size: 22, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
          new Paragraph({ children: [new TextRun({ text: desc, size: 19, color: BRAND_GREY, font: FONT_BODY })] }),
        ],
      }),
    ]})],
  });
}
function connector(label) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text: '▼  ' + label, size: 16, bold: true, color: BRAND_GREY, font: FONT_BODY })],
  });
}

// ---------- Sign-off block ----------
function signRow(roleLabel) {
  const cell = (children, w) => new TableCell({
    width: { size: w, type: WidthType.DXA }, borders: cellBorders,
    margins: { top: 220, bottom: 120, left: 140, right: 140 }, verticalAlign: VerticalAlign.BOTTOM, children,
  });
  const line = (lbl) => [
    new Paragraph({ spacing: { after: 0 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BRAND_GREY } }, children: [new TextRun({ text: ' ', size: 20 })] }),
    new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: lbl, size: 16, color: BRAND_GREY, font: FONT_BODY })] }),
  ];
  return new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 2600, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 160, bottom: 160, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: roleLabel, size: 20, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] })] }),
    cell(line('Name & Signature'), 4360),
    cell(line('Date'), CONTENT_W - 2600 - 4360),
  ]});
}

// ---------- Header / Footer ----------
function makeHeader() {
  return new Header({ children: [new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2400, CONTENT_W - 2400],
    borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 160, height: 34 } })] })] }),
      new TableCell({
        borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } },
        verticalAlign: VerticalAlign.BOTTOM,
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: HEADER_TITLE, size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
      }),
    ]})],
  })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80 },
    children: [
      new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8500  |  technijian.com  |  CONFIDENTIAL  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ text: ' of ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: BRAND_GREY, font: FONT_BODY }),
    ],
  })] });
}

// =====================================================================
// DOCUMENT BODY
// =====================================================================
const docChildren = [];

// ---------- COVER ----------
docChildren.push(
  colorBanner(CORE_BLUE),
  spacer(800),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 260, height: 54 } })] }),
  spacer(400),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2000, 5360, 2000],
    borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
      new TableCell({ borders: { bottom: { style: BorderStyle.SINGLE, size: 12, color: CORE_ORANGE } }, children: [new Paragraph('')] }),
      new TableCell({ borders: noBorders, children: [new Paragraph('')] }),
    ]})],
  }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'OXPLiveNG MCP SERVER', size: 56, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Solution Overview & Approval', size: 36, bold: false, color: CORE_BLUE, font: FONT_HEAD })] }),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared for OrthoKinetix', size: 26, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'powered by OrthoXpress', size: 22, color: BRAND_GREY, font: FONT_HEAD })] }),
  spacer(80),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Secure AI Access to the OXPLiveNG Claims Database', size: 24, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(60),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(600),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared exclusively for OrthoKinetix / OrthoXpress', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC (no trailing page break; first section's pageBreakBefore handles it) ----------
docChildren.push(
  new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }),
);

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '457', label: 'Tables in the OXPLiveNG database', color: CORE_BLUE },
    { number: '31', label: 'Business views to expose safely', color: TEAL },
    { number: '1', label: 'Governed path: SP to API to MCP', color: CORE_ORANGE },
    { number: 'HIPAA', label: 'PHI-safe & fully audited by design', color: DARK_CHARCOAL },
  ]),
  spacer(300),
  p('OrthoKinetix runs its claims, accounts-receivable, EDI and patient operations on the OXPLiveNG platform — a large, mature SQL Server database with hundreds of tables and dozens of reporting views, used by the OrthoXpress Claims Dashboard. Technijian proposes to make that data safely available to AI assistants (such as Claude) through a Model Context Protocol (MCP) server, so your team can ask plain-language questions — "show me open claims for this payer," "what is the AR balance for this patient" — and get governed, audited answers in seconds.'),
  p('The work is built on one firm rule that protects the platform: every request travels a single, governed path. AI assistants talk only to a documented API; the API talks to the database only through stored procedures; and a management portal lets your team control exactly what is exposed — with no developer and no code changes. Nothing is hardcoded; every setting lives in the database where it can be changed safely and tracked.'),
  p('This document explains what we found in OXPLiveNG, what we will build, how it stays HIPAA-safe, the delivery plan, and the approval we are requesting to begin. It is a business-level overview; the full engineering specification is available on request.'),
  spacer(100),
  calloutBox(
    'What We Are Asking You to Approve',
    [
      'Approval to build the OXPLiveNG MCP Server on the four-layer architecture described in Section 3 — delivered in phases, read-only first, with full create/update/delete added once the read layer is proven.',
      'A short discovery session to confirm which views, data, and operations matter most, and to retire one security gap we found (a database password currently stored in plain text in the application configuration).',
      'Agreement on the phase plan and timeline in Section 7 so Technijian can schedule the work.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 02 WHY NOW — CURRENT STATE ----------
docChildren.push(
  ...sectionHeader('Why Now — The Current-State Gap', TEAL, '02'),
  spacer(100),
  p('Technijian reviewed the OXPLiveNG database and the OrthoXpress Claims Dashboard application directly on May 22, 2026. The platform is solid and feature-rich, but the way the application reaches the data today is not ready for safe AI access. The findings below are the reason this project exists — and each one is addressed by the proposed design.'),
  spacer(140),
  buildTable(
    [
      { label: 'What We Found', weight: 3 },
      { label: 'Why It Matters', weight: 3.4 },
      { label: 'How the MCP Solution Fixes It', weight: 3.6 },
    ],
    [
      ['No stored-procedure layer exists. Of 6 stored procedures, all 6 are auto-generated SQL Server diagram helpers — zero business procedures.', 'Applications read tables and views directly, so there is no single, controllable gate for data access — and no safe surface to expose to AI.', 'We build a governed stored-procedure layer that becomes the only way in (Section 4).'],
      ['The Claims Dashboard reads data directly via its data layer (Entity Framework 6, database-first), not through procedures.', 'Logic and access rules are scattered across the app instead of centralized and auditable.', 'The API and AI both call procedures, centralizing rules, validation, and auditing.'],
      [{ text: 'A database password is hardcoded in plain text in the application configuration (web.config).', color: CRITICAL }, 'This is a security and compliance exposure for a system holding patient data (PHI).', 'Replaced with a least-privilege login whose secret is stored in a secure vault — never in code (Section 5).'],
      ['31 business views hold valuable, ready-to-use information (claims dashboard, transactions, AR balances, payer risk, payment-notification metrics).', 'This is exactly the data AI should surface — but only through a safe, read-controlled channel.', 'Each view is wrapped in a procedure, exposed as an API endpoint, and offered as an AI tool.'],
      ['The physical database is cluttered with backup and temporary tables (dated backups, Temp_ copies).', 'Direct access risks exposing the wrong or stale data to users and AI.', 'The API surface is a curated allow-list; clutter is excluded by design.'],
    ],
  ),
);

// ---------- 03 THE SOLUTION — ARCHITECTURE ----------
docChildren.push(
  ...sectionHeader('The Solution — A Four-Layer Governed Architecture', CORE_BLUE, '03'),
  spacer(100),
  p('Every AI request follows the same one-way path, top to bottom. Each layer has one job and can only talk to the next — so there is exactly one controllable, auditable route to your data. This is the same proven architecture Technijian already runs in production for other ORX systems.'),
  spacer(160),
  layerCard('AI ASSISTANT', 'Claude (or another MCP client)', 'Your team asks questions in plain language. The assistant never sees the database — only the approved tools.', DARK_CHARCOAL),
  connector('asks via Model Context Protocol'),
  layerCard('MCP SERVER', 'The governed AI gateway', 'Translates each question into an approved tool call. Holds no database connection. Tools are turned on or off from the portal.', TEAL),
  connector('calls the documented REST API (HTTPS)'),
  layerCard('SWAGGER API', 'The single documented gateway', 'A secured, versioned REST API. The only thing it is allowed to do against the database is run approved stored procedures.', CORE_ORANGE),
  connector('executes stored procedures only'),
  layerCard('STORED PROCEDURES', 'The only door into the data', 'Purpose-built procedures wrap each view, function, and table operation. No direct table or view access from outside is permitted.', CORE_BLUE),
  connector('reads / writes'),
  layerCard('OXPLiveNG', 'Your claims, AR, EDI & patient data', 'The existing .NET Claims Dashboard database — untouched. We add a new procedure layer on top; nothing existing is altered.', BRAND_GREY),
  spacer(200),
  calloutBox(
    'The Admin Portal — You Stay in Control',
    [
      'A separate management portal lets your team operate the MCP server with no developer: enable or disable tools, manage who can access what, review a full audit trail, schedule jobs, set data-retention rules, and test any tool safely.',
      'Because every setting lives in the database, changes are immediate, tracked, and reversible — there is no code to edit and no redeployment to wait for.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 04 WHAT GETS BUILT ----------
docChildren.push(
  ...sectionHeader('What Gets Built', TEAL, '04'),
  spacer(100),
  p('Four components make up the delivery. Each is a discrete, testable piece, and each maps directly to a layer in Section 3.'),
  spacer(140),
  subHeader('1 — The Stored-Procedure Layer (in OXPLiveNG)'),
  bullet('Read procedures that wrap all 31 business views and the key reporting functions (e.g., the claims-dashboard filter and the patient-balance lookup).'),
  bullet('Full create / read / update / delete procedures for the core entities — claims, claim services, patients, insurance, jobs/orders and claim status notes — generated from the database so the set grows by configuration, not custom code.'),
  bullet('A self-describing catalog: small tables that list every exposed procedure, its inputs, and its outputs — so the API and AI tools are generated from the database, never hand-maintained.'),
  spacer(140),
  subHeader('2 — The Swagger / OpenAPI REST API'),
  bullet('A secured .NET 8 API that exposes one endpoint per approved procedure, fully documented in Swagger.'),
  bullet('Sign-in with Microsoft Entra ID (Azure AD), role-based permissions, input validation, paging, and standardized error messages.'),
  bullet('Patient-data fields are flagged and hidden from anyone without explicit clearance.'),
  spacer(140),
  subHeader('3 — The MCP Server'),
  bullet('Connects to AI assistants two ways: directly in Claude Desktop/Code, and over the web for remote use.'),
  bullet('Exposes each approved API endpoint as an AI tool, plus ready-made prompts for common questions (find claims by patient, AR summary by payer, add a claim status note).'),
  bullet('Talks only to the API — it has no path to the database — and every tool call is logged.'),
  spacer(140),
  subHeader('4 — The MCP Admin Portal'),
  bullet('A web dashboard for your team to manage tools, connections, users and roles, the audit log, schedules, notifications, data retention, and a built-in test runner.'),
  bullet('All controlled through the database, so the people who run the platform do not need a developer to make changes.'),
);

// ---------- 05 SECURITY, HIPAA & GOVERNANCE ----------
docChildren.push(
  ...sectionHeader('Security, HIPAA & Governance', CORE_ORANGE, '05'),
  spacer(100),
  p('OXPLiveNG contains protected health information — patients, insurance, and EDI 835/837 claims data. Security is therefore designed into every layer, not added afterward. The controls below are standard in this architecture.'),
  spacer(140),
  buildTable(
    [
      { label: 'Control', weight: 2.6 },
      { label: 'What It Means for OrthoKinetix', weight: 6.4 },
    ],
    [
      [{ text: 'One governed path', bold: true }, 'AI and applications can reach data only through approved stored procedures behind the API — there is exactly one route to audit and control.'],
      [{ text: 'Least privilege', bold: true }, 'The API signs in with an account that can only run approved procedures — it cannot read or change tables directly.'],
      [{ text: 'No hardcoded secrets', bold: true }, 'Passwords and keys live in a secure vault and are referenced, never stored in code or config. The current plain-text password is retired.'],
      [{ text: 'Minimum necessary (PHI)', bold: true }, 'Patient-data fields are tagged; users and AI tools without clearance never receive them.'],
      [{ text: 'Full audit trail', bold: true }, 'Every tool call, API call, and procedure run is logged with who, what, when, and a correlation id — with patient data redacted in the logs.'],
      [{ text: 'Deny by default', bold: true }, 'Nothing is exposed unless explicitly enabled and permitted for that role. Write operations are off until you turn them on.'],
      [{ text: 'Encrypted everywhere', bold: true }, 'All connections use TLS; database connections are encrypted.'],
    ],
  ),
  spacer(120),
  p('This design supports your HIPAA compliance posture; it does not replace your organization’s policies, business-associate agreements, or staff training, which remain in place.', { italics: true, size: 20 }),
);

// ---------- 06 CONFIG-DRIVEN ----------
docChildren.push(
  ...sectionHeader('Configuration-Driven by Design — Nothing Hardcoded', CORE_BLUE, '06'),
  spacer(100),
  p('A specific requirement of this project is that the system is driven entirely from the database — not from code or configuration files. This is what keeps OrthoKinetix in control and the system easy to operate over time.'),
  spacer(120),
  buildTable(
    [
      { label: 'Stored in the database (changeable any time)', weight: 5 },
      { label: 'The benefit', weight: 5 },
    ],
    [
      ['Which procedures, endpoints, and AI tools exist and are enabled', 'Add or retire a capability by changing data — no code release.'],
      ['API addresses, connection settings, and timeouts', 'Re-point or tune the system without touching code.'],
      ['Users, roles, and permissions', 'Manage access centrally with a full change history.'],
      ['Schedules, notification rules, and data-retention policy', 'Operations teams adjust behavior themselves.'],
      ['Secret references (not the secrets themselves)', 'Sensitive values stay in a vault; the database only points to them.'],
    ],
  ),
  spacer(120),
  calloutBox(
    'Why This Matters',
    'When everything that changes lives in data, your team can adapt the system safely and instantly — and every change is tracked. There are no hidden settings buried in code, and no waiting on a developer to flip a switch.',
    CORE_ORANGE
  ),
);

// ---------- 07 DELIVERY PLAN ----------
docChildren.push(
  ...sectionHeader('Delivery Plan & Phases', TEAL, '07'),
  spacer(100),
  p('The work is delivered in six phases. Read-only access is proven first, which lets your team see value early and with the lowest possible risk; full create/update/delete is added only once the read layer is solid. Each phase ends with a clear, demonstrable result.'),
  spacer(140),
  buildTable(
    [
      { label: 'Phase', weight: 0.9, align: AlignmentType.CENTER },
      { label: 'Deliverable', weight: 4.4 },
      { label: 'You Will See', weight: 3.7 },
    ],
    [
      [{ text: '0', bold: true }, 'Foundations — project setup, secure login, configuration tables, retire the hardcoded password', 'A clean, secure footing; the plain-text password gone'],
      [{ text: '1', bold: true }, 'Read procedure layer over all 31 views and key functions', 'Every report view reachable through the governed layer'],
      [{ text: '2', bold: true }, 'Swagger API for all read operations', 'A live, documented API your team can explore'],
      [{ text: '3', bold: true }, 'MCP server (read) + Admin Portal first release', 'Claude answering real questions; the portal toggling tools'],
      [{ text: '4', bold: true }, 'Full create / update / delete for core entities', 'AI and apps can safely update data through procedures'],
      [{ text: '5', bold: true }, 'Hardening — retention, alerts, testing, HIPAA review', 'Production-ready, reviewed, and signed off'],
    ],
  ),
  spacer(120),
  p('Detailed timeline and effort estimates are confirmed during discovery (Section 8) and provided in a companion Statement of Work upon approval.', { italics: true, size: 20 }),
);

// ---------- 08 WHAT WE NEED FROM YOU ----------
docChildren.push(
  ...sectionHeader('What We Need From You', CORE_ORANGE, '08'),
  spacer(100),
  p('To begin, Technijian needs a short discovery session and a few decisions. None of these block approval — they shape the detailed plan.'),
  spacer(120),
  bullet('Priority data: which views, reports, and operations matter most to surface first.'),
  bullet('Write scope: confirm the core entities that should support create/update/delete in Phase 4.'),
  bullet('Access & roles: who should use the AI tools, and at what permission level (including who may see patient data).'),
  bullet('Environment: confirmation to use the existing test database (OXPTestDB / UAT) for build-and-test before production.'),
  bullet('Security: approval to retire the hardcoded credential and move secrets into a vault.'),
  bullet('Hosting & SSO: confirm Microsoft Entra ID (Azure AD) for sign-in and the preferred hosting (on-premises IIS or container).'),
);

// ---------- 09 APPROVAL & SIGN-OFF ----------
docChildren.push(
  ...sectionHeader('Approval & Sign-Off', CORE_BLUE, '09'),
  spacer(100),
  p('By signing below, OrthoKinetix authorizes Technijian to proceed with the OXPLiveNG MCP Server as described in this document, beginning with Phase 0 and the discovery session. This approval covers the approach and phase plan; specific scope, timeline, and fees are confirmed in a companion Statement of Work.'),
  spacer(200),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [2600, 4360, CONTENT_W - 2600 - 4360],
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: [
        new TableCell({ shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: 'Role', size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })] }),
        new TableCell({ shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: 'Name & Signature', size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })] }),
        new TableCell({ shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: 'Date', size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })] }),
      ]}),
      signRow('OrthoKinetix — Authorized Approver'),
      signRow('OrthoKinetix — Technical / Security'),
      signRow('Technijian — Engagement Lead'),
    ],
  }),
  spacer(240),
  calloutBox(
    'Next Step',
    'On approval, Technijian schedules the discovery session, issues the Statement of Work with timeline and fees, and begins Phase 0. Questions in the meantime: your Technijian engagement lead, or 949.379.8500.',
    CORE_ORANGE
  ),
);

// ---------- APPENDIX A — SCOPE SNAPSHOT ----------
docChildren.push(
  ...sectionHeader('Appendix A — OXPLiveNG Scope Snapshot', BRAND_GREY, 'A'),
  spacer(100),
  p('Captured live from the OXPLiveNG database on May 22, 2026. Provided for transparency; final scope is confirmed during discovery.', { italics: true }),
  spacer(120),
  buildTable(
    [
      { label: 'Object Type', weight: 3 },
      { label: 'Count', weight: 1.4, align: AlignmentType.CENTER },
      { label: 'Role in This Project', weight: 5.6 },
    ],
    [
      ['Business views', '31', 'Primary read targets — wrapped in procedures and exposed as AI tools'],
      ['Functions', '12', 'Key reporting logic (claims-dashboard filter, patient balance) used inside procedures'],
      ['Tables', '~457', 'The data estate; core entities receive full CRUD, clutter is excluded'],
      [{ text: 'Business stored procedures', bold: true }, { text: '0', bold: true, color: CRITICAL }, 'None exist today — the governed layer is built new (the heart of this project)'],
    ],
  ),
  spacer(160),
  subHeader('Representative Views to Be Exposed'),
  p('vw_ClaimDashboard, vw_ClaimTransaction, vw_ClaimService / vw_ClaimServiceBalance / vw_ClaimServiceAggregated, vw_ARSummaryPRBalance, vw_ClaimHistory, vw_GetClaims, vw_RiskPayerGroup, vw_DuplicateClaimsView, and the vw_Notification* payment-metric set — among the full set of 31 views in OXPLiveNG.', { size: 20 }),
  spacer(160),
  calloutBox(
    'About Technijian',
    'Technijian is an Irvine, California IT and AI services firm delivering managed IT, cybersecurity, custom application development, and AI/agent integration. This MCP architecture is already in production for other ORX systems — OrthoKinetix benefits from a proven pattern, not an experiment.',
    CORE_BLUE
  ),
);

// =====================================================================
// DOCUMENT ASSEMBLY
// =====================================================================
const doc = new Document({
  numbering: { config: [{
    reference: NUM_BULLETS,
    levels: [{
      level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 360, hanging: 360 } }, run: { font: 'Symbol', size: 22, color: CORE_BLUE } },
    }],
  }]},
  styles: {
    default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
        run: { size: 2, bold: true, color: 'FFFFFF', font: FONT_HEAD },
        paragraph: { spacing: { before: 0, after: 120 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal',
        run: { size: 26, bold: true, color: CORE_BLUE, font: FONT_HEAD },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal',
        run: { size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD },
        paragraph: { spacing: { before: 220, after: 80 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } },
    headers: { default: makeHeader() },
    footers: { default: makeFooter() },
    children: docChildren,
  }],
});

const OUT_PATH = path.join(__dirname, 'OXPLiveNG-MCP-Server-Approval-Report.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
