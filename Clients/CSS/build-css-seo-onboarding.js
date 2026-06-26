// Custom Silicon Solutions (CSS) — My SEO Onboarding & Strategy Report (INTERNAL SEO-team playbook)
// Technijian-branded DOCX. Grounded in REAL data: SEMrush, GA4/GSC/GTM, the 2026-06-16 onboarding intake,
// and the 2026-05-27 keyword-gap + backlink audit. Niche B2B semiconductor — no invented search volumes.
// Also emits two team-importable CSVs: 52-week content calendar + keyword map.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, LevelFormat,
  TabStopType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak, TableOfContents
} = require('C:/vscode/tech-branding/tech-branding/node_modules/docx');

const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'assets', 'brand-tokens.json'), 'utf8'));
const strip = (h) => (h || '').replace('#', '');
const CORE_BLUE = strip(tokens.color.primary.blue.$value);
const CORE_ORANGE = strip(tokens.color.primary.orange.$value);
const TEAL = strip(tokens.color.secondary.teal.$value);
const CHARTREUSE = strip(tokens.color.secondary.chartreuse.$value);
const DARK_CHARCOAL = strip(tokens.color.neutral.dark.$value);
const BRAND_GREY = strip(tokens.color.secondary.grey.$value);
const OFF_WHITE = strip(tokens.color.neutral.off_white.$value);
const WHITE = 'FFFFFF';
const LIGHT_GREY = strip(tokens.color.neutral.light_grey.$value);
const CRITICAL = strip(tokens.color.status.critical.$value);
const GREEN = '28A745';
const FONT_HEAD = 'Open Sans', FONT_BODY = 'Open Sans';
const LOGO_BUF = fs.readFileSync(path.join(__dirname, 'assets', 'Technijian Logo 2.png'));
const LOGO_AR = 4.779;
const TODAY = 'June 26, 2026';

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const PAGE_W = 12240, MARGIN = 1440, CONTENT_W = PAGE_W - MARGIN * 2;

function spacer(s = 200) { return new Paragraph({ keepNext: true, spacing: { before: s, after: 0 }, children: [new TextRun({ text: '' })] }); }
function p(text, o = {}) {
  const { size = 22, color = BRAND_GREY, bold = false, italics = false, align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = o;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_BODY })] });
}
function pRuns(runs, o = {}) {
  const { align = AlignmentType.JUSTIFIED, spaceBefore = 0, spaceAfter = 140 } = o;
  return new Paragraph({ alignment: align, spacing: { before: spaceBefore, after: spaceAfter, line: 320 }, children: runs.map(r => new TextRun({ text: r.text, size: r.size || 22, color: r.color || BRAND_GREY, bold: r.bold || false, italics: r.italics || false, font: FONT_BODY })) });
}
function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  const headingPara = new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, keepNext: true, spacing: { before: 0, after: 120, line: 240 }, children: [new TextRun({ text: label, size: 2, color: 'FFFFFF', font: FONT_HEAD })] });
  const visual = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders, rows: [new TableRow({ children: [
    new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] }),
    new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text: label, size: 34, bold: true, color, font: FONT_HEAD })] })] }),
  ] })] });
  return [headingPara, visual, spacer(120)];
}
function plainHeader(text, color = CORE_BLUE) {
  const visual = new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [120, CONTENT_W - 120], borders: noBorders, rows: [new TableRow({ children: [
    new TableCell({ width: { size: 120, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] }),
    new TableCell({ width: { size: CONTENT_W - 120, type: WidthType.DXA }, borders: noBorders, margins: { top: 100, bottom: 100, left: 200, right: 0 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new TextRun({ text, size: 34, bold: true, color, font: FONT_HEAD })] })] }),
  ] })] });
  return [new Paragraph({ pageBreakBefore: true, spacing: { before: 0, after: 0 }, children: [new TextRun({ text: '', size: 1 })] }), visual, spacer(120)];
}
function subHeader(text, color = CORE_BLUE) { return new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, keepLines: true, spacing: { before: 300, after: 130 }, children: [new TextRun({ text, size: 27, bold: true, color, font: FONT_HEAD })] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, keepNext: true, spacing: { before: 220, after: 90 }, children: [new TextRun({ text, size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }); }
const NB = 'bullets';
function bullet(text, o = {}) { return new Paragraph({ numbering: { reference: NB, level: 0 }, spacing: { before: 40, after: 80, line: 300 }, children: [new TextRun({ text, size: 22, color: BRAND_GREY, font: FONT_BODY, ...o })] }); }
function bulletRuns(runs) { return new Paragraph({ numbering: { reference: NB, level: 0 }, spacing: { before: 40, after: 80, line: 300 }, children: runs.map(r => new TextRun({ text: r.text, size: r.size || 22, color: r.color || BRAND_GREY, bold: r.bold || false, italics: r.italics || false, font: FONT_BODY })) }); }
function calloutBox(title, body, color = CORE_BLUE) {
  const titleP = new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: title, size: 22, bold: true, color, font: FONT_HEAD })] });
  const arr = Array.isArray(body) ? body : [body];
  const bodyParas = arr.map((b, i) => new Paragraph({ keepNext: i < arr.length - 1, keepLines: true, spacing: { before: 40, after: 60, line: 300 }, children: [new TextRun({ text: b, size: 20, color: BRAND_GREY, font: FONT_BODY })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [80, CONTENT_W - 80], rows: [new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 80, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun('')] })] }),
    new TableCell({ width: { size: CONTENT_W - 80, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 160, bottom: 160, left: 240, right: 200 }, children: [titleP, ...bodyParas] }),
  ] })] });
}
function kpiRow(items) {
  const w = Math.floor(CONTENT_W / items.length);
  const cells = items.map(it => new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { fill: OFF_WHITE, type: ShadingType.CLEAR }, borders: noBorders, margins: { top: 200, bottom: 200, left: 90, right: 90 }, verticalAlign: VerticalAlign.CENTER, children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: it.number, size: 34, bold: true, color: it.color || CORE_BLUE, font: FONT_HEAD })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: it.label, size: 15, color: BRAND_GREY, font: FONT_BODY })] }),
  ] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: items.map(() => w), borders: noBorders, rows: [new TableRow({ children: cells })] });
}
function buildTable(columns, rows, o = {}) {
  const { headerColor = CORE_BLUE, zebra = true, fontSize = 19, headerSize = 19 } = o;
  const totalW = columns.reduce((s, c) => s + c.weight, 0);
  const cw = columns.map(c => Math.floor(CONTENT_W * (c.weight / totalW)));
  cw[cw.length - 1] += CONTENT_W - cw.reduce((s, w) => s + w, 0);
  const hc = columns.map((c, i) => new TableCell({ width: { size: cw[i], type: WidthType.DXA }, shading: { fill: headerColor, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 90, bottom: 90, left: 110, right: 110 }, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: c.align || AlignmentType.LEFT, children: [new TextRun({ text: c.label, size: headerSize, bold: true, color: WHITE, font: FONT_HEAD })] })] }));
  const dr = rows.map((row, ri) => new TableRow({ cantSplit: true, children: row.map((cell, i) => {
    const co = typeof cell === 'string' ? { text: cell } : cell;
    const fill = zebra && ri % 2 === 1 ? OFF_WHITE : WHITE;
    const texts = Array.isArray(co.text) ? co.text : [co.text];
    const paras = texts.map(t => new Paragraph({ alignment: columns[i].align || AlignmentType.LEFT, spacing: { before: 0, after: 20, line: 264 }, children: [new TextRun({ text: t, size: co.size || fontSize, color: co.color || BRAND_GREY, bold: co.bold || false, italics: co.italics || false, font: FONT_BODY })] }));
    return new TableCell({ width: { size: cw[i], type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR }, borders: cellBorders, margins: { top: 70, bottom: 70, left: 110, right: 110 }, verticalAlign: VerticalAlign.TOP, children: paras });
  }) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: cw, rows: [new TableRow({ tableHeader: true, children: hc }), ...dr] });
}
function colorBar(color, h = 60) { return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], rows: [new TableRow({ height: { value: h, rule: 'exact' }, children: [new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, shading: { fill: color, type: ShadingType.CLEAR }, borders: noBorders, children: [new Paragraph({ children: [new TextRun({ text: '' })] })] })] })] }); }
function centered(text, o = {}) { const { size = 22, color = BRAND_GREY, bold = false, italics = false, after = 100, before = 0 } = o; return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before, after }, children: [new TextRun({ text, size, color, bold, italics, font: FONT_HEAD })] }); }

