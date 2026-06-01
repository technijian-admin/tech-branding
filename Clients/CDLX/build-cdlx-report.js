// CardLogix (CDLX) — Hardware-Backed Certificate Authority on Cloud HSM
// AWS CloudHSM vs. Microsoft Azure Cloud HSM — Cost Analysis & Implementation Guide
// Technijian-branded DOCX report builder. Reads brand-tokens.json for brand values.
// Pattern adapted from Clients/AAVA/build-aava-report.js (TALY/VAF/SCF/ORX/MWAR/RKE lineage).

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
const PASS          = strip(tokens.color.status.pass.$value);
const GOLD          = 'C9922A';

const FONT_HEAD = 'Open Sans';
const FONT_BODY = 'Open Sans';

const LOGO_PATH = path.join(__dirname, '..', '..', tokens.logo.full_color_small.$value);
const LOGO_BUF  = fs.readFileSync(LOGO_PATH);

const TODAY = '2026-05-29';
const CLIENT = 'CardLogix';

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

function sectionHeader(text, color = CORE_BLUE, num = '') {
  const label = num ? `${num}  ${text}` : text;
  const headingPara = new Paragraph({
    heading: HeadingLevel.HEADING_1,
    keepNext: true,
    spacing: { before: 480, after: 120, line: 240 },
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

// A bullet that leads with a bold lead-in phrase, then regular body text.
function leadBullet(lead, body, opts = {}) {
  return new Paragraph({
    numbering: { reference: NUM_BULLETS, level: 0 },
    spacing: { before: 40, after: 80, line: 300 },
    children: [
      new TextRun({ text: lead, size: 22, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD }),
      new TextRun({ text: body, size: 22, color: BRAND_GREY, font: FONT_BODY }),
    ],
  });
}

// Manually-numbered steps — bulletproof restart per list (avoids docx auto-numbering shared state).
function numberedSteps(items) {
  return items.map((t, i) => new Paragraph({
    spacing: { before: 30, after: 70, line: 300 },
    indent: { left: 520, hanging: 520 },
    children: [
      new TextRun({ text: `${i + 1}.`, size: 22, bold: true, color: CORE_BLUE, font: FONT_HEAD }),
      new TextRun({ text: '\t', size: 22, font: FONT_BODY }),
      new TextRun({ text: t, size: 22, color: BRAND_GREY, font: FONT_BODY }),
    ],
  }));
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
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: number, size: 40, bold: true, color, font: FONT_HEAD })] }),
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
      const fill = cellObj.fill || (zebra && ri % 2 === 1 ? OFF_WHITE : WHITE);
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
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Managed PKI on Cloud HSM', size: 16, color: BRAND_GREY, font: FONT_BODY })] })],
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
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'Hardware-Backed Certificate Authority', size: 48, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'on Cloud HSM', size: 48, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'AWS CloudHSM vs. Microsoft Azure Cloud HSM', size: 30, color: CORE_BLUE, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Cost Analysis & Implementation Guide for a Managed-PKI Offering', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(160),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared for CardLogix', size: 24, bold: true, color: DARK_CHARCOAL, font: FONT_HEAD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'CardLogix (reseller)  ·  Technijian (implementation & managed support)', size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Prepared by Technijian  |  ' + TODAY, size: 22, color: BRAND_GREY, font: FONT_BODY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Document version 1.0  ·  Pricing current as of May 2026', size: 20, italics: true, color: BRAND_GREY, font: FONT_BODY })] }),
  spacer(520),
  colorBanner(CORE_ORANGE, 160),
  spacer(120),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONFIDENTIAL — Prepared for CardLogix. All figures are list-price estimates and must be validated against live provider pricing.', size: 18, color: BRAND_GREY, italics: true, font: FONT_BODY })] }),
  pageBreak(),
);

// ---------- TOC ----------
docChildren.push(
  new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }),
  pageBreak(),
);

