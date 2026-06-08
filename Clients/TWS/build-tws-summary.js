// ThriveWell Schools (TWS) — AI Growth Blueprint — Executive Summary
// 5-page first-touch hook artifact for outreach email
// Run: node build-tws-summary.js

const fs   = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType,
  BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak
} = require('docx');

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
const LIGHT_GREY    = strip(tokens.color.neutral.light_grey.$value);
const WHITE         = 'FFFFFF';

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH    = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF     = fs.readFileSync(LOGO_PATH);
const LOGO_WH_PATH = path.join(__dirname, '..', '..', tokens.logo.reverse_white.$value);
const LOGO_WH_BUF  = fs.existsSync(LOGO_WH_PATH) ? fs.readFileSync(LOGO_WH_PATH) : LOGO_BUF;

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const dbuf = (n) => { const p2 = path.join(DIAGRAMS_DIR, n); return fs.existsSync(p2) ? fs.readFileSync(p2) : null; };
const ARCH_BUF     = dbuf('architecture.png');
const TIMELINE_BUF = dbuf('timeline.png');

function pngDimensions(buf) {
  if (!buf || buf.length < 24) return { w: 1200, h: 700 };
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

const TODAY = '2026-06-08';

const noBorder  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder  = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const PAGE_W    = 12240;
const MARGIN    = 1440;
const CONTENT_W = PAGE_W - MARGIN * 2;

function spacer(sz = 200) { return new Paragraph({ spacing: { before: sz, after: 0 }, children: [new TextRun('')] }); }
function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }
function p(text, opts = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceAfter = 140 } = opts;
  return new Paragraph({ alignment: align, spacing: { before: 0, after: spaceAfter, line: 320 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}
function colorBanner(color, height = 200) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders,
    rows: [new TableRow({ children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ spacing: { before: height, after: 0 }, children: [new TextRun('')] })] })] })] });
}
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const bodyArr = Array.isArray(body) ? body : [body];
  const bodyParas = bodyArr.map((b, i) => new Paragraph({ keepNext: i < bodyArr.length - 1, spacing: { before: 40, after: 60, line: 300 }, children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80],
    rows: [new TableRow({ cantSplit: true, children: [
      new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
    ]})],
  });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  const cells = items.map(it => new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 100, right: 100 }, verticalAlign: VerticalAlign.CENTER, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: it.number, size: 48, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: it.label, size: 17, color: BRAND_GREY, font: FONT_BODY })] }),
  ]}));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: cells })] });
}
function buildTable(columns, rows, opts = {}) {
  const { headerColor = CORE_BLUE, zebra = true } = opts;
  const total = columns.reduce((s, c) => s + c.weight, 0);
  let cw = columns.map(c => Math.floor(CONTENT_W * c.weight / total));
  cw[cw.length - 1] += CONTENT_W - cw.reduce((s, w) => s + w, 0);
  const hdr = columns.map((c, i) => new TableCell({ width: { size: cw[i], type: WidthType.DXA }, shading: { fill: headerColor, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 120, bottom: 120, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: c.label, size: 20, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dRows = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const co = typeof cell === 'string' ? { text: cell } : cell;
    const fill = zebra && ri % 2 === 1 ? OFF_WHITE : WHITE;
    return new TableCell({ width: { size: cw[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 100, bottom: 100, left: 140, right: 140 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: co.text || '', size: 20, color: co.color || BRAND_GREY, bold: co.bold || false, font: FONT_BODY })] })] });
  })}));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: cw, rows: [new TableRow({ cantSplit: true, tableHeader: true, children: hdr }), ...dRows] });
}
function diagramImage(buf, alt, widthPx = 540) {
  if (!buf) return new Paragraph({ children: [new TextRun('')] });
  const dims = pngDimensions(buf);
  const h = Math.round(widthPx * dims.h / dims.w);
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 80 }, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height: h }, altText: { title: alt, description: alt, name: alt } })] });
}
function diagramCaption(text) {
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 }, children: [new TextRun({ text, size: 18, italics: true, color: BRAND_GREY, font: FONT_BODY })] });
}
function sectionLabel(text, color = CORE_BLUE) {
  return new Paragraph({
    spacing: { before: 320, after: 100 },
    children: [new TextRun({ text: text.toUpperCase(), size: 20, bold: true, color, font: FONT_HEAD, allCaps: true })],
  });
}