// ============================================================ DATA: PERSONA KEYWORD CLUSTERS
// Niche B2B semiconductor terms — LOW volume, HIGH intent. Exact MSV/KD pulled per-term in SEMrush at onboarding.
// Priority = strategic priority (intent x business fit x gap), NOT a volume claim.
const KW = {
  ind: { name: 'Industrial / IoT Design Engineer', color: CORE_BLUE, aeo: '“who designs custom mixed-signal ASICs for industrial sensors / metering in the US”',
    rows: [
      ['industrial ASIC design', 'Head', 'Commercial', 'High (gap)', '/market-expertise (Industrial pillar — NEW)'],
      ['mixed-signal ASIC design', 'Head', 'Commercial', 'High', '/ic-design-expertise'],
      ['analog ASIC design / analog IC design services', 'Head', 'Commercial', 'High (gap)', 'Analog ASIC page (NEW)'],
      ['sensor interface ASIC / signal-conditioning IC', 'Long-tail', 'Commercial', 'High', 'Sensor-interface capability page (NEW)'],
      ['custom PMIC / power-management ASIC', 'Long-tail', 'Commercial', 'High (gap)', 'Power ASIC page (NEW)'],
      ['high-voltage gate-driver ASIC', 'Long-tail', 'Commercial', 'High (gap)', 'High-voltage page'],
      ['sigma-delta / SAR / flash ADC ASIC', 'Long-tail', 'Commercial', 'Medium', 'Data-converter capability page (NEW)'],
      ['MEMS readout / interface ASIC', 'Long-tail', 'Commercial', 'Medium', 'MEMS-interface page (NEW)'],
      ['smart-metering ASIC / energy IC', 'Long-tail', 'Commercial', 'Medium', 'Industrial vertical page'],
      ['RF / wireless ASIC design', 'Long-tail', 'Commercial', 'Medium', 'RF/wireless capability page'],
      ['mixed-signal IC consolidation (discrete → ASIC)', 'Long-tail', 'Informational', 'High', 'Blog cluster + Industrial page'],
    ] },
  med: { name: 'Medical-Device R&D Lead', color: CORE_ORANGE, aeo: '“custom ultra-low-power ASIC partner for an implantable / wearable medical device”',
    rows: [
      ['medical device ASIC design / medical ASIC', 'Head', 'Commercial', 'High (gap)', '/market-expertise (Medical pillar — NEW)'],
      ['ultra-low-power ASIC / nanoamp IC design', 'Head', 'Commercial', 'High', 'Ultra-low-power capability page (NEW)'],
      ['implantable ASIC design', 'Long-tail', 'Commercial', 'High', 'Medical vertical page'],
      ['wearable medical ASIC', 'Long-tail', 'Commercial', 'High', 'Medical vertical page'],
      ['biosensor / diagnostic interface ASIC', 'Long-tail', 'Commercial', 'Medium', 'Medical vertical page'],
      ['energy-harvesting ASIC (battery-free / long-life)', 'Long-tail', 'Commercial', 'Medium', 'Low-power capability page'],
      ['low-power sensor ASIC for medical', 'Long-tail', 'Commercial', 'Medium', 'Sensor-interface page'],
      ['long-life medical IC supply / lifecycle support', 'Long-tail', 'Informational', 'Medium', 'Blog + Medical page'],
    ] },
  aero: { name: 'Aerospace & Defense / Hi-Rel Program Engineer', color: TEAL, aeo: '“US-based trusted hi-rel ASIC design house for a defense / space program”',
    rows: [
      ['aerospace ASIC design / defense ASIC', 'Head', 'Commercial', 'High (gap)', '/market-expertise (A&D pillar — NEW)'],
      ['hi-rel ASIC / high-reliability IC', 'Head', 'Commercial', 'High', 'A&D vertical page'],
      ['radiation-hardened (rad-hard) ASIC design', 'Long-tail', 'Commercial', 'High (gap)', 'Rad-hard page (NEW)'],
      ['high-voltage ASIC for defense', 'Long-tail', 'Commercial', 'Medium', 'High-voltage page'],
      ['phased-array ASIC', 'Long-tail', 'Commercial', 'Medium', 'A&D vertical page'],
      ['downhole / extreme-environment ASIC', 'Long-tail', 'Commercial', 'Medium', 'A&D / Industrial page'],
      ['trusted US ASIC supplier / US-based ASIC design', 'Long-tail', 'Commercial', 'High', 'About + A&D page'],
      ['ruggedized mixed-signal ASIC', 'Long-tail', 'Commercial', 'Medium', 'A&D vertical page'],
    ] },
  obs: { name: 'Obsolescence / Sustaining-Engineering Manager', color: GREEN, aeo: '“drop-in replacement for an obsolete [analog / mixed-signal] IC” / “DMSMS solution”',
    rows: [
      ['obsolete IC replacement / IC obsolescence solution', 'Head', 'Commercial', 'Flagship', '/blog obsolescence pillar (exists — expand)'],
      ['drop-in IC / ASIC replacement', 'Head', 'Commercial', 'Flagship', 'Obsolescence hub (NEW)'],
      ['form-fit-function ASIC replacement', 'Long-tail', 'Commercial', 'High', 'Obsolescence hub'],
      ['DMSMS / diminishing manufacturing sources', 'Long-tail', 'Informational', 'High', 'Obsolescence blog cluster'],
      ['last-time-buy alternative / EOL chip replacement', 'Long-tail', 'Commercial', 'High', 'Obsolescence hub'],
      ['obsolete analog IC replacement', 'Long-tail', 'Commercial', 'High', 'Obsolescence hub'],
      ['recreate / reverse-engineer an obsolete IC', 'Long-tail', 'Informational', 'Medium', 'Obsolescence blog cluster'],
      ['legacy IC continuity / long-lifecycle supply', 'Long-tail', 'Informational', 'Medium', 'Obsolescence + Lifecycle page'],
    ] },
};
const KW_CROSS = [
  ['custom ASIC design', 'Head', 'Commercial', 'Core — defend', 'Homepage (ranks now)'],
  ['turnkey ASIC design & manufacturing', 'Head', 'Commercial', 'Core — defend', '/turnkey-asics (ranks now)'],
  ['ASIC design services / ASIC manufacturing services', 'Head', 'Commercial', 'High (gap)', '/turnkey-asics + services copy'],
  ['fabless ASIC partner / fab-agnostic ASIC', 'Long-tail', 'Commercial', 'Medium', 'Homepage + About'],
  ['ASIC design flow (concept → production)', 'Long-tail', 'Informational', 'High (gap)', 'Design-flow page (NEW)'],
  ['ASIC packaging', 'Long-tail', 'Commercial', 'Medium (gap)', 'Turnkey sub-section / page (NEW)'],
  ['ASIC test / production test', 'Long-tail', 'Commercial', 'Medium (gap)', 'Test capability page (NEW)'],
  ['ASIC process nodes / node selection', 'Long-tail', 'Informational', 'Medium (gap)', 'Design-flow / blog'],
  ['ASIC vs FPGA', 'Long-tail', 'Informational', 'High (citable)', 'Decision-stage blog'],
  ['ASIC NRE cost / ASIC development cost', 'Long-tail', 'Informational', 'High (citable)', 'Decision-stage blog'],
  ['when to move to a custom ASIC', 'Long-tail', 'Informational', 'High (citable)', 'Decision-stage blog'],
  ['custom ASIC design company / ASIC design company Orange County', 'Long-tail', 'Commercial', 'Medium', 'Homepage + About (entity)'],
];