// ---------- 01 EXECUTIVE SUMMARY ----------
docChildren.push(
  ...sectionHeader('Executive Summary', CORE_BLUE, '01'),
  spacer(200),
  kpiRow([
    { number: '~$2,300', label: 'AWS CloudHSM — HA production / month', color: CORE_BLUE },
    { number: '~$3,800', label: 'Azure Cloud HSM — comparable / month', color: CORE_ORANGE },
    { number: 'FIPS 140-3', label: 'Level 3 validated on both platforms', color: TEAL },
    { number: 'Zero', label: 'provider access to key material', color: PASS },
  ]),
  spacer(300),
  p('This document evaluates two cloud-based Hardware Security Module (HSM) services — AWS CloudHSM and Microsoft Azure Cloud HSM — as the cryptographic foundation for a managed Certificate Authority (CA) offering. The intended commercial model is that CardLogix resells the service alongside its smart card products, and Technijian implements and provides ongoing managed support.'),
  p('The underlying need is straightforward: customers use CardLogix smart cards and tokens as certificate-based authenticators (functionally similar to a YubiKey) for Windows logon, VPN, document signing, and multi-factor authentication. Those credentials are issued by a Microsoft Active Directory Certificate Services (AD CS) CA. The security of the entire system depends on protecting the CA’s signing key. Today that key commonly lives in software on a Windows server; if that server is breached, an attacker can copy the key and forge certificates for any user — a total compromise. Storing the CA signing key in an HSM removes that risk: the key is generated inside tamper-resistant hardware and can never be extracted.'),
  p('Both AWS and Azure cloud HSM services are appropriate for this purpose. Each provides single-tenant, FIPS 140-3 Level 3 validated HSMs, full customer control of keys, and native support for AD CS through a Windows Key Storage Provider (KSP). They differ primarily on cost, on the surrounding cloud ecosystem, and on operational details.'),
  spacer(100),
  calloutBox(
    'Headline Recommendation',
    [
      'AWS CloudHSM is the recommended primary platform on cost and fit: roughly $2,300/month for a production high-availability deployment, with mature, well-documented AD CS integration.',
      'Azure Cloud HSM is the recommended option when the end customer is already an Azure / Microsoft-centric environment; it is equally capable but materially more expensive (roughly $3,800/month for a comparable deployment).',
      'In both cases the CA is best located on a cloud virtual machine adjacent to the HSM, with a private network link back to the customer’s on-premises Active Directory for enrolment and certificate distribution.',
    ],
    CORE_ORANGE
  ),
);

// ---------- 02 BACKGROUND ----------
docChildren.push(
  ...sectionHeader('Background: The Problem Being Solved', CORE_BLUE, '02'),
  spacer(100),
  p('A certificate-based smart card stores a private key and a digital certificate. The private key never leaves the card — which is why a stolen certificate (the public half) is harmless on its own. The components that must be protected are the private keys, and there are two of them that matter:'),
  spacer(60),
  leadBullet('The cardholder’s private key. ', 'Generated on the card itself and marked non-exportable. This is already handled correctly in the current design — a server breach cannot expose a key that was never on the server.'),
  leadBullet('The CA’s signing key. ', 'The key the CA uses to sign every certificate it issues. This is the crown jewel. If it is stored in software on the CA server and that server is breached, the attacker can forge certificates for anyone in the organisation.'),
  spacer(80),
  p('Moving the CA signing key into an HSM closes that gap. The HSM generates the key internally; the CA server can ask the HSM to sign, but can never read the key out. A compromised server can be rebuilt; the signing key remains sealed. This is Microsoft’s own recommended practice for protecting a CA key.'),
  p('A cloud HSM provides this protection as a managed service — no physical appliance to buy, rack, or maintain, with provider-managed availability and backup. The trade-off is that the CA must reach the HSM over a network connection, which shapes the architecture described below.'),
  spacer(120),
  calloutBox(
    'Why This Matters Commercially',
    [
      'The smart card is only as trustworthy as the CA that signs its certificates. A software-held CA key is the single point of total compromise in an otherwise hardware-rooted system.',
      'Moving the CA key into an HSM turns "trust our cards" into "trust the hardware that signs them" — a stronger, auditable claim CardLogix can sell, and one Technijian operates.',
    ],
    TEAL
  ),
);