function makeHeader() {
  return new Header({ children: [new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2400, CONTENT_W - 2400], borders: noBorders, rows: [new TableRow({ children: [
    new TableCell({ borders: noBorders, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 160, height: 34 } })] })] }),
    new TableCell({ borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, verticalAlign: VerticalAlign.BOTTOM, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Executive Summary  |  ThriveWell Schools', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ]})]})] });
}
function makeFooter() {
  return new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 }, children: [
    new TextRun({ text: 'Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8499  |  technijian.com  |  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
    new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
  ]})] });
}

async function main() {
  const children = [];

  // ── COVER (dark) ────────────────────────────────────────────────────
  children.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], borders: noBorders,
    rows: [new TableRow({ children: [new TableCell({ shading: { fill: DARK_CHARCOAL, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 500, bottom: 500, left: 600, right: 600 }, children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new ImageRun({ type: 'png', data: LOGO_WH_BUF, transformation: { width: 180, height: 38 } })] }),
      spacer(300),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'ThriveWell Schools', size: 56, bold: true, color: WHITE, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AI Growth Blueprint', size: 36, bold: true, color: CORE_ORANGE, font: FONT_HEAD })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: 'Executive Summary', size: 28, color: TEAL, italics: true, font: FONT_BODY })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Scaling Restorative Justice & Trauma-Informed Excellence', size: 22, color: WHITE, font: FONT_BODY })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: 'Across California\'s K-12 School Districts', size: 22, color: WHITE, font: FONT_BODY })] }),
      spacer(400),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: `Prepared for Dr. Jennifer Lynn-Whaley, PhD  |  ${TODAY}`, size: 18, color: BRAND_GREY, font: FONT_BODY })] }),
    ]})] })],
  }));
  children.push(pageBreak());

  // ── PAGE 2: MARKET MOMENT + THREE MOVES ──────────────────────────────
  children.push(sectionLabel('The Moment', CORE_BLUE));
  children.push(new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: 'California\'s Historic Funding Window', size: 30, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }));
  children.push(spacer(80));
  children.push(kpiRow([
    { number: '$8B', label: 'CA Wellness Investment\n(CYBHI + CCSPP)', color: CORE_BLUE },
    { number: '70%', label: 'Behavioral Referral Drop\nAcquired CA Middle School', color: CORE_ORANGE },
    { number: '53%', label: 'Teacher Burnout Rate\nRAND 2025', color: TEAL },
    { number: '37%', label: 'Schools Without\nFormal SEL Curriculum', color: CORE_BLUE },
  ]));
  children.push(spacer(200));
  children.push(p('California has committed $8 billion to children\'s behavioral health and school climate — the largest investment window in state history. Districts are receiving discretionary block grants, LCFF increases, and Title IV allocations earmarked for exactly the kind of trauma-informed, restorative justice implementation that ThriveWell delivers.'));
  children.push(p('At the same time, teacher burnout is at crisis levels (53% report burnout — student behavior management is the #1 driver). Counselors are overwhelmed. The school-to-prison pipeline is under legislative scrutiny. And federal grant cuts are accelerating district urgency to spend state dollars now.'));
  children.push(calloutBox(
    'ThriveWell\'s Position',
    'No competitor holds the combination: Restorative Justice + Trauma-Informed Practice + School-to-Prison Pipeline Prevention + PhD-backed research credibility + implementation coaching that stays. The question is not whether this work is needed — it is. The question is how fast ThriveWell can reach the districts that most need it.',
    TEAL
  ));
  children.push(spacer(200));
  children.push(sectionLabel('Three Moves', CORE_BLUE));
  children.push(new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: 'The ThriveWell AI Growth Engine', size: 30, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }));
  children.push(buildTable(
    [{ label: 'Motion', weight: 2 }, { label: 'What It Does', weight: 5 }, { label: 'Service', weight: 2 }],
    [
      [{ text: 'Get Found', bold: true, color: CORE_BLUE }, 'Rank for "trauma-informed professional development California," optimize for AI-generated search answers, amplify Jennifer\'s "Neuroscience Behind Misbehavior" research into inbound district conversations', 'My SEO — Education Authority'],
      [{ text: 'Win Districts', bold: true, color: TEAL }, 'Monitor named-account triggers (CYBHI grants, new superintendents, CA Dashboard flags); match ThriveWell to open grants; systematize outcome data that wins the next contract', 'My AI Lead Gen + Grant AI'],
      [{ text: 'Scale & Serve', bold: true, color: CORE_ORANGE }, 'Deliver Strong Beginnings, Trauma Foundations, and Staff Resilience virtually; remove Jennifer\'s geographic ceiling; give district leaders the data dashboard that renews contracts', 'My Dev — ThriveWell Platform'],
    ]
  ));
  children.push(pageBreak());

  // ── PAGE 3: ARCHITECTURE DIAGRAM + ROI ──────────────────────────────
  children.push(diagramImage(ARCH_BUF, 'ThriveWell AI Growth Architecture', 540));
  children.push(diagramCaption('Figure 1: Three-motion AI growth engine — Get Found, Win Districts, Scale & Serve'));
  children.push(spacer(200));
  children.push(sectionLabel('The Investment', CORE_BLUE));
  children.push(new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: 'Start at Entry — Expand as Growth Confirms', size: 28, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }));
  children.push(buildTable(
    [{ label: 'Phase', weight: 2 }, { label: 'Services', weight: 4 }, { label: 'Y1 Investment', weight: 2 }, { label: 'Expected ROI', weight: 2 }],
    [
      [{ text: 'Entry (Phase 1)', bold: true, color: TEAL }, 'My SEO Authority + My AI Workshop + My AI Fractional Advisor Starter', { text: '$34,988', bold: true, color: TEAL }, { text: '1.7×–5.1×', bold: true, color: TEAL }],
      [{ text: 'Full Engine (Phase 2)', bold: true, color: CORE_BLUE }, 'Adds: My AI Lead Gen Pro + Advisor upgrade + My Dev Platform Build + Managed Services', { text: '$135,576', bold: true, color: CORE_BLUE }, { text: '2.7×–5.3×+', bold: true, color: CORE_BLUE }],
    ]
  ));
  children.push(spacer(140));
  children.push(calloutBox(
    'The Entry Case Makes Itself',
    'At $34,988 for Year 1, a single new district training and coaching contract recovers the investment. The expected case — 2 to 3 new district engagements over 12 months of SEO authority-building and account intelligence — is a 3.4× to 5.1× return. Contract values shown are illustrative; ThriveWell\'s actual pricing determines the precise multiple.',
    CORE_ORANGE
  ));
  children.push(pageBreak());

  // ── PAGE 4: ROADMAP ──────────────────────────────────────────────────
  children.push(sectionLabel('The Roadmap', CORE_BLUE));
  children.push(new Paragraph({ spacing: { before: 0, after: 100 }, children: [new TextRun({ text: '90-Day Foundation → 180-Day Acceleration → 365-Day Scale', size: 28, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }));
  children.push(spacer(100));
  children.push(diagramImage(TIMELINE_BUF, 'ThriveWell 90/180/365 Roadmap', 540));
  children.push(diagramCaption('Figure 2: Implementation roadmap — get found, win districts, scale delivery'));
  children.push(spacer(140));
  children.push(buildTable(
    [{ label: 'Phase', weight: 2 }, { label: 'Key Actions', weight: 5 }, { label: 'Outcome', weight: 3 }],
    [
      [{ text: 'Days 1–90\nFoundation', bold: true, color: CORE_BLUE }, 'AI Workshop + SEO launch + website case study + LinkedIn "Neuroscience Behind Misbehavior" series', 'ThriveWell visible in search. Consultation pipeline active.'],
      [{ text: 'Days 91–180\nAcceleration', bold: true, color: TEAL }, 'AI Lead Gen launch + Grant Application AI + Outcome documentation system + Virtual delivery pilot', '2-4 new district conversations in pipeline. Grant applications submitted.'],
      [{ text: 'Days 181–365\nScale', bold: true, color: CORE_ORANGE }, 'ThriveWell Platform live + School Climate Dashboard + 10-15 district targets + Certification program design', '5-12 active district contracts. Online revenue stream launched.'],
    ]
  ));
  children.push(pageBreak());

  // ── PAGE 5: QUICK WINS + NEXT STEP ───────────────────────────────────
  children.push(sectionLabel('Start This Week — No Budget Required', CORE_ORANGE));
  children.push(new Paragraph({ spacing: { before: 0, after: 100 }, children: [new TextRun({ text: 'Six Quick Wins Before Any Contract Is Signed', size: 28, bold: true, color: CORE_BLUE, font: FONT_HEAD })] }));
  children.push(spacer(100));
  children.push(buildTable(
    [{ label: '#', weight: 1 }, { label: 'Action', weight: 4 }, { label: 'Impact', weight: 4 }],
    [
      ['1', 'Add the 70% referral reduction outcome prominently to the homepage', 'Single sentence that changes conversion rate for every visitor'],
      ['2', 'Publish the Park Middle School case study (600 words) on website, Substack, LinkedIn', 'Organic ranking for "trauma-informed school results California" within 60 days'],
      ['3', 'LinkedIn series: repurpose "Neuroscience Behind Misbehavior" paper into 4 posts', 'Reaches Jennifer\'s 464+ education-professional connections; positions as thought leader'],
      ['4', 'Submit one ACSA or CDE conference speaking proposal', '"Breaking the School-to-Prison Pipeline" session — direct access to superintendent buyers'],
      ['5', 'Add qualifying intake questions to the free consultation form', 'Triples information quality from first contact; better prepared discovery calls'],
      ['6', 'Claim a Google Business Profile for ThriveWell Schools in Berkeley, CA', 'Local SEO anchor; enables Google reviews; surfaces in K-12 consultant searches'],
    ]
  ));
  children.push(spacer(200));
  children.push(calloutBox(
    'What Happens Next',
    [
      '1. Review this summary and identify any corrections or clarifications.',
      '2. Schedule a 30-minute call with Technijian to walk through the three motions and calibrate the investment.',
      '3. Technijian scopes the entry package within 3 business days of the call.',
      '4. My AI Executive Workshop — Day 1 — maps ThriveWell\'s full AI growth opportunity.',
      '',
      'Contact: 949.379.8499  |  technijian.com  |  18 Technology Dr., Ste 141, Irvine, CA 92618',
    ],
    CORE_BLUE
  ));
  children.push(spacer(200));
  children.push(p('"technology as a solution"', { bold: true, color: CORE_BLUE, align: AlignmentType.CENTER, size: 24 }));

  // ---------- Assemble ----------
  const doc = new Document({
    numbering: { config: [{ reference: 'bullets', levels: [{ level: 0, format: 'bullet', text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 260 } } } }] }] },
    styles: {
      default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', run: { font: FONT_HEAD, size: 28, bold: true, color: CORE_BLUE } },
      ],
    },
    sections: [{
      properties: {
        page: { margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN }, size: { width: PAGE_W, height: 15840 } },
        titlePage: true,
      },
      headers: { default: makeHeader(), first: new Header({ children: [] }) },
      footers: { default: makeFooter(), first: new Footer({ children: [] }) },
      children,
    }],
  });

  const buf = await Packer.toBuffer(doc);
  const outPath = path.join(__dirname, 'TWS-AI-Growth-Blueprint-Summary.docx');
  fs.writeFileSync(outPath, buf);
  console.log('Written:', outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