// ============================================================ DATA: 52-WEEK CONTENT CALENDAR
// Persona codes: Ind / Med / A&D / Obs / All.  Stage: TOFU / MOFU / BOFU.
// q = quarter theme.  Built to cover all 4 personas, all 15 gap keywords, all funnel stages, 4 case studies.
const CAL = [
  // Q1 — Foundation: decision-stage education + core capability (authority & AEO citability)
  [1,'Q1','ASIC vs. FPGA: When Does Custom Silicon Actually Win?','All','asic vs fpga','TOFU','Education','Decision blog → /turnkey-asics'],
  [2,'Q1','When to Move From Discrete Parts to a Custom ASIC','Ind','when to move to a custom asic','TOFU','Education','Decision blog → Industrial pillar'],
  [3,'Q1','What an ASIC Really Costs: NRE, Masks, and Unit Economics','All','asic nre cost','MOFU','Education','Decision blog'],
  [4,'Q1','Custom ASIC vs. Off-the-Shelf IC: BOM, Size, Power & IP','Ind','custom asic vs standard ic','TOFU','Education','Decision blog'],
  [5,'Q1','A Practical Guide to the Custom ASIC Design Flow','All','asic design flow','MOFU','Process','Design-flow page (NEW)'],
  [6,'Q1','Mixed-Signal ASIC Design: Analog + Digital on One Chip','Ind','mixed-signal asic design','MOFU','Capability','/ic-design-expertise'],
  [7,'Q1','Analog ASIC Design Services: What to Look For in a Partner','Ind','analog asic design','MOFU','Capability','Analog ASIC page (NEW)'],
  [8,'Q1','Choosing the Right Process Node for Your Analog/Mixed-Signal ASIC','All','asic process nodes','MOFU','Process','Design-flow / blog'],
  [9,'Q1','How a Fabless, Fab-Agnostic Partner De-Risks Your ASIC','All','fabless asic partner','MOFU','Capability','/turnkey-asics'],
  [10,'Q1','Precision Data Converters: SAR, Sigma-Delta & Flash ADCs in an ASIC','Ind','data converter asic','MOFU','Capability','Data-converter page (NEW)'],
  [11,'Q1','The Volume Question: When a Custom ASIC Pays Off','All','asic volume threshold','MOFU','Education','Decision blog'],
  [12,'Q1','Protecting Your IP in Silicon: Custom ASIC vs. Reverse-Engineering','All','protect ip with a custom asic','MOFU','Education','Decision blog'],
  [13,'Q1','In-House Wafer Probe & Final Test: Why a Test Floor Matters','All','asic production test','MOFU','Process','Test capability page (NEW)'],
  // Q2 — Verticals: Medical & Industrial depth
  [14,'Q2','Medical-Device ASIC Design: Ultra-Low Power, Long Battery Life','Med','medical device asic design','MOFU','Vertical','Medical pillar (NEW)'],
  [15,'Q2','Designing ASICs for Implantable & Wearable Medical Devices','Med','implantable asic design','MOFU','Vertical','Medical pillar'],
  [16,'Q2','Sensor-Interface ASICs: Turning Raw Signals Into Clean Data','Ind','sensor interface asic','MOFU','Capability','Sensor-interface page (NEW)'],
  [17,'Q2','Ultra-Low-Power ASIC Design: Nanoamp & Energy-Harvesting Techniques','Med','ultra low power asic','MOFU','Capability','Low-power page (NEW)'],
  [18,'Q2','MEMS-Interface ASICs: Pressure, Inertial & Environmental Sensing','Ind','mems interface asic','MOFU','Capability','MEMS page (NEW)'],
  [19,'Q2','Industrial ASIC Design: Drivers, PMICs & Rugged Mixed-Signal','Ind','industrial asic design','MOFU','Vertical','Industrial pillar (NEW)'],
  [20,'Q2','ASICs for Smart Metering & Energy Systems','Ind','metering asic','MOFU','Vertical','Industrial pillar'],
  [21,'Q2','High-Voltage ASIC Design: Gate Drivers and Beyond','Ind','high-voltage asic design','MOFU','Capability','High-voltage page'],
  [22,'Q2','Power-Management ASICs (PMIC): Custom vs. Catalog','Ind','power asic design','MOFU','Capability','Power ASIC page (NEW)'],
  [23,'Q2','Biosensor & Diagnostic ASICs: Designing for Accuracy & Compliance','Med','biosensor asic','MOFU','Vertical','Medical pillar'],
  [24,'Q2','Medical-Device Longevity: Supply, Quality & Traceability','Med','long life medical ic supply','MOFU','Vertical','Medical pillar'],
  [25,'Q2','From Sensor to System: Consolidating a Node Into One ASIC','Ind','sensor node asic integration','MOFU','Education','Industrial pillar + blog'],
  [26,'Q2','Application Story: Mixed-Signal Integration for an Industrial OEM','Ind','mixed-signal asic case study','BOFU','Case Study','/asic-portfolio'],
  // Q3 — Aerospace/Defense, Obsolescence, RF + Turnkey ops
  [27,'Q3','Aerospace & Defense ASIC Design: Reliability for 20-Year Programs','A&D','aerospace asic design','MOFU','Vertical','A&D pillar (NEW)'],
  [28,'Q3','Radiation-Hardened ASIC Design: When and How','A&D','rad-hard asic design','MOFU','Capability','Rad-hard page (NEW)'],
  [29,'Q3','Hi-Rel ASICs: Screening, Qualification & Trusted US Supply','A&D','hi-rel asic','MOFU','Vertical','A&D pillar'],
  [30,'Q3','The Drop-In ASIC Replacement Playbook for Obsolete Parts','Obs','obsolete ic replacement','MOFU','Obsolescence','Obsolescence hub (expand existing)'],
  [31,'Q3','DMSMS & Last-Time-Buy: Engineering Out of an EOL Crisis','Obs','dmsms ic replacement','MOFU','Obsolescence','Obsolescence hub'],
  [32,'Q3','Form-Fit-Function: Recreating an Obsolete Part Without the Original Design','Obs','form fit function ic replacement','MOFU','Obsolescence','Obsolescence hub'],
  [33,'Q3','When the Original Chip Is Gone: From Sample to Compliant ASIC','Obs','recreate obsolete ic','MOFU','Obsolescence','Obsolescence hub'],
  [34,'Q3','RF & Wireless ASIC Design: LNAs, Mixers, VCOs and PAs','Ind','rf asic design','MOFU','Capability','RF/wireless page'],
  [35,'Q3','ASIC Packaging Options: From Bare Die to Custom Packages','All','asic packaging','MOFU','Process','Packaging page (NEW)'],
  [36,'Q3','Production Test & Characterization: Guaranteeing Every Shipped Die','All','asic characterization','MOFU','Process','Test page'],
  [37,'Q3','Tape-Out Readiness: A Checklist Before You Commit to Masks','All','asic tape-out checklist','MOFU','Process','Design-flow / blog'],
  [38,'Q3','Prototype to Production: Scaling a Custom ASIC Program','All','prototype asic','MOFU','Process','/turnkey-asics'],
  [39,'Q3','Application Story: Keeping a Long-Lifecycle System Alive (Obsolescence)','Obs','obsolete part replacement case study','BOFU','Case Study','/asic-portfolio'],
  // Q4 — Authority, comparisons, glossary, refresh
  [40,'Q4','Choosing a Custom ASIC Design Company: A Buyer’s Checklist','All','custom asic design company','MOFU','Education','Decision blog → Homepage'],
  [41,'Q4','ASIC Design Services Explained: What “Turnkey” Really Includes','All','asic design services','MOFU','Capability','/turnkey-asics'],
  [42,'Q4','Analog IC Design Services: Specifying Performance That Survives Production','Ind','analog ic design services','MOFU','Capability','Analog ASIC page'],
  [43,'Q4','Energy Harvesting + Ultra-Low Power: Designing Battery-Free Devices','Med','energy harvesting asic','MOFU','Capability','Low-power page'],
  [44,'Q4','EMI, Temperature & Ruggedization in Industrial ASICs','Ind','rugged industrial asic','MOFU','Vertical','Industrial pillar'],
  [45,'Q4','Wearable Health Tech: ASIC Design for Continuous Monitoring','Med','wearable health asic','MOFU','Vertical','Medical pillar'],
  [46,'Q4','The Hidden Cost of NOT Going Custom (Discrete & Catalog Parts)','Ind','asic vs discrete cost','MOFU','Education','Decision blog'],
  [47,'Q4','ASIC Design for Phased-Array & Downhole Applications','A&D','phased array asic','MOFU','Vertical','A&D pillar'],
  [48,'Q4','Building a Multi-Year Supply Plan for Your Custom ASIC','All','asic lifecycle support','MOFU','Process','Lifecycle / Obsolescence page'],
  [49,'Q4','Glossary Deep-Dive: 20 ASIC Terms Every Hardware Buyer Should Know','All','asic glossary','TOFU','Glossary','/asic-solutions-glossary-of-terms'],
  [50,'Q4','Application Story: A Sensor-Interface ASIC From Sketch to Production','Med','sensor asic case study','BOFU','Case Study','/asic-portfolio'],
  [51,'Q4','Custom-Silicon Trends: Reshoring, AI, and the Sensor Boom','All','custom silicon trends','TOFU','Thought','Blog (link-bait)'],
  [52,'Q4','The Complete Guide to Custom ASIC Development (Pillar Refresh)','All','custom asic design','TOFU','Pillar','Homepage/pillar — link all clusters'],
];
const PERSONA_LEGEND = 'Ind = Industrial / IoT · Med = Medical · A&D = Aerospace & Defense · Obs = Obsolescence · All = cross-persona';