// ---------- 03 SOLUTION OVERVIEW & SCOPE ----------
docChildren.push(
  ...sectionHeader('Solution Overview & Scope', CORE_BLUE, '03'),
  spacer(100),
  p('Both candidate services were assessed against the requirement that they serve as the AD CS CA key store through a Windows CNG Key Storage Provider. A third option, Google Cloud HSM, was evaluated and excluded: Google’s Windows CNG provider is documented for code signing rather than the AD CS CA role, and Google’s intended path for running a CA is its own managed Certificate Authority Service, which would replace AD CS rather than protect it. AWS and Azure both support the AD CS CA role natively, and are therefore the two options carried forward.'),
  spacer(140),
  subHeader('Common Reference Architecture'),
  p('Regardless of provider, the recommended design is the same:'),
  spacer(60),
  leadBullet('An offline Root CA ', 'whose key is held offline (air-gapped or in a separate offline HSM) and used only to sign the issuing CA. This limits blast radius — if the online CA is ever compromised, the root can revoke it and the trust chain is rebuilt.'),
  leadBullet('An online Issuing CA ', 'running on a Windows Server virtual machine in the cloud, with its signing key generated in and stored on the cloud HSM via the provider’s KSP.'),
  leadBullet('A high-availability HSM configuration ', 'so a single hardware or zone failure does not stop certificate issuance.'),
  leadBullet('A private network link ', '(VPN or dedicated circuit) between the cloud environment and the customer’s on-premises Active Directory, so domain enrolment, CRL/OCSP publication, and smart card issuance work seamlessly.'),
  leadBullet('CardLogix smart cards ', 'enrolled through the Windows minidriver, with each cardholder key generated on the card and the resulting certificate signed by the issuing CA.'),
  spacer(80),
  p('Because the CA signing key is currently in software, the migration approach is to build a fresh CA with a new key generated inside the HSM — not to import the existing key, which must be treated as potentially already exposed — then re-issue cards and retire the old CA.'),
);

