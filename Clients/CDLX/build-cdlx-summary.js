// CardLogix (CDLX) — AI Growth Blueprint EXECUTIVE SUMMARY (hook artifact, Phase 10)
// Short 4–6pp distilled PDF for the first-touch email. Entry pricing ONLY (no expansion table).
// Reuses the same brand recipe + architecture.png + timeline.png from the full report.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType,
  BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak
} = require('docx');

const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'));
const strip = (h) => (h || '').replace('#', '');
const CORE_BLUE = strip(tokens.color.primary.blue.$value);
const CORE_ORANGE = strip(tokens.color.primary.orange.$value);
const TEAL = strip(tokens.color.secondary.teal.$value);
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);
const BRAND_GREY = strip(tokens.color.secondary.grey.$value);
const OFF_WHITE = strip(tokens.color.neutral.off_white.$value);
const WHITE = 'FFFFFF';
const LIGHT_GREY = strip(tokens.color.neutral.light_grey.$value);
const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_BUF = fs.readFileSync(path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value));
const dbuf = (n) => fs.existsSync(path.join(__dirname, 'diagrams', n)) ? fs.readFileSync(path.join(__dirname, 'diagrams', n)) : null;
const DIAGRAM_ARCH_BUF = dbuf('architecture.png');
const DIAGRAM_TIMELINE_BUF = dbuf('timeline.png');

const TODAY = '2026-05-30';
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;

function spacer(s = 200) { return new Paragraph({ spacing: { before: s, after: 0 }, children: [new TextRun('')] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = opts;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}
function sectionHeader(text, color = CORE_BLUE) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders,
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text, size: 32, bold: true, color, font: FONT_HEAD })] })] }),
    ]})],
  });
}
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const arr = Array.isArray(body) ? body : [body];
  const bodyParas = arr.map((b, i) => new Paragraph({ keepNext: i < arr.length - 1, keepLines: true, spacing: { before: 40, after: 60, line: 300 }, children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80], rows: [new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
    new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
  ]})] });
}
function kpiCell(number, label, color, w) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 38, bold: true, color, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, size: 16, color: BRAND_GREY, font: FONT_BODY })] }),
  ]});
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: items.map(it => kpiCell(it.number, it.label, it.color || CORE_BLUE, w)) })] });
}
function buildTable(columns, rows) {
  const totalWeight = columns.reduce((s, c) => s + c.weight, 0);
  let colWidths = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalWeight)));
  colWidths[colWidths.length - 1] += CONTENT_W - colWidths.reduce((s, w) => s + w, 0);
  const headerCells = columns.map((c, i) => new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 120, bottom: 120, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dataRows = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const o = typeof cell === 'string' ? { text: cell } : cell;
    const fill = o.fill || (ri % 2 === 1 ? OFF_WHITE : WHITE);
    return new TableCell({ width: { size: colWidths[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, children: [new TextRun({ text: o.text || '', size: 20, color: o.color || BRAND_GREY, bold: o.bold || false, font: FONT_BODY })] })] });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: colWidths, rows: [new TableRow({ cantSplit: true, tableHeader: true, children: headerCells }), ...dataRows] });
}
function diagramImage(buf, alt, widthPx = 600, ar = 1.42) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 80 }, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: Math.round(widthPx / ar) }, altText: { title: alt, description: alt, name: alt } })] });
}
function diagramCaption(t) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 220 }, children: [new TextRun({ text: t, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] }); }
function colorBanner(color, h = 200) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders, rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: h, after: 0 }, children: [new TextRun('')] })] })] })] });
}
function makeHeader() {
  return new Header({ children: [new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], borders: noBorders, rows: [new TableRow({ children: [
    new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 160, height: 34 } })] })] }),
    new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Executive Summary', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ]})] })] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 }, children: [
    new TextRun({ text: 'Technijian  |  Irvine, CA  |  949.379.8499  |  technijian.com  |  CONFIDENTIAL  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ text: ' of ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: BRAND_GREY, font: FONT_BODY }),
  ]})] });
}