// ============================================================ COVER
const cover = [
  colorBar(CORE_BLUE, 200), spacer(780),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 330, height: Math.round(330 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] }),
  spacer(320),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '━━━━━━━━━━', size: 32, color: CORE_ORANGE, bold: true })] }), spacer(210),
  centered('MY SEO — ONBOARDING', { size: 27, color: CORE_ORANGE, bold: true, after: 120 }),
  centered('& STRATEGY REPORT', { size: 27, color: CORE_ORANGE, bold: true, after: 200 }), spacer(140),
  centered('Custom Silicon Solutions', { size: 48, color: DARK_CHARCOAL, bold: true, after: 150 }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Baseline metrics · per-persona keyword & long-tail analysis · a 52-week content calendar · and the full onboarding playbook for the Technijian SEO team', size: 22, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(760),
  centered('PREPARED FOR', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('The Technijian My SEO team — onboarding playbook', { size: 21, color: DARK_CHARCOAL, bold: true, after: 150 }),
  centered('PREPARED BY', { size: 18, color: BRAND_GREY, after: 60 }),
  centered('Technijian — technology as a solution', { size: 22, color: CORE_BLUE, bold: true, after: 150 }),
  centered('DATE', { size: 18, color: BRAND_GREY, after: 60 }),
  centered(TODAY, { size: 22, color: DARK_CHARCOAL, bold: true, after: 360 }),
  centered('INTERNAL · CLIENT: CUSTOM SILICON SOLUTIONS (CSS) · customsiliconsolutions.com', { size: 16, color: BRAND_GREY, bold: true, after: 160 }),
  colorBar(CORE_ORANGE, 200),
];

// ============================================================ METHOD NOTE
const methodNote = [
  ...plainHeader('How to Read This Report'),
  p('This is the internal onboarding playbook for the Technijian My SEO team taking on Custom Silicon Solutions (CSS) — everything needed to run the account well, in one place. It builds directly on the company’s AI Growth & Integration Blueprint (June 26, 2026) and on the SEO work already underway.', { spaceAfter: 120 }),
  bulletRuns([{ text: 'It is grounded in real data. ', bold: true, color: DARK_CHARCOAL }, { text: 'Baseline metrics come from our SEMrush pulls, the GA4/Search Console connection, the June 16 onboarding intake, and the May 27 keyword-gap and backlink audit. Sources are in the Appendix.' }]),
  bulletRuns([{ text: 'It does not invent search volumes. ', bold: true, color: DARK_CHARCOAL }, { text: 'This is a niche B2B semiconductor account — terms are low-volume and high-intent. Exact monthly volume and difficulty are pulled per term in SEMrush during week 1; here, keywords are prioritised by intent, business fit, and competitor gap, not by a fabricated volume.' }]),
  bulletRuns([{ text: 'It is built to be used. ', bold: true, color: DARK_CHARCOAL }, { text: 'The per-persona keyword map and the 52-week calendar are also delivered as CSVs (see the Appendix) so they drop straight into the content workflow and the Client Portal ticket queue.' }]),
  calloutBox('The strategic headline',
    ['CSS has a deep, credible capability site (42 pages, strong proof) and an almost-silent top of funnel — one real blog post. The job is to turn three decades of analog-design expertise into published, citable authority: capture the high-intent technical long-tail per persona, win AI-assistant citations (AEO/GEO), and harden the conversion path — while keeping the existing pages strong. Success is measured in qualified RFQs and AI citations, not raw traffic.'], TEAL),
];

// ============================================================ TOC
const toc = [
  ...plainHeader('Contents'),
  p('Page numbers are generated by Word. If they ever look stale, open in Word and press Ctrl+A then F9 (or right-click the list → Update Field).', { italics: true, size: 18, color: BRAND_GREY, spaceAfter: 120 }),
  new TableOfContents('Contents — right-click and choose "Update Field" to populate page numbers.', { hyperlink: true, headingStyleRange: '1-1' }),
];

// ============================================================ 01 CLIENT SNAPSHOT
const section1 = [
  ...sectionHeader('Client Snapshot', CORE_BLUE, '01'),
  p('The one-screen orientation for anyone joining the account. Full strategic detail is in the AI Growth & Integration Blueprint.', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Field', weight: 26 }, { label: 'Detail', weight: 74 }],
    [
      [{ text: 'Client', bold: true }, 'Custom Silicon Solutions, Inc. (client code CSS) — customsiliconsolutions.com'],
      [{ text: 'What they do', bold: true }, 'Fabless, fab-agnostic custom-ASIC house since 1996: analog, mixed-signal, high-voltage, and wireless ASICs, concept → production, plus turnkey manufacturing, in-house test, and drop-in replacements for obsolete parts.'],
      [{ text: 'Markets', bold: true }, 'Industrial / IoT · Medical devices · Aerospace & Defense · Consumer. Sells nationally and globally B2B — not local foot-traffic.'],
      [{ text: 'Proof points', bold: true }, '~30 years; 300+ tape-outs at 100% success (company-cited); 25+-year average engineer; in-house Class-10,000 production test floor; named customers Itron, Curtis Instruments, Transoma Medical.'],
      [{ text: 'NAP', bold: true }, 'Custom Silicon Solutions · 18021 Cowan, Irvine, CA 92614 · +1 949-797-9220 (keep consistent across all citations).'],
      [{ text: 'Platform', bold: true }, 'WordPress + Yoast SEO; ~42 pages; Elementor in use. GA4 (397845611), Search Console, and Google Tag Manager connected.'],
      [{ text: 'GTM motion', bold: true }, 'Account-based (ABM). Buyers are a finite, known universe of OEM design engineers — vertical + AI-search visibility matter far more than local-radius SEO.'],
      [{ text: 'Current scope', bold: true, color: CORE_ORANGE }, 'Weekly SEO reporting (lean: GA4 + GSC + site health). This report defines the full program; content production and technical build are expansion lines (Section 13).'],
      [{ text: 'Team contacts', bold: true }, 'SEO analyst: Puneet. Audit/reporting partner referenced: Mimi. Owner roles below (Section 12).'],
    ], { headerColor: DARK_CHARCOAL }),
];

// ============================================================ 02 CURRENT SEO METRICS
const section2 = [
  ...sectionHeader('Current SEO Metrics & Baseline', CORE_BLUE, '02'),
  p('The baseline to measure everything against, observed June 2026. These are real figures from our SEMrush pulls and the connected analytics — not estimates. Re-snapshot at onboarding and lock these as month-zero.', { spaceAfter: 130 }),
  kpiRow([
    { number: '124', label: 'Organic keywords (SEMrush, Jun 2026)', color: CORE_BLUE },
    { number: '~105', label: 'Organic visits / month', color: CORE_ORANGE },
    { number: '0', label: 'Paid-search keywords', color: TEAL },
    { number: '1', label: 'Live blog post (dormant engine)', color: CRITICAL },
  ]),
  spacer(140),
  kpiRow([
    { number: '~4.0K', label: 'Total backlinks (May 2026 audit)', color: CORE_BLUE },
    { number: '423', label: 'Referring domains', color: CORE_ORANGE },
    { number: '~42', label: 'Indexable pages', color: TEAL },
    { number: '23', label: 'Product/portfolio pages (weakly linked)', color: DARK_CHARCOAL },
  ]),
  spacer(160),
  subHeader('Baseline detail'),
  buildTable(
    [{ label: 'Metric', weight: 30 }, { label: 'Current (Jun 2026)', weight: 34 }, { label: 'Read / action', weight: 36 }],
    [
      [{ text: 'Organic keywords', bold: true }, '124 (US, SEMrush)', 'Tiny vs. capability breadth — the core growth gap. Each specialty is its own long-tail space.'],
      [{ text: 'Organic traffic', bold: true }, '~105 visits / mo', 'Low is expected for niche B2B; judge lead quality, not raw visits.'],
      [{ text: 'Domain rank / authority', bold: true }, 'SEMrush domain rank ~3.65M', 'Capture as month-zero; track trend, not absolute.'],
      [{ text: 'Paid search', bold: true }, 'None running', 'Every visit is earned — organic + AEO is the whole game (paid is an upsell, Section 13).'],
      [{ text: 'Backlinks / ref. domains', bold: true }, '~4.0K links / 423 RD / 230 IPs', 'Real base, not zero. 68% text / 32% image. Need topically-relevant RDs, not raw count (Section 9).'],
      [{ text: 'Content footprint', bold: true, color: CRITICAL }, '1 substantive blog post', 'Dormant engine. The 52-week calendar (Section 8) is the fix.'],
      [{ text: 'Analytics', bold: true }, 'GA4 397845611 · GSC · GTM connected', 'Confirm conversion goals/events are firing (Section 3).'],
      [{ text: 'Google Business Profile', bold: true }, 'Not confirmed', 'Claim/verify for entity + Orange County queries (low priority; not a local-foot-traffic business).'],
    ], { headerColor: CORE_BLUE }),
  spacer(120),
  calloutBox('Set the right scoreboard',
    'For a low-volume, high-consideration B2B account, vanity traffic is the wrong KPI. Lock month-zero baselines for: indexed pages, ranked keywords (esp. the gap terms), AI-assistant citations, RFQ/quote-form submissions, and assisted conversions. A 3–5 lead-quality improvement beats a traffic spike here.', TEAL),
];

// ============================================================ 03 TECHNICAL SEO
const section3 = [
  ...sectionHeader('Technical SEO & Site-Health Onboarding', CORE_BLUE, '03'),
  p('What to fix and confirm in the first weeks, drawn from the May 27 audit follow-up and the live-site validation. Several items are already in progress; this consolidates the open list.', { spaceAfter: 130 }),
  subHeader('Open / in-progress fix list'),
  buildTable(
    [{ label: 'Item', weight: 28 }, { label: 'Status / finding', weight: 44 }, { label: 'Owner · Priority', weight: 28 }],
    [
      [{ text: 'Conversion path / CTAs', bold: true, color: CRITICAL }, 'Generic “Learn More” / “Contact CSS”. Replace site-wide with “Request a Feasibility Review” / “Get an ASIC Quote” + a gated lead magnet (IP-block catalog or ASIC-vs-FPGA guide) + short qualifier (market/volume/timeline).', 'ux-design (04) · High'],
      [{ text: 'Schema markup', bold: true, color: CRITICAL }, 'Yoast emits Organization/WebSite/Breadcrumb; Product/Service/FAQ not confirmed. Add Organization, Service, Product, and FAQ schema for AI citability.', 'technical (05) · High'],
      [{ text: 'Internal linking', bold: true }, '23 product/portfolio pages weakly linked (partial orphaning). Build hub-and-spoke from market/portfolio hubs.', 'technical (05) · Medium'],
      [{ text: 'Template / utility URLs', bold: true }, '/elementor-hf/footer/ and /products-for-asic-solutions/ (legacy dup → /turnkey-asics/) need indexation cleanup. /ewna-booking/ already noindex,follow.', 'technical (05) · Medium'],
      [{ text: 'Soft-404 / 404 buckets', bold: true }, 'Soft-404 set includes asset routes (/home/react/, /home/vuejs/, react.svg, vuejs.svg). 404 bucket ~15 (stale, not currently linked). GSC validation already started.', 'technical (05) · Medium'],
      [{ text: 'Core Web Vitals / speed', bold: true }, 'Audit flagged ~7 slow pages; not yet measured per-URL. Run CWV/PageSpeed on the core set (home, /turnkey-asics, /asic-portfolio, /about, /contact, /blog).', 'technical (05) · Medium'],
      [{ text: 'Titles / meta', bold: true }, 'Updated on core pages already; align remaining pages to commercial keyword themes per Section 5.', 'technical (05) · Low'],
      [{ text: 'IMU URL typo', bold: true, color: GREEN }, 'DONE — /intertial-motion-unit/ 301→/inertial-motion-unit/; corrected URL submitted for indexing.', '— · Complete'],
    ], { headerColor: CORE_BLUE, fontSize: 18 }),
  subHeader('Access & instrumentation to confirm (week 1)'),
  bulletRuns([{ text: 'WordPress admin ', bold: true, color: DARK_CHARCOAL }, { text: '(editor + Yoast + Elementor) — confirm credentials in the fleet vault; needed for on-page, schema, and publishing.' }]),
  bulletRuns([{ text: 'GA4 (397845611), Search Console (sc-domain + https), GTM (6083523785 / 108259178) ', bold: true, color: DARK_CHARCOAL }, { text: '— connected; confirm goal/event tracking for the quote/feasibility form and lead-magnet downloads.' }]),
  bulletRuns([{ text: 'SEMrush project ', bold: true, color: DARK_CHARCOAL }, { text: '— position tracking for the gap + per-persona keyword set; site audit scheduled; backlink monitoring on.' }]),
  bulletRuns([{ text: 'Google Business Profile ', bold: true, color: DARK_CHARCOAL }, { text: '— claim/verify (category “ASIC/semiconductor design”); confirm NAP across AnySilicon, GlobalSpec, LinkedIn, ZoomInfo.' }]),
];

// ============================================================ 04 PERSONAS -> SEARCH
const section4 = [
  ...sectionHeader('Customer Personas → Search Behaviour', CORE_BLUE, '04'),
  p('The keyword and content plan is organised around four buyer personas, carried over from the AI Growth Blueprint and reconciled with the three buying-situation personas in the June 16 intake. The point for SEO: each persona searches differently, and increasingly asks an AI assistant before it searches at all.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Persona', weight: 22 }, { label: 'How they search / what triggers it', weight: 50 }, { label: 'Primary intent', weight: 28 }],
    [
      [{ text: 'Industrial / IoT Design Engineer', bold: true, color: CORE_BLUE }, 'Searches capability + integration terms (mixed-signal, sensor interface, PMIC, data converter) when a new revision or cost-down mandate makes a board of discrete parts untenable.', 'Commercial — capability & volume'],
      [{ text: 'Medical-Device R&D Lead', bold: true, color: CORE_ORANGE }, 'Searches ultra-low-power, implantable/wearable, biosensor terms at a funding or prototype-to-production milestone; values long-life supply and quality rigor.', 'Commercial — low-power & longevity'],
      [{ text: 'Aerospace & Defense Engineer', bold: true, color: TEAL }, 'Searches hi-rel, rad-hard, trusted-US-supply, phased-array terms; triggered by reliability, ITAR/trusted-supply, or a long-program requirement.', 'Commercial — hi-rel & US supply'],
      [{ text: 'Obsolescence / Sustaining Mgr', bold: true, color: GREEN }, 'Searches urgently for “drop-in replacement / obsolete IC / DMSMS / last-time-buy” the moment a critical part goes EOL. Highest-intent, most underserved entry point.', 'Commercial — urgent replacement'],
    ], { headerColor: CORE_BLUE }),
  spacer(80),
  calloutBox('The buying-situation lens (from the June 16 intake)',
    'The same people show up as three buying situations: the Integration-Driven Engineering Lead (consolidate discrete → ASIC), the Obsolescence/EOL Continuity Owner (keep a long-life product shipping), and the Turnkey-Seeking Founder/VP Eng (no in-house IC team). Map every piece of content to a persona AND a situation — it sharpens the CTA (feasibility review vs. obsolete-part replacement vs. start-your-project qualifier).', TEAL),
];