// ---------- 04 AWS CLOUDHSM ----------
docChildren.push(
  ...sectionHeader('AWS CloudHSM', CORE_ORANGE, '04'),
  spacer(100),
  subHeader('4.1  Platform Summary'),
  buildTable(
    [{ label: 'Attribute', weight: 2.2 }, { label: 'AWS CloudHSM', weight: 6 }],
    [
      ['Tenancy', 'Single-tenant, customer-owned HSMs running inside your own Virtual Private Cloud (VPC)'],
      ['Validation', 'FIPS 140-3 Level 3 (current hsm2m.medium instance type, CMVP Cert. #4703)'],
      ['AD CS support', 'Native. Windows client includes a CNG/KSP provider; CA key is generated and stored on the cluster'],
      ['High availability', 'Cluster of 2+ HSMs across Availability Zones; client load-balances and fails over automatically'],
      ['Backup', 'Automatic, encrypted cluster backups managed by AWS; supports restore to a new cluster'],
      ['Key control', 'Customer holds crypto-officer and crypto-user credentials; AWS has no access to key material'],
    ],
  ),
  spacer(200),
  subHeader('4.2  Implementation Steps'),
  p('The following is the implementation outline for the issuing CA on AWS CloudHSM. Technijian would perform these steps.'),
  spacer(60),
  ...numberedSteps([
    'Create (or use an existing) VPC with private subnets in at least two Availability Zones.',
    'Create a CloudHSM cluster in FIPS mode and add two HSMs, one per Availability Zone, for high availability.',
    'Initialise the cluster: generate and sign the cluster certificate signing request, install the cluster certificate, and configure the first crypto officer (CO).',
    'Launch a Windows Server EC2 instance in the VPC to host the issuing CA.',
    'Install the AWS CloudHSM Client (the SDK that provides the CNG and KSP providers) on the Windows server and point it at the cluster.',
    'Create a crypto user (CU) on the HSM that the CA will use to own and operate its signing key.',
    'Register the AWS CloudHSM Key Storage Provider on the Windows server.',
    'Add the AD CS role. During configuration, select the AWS CloudHSM KSP so the CA private key is generated inside the HSM. Configure this server as the Subordinate (issuing) CA beneath the offline root.',
    'Configure the CA: validity periods, CRL/OCSP distribution points (CDP/AIA), and certificate templates such as Smartcard Logon (with a hardware KSP and non-exportable keys, UPN in the Subject Alternative Name).',
    'Establish connectivity to the customer’s on-premises network using AWS Site-to-Site VPN or AWS Direct Connect so domain enrolment and CRL retrieval function.',
    'Confirm automatic cluster backup is enabled and document the restore procedure and crypto-officer custody.',
    'Enrol CardLogix smart cards through the minidriver — keys generated on the card, certificates signed by the issuing CA.',
  ]),
  spacer(200),
  subHeader('4.3  Cost Breakdown (illustrative, list price)'),
  p('Assumes a production high-availability deployment running 24/7 in a US region. CloudHSM is billed per HSM-hour with no upfront cost.'),
  spacer(60),
  buildTable(
    [
      { label: 'Component', weight: 3 },
      { label: 'Basis', weight: 4 },
      { label: 'Est. monthly (USD)', weight: 2, align: AlignmentType.RIGHT },
    ],
    [
      ['CloudHSM — HSM #1', 'hsm2m.medium @ ~$1.45/hr × 730 hrs', { text: '$1,060', align: AlignmentType.RIGHT }],
      ['CloudHSM — HSM #2 (HA)', 'Second HSM for high availability', { text: '$1,060', align: AlignmentType.RIGHT }],
      ['CA virtual machine', 'Windows Server EC2 (e.g. t3.large)', { text: '$100', align: AlignmentType.RIGHT }],
      ['Networking', 'Site-to-Site VPN connection + modest data transfer', { text: '$45', align: AlignmentType.RIGHT }],
      ['Storage', 'EBS volume for CA database and logs', { text: '$25', align: AlignmentType.RIGHT }],
      [{ text: 'Subtotal (infrastructure)', bold: true }, '', { text: '~$2,290 / month', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }],
      [{ text: 'Annualised', bold: true }, '', { text: '~$27,500 / year', bold: true, color: CORE_BLUE, align: AlignmentType.RIGHT }],
    ],
  ),
  spacer(120),
  p('Excludes: AWS support plan (Business support is billed as the greater of ~$100/month or a percentage of spend), applicable taxes, and Technijian’s managed-service fee. The single largest cost driver is the HSM pair; a non-HA single-HSM configuration roughly halves the HSM cost but is not recommended for production.', { size: 20, italics: true }),
);