const c = [];
// COVER (compact)
c.push(
  colorBanner(CORE_BLUE),
  spacer(500),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 240, height: 50 } })] }),
  spacer(300),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'CARDLOGIX', size: 52, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'AI-Driven Business Development Blueprint', size: 30, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Executive Summary', size: 26, bold: true, color: CORE_ORANGE, font: FONT_HEAD })] }),
  spacer(200),
  kpiRow([
    { number: '2', label: 'Tracks: your own IT + a channel partnership', color: CORE_BLUE },
    { number: '3 waves', label: 'MFA mandates: federal → state/local → private (insurance)', color: CORE_ORANGE },
    { number: '~$31K', label: 'Entry program, Year 1', color: TEAL },
    { number: '5 min', label: 'Apart in the Irvine Spectrum', color: DARK_CHARCOAL },
  ]),
  spacer(260),
  p('CardLogix makes the credentials that secure identity — PIV, FIDO2, FRAC, and BIOSID. This summary distils a two-track plan: a small co-managed IT engagement for CardLogix’s own team now, and a phishing-resistant-MFA channel partnership where Technijian wraps managed services — including the certificate authority — around CardLogix’s cards for the customers now required to adopt them. Grounded in our May 29 conversation; the full plan is ready on request.', { align: AlignmentType.CENTER }),
  spacer(200),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Prepared for CardLogix Corporation  |  Technijian  |  ' + TODAY, size: 20, color: BRAND_GREY, font: FONT_BODY })] }),
  pageBreak(),
);

// THE OPPORTUNITY
c.push(
  sectionHeader('The Opportunity', CORE_BLUE),
  spacer(160),
  p('Two distinct openings sit in front of CardLogix, and the plan treats them as parallel tracks — one fast and close to home, one strategic.'),
  spacer(60),
  buildTable(
    [{ label: '', weight: 1.4 }, { label: 'Track A — Your Own IT', weight: 3.4 }, { label: 'Track B — MFA / CA Partnership', weight: 3.4 }],
    [
      [{ text: 'What', bold: true }, 'Co-managed IT for a lean internal team', 'CardLogix supplies the credentials; Technijian wraps managed IT, SOC, compliance, and the certificate authority for end customers'],
      [{ text: 'Confidence', bold: true }, 'High — this is what co-managed IT is for', 'Validated on our May 29 call — Nick confirmed it as a joint, customer-facing service'],
      [{ text: 'Time', bold: true }, 'Weeks once scoped', 'A few quarters — needs one joint pilot'],
    ],
  ),
  spacer(160),
  calloutBox('Why Now — MFA Went From Recommended to Required, in Three Waves', [
    'Federal first (≈3 years ago), then state and local — including law enforcement under CJIS 5.9.5, mandatory as of October 1, 2024 — and now private companies, pushed by cyber-insurance renewals that require MFA to be in place.',
    'And the kind of MFA matters: phone-based codes (Cisco Duo, Okta) are being displaced because phones get compromised. CardLogix’s PIV and FIDO2 cards are the phishing-resistant answer — riding the badge people already carry.',
    'What customers still need is a partner to deploy and operate it — the managed-services + certificate-authority wrap CardLogix does not bring today.',
    'Honest note: Technijian runs eight compliance frameworks but not yet CJIS. We treat CJIS as a near-term build adjacent to our existing CMMC practice — triggered by exactly this partnership, never claimed as completed work.',
  ], CORE_ORANGE),
  pageBreak(),
);

// THE ENGINE
c.push(
  sectionHeader('How AI Powers Both Tracks', CORE_BLUE),
  spacer(140),
  p('This is account-based, not broad lead generation. AI sits underneath the relationship layer — it surfaces the right accounts, arms the conversation, and automates the compliance evidence. The human trust between CardLogix, Technijian, and a customer still closes the deal.'),
  diagramImage(DIAGRAM_ARCH_BUF, 'CardLogix AI Growth Engine', 600, 1.42),
  diagramCaption('Inbound authority · Outbound account intelligence · Internal evidence — feeding one joint pipeline'),
  spacer(120),
  calloutBox('Three Motions', [
    'Get cited: authority content answering the exact MFA, CJIS, and smart-card questions buyers ask.',
    'Reach the right accounts: AI account intelligence and trigger monitoring on named agencies, private targets, and the integrators that serve them.',
    'Remove the drag: AI-assisted compliance audit-evidence packs and card-lifecycle automation.',
  ], CORE_BLUE),
);