// ============================================================ 05 KEYWORDS PER PERSONA
function kwTable(persona) {
  return buildTable(
    [{ label: 'Keyword / phrase', weight: 40 }, { label: 'Type', weight: 12 }, { label: 'Intent', weight: 16 }, { label: 'Priority', weight: 14 }, { label: 'Target page / asset', weight: 18 }],
    persona.rows.map(r => [{ text: r[0], bold: false }, r[1], r[2], { text: r[3], bold: r[3].includes('Flagship') || r[3].includes('High') }, r[4]]),
    { headerColor: persona.color, fontSize: 18, headerSize: 18 });
}
const section5 = [
  ...sectionHeader('Keyword & Long-Tail Analysis per Persona', CORE_BLUE, '05'),
  p('The keyword strategy, organised by persona, then a cross-cutting capability/decision set every persona shares. “Priority” reflects intent, business fit, and the competitor gap — not search volume. Volume and difficulty are pulled per term in SEMrush at onboarding; for context, the named competitor set (System-to-ASIC, EnSilica, Mindcet) targets many of the “(gap)” terms directly in titles and nav while CSS does not yet.', { spaceAfter: 120 }),
  subHeader('Persona 1 — Industrial / IoT Design Engineer', CORE_BLUE),
  pRuns([{ text: 'AEO target query: ', bold: true, color: DARK_CHARCOAL }, { text: KW.ind.aeo, italics: true }], { spaceAfter: 90 }),
  kwTable(KW.ind),
  subHeader('Persona 2 — Medical-Device R&D Lead', CORE_ORANGE),
  pRuns([{ text: 'AEO target query: ', bold: true, color: DARK_CHARCOAL }, { text: KW.med.aeo, italics: true }], { spaceAfter: 90 }),
  kwTable(KW.med),
  subHeader('Persona 3 — Aerospace & Defense / Hi-Rel Engineer', TEAL),
  pRuns([{ text: 'AEO target query: ', bold: true, color: DARK_CHARCOAL }, { text: KW.aero.aeo, italics: true }], { spaceAfter: 90 }),
  kwTable(KW.aero),
  subHeader('Persona 4 — Obsolescence / Sustaining-Engineering Manager', GREEN),
  pRuns([{ text: 'AEO target query: ', bold: true, color: DARK_CHARCOAL }, { text: KW.obs.aeo, italics: true }], { spaceAfter: 90 }),
  kwTable(KW.obs),
  subHeader('Cross-cutting — capability & decision-stage (all personas)', DARK_CHARCOAL),
  p('Core commercial terms CSS must defend, plus the decision-stage informational terms that earn AI citations and feed the top of funnel.', { spaceAfter: 90 }),
  buildTable(
    [{ label: 'Keyword / phrase', weight: 40 }, { label: 'Type', weight: 12 }, { label: 'Intent', weight: 16 }, { label: 'Priority', weight: 14 }, { label: 'Target page / asset', weight: 18 }],
    KW_CROSS.map(r => [{ text: r[0] }, r[1], r[2], { text: r[3], bold: r[3].includes('Core') || r[3].includes('High') }, r[4]]),
    { headerColor: DARK_CHARCOAL, fontSize: 18, headerSize: 18 }),
  spacer(80),
  calloutBox('The 15 gap terms are the priority backlog',
    'The May 27 audit named 15 terms competitors target and CSS does not: analog ASIC design, analog IC design services, ASIC design services, ASIC manufacturing services, ASIC packaging, ASIC test/production test, ASIC process nodes, ASIC design flow, industrial/medical/aerospace ASIC design, power ASIC design, high-voltage ASIC design, rad-hard ASIC design, and quick-silicon/prototype ASIC. Every one is placed above on a persona or the cross-cutting set, and every one has a page and a calendar slot. Closing them is the fastest ranked-keyword growth available.', CORE_ORANGE),
];

// ============================================================ 06 AEO / GEO
const section6 = [
  ...sectionHeader('AEO / GEO — Winning AI-Search Citations', CORE_BLUE, '06'),
  p('More of these buyers now ask ChatGPT, Perplexity, or Gemini for a partner before they ever run a Google search. On non-geo queries those engines surface global competitors (ICsense, Cactus Semiconductor, Comport Data, ASIC North) and can omit CSS entirely without entity and FAQ content. Winning the citation is as important as ranking.', { spaceAfter: 130 }),
  subHeader('What earns the citation'),
  bulletRuns([{ text: 'Entity clarity. ', bold: true, color: DARK_CHARCOAL }, { text: 'Organization schema, a tight About/entity page, and consistent NAP so engines know exactly who CSS is and what it does.' }]),
  bulletRuns([{ text: 'Direct-answer FAQ blocks. ', bold: true, color: DARK_CHARCOAL }, { text: 'FAQ schema on every capability and vertical page answering the literal question a buyer asks an assistant (“who designs ultra-low-power medical ASICs in the US?”).' }]),
  bulletRuns([{ text: 'Decision-stage content. ', bold: true, color: DARK_CHARCOAL }, { text: 'ASIC vs FPGA, NRE cost, when-to-go-custom — the explainer pages assistants quote. These are the most citable assets in the calendar.' }]),
  bulletRuns([{ text: 'Comparison & glossary depth. ', bold: true, color: DARK_CHARCOAL }, { text: 'Definitional and comparison pages (already a CSS strength via the glossary) are heavily reused by answer engines — expand them.' }]),
  subHeader('Baseline & track'),
  p('Week 1: run the persona AEO queries above on ChatGPT, Perplexity, and Gemini and record whether CSS is named and against whom. Re-run monthly; “first AI citation” and “share of AI answers vs. the named competitor set” are headline KPIs (Section 11). This is the part almost no competitor measures.', { spaceAfter: 120 }),
  calloutBox('Practical rule',
    'Every new page ships with: one clear H1 matching the target query, a 2–3 sentence direct answer near the top, an FAQ block with schema, and an internal link to the relevant pillar. That single template serves classic SEO and AEO at once.', TEAL),
];