// ---------- 05 AZURE CLOUD HSM ----------
docChildren.push(
  ...sectionHeader('Microsoft Azure Cloud HSM', CORE_ORANGE, '05'),
  spacer(100),
  subHeader('5.1  Platform Summary'),
  buildTable(
    [{ label: 'Attribute', weight: 2.2 }, { label: 'Azure Cloud HSM', weight: 6 }],
    [
      ['Tenancy', 'Single-tenant, customer-owned HSM cluster; customer holds full administrative authority'],
      ['Validation', 'FIPS 140-3 Level 3 validated'],
      ['AD CS support', 'Native. Lists AD CS and CA private-key protection as supported applications via CNG/KSP'],
      ['High availability', 'Highly available managed cluster; HA topology and node count confirmed at provisioning'],
      ['Backup', 'HSM backup and key export under wrap with M-of-N custodians per Azure Cloud HSM procedures'],
      ['Key control', 'Fully managed service; customer retains administrative and cryptographic control of keys'],
      ['Note', 'Azure Cloud HSM is the strategic successor to the older Azure Dedicated HSM (Thales Luna 7) offering'],
    ],
  ),
  spacer(200),
  subHeader('5.2  Implementation Steps'),
  p('Implementation parallels the AWS flow; the differences are in the Azure-specific provisioning and client tooling.'),
  spacer(60),
  ...numberedSteps([
    'Provision an Azure Cloud HSM resource (Standard B1) in the target region. This deploys a single-tenant HSM cluster under your administration.',
    'Complete HSM onboarding: establish the security officer credentials and partition, and initialise per the Azure Cloud HSM onboarding procedure.',
    'Create an Azure Virtual Network (VNet) and deploy a Windows Server VM to host the issuing CA, with private connectivity to the HSM.',
    'Install the Azure Cloud HSM client SDK and CNG/KSP provider on the VM and configure it to reach the HSM cluster.',
    'Create the crypto user/role on the HSM for the CA’s signing key.',
    'Add the AD CS role. During configuration, select the Azure Cloud HSM KSP so the CA private key is generated inside the HSM. Configure as the Subordinate (issuing) CA beneath the offline root.',
    'Configure CA settings, CDP/AIA endpoints, and certificate templates (Smartcard Logon, hardware KSP, non-exportable, UPN in SAN).',
    'Connect to the customer’s on-premises network via an Azure VPN Gateway or ExpressRoute for domain enrolment and CRL publication.',
    'Configure backup and disaster recovery per Azure Cloud HSM: HSM backup and wrapped key export with custodian key shares.',
    'Enrol CardLogix smart cards through the minidriver — keys generated on the card, certificates signed by the issuing CA.',
  ]),
  spacer(200),
  subHeader('5.3  Cost Breakdown (illustrative, list price)'),
  p('Assumes a production deployment running 24/7 in a US region. Azure Cloud HSM is billed per hour for the deployed cluster.'),
  spacer(60),
  buildTable(
    [
      { label: 'Component', weight: 3 },
      { label: 'Basis', weight: 4 },
      { label: 'Est. monthly (USD)', weight: 2, align: AlignmentType.RIGHT },
    ],
    [
      ['Azure Cloud HSM', 'Standard B1 @ ~$4.80/hr × 730 hrs', { text: '$3,500', align: AlignmentType.RIGHT }],
      ['CA virtual machine', 'Windows Server VM (e.g. D2s_v5)', { text: '$140', align: AlignmentType.RIGHT }],
      ['Networking', 'VPN Gateway (VpnGw1) + data transfer', { text: '$140', align: AlignmentType.RIGHT }],
      ['Storage', 'Managed disk for CA database and logs', { text: '$20', align: AlignmentType.RIGHT }],
      [{ text: 'Subtotal (infrastructure)', bold: true }, '', { text: '~$3,800 / month', bold: true, color: CORE_ORANGE, align: AlignmentType.RIGHT }],
      [{ text: 'Annualised', bold: true }, '', { text: '~$45,600 / year', bold: true, color: CORE_ORANGE, align: AlignmentType.RIGHT }],
    ],
  ),
  spacer(120),
  p('Excludes: Azure support plan, taxes, and Technijian’s managed-service fee. Confirm the exact HSM HA topology and whether the Standard B1 rate covers the required node count, as this drives the dominant line item. ExpressRoute, if used instead of VPN, increases the networking cost.', { size: 20, italics: true }),
);