// THE PROGRAM (entry only)
c.push(
  sectionHeader('The Entry Program', CORE_BLUE),
  spacer(140),
  p('The plan is built land-and-expand: a small, easy-to-approve entry that solves Track A now, with the larger partnership engine built later, once the entry proves the working relationship. Only the entry is shown here; the full Service Investment Map is reserved for the discovery call. Every figure is estimated and confirmed at discovery.'),
  spacer(80),
  buildTable(
    [{ label: 'Service', weight: 3 }, { label: 'Scope', weight: 4.2 }, { label: 'Est. Y1', weight: 1.8, align: AlignmentType.RIGHT }],
    [
      ['My IT — Co-Managed', 'Coverage, monitoring, patching, senior support for a lean team (per the 2026 rate card)', { text: '~$14,400', align: AlignmentType.RIGHT }],
      ['My SEO — Tier 3', 'Authority content on the MFA, CJIS + smart-card questions buyers ask', { text: '$12,000', align: AlignmentType.RIGHT }],
      ['My AI — Readiness Workshop', 'One-time: map the joint go-to-market + CJIS build path', { text: '~$5,000', align: AlignmentType.RIGHT }],
      [{ text: 'ENTRY PROGRAM (Y1)', bold: true }, { text: 'The land — no large build', bold: true }, { text: '~$31,400', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }],
    ],
  ),
  spacer(120),
  p('We model the return as a range, not a single optimistic number. The Very Conservative floor assumes the partnership lands nothing in Year 1 (the entry pays back in recovered time and a stronger posture); the Likely case counts one joint managed-MFA/CA win, which Nick confirmed CardLogix wants to offer:'),
  spacer(60),
  buildTable(
    [{ label: 'Year-1 ROI vs. entry', weight: 3 }, { label: 'Very Conservative', weight: 2, align: AlignmentType.RIGHT }, { label: 'Likely', weight: 2, align: AlignmentType.RIGHT }, { label: 'Upside', weight: 2, align: AlignmentType.RIGHT }],
    [
      ['Estimated Y1 value', { text: '+$15,000', align: AlignmentType.RIGHT }, { text: '+$55,000', align: AlignmentType.RIGHT }, { text: '+$95,000', align: AlignmentType.RIGHT }],
      [{ text: 'Modeled ROI', bold: true }, { text: '~0.5×', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }, { text: '~1.8×', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }, { text: '~3.0×', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }],
    ],
  ),
  spacer(120),
  p('The entry is small on purpose. The real economics live in the expansion — the managed CA on cloud HSM, the CJIS practice, the account-intelligence engine — against a market widening from federal and law enforcement into private companies. The bigger build comes later, once the entry proves the lift.'),
  spacer(120),
  calloutBox('Start Free — Nexus Assess', [
    'Before any commitment, Technijian runs a free Nexus Assess security assessment: internal vulnerabilities (devices, Active Directory, patches, EOL systems), external exposure (perimeter scan + dark-web credential check), and a Microsoft 365 review (MFA coverage, risky sign-ins, admin roles, sharing).',
    'It returns a prioritized remediation roadmap and maps to CJIS, HIPAA, SOC 2, PCI, and NIST — so the free run doubles as a head start on the CJIS gap map. No contract, no spend.',
  ], TEAL),
  spacer(160),
  sectionHeader('The Roadmap', CORE_ORANGE),
  diagramImage(DIAGRAM_TIMELINE_BUF, 'Implementation Roadmap', 600, 1.74),
  diagramCaption('Foundation (0–90 days) → Joint Pilot (90–180) → Scale (180–365)'),
  spacer(120),
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], rows: [new TableRow({ children: [new TableCell({
    shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 280, bottom: 280, left: 400, right: 400 },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 90 }, children: [new TextRun({ text: 'Two tracks, one local partner — five minutes away in the Spectrum.', size: 24, bold: true, color: WHITE, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 70 }, children: [new TextRun({ text: 'Use the Book a Meeting button in my signature to set up a time to discuss this and all the AI strategies Technijian is putting into place for itself and its clients.', size: 20, color: WHITE, font: FONT_BODY })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8499', size: 20, color: WHITE, font: FONT_BODY })] }),
    ],
  })] })] }),
);

const doc = new Document({
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } } },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN } } }, headers: { default: makeHeader() }, footers: { default: makeFooter() }, children: c }],
});
const OUT = path.join(__dirname, 'CardLogix-AI-Growth-Summary.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(OUT, buf); console.log('SUMMARY DOCX', (buf.length / 1024).toFixed(1), 'KB'); }).catch(e => { console.error(e.message); process.exit(1); });