// ============================================================ 07 SITE ARCHITECTURE / ON-PAGE
const section7 = [
  ...sectionHeader('Site Architecture & On-Page Plan', CORE_BLUE, '07'),
  p('The content engine needs somewhere to live. CSS has strong capability pages but thin vertical and educational coverage, and orphaned portfolio pages. The target architecture is hub-and-spoke: four market pillars, a capability layer, an obsolescence hub, a decision-stage blog cluster, and a hardened conversion path.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Build', weight: 26 }, { label: 'Pages / assets', weight: 50 }, { label: 'Status', weight: 24 }],
    [
      [{ text: 'Market pillars (4)', bold: true, color: CORE_BLUE }, 'Industrial, Medical, Aerospace & Defense, Consumer — each a deep pillar with FAQ schema, linking down to capability + portfolio + case study.', 'Expand /market-expertise'],
      [{ text: 'Capability layer', bold: true, color: CORE_BLUE }, 'Analog ASIC, Mixed-Signal, High-Voltage, Power/PMIC, Ultra-Low-Power, Sensor/MEMS interface, Data converters, RF/wireless — dedicated, keyword-targeted pages.', 'Several NEW (gap terms)'],
      [{ text: 'Turnkey / process', bold: true, color: CORE_BLUE }, 'ASIC Design Flow, Packaging, Production Test, Process-Node selection — name verification, packaging, testing, lifecycle on /turnkey-asics.', 'Expand + NEW pages'],
      [{ text: 'Obsolescence hub', bold: true, color: GREEN }, 'Expand the existing obsolete-IC article into a hub: drop-in replacement, DMSMS, last-time-buy, form-fit-function, reverse-engineering.', 'Expand existing post'],
      [{ text: 'Decision-stage blog', bold: true, color: CORE_ORANGE }, 'ASIC vs FPGA, NRE cost, when-to-go-custom, buyer’s checklist — the citable top-of-funnel cluster.', 'NEW cluster (Section 8)'],
      [{ text: 'Proof', bold: true, color: CORE_BLUE }, 'Outcome-based case studies from named customers (with permission); portfolio hub surfacing the 23 product pages.', 'NEW + relink'],
      [{ text: 'Conversion path', bold: true, color: CRITICAL }, 'High-intent CTA, gated lead magnet, short qualifier form, direct email + response window on /contact.', 'NEW (highest ROI)'],
    ], { headerColor: CORE_BLUE, fontSize: 18 }),
  spacer(80),
  calloutBox('On-page template (every page)',
    'Single clear H1 on the target query · a direct 2–3 sentence answer up top · keyword-aligned title + meta (Yoast) · FAQ block + schema · 3–5 internal links (up to pillar, across to siblings) · a primary CTA. Consistency here is what makes the long-tail compound.', TEAL),
];

// ============================================================ 08 52-WEEK CALENDAR
function calTable(rows, qColor) {
  return buildTable(
    [{ label: 'Wk', weight: 6, align: AlignmentType.CENTER }, { label: 'Working title', weight: 48 }, { label: 'Persona', weight: 10 }, { label: 'Primary keyword', weight: 24 }, { label: 'Stage', weight: 12 }],
    rows.map(r => [{ text: String(r[0]), align: AlignmentType.CENTER, bold: true, color: qColor }, r[2], r[3], { text: r[4], italics: true }, r[5]]),
    { headerColor: qColor, fontSize: 17, headerSize: 18 });
}
const section8 = [
  ...sectionHeader('The 52-Week Content Calendar', CORE_BLUE, '08'),
  p('A full year of weekly content, engineered to close the keyword gaps, cover all four personas, and move buyers through the funnel — front-loaded with the most citable decision-stage education. Cadence is one post per week; pair each with a short LinkedIn post and a glossary cross-link. Working titles are starting points for the copy team; the full grid (with secondary keywords, content type, and target page) is in the CSV.', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Quarter', weight: 16 }, { label: 'Theme', weight: 56 }, { label: 'Emphasis', weight: 28 }],
    [
      [{ text: 'Q1 · Wks 1–13', bold: true, color: CORE_BLUE }, 'Foundation — decision-stage education + core capability', 'AEO citability, defend core terms'],
      [{ text: 'Q2 · Wks 14–26', bold: true, color: CORE_ORANGE }, 'Verticals — Medical & Industrial depth', 'Medical + Industrial gap terms'],
      [{ text: 'Q3 · Wks 27–39', bold: true, color: TEAL }, 'Aerospace/Defense, Obsolescence, RF & turnkey ops', 'Hi-rel + obsolescence wedge'],
      [{ text: 'Q4 · Wks 40–52', bold: true, color: GREEN }, 'Authority, comparisons, glossary & pillar refresh', 'Consolidate + link equity'],
    ], { headerColor: DARK_CHARCOAL }),
  p('Persona key: ' + PERSONA_LEGEND + '. Stage: TOFU (awareness/education) · MOFU (evaluation) · BOFU (proof/decision). Four application case studies (Wks 26, 39, 50 + the obsolescence story) anchor proof.', { italics: true, size: 18, spaceBefore: 100, spaceAfter: 60 }),
  subHeader('Q1 — Foundation (Weeks 1–13)', CORE_BLUE),
  calTable(CAL.slice(0, 13), CORE_BLUE),
  subHeader('Q2 — Verticals: Medical & Industrial (Weeks 14–26)', CORE_ORANGE),
  calTable(CAL.slice(13, 26), CORE_ORANGE),
  subHeader('Q3 — A&D, Obsolescence, RF & Ops (Weeks 27–39)', TEAL),
  calTable(CAL.slice(26, 39), TEAL),
  subHeader('Q4 — Authority, Comparisons & Refresh (Weeks 40–52)', GREEN),
  calTable(CAL.slice(39, 52), GREEN),
];

// ============================================================ 09 LINK BUILDING
const section9 = [
  ...sectionHeader('Link-Building & Digital PR Plan', CORE_BLUE, '09'),
  p('CSS starts from a real base — ~4.0K backlinks across 423 referring domains — so the job is relevance and authority, not raw volume. The biggest lever is more topically-relevant referring domains from the semiconductor, ASIC, embedded, and engineering world, earned by linkable technical assets.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Channel', weight: 26 }, { label: 'Targets / approach', weight: 54 }, { label: 'Priority', weight: 20 }],
    [
      [{ text: 'Industry directories', bold: true }, 'AnySilicon supplier listing, GlobalSpec supplier profile, semiconductor/ASIC marketplaces, Design-Reuse, EE directories — verify and enrich the listing + NAP.', 'High (quick win)'],
      [{ text: 'Ecosystem / partner links', bold: true }, 'Foundry and assembly partner ecosystem pages, IP and EDA partner directories, “ASIC design partner” lists.', 'Medium'],
      [{ text: 'Linkable assets', bold: true }, 'The design-flow, packaging, test, process-node, glossary, and obsolescence resource pages — built to attract technical citations naturally.', 'High'],
      [{ text: 'Guest / contributed content', bold: true }, 'Custom ASIC design, mixed-signal IC development, obsolete-IC replacement, industrial/medical applications — EE trade outlets and engineering communities.', 'Medium'],
      [{ text: 'Case studies / PR', bold: true }, 'Customer-approved success stories (Curtis, Itron, Transoma where permitted); trade-show announcements (Sensors Converge, MD&M West, GOMACTech) as news hooks.', 'Medium'],
      [{ text: 'Digital hygiene', bold: true }, 'Keep PDF/asset URLs from distracting crawl focus from core service pages; disavow only if a clearly toxic pattern appears.', 'Low (monitor)'],
    ], { headerColor: CORE_BLUE, fontSize: 18 }),
  spacer(80),
  p('Backlink profile to monitor monthly: total links, referring domains, RD topical relevance, and new/lost domains. The May 2026 baseline (4.0K / 423 RD / 230 IPs, 68% text / 32% image) is month-zero.', { spaceAfter: 120 }),
];