// ---------- 06 SIDE-BY-SIDE COMPARISON ----------
docChildren.push(
  ...sectionHeader('Side-by-Side Comparison', CORE_BLUE, '06'),
  spacer(100),
  buildTable(
    [
      { label: 'Dimension', weight: 2.6 },
      { label: 'AWS CloudHSM', weight: 3.2 },
      { label: 'Azure Cloud HSM', weight: 3.2 },
    ],
    [
      ['FIPS validation', '140-3 Level 3', '140-3 Level 3'],
      ['Tenancy', 'Single-tenant in your VPC', 'Single-tenant, customer-administered'],
      ['AD CS / KSP support', 'Native, mature, well documented', 'Native, documented'],
      ['HA model', '2+ HSMs across AZs', 'Managed HA cluster'],
      ['Est. infra cost / month', { text: '~$2,300', bold: true, color: PASS }, { text: '~$3,800', bold: true, color: CORE_ORANGE }],
      ['Est. infra cost / year', { text: '~$27,500', bold: true, color: PASS }, { text: '~$45,600', bold: true, color: CORE_ORANGE }],
      ['Best-fit customer', 'Cost-sensitive; AWS-neutral or AWS-based', 'Microsoft / Azure-centric environments'],
      ['Setup complexity', 'Moderate', 'Moderate'],
    ],
  ),
  spacer(160),
  p('Both platforms meet the security bar identically (single-tenant, FIPS 140-3 Level 3, non-extractable keys, no provider access). The practical decision is cost versus ecosystem alignment: AWS is roughly 35–40% cheaper at list price, while Azure is the natural fit for customers already standardised on Microsoft cloud services and billing.'),
  spacer(120),
  calloutBox(
    'The Decision in One Line',
    [
      'Security is a tie — both are single-tenant, FIPS 140-3 Level 3, with non-extractable keys and zero provider access.',
      'Default to AWS on cost (≈35–40% cheaper at list price); choose Azure when the end customer is already Microsoft/Azure-centric and wants one cloud and one bill.',
    ],
    CORE_BLUE
  ),
);

// ---------- 07 COMMERCIAL MODEL ----------
docChildren.push(
  ...sectionHeader('Commercial Model: Reseller & Managed Support', TEAL, '07'),
  spacer(100),
  p('The proposed structure has CardLogix as the reseller (bundling the service with its smart card hardware and selling to the end customer) and Technijian as the implementation and ongoing support partner. Both clouds support partner resale, which lets the offering be sold as a single managed package rather than the customer holding a direct cloud account.'),
  spacer(140),
  subHeader('Resale Mechanics'),
  leadBullet('Azure: ', 'the Microsoft Cloud Solution Provider (CSP) program lets a partner resell Azure consumption, own the billing relationship, and set margin. Technijian can act as the CSP partner of record, with CardLogix as the customer-facing reseller.'),
  leadBullet('AWS: ', 'resale is available through the AWS Partner Network (Solution Provider Program / distribution) or via AWS Marketplace, similarly allowing a partner to package and re-bill cloud usage.'),
  leadBullet('Cloud margins on raw consumption ', 'are typically modest and partner-negotiated. The substantial and durable margin for this offering is the managed-service wrap that Technijian provides on top of the infrastructure.'),
  spacer(140),
  subHeader('Suggested Packaging'),
  p('A clean way to present this to end customers is a one-time setup fee plus a recurring monthly managed-PKI subscription that bundles the cloud infrastructure and Technijian’s support. Illustrative tiering:'),
  spacer(60),
  buildTable(
    [
      { label: 'Element', weight: 2.6 },
      { label: 'What It Covers', weight: 4.2 },
      { label: 'Pricing Approach', weight: 2.6 },
    ],
    [
      ['One-time onboarding', 'Architecture, HSM provisioning, CA build, root-key ceremony, initial card issuance', 'Fixed project fee'],
      ['Managed-PKI subscription', 'Cloud infrastructure pass-through + 24/7 monitoring, backup verification, patching, renewals', 'Monthly per-CA fee with margin over cost'],
      ['Per-card / per-credential', 'Issuance and lifecycle of each smart card credential', 'Per-card fee (bundled with CardLogix hardware)'],
      ['Incident / change requests', 'Revocation events, re-issuance, template changes, audits', 'Included allotment + hourly overage'],
    ],
  ),
  spacer(140),
  p('Because the infrastructure cost is known and stable (Sections 4.3 / 5.3), Technijian can price the subscription with a predictable margin and absorb minor usage variance.'),
);