// ============================================================ 10 COMPETITOR BENCHMARK
const section10 = [
  ...sectionHeader('Competitor SEO Benchmark', CORE_BLUE, '10'),
  p('Two competitor sets matter: the direct service-overlap houses we benchmark keyword gaps against, and the names AI answer engines surface on non-geo queries. Watch both in SEMrush position tracking.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Competitor', weight: 28 }, { label: 'How they out-target CSS', weight: 50 }, { label: 'Set', weight: 22 }],
    [
      [{ text: 'System to ASIC', bold: true, color: CORE_BLUE }, 'Names ASIC Design Flow, Mixed-Signal, Process Nodes, Test, Packaging, and Medical/Industrial/Aerospace ASIC directly in titles & nav.', 'Service-overlap'],
      [{ text: 'EnSilica', bold: true, color: CORE_BLUE }, 'Strong “turnkey ASIC” framing — specification, design, verification, manufacturing, packaging, testing — as explicit page targets.', 'Service-overlap'],
      [{ text: 'Mindcet', bold: true, color: CORE_BLUE }, 'Owns High-Voltage, Rad-Hard, and Power ASIC language; “concept to production-tested ASICs.”', 'Service-overlap'],
      [{ text: 'ICsense', bold: true, color: CORE_ORANGE }, 'Surfaces in AI answers for analog/mixed-signal ASIC design services; deep published content + tape-out track record.', 'AI-answer'],
      [{ text: 'ASIC North', bold: true, color: CORE_ORANGE }, 'US analog/mixed-signal peer cited by assistants; strong capability content.', 'AI-answer / peer'],
      [{ text: 'Cactus Semiconductor · Comport Data', bold: true, color: CORE_ORANGE }, 'Appear in AI answers for medical / custom mixed-signal ASIC queries; entity + content presence.', 'AI-answer'],
    ], { headerColor: CORE_BLUE, fontSize: 18 }),
  spacer(80),
  calloutBox('The takeaway',
    'CSS’s differentiators (in-house test floor, 100% tape-out record, obsolescence niche, US-domiciled) are real and largely absent from competitors — but invisible online. Beating this set is less about outspending and more about naming the gap terms on dedicated pages and out-publishing them on decision-stage and obsolescence content.', TEAL),
];

// ============================================================ 11 KPIs / REPORTING
const section11 = [
  ...sectionHeader('KPIs, Reporting & Cadence', CORE_BLUE, '11'),
  p('Measure what matters for a niche, high-consideration B2B account — lead quality and authority, not vanity traffic. Attribution lags content by months, so track leading indicators too.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'KPI', weight: 30 }, { label: 'What / why', weight: 46 }, { label: 'Cadence', weight: 24 }],
    [
      [{ text: 'Ranked keywords (gap set)', bold: true }, 'Count + average position for the 15 gap terms and the per-persona set. The clearest growth signal.', 'Weekly / monthly'],
      [{ text: 'AI-citation share', bold: true }, 'Whether CSS is named in ChatGPT/Perplexity/Gemini answers for the persona AEO queries, vs. the named competitors.', 'Monthly'],
      [{ text: 'RFQ / quote-form leads', bold: true }, 'Submissions on the new feasibility/quote CTA + lead-magnet downloads — the real business outcome.', 'Weekly'],
      [{ text: 'Indexed / published pages', bold: true }, 'New capability/vertical pages live + indexed; blog cadence held (1/wk).', 'Weekly'],
      [{ text: 'Organic + assisted conversions', bold: true }, 'GA4 organic sessions to key pages and assisted conversions (long sales cycle — assists matter).', 'Monthly'],
      [{ text: 'Referring domains (relevant)', bold: true }, 'Net new topically-relevant RDs vs. the 423 baseline.', 'Monthly'],
      [{ text: 'Technical health', bold: true }, 'Site-audit score, CWV on core pages, crawl errors trending down.', 'Monthly'],
    ], { headerColor: CORE_BLUE, fontSize: 18 }),
  subHeader('Reporting rhythm'),
  bulletRuns([{ text: 'Weekly: ', bold: true, color: DARK_CHARCOAL }, { text: 'the contracted weekly SEO report (DOCX) + status-review deck — GA4 + GSC + site health + work done + next week (the existing deliverable, now mapped to this plan).' }]),
  bulletRuns([{ text: 'Monthly: ', bold: true, color: DARK_CHARCOAL }, { text: 'a strategy review — rankings on the gap/persona set, AI-citation check, content shipped vs. calendar, lead/RFQ trend, and the next month’s priorities.' }]),
  bulletRuns([{ text: 'Quarterly: ', bold: true, color: DARK_CHARCOAL }, { text: 'recalibrate the calendar and keyword priorities against what is actually ranking and converting.' }]),
];

// ============================================================ 12 TEAM / WEEK-1
const section12 = [
  ...sectionHeader('Team, Roles & Week-1 Onboarding Checklist', CORE_BLUE, '12'),
  p('Who owns what, and the first-week tasks to stand the account up. Roles map to the SEO-OS agent functions; assign a named person to each.', { spaceAfter: 120 }),
  buildTable(
    [{ label: 'Function', weight: 26 }, { label: 'Owns', weight: 56 }, { label: 'Lead', weight: 18 }],
    [
      [{ text: 'Research (01)', bold: true }, 'Keyword/competitor/SERP research; pull SEMrush MSV/KD for the per-persona + gap set; maintain the keyword map.', 'TBD'],
      [{ text: 'Strategy (02)', bold: true }, 'Owns this plan + the 52-week calendar; monthly recalibration; persona/content mapping.', 'TBD'],
      [{ text: 'Copy (03)', bold: true }, 'Writes the weekly post + capability/vertical pages; holds the editorial cadence.', 'TBD'],
      [{ text: 'UX-Design (04)', bold: true }, 'Conversion path: high-intent CTA, lead magnet, qualifier form, portfolio hub.', 'TBD'],
      [{ text: 'Technical (05)', bold: true }, 'Schema, internal linking, URL/indexation cleanup, CWV, on-page fixes.', 'TBD'],
      [{ text: 'Measurement (09)', bold: true }, 'KPI dashboard, GA4/GSC instrumentation, weekly + monthly reporting.', 'Puneet'],
      [{ text: 'GEO / AEO (10)', bold: true }, 'AI-citation baseline + monthly tracking; FAQ/entity content; GBP verification.', 'TBD'],
    ], { headerColor: DARK_CHARCOAL, fontSize: 18 }),
  subHeader('Puneet’s standing weekly tickets (per-client norm)'),
  bulletRuns([{ text: 'Data generation ', bold: true, color: DARK_CHARCOAL }, { text: '— pull GA4 + GSC + site-health for the week.' }]),
  bulletRuns([{ text: 'Weekly report ', bold: true, color: DARK_CHARCOAL }, { text: '— build the branded DOCX + status-review deck.' }]),
  bulletRuns([{ text: 'Client communication ', bold: true, color: DARK_CHARCOAL }, { text: '— send the update and capture replies/requests.' }]),
  subHeader('Week-1 checklist'),
  bulletRuns([{ text: '1. ', bold: true, color: CORE_BLUE }, { text: 'Confirm access: WordPress, GA4, GSC, GTM, SEMrush project (Section 3). Lock month-zero baselines (Section 2).' }]),
  bulletRuns([{ text: '2. ', bold: true, color: CORE_BLUE }, { text: 'Run the AEO baseline (persona queries on ChatGPT/Perplexity/Gemini) and record citations.' }]),
  bulletRuns([{ text: '3. ', bold: true, color: CORE_BLUE }, { text: 'Pull SEMrush MSV/KD for the keyword map; finalise the keyword-priority CSV.' }]),
  bulletRuns([{ text: '4. ', bold: true, color: CORE_BLUE }, { text: 'Spec the conversion path (CTA + lead magnet + qualifier) and the schema build.' }]),
  bulletRuns([{ text: '5. ', bold: true, color: CORE_BLUE }, { text: 'Load weeks 1–4 of the calendar into the Client Portal ticket queue and start the first post.' }]),
];

// ============================================================ 13 UPSELL
const section13 = [
  ...sectionHeader('Expansion / Upsell Roadmap', CORE_BLUE, '13'),
  p('The current scope is weekly reporting only. This plan needs content production and a technical build to deliver — both are natural expansions, and they line up with the AI Growth Blueprint’s land-and-expand path. Present as the program matures, not all at once.', { spaceAfter: 130 }),
  buildTable(
    [{ label: 'Expansion', weight: 28 }, { label: 'Why now', weight: 48 }, { label: 'Maps to', weight: 24 }],
    [
      [{ text: 'Content production', bold: true, color: CORE_BLUE }, 'The 52-week calendar + capability/vertical pages need a writer/editor cadence — the engine that closes the gap terms and earns AI citations.', 'My SEO content add-on'],
      [{ text: 'AI-Search (AEO/GEO) add-on', bold: true, color: CORE_BLUE }, 'Entity/FAQ content + AI-citation tracking — the frontier traditional SEO does not cover, and the blueprint’s headline.', 'My SEO AI-Search add-on'],
      [{ text: 'Technical SEO build', bold: true, color: CORE_BLUE }, 'Schema, conversion path, internal-link architecture, CWV — one-time build that lifts every page.', 'Fixed-scope project'],
      [{ text: 'Obsolescence cross-ref tool', bold: true, color: GREEN }, 'A parametric “dead part → CSS drop-in” tool turns the highest-intent searches into leads.', 'My Dev (blueprint expansion)'],
      [{ text: 'LinkedIn ABM / paid', bold: true, color: CORE_ORANGE }, 'B2B chip buyers respond to LinkedIn ABM and high-intent paid search; low-volume but precise.', 'Paid amplification (later)'],
    ], { headerColor: CORE_BLUE, fontSize: 18 }),
  spacer(80),
  calloutBox('Sequencing',
    'Land: extend reporting into the content engine + AEO and ship the technical/conversion build. Expand: the obsolescence tool and deeper automation. Scale: paid/ABM once organic + AEO prove the lead quality. Keep each step paying for itself before the next — and model ROI on RFQ/lead quality, not traffic.', TEAL),
];

// ============================================================ ABOUT + APPENDIX
const about = [
  ...sectionHeader('About Technijian', CORE_BLUE, ''),
  p('Technijian is an AI strategy and implementation firm and full-spectrum IT services company founded in 2000 by Ravi Jain, headquartered in Irvine, California — minutes from Custom Silicon Solutions. The My SEO practice runs a multi-model SEO + AEO platform (Claude, GPT, and Gemini with SEMrush, GA4, and Perplexity) that produces and optimises authority content and tracks AI-assistant citations. This onboarding report is the operating plan for the CSS account.', { spaceAfter: 140 }),
  buildTable(
    [{ label: 'Contact', weight: 30 }, { label: 'Detail', weight: 70 }],
    [
      [{ text: 'Primary contact', bold: true }, 'Ravi Jain, Founder & CEO — rjain@technijian.com'],
      [{ text: 'Main line', bold: true }, '+1 949.379.8499'],
      [{ text: 'US headquarters', bold: true }, '18 Technology Dr., Ste 141, Irvine, CA 92618'],
      [{ text: 'Web', bold: true }, 'technijian.com · technology as a solution'],
    ], { headerColor: DARK_CHARCOAL }),
];
const appendix = [
  ...sectionHeader('Appendix — Sources & Deliverables', CORE_BLUE, ''),
  subHeader('Companion files (delivered with this report)'),
  bullet('css-52-week-content-calendar.csv — the full 52-week grid (week, suggested publish date, quarter/theme, working title, persona, content pillar, primary + secondary keyword, funnel stage, content type, target page/internal link) for the content workflow and Client Portal tickets.'),
  bullet('css-keyword-map.csv — the per-persona + cross-cutting keyword set (keyword, persona, type, intent, priority, target page) for SEMrush position tracking; pull MSV/KD per term to complete it.'),
  subHeader('Data sources'),
  bullet('SEMrush — domain overview pull (customsiliconsolutions.com, June 16 2026): 124 organic keywords, ~105 monthly organic visits, domain rank ~3.65M, 0 paid; plus the May 27 2026 backlink audit (~4.0K backlinks, 423 referring domains, 230 IPs).'),
  bullet('Google — GA4 property 397845611, Search Console (sc-domain + https), and Google Tag Manager (6083523785 / 108259178) connection status from the SEO workspace.'),
  bullet('Onboarding intake — customsiliconsolutions.com onboarding strategy report, June 16 2026 (site audit, personas, 90-day outline, content gaps).'),
  bullet('Keyword-gap & backlink follow-up — May 27 2026 (15 named gap terms; competitor set System-to-ASIC, EnSilica, Mindcet; live-site/GSC validation).'),
  bullet('AI Growth & Integration Blueprint — Custom Silicon Solutions, June 26 2026 (personas, GTM motion, capability and obsolescence positioning).'),
  bullet('Company — customsiliconsolutions.com (capabilities, markets, leadership) and LinkedIn (trade-show activity).'),
  spacer(120),
  p('Search volumes and difficulty are intentionally not asserted per keyword — they are pulled per term in SEMrush at onboarding (niche B2B terms are low-volume, high-intent). Prepared by Technijian, ' + TODAY + '.', { italics: true, size: 18, spaceAfter: 80 }),
];

// ============================================================ HEADER / FOOTER / ASSEMBLE
const docHeader = new Header({ children: [
  new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [Math.floor(CONTENT_W * 0.5), CONTENT_W - Math.floor(CONTENT_W * 0.5)], borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE } }, rows: [new TableRow({ children: [
    new TableCell({ width: { size: Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ children: [new ImageRun({ type: 'png', data: LOGO_BUF, transformation: { width: 132, height: Math.round(132 / LOGO_AR) }, altText: { title: 'Technijian', description: 'Technijian Logo', name: 'Technijian Logo' } })] })] }),
    new TableCell({ width: { size: CONTENT_W - Math.floor(CONTENT_W * 0.5), type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Custom Silicon Solutions  ·  My SEO Onboarding & Strategy', size: 16, color: BRAND_GREY, font: FONT_BODY })] })] }),
  ] })] }),
  new Paragraph({ children: [new TextRun({ text: '' })] }),
] });
const docFooter = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, children: [
  new TextRun({ text: 'Technijian', size: 16, color: BRAND_GREY, bold: true, font: FONT_BODY }),
  new TextRun({ text: '  ·  technology as a solution  ·  technijian.com  ·  +1 949.379.8499  ·  INTERNAL  ·  Page ', size: 16, color: BRAND_GREY, font: FONT_BODY }),
  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY, font: FONT_BODY }),
] })] });

const allChildren = [
  ...cover, ...methodNote, ...toc,
  ...section1, ...section2, ...section3, ...section4, ...section5,
  ...section6, ...section7, ...section8, ...section9, ...section10,
  ...section11, ...section12, ...section13,
  ...about, ...appendix,
];
const doc = new Document({
  creator: 'Technijian', title: 'Custom Silicon Solutions — My SEO Onboarding & Strategy Report', description: 'Internal My SEO onboarding playbook for Custom Silicon Solutions, prepared by Technijian.',
  features: { updateFields: true },
  styles: { default: { document: { run: { font: FONT_BODY, size: 22, color: BRAND_GREY } } }, paragraphStyles: [
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: FONT_HEAD, color: CORE_BLUE }, paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: FONT_HEAD, color: DARK_CHARCOAL }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
  ] },
  numbering: { config: [{ reference: NB, levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: PAGE_W, height: 15840 }, margin: { top: 1800, right: MARGIN, bottom: 1440, left: MARGIN } } }, headers: { default: docHeader }, footers: { default: docFooter }, children: allChildren }],
});
const outPath = path.join(__dirname, 'Custom-Silicon-Solutions-My-SEO-Onboarding-Report.docx');
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(outPath, buf); console.log('Wrote:', outPath, '(' + (buf.length / 1024).toFixed(1) + ' KB)'); }).catch(err => { console.error('Failed:', err); process.exit(1); });

// ============================================================ CSV EXPORTS (team-importable)
function csvCell(s) { s = String(s == null ? '' : s); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
// 52-week calendar CSV with suggested weekly publish dates (Mondays from 2026-07-06)
const start = new Date(Date.UTC(2026, 6, 6)); // 2026-07-06 (Mon)
const secondaryByPersona = { Ind: 'mixed-signal/sensor/PMIC long-tail', Med: 'ultra-low-power/implantable long-tail', 'A&D': 'hi-rel/rad-hard long-tail', Obs: 'DMSMS/last-time-buy long-tail', All: 'ASIC design flow / vs FPGA / NRE' };
const calHeader = ['Week', 'Suggested publish date', 'Quarter/Theme', 'Working title', 'Persona', 'Content pillar', 'Primary keyword', 'Secondary keyword theme', 'Funnel stage', 'Content type', 'Target page / internal link'];
const calLines2 = [calHeader.map(csvCell).join(',')];
for (const r of CAL) {
  const [w, q, title, persona, kw, stage, type, target] = r;
  const d = new Date(start.getTime()); d.setUTCDate(d.getUTCDate() + (w - 1) * 7);
  const pub = d.toISOString().slice(0, 10);
  const theme = q === 'Q1' ? 'Foundation' : q === 'Q2' ? 'Verticals: Medical & Industrial' : q === 'Q3' ? 'A&D / Obsolescence / Ops' : 'Authority & Refresh';
  calLines2.push([w, pub, `${q} — ${theme}`, title, persona, type, kw, secondaryByPersona[persona] || '', stage, type, target].map(csvCell).join(','));
}
fs.writeFileSync(path.join(__dirname, 'css-52-week-content-calendar.csv'), calLines2.join('\r\n'));
console.log('Wrote: css-52-week-content-calendar.csv (' + CAL.length + ' rows)');

// keyword map CSV
const kwHeader = ['Persona', 'Keyword / phrase', 'Type', 'Intent', 'Strategic priority', 'Target page / asset', 'MSV (pull in SEMrush)', 'KD (pull in SEMrush)'];
const kwLines = [kwHeader.map(csvCell).join(',')];
for (const key of ['ind', 'med', 'aero', 'obs']) {
  for (const r of KW[key].rows) kwLines.push([KW[key].name, r[0], r[1], r[2], r[3], r[4], '', ''].map(csvCell).join(','));
}
for (const r of KW_CROSS) kwLines.push(['Cross-cutting (all personas)', r[0], r[1], r[2], r[3], r[4], '', ''].map(csvCell).join(','));
fs.writeFileSync(path.join(__dirname, 'css-keyword-map.csv'), kwLines.join('\r\n'));
console.log('Wrote: css-keyword-map.csv (' + (kwLines.length - 1) + ' rows)');