// ---------- 08 ONGOING OPERATIONAL RESPONSIBILITIES ----------
docChildren.push(
  ...sectionHeader('Ongoing Operational Responsibilities (Technijian)', CORE_BLUE, '08'),
  spacer(100),
  p('A managed CA is not a set-and-forget service. The recurring responsibilities that justify the support fee and protect the customer are:'),
  spacer(60),
  leadBullet('Backup and disaster recovery: ', 'verify HSM/cluster backups, and maintain the M-of-N key custodian shares so the CA can be recovered to a new HSM if hardware fails.'),
  leadBullet('Key custodian ceremony: ', 'conduct and document the root-key and custodian ceremony at build time, with defined custodians and secure storage of shares.'),
  leadBullet('Monitoring and alerting: ', 'HSM health, CA service availability, certificate issuance failures, and connectivity to on-premises Active Directory.'),
  leadBullet('Certificate lifecycle: ', 'CRL/OCSP publication and freshness, certificate renewals, and prompt revocation of lost or compromised cards.'),
  leadBullet('Patching and hardening: ', 'Windows Server and CA host patching, client SDK/KSP updates, and review of FIPS certificate validity (certificates have published validity windows and occasionally move to historical status).'),
  leadBullet('Audit and reporting: ', 'issuance logs, tamper-evident HSM audit logs, and periodic access review.'),
  spacer(120),
  calloutBox(
    'This Is Where the Durable Margin Lives',
    [
      'The cloud infrastructure is a stable, pass-through cost. The recurring value CardLogix sells and Technijian delivers is the operational wrap above it — the backups verified, the keys recoverable, the certificates fresh, and the audit trail intact.',
      'It is also what protects the end customer: a CA without disciplined custody and lifecycle management is a liability, not an asset.',
    ],
    TEAL
  ),
);

// ---------- 09 RISKS, CAVEATS & ITEMS TO VERIFY ----------
docChildren.push(
  ...sectionHeader('Risks, Caveats & Items to Verify', CORE_ORANGE, '09'),
  spacer(100),
  leadBullet('Pricing is list-price and subject to change. ', 'Validate current per-hour HSM rates, VM and networking costs, and any partner/CSP discounts on the provider pricing pages before quoting.'),
  leadBullet('Connectivity dependency: ', 'the CA reaches the HSM over the network for every signing operation. The private link (VPN/Direct Connect/ExpressRoute) is a hard dependency — size it for availability and low latency, and plan for link failure.'),
  leadBullet('CA location: ', 'going cloud-HSM effectively means hosting the CA in the cloud next to the HSM. If the customer mandates an on-premises CA, an on-premises HSM (e.g. a dedicated CA-grade appliance) is the alternative and should be priced separately.'),
  leadBullet('Region and HA topology: ', 'confirm HSM availability in the chosen region and the exact node count required for the providers’ HA configuration, as this drives the dominant cost line.'),
  leadBullet('FIPS validity: ', 'confirm the current validated HSM model/certificate for each provider at time of sale, particularly if the customer has a strict FIPS 140-3 requirement.'),
  leadBullet('Migration: ', 'do not import the existing software CA key. Generate a new key inside the HSM and re-issue, treating the prior key as potentially exposed.'),
  leadBullet('Google Cloud HSM was excluded ', 'for the AD CS CA-key-store use case (its CNG provider targets code signing; its CA path replaces AD CS). Revisit only if the customer is open to a Google-managed CA instead of AD CS.'),
);

// ---------- 10 RECOMMENDATION & NEXT STEPS ----------
docChildren.push(
  ...sectionHeader('Recommendation & Next Steps', DARK_CHARCOAL, '10'),
  spacer(100),
  p('Lead with AWS CloudHSM as the standard offering on cost and maturity, and position Azure Cloud HSM as the option for Microsoft/Azure-aligned customers. Both deliver identical security guarantees for the CA signing key; the differentiator is cost and ecosystem fit, not strength.'),
  spacer(120),
  subHeader('Recommended Next Steps'),
  ...numberedSteps([
    'Confirm with the first target customer whether the CA may be hosted in the cloud (required for cloud HSM) or must remain on-premises.',
    'Select the provider based on the customer’s existing cloud footprint (default AWS unless Azure-centric).',
    'Validate current pricing and any CSP/partner discounts, and finalise the managed-PKI subscription price with Technijian’s margin.',
    'Run a pilot: build the offline root, the HSM-backed issuing CA, and issue a small batch of CardLogix cards before production rollout.',
    'Define the support SLA, backup/DR runbook, and key custodian ceremony as part of the onboarding package.',
  ]),
  spacer(200),
  new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
      borders: noBorders,
      margins: { top: 300, bottom: 300, left: 400, right: 400 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Ready to put a hardware-rooted CA behind every CardLogix card?', size: 26, bold: true, color: WHITE, font: FONT_HEAD })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Contact Ravi Jain, Technijian  |  RJain@technijian.com  |  949.379.8500', size: 22, color: WHITE, font: FONT_BODY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'technijian.com  |  Irvine, CA', size: 20, color: WHITE, font: FONT_BODY })] }),
      ],
    })]})],
  }),
  spacer(160),
  p('Prepared as a planning and evaluation document. All cost figures are list-price estimates as of May 2026 and must be validated against current provider pricing prior to any customer quotation.', { italics: true, size: 20 }),
);

// ---------- 11 ABOUT TECHNIJIAN ----------
docChildren.push(
  ...sectionHeader('About Technijian', BRAND_GREY, '11'),
  spacer(100),
  p('Technijian is an AI-native managed services and technology firm headquartered in Irvine, California, serving small and mid-sized businesses since 2000. We design, build, and operate secure infrastructure — including identity, PKI, and HSM-backed cryptographic services — with security and compliance built in, not bolted on.'),
  spacer(140),
  buildTable(
    [{ label: 'Service', weight: 2 }, { label: 'Role in a Managed-PKI Offering', weight: 5 }],
    [
      ['My Security', 'HSM provisioning, CA architecture, key custodian ceremonies, and the hardening and access governance behind the signing key'],
      ['My IT', '24/7 monitoring, patching, backup verification, and lifecycle operations for the CA host and connectivity'],
      ['My Cloud', 'AWS and Azure deployment, CSP/Partner billing, and the private-link networking between cloud and on-premises AD'],
      ['My Compliance', 'Audit logging, evidence, and access review supporting the customer’s compliance posture for certificate issuance'],
    ],
  ),
  spacer(200),
  buildTable(
    [{ label: 'Contact', weight: 2 }, { label: 'Detail', weight: 4 }],
    [
      ['Account Executive', 'Ravi Jain — RJain@technijian.com'],
      ['Office', '18 Technology Dr., Suite 141, Irvine, CA 92618'],
      ['Phone', '(949) 379-8500'],
      ['Web', 'technijian.com'],
    ],
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
        paragraph: { spacing: { before: 480, after: 120 }, outlineLevel: 0 } },
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

const OUT_PATH = path.join(__dirname, 'CardLogix-Managed-PKI-CloudHSM-Analysis.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT_PATH, buf);
  console.log(`\nDOCX written: ${OUT_PATH}`);
  console.log(`   Size: ${(buf.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
