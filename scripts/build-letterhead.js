/**
 * Build Technijian letterhead DOCX templates for BOTH offices.
 *
 * Outputs:
 *   assets/print/templates/technijian-letterhead-usa.docx     (US HQ - Irvine, CA)
 *   assets/print/templates/technijian-letterhead-india.docx   (India Delivery Center - Panchkula)
 *   assets/print/templates/technijian-letterhead-template.docx (legacy alias = USA)
 *
 * Brand values are read from assets/brand-tokens.json so a single token edit
 * propagates to every template.
 */

const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        ImageRun, Header, Footer, AlignmentType,
        BorderStyle, WidthType, ShadingType, PageNumber, TabStopType, TabStopPosition } = require('docx');
const fs = require('fs');
const path = require('path');

// ---- Load brand tokens (single source of truth) ----------------------------
const TOKENS = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, '..', 'assets', 'brand-tokens.json'), 'utf8'));

const v = (token) => token['$value'];
const C = {
  BLUE:        v(TOKENS.color.primary.blue).replace('#',''),
  ORANGE:      v(TOKENS.color.primary.orange).replace('#',''),
  TEAL:        v(TOKENS.color.secondary.teal).replace('#',''),
  DARK:        v(TOKENS.color.neutral.dark).replace('#',''),
  GREY:        v(TOKENS.color.secondary.grey).replace('#',''),
  OFF_WHITE:   v(TOKENS.color.neutral.off_white).replace('#',''),
  WHITE:       v(TOKENS.color.neutral.white).replace('#',''),
  LIGHT_GREY:  v(TOKENS.color.neutral.light_grey).replace('#',''),
};

const logoPath = path.resolve(__dirname, '..',
  v(TOKENS.logo.full_color_small));
const logoData = fs.readFileSync(logoPath);

const COMPANY = v(TOKENS.company.name);
const TAGLINE = v(TOKENS.company.tagline);
const WEBSITE = v(TOKENS.company.website);

// ---- DOCX helpers ----------------------------------------------------------
const noBorders = {
  top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
};

const thinBlueRule = (height = 4) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  rows: [new TableRow({
    children: [new TableCell({
      borders: noBorders,
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill: C.BLUE, type: ShadingType.CLEAR },
      margins: { top: height, bottom: height, left: 0, right: 0 },
      children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [] })]
    })]
  })]
});

const thinOrangeRule = (height = 4) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  rows: [new TableRow({
    children: [new TableCell({
      borders: noBorders,
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill: C.ORANGE, type: ShadingType.CLEAR },
      margins: { top: height, bottom: height, left: 0, right: 0 },
      children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [] })]
    })]
  })]
});

// ---- Header builder --------------------------------------------------------
function buildHeader(office) {
  const officeLines = office.address_block;
  return new Header({
    children: [
      // Two-column: logo (left) + office identifier + address (right)
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4400, 4960],
        rows: [new TableRow({
          children: [
            new TableCell({
              borders: noBorders,
              width: { size: 4400, type: WidthType.DXA },
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              verticalAlign: 'center',
              children: [new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [
                  new ImageRun({
                    type: 'png', data: logoData,
                    transformation: { width: 220, height: 46 },
                    altText: { title: COMPANY, description: 'Technijian logo', name: 'logo' }
                  }),
                ]
              })]
            }),
            new TableCell({
              borders: noBorders,
              width: { size: 4960, type: WidthType.DXA },
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              verticalAlign: 'center',
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { after: 50 },
                  children: [new TextRun({
                    text: office.label_short.toUpperCase(),
                    font: 'Open Sans', size: 15, bold: true, color: C.BLUE,
                    characterSpacing: 24,
                  })]
                }),
                ...officeLines.map((line, i) => new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { after: i === officeLines.length - 1 ? 30 : 0 },
                  children: [new TextRun({
                    text: line, font: 'Open Sans', size: 16, color: C.GREY
                  })]
                })),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: office.phone, font: 'Open Sans', size: 16, color: C.GREY }),
                    new TextRun({ text: '   ', font: 'Open Sans', size: 16, color: C.LIGHT_GREY }),
                    new TextRun({ text: WEBSITE, font: 'Open Sans', size: 16, bold: true, color: C.BLUE }),
                  ]
                }),
              ]
            }),
          ]
        })]
      }),
      new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),
      thinOrangeRule(4),
    ]
  });
}

// ---- Footer builder — restrained corporate-elegant -------------------------
// Single centered line: Technijian, Inc.  ·  technology as a solution  ·  technijian.com  ·  +1 949.379.8499
// (India variant adds a small GSTIN line below)
// Page numbers ONLY on multi-page letters (not shown on single-page).
const SUBTLE_GREY = 'C9CDD2';   // separator color — between LIGHT_GREY and GREY for elegance
function buildFooter(office, otherOffice, isIndia) {
  const sep = (size = 16) => new TextRun({ text: '   ·   ', font: 'Open Sans', size: size, color: SUBTLE_GREY });

  const mainLine = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0 },
    children: [
      new TextRun({ text: COMPANY + ', Inc.', font: 'Open Sans', size: 16, bold: true, color: C.DARK }),
      sep(16),
      new TextRun({ text: TAGLINE, font: 'Open Sans', size: 16, italics: true, color: C.GREY }),
      sep(16),
      new TextRun({ text: WEBSITE, font: 'Open Sans', size: 16, bold: true, color: C.BLUE }),
      sep(16),
      new TextRun({ text: '+1 949.379.8499', font: 'Open Sans', size: 16, color: C.GREY }),
    ]
  });

  const children = [
    // Hairline rule (1px light grey, not a heavy blue bar)
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [new TableRow({
        children: [new TableCell({
          borders: noBorders,
          width: { size: 9360, type: WidthType.DXA },
          shading: { fill: C.LIGHT_GREY, type: ShadingType.CLEAR },
          margins: { top: 1, bottom: 1, left: 0, right: 0 },
          children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [] })]
        })]
      })]
    }),
    new Paragraph({ spacing: { before: 140, after: 0 }, children: [] }),
    mainLine,
  ];

  if (isIndia) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 0 },
      children: [
        new TextRun({ text: 'GSTIN ', font: 'Open Sans', size: 14, color: SUBTLE_GREY, characterSpacing: 24 }),
        new TextRun({ text: '[Panchkula entity GSTIN]', font: 'Open Sans', size: 14, color: C.GREY }),
      ]
    }));
  }

  return new Footer({ children });
}

// ---- Body builder ----------------------------------------------------------
function buildBody(office, isIndia) {
  const dateLine = isIndia ? '[Day Month Year]' : '[Month Day, Year]';
  const phoneSlug = isIndia ? '[direct phone]' : '[direct phone]';
  return [
    // Date — right-aligned, subtle
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 360, after: 360 },
      children: [new TextRun({ text: dateLine, font: 'Open Sans', size: 20, color: C.GREY })]
    }),

    // Recipient block — Dark Charcoal, single-spaced
    new Paragraph({ children: [new TextRun({ text: '[Recipient Name]',  font: 'Open Sans', size: 22, bold: true, color: C.DARK })] }),
    new Paragraph({ children: [new TextRun({ text: '[Title]',           font: 'Open Sans', size: 22, color: C.DARK })] }),
    new Paragraph({ children: [new TextRun({ text: '[Company Name]',    font: 'Open Sans', size: 22, color: C.DARK })] }),
    new Paragraph({ children: [new TextRun({ text: '[Street Address]',  font: 'Open Sans', size: 22, color: C.DARK })] }),
    new Paragraph({
      spacing: { after: 280 },
      children: [new TextRun({ text: isIndia ? '[City, State PIN, Country]' : '[City, State ZIP]', font: 'Open Sans', size: 22, color: C.DARK })]
    }),

    // Optional reference / subject line — Core Blue uppercase
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({ text: 'RE: ', font: 'Open Sans', size: 22, bold: true, color: C.BLUE }),
        new TextRun({ text: '[Subject of letter]', font: 'Open Sans', size: 22, bold: true, color: C.DARK }),
      ]
    }),

    // Salutation
    new Paragraph({
      spacing: { after: 220 },
      children: [new TextRun({ text: 'Dear [Recipient Name],', font: 'Open Sans', size: 22, color: C.DARK })]
    }),

    // Body paragraphs — Brand Grey, comfortable line height via spacing
    new Paragraph({
      spacing: { after: 200, line: 320, lineRule: 'auto' },
      children: [new TextRun({ text: '[Opening paragraph. State the purpose of the letter clearly and directly. Reference any prior conversations, proposals, or agreements so the recipient can place this letter in context immediately.]', font: 'Open Sans', size: 22, color: C.GREY })]
    }),
    new Paragraph({
      spacing: { after: 200, line: 320, lineRule: 'auto' },
      children: [new TextRun({ text: '[Body paragraph. Provide supporting details, key information, or value propositions. Keep paragraphs concise — 2 to 3 sentences. Use plain English over jargon, and lead with what the reader needs to know.]', font: 'Open Sans', size: 22, color: C.GREY })]
    }),
    new Paragraph({
      spacing: { after: 200, line: 320, lineRule: 'auto' },
      children: [new TextRun({ text: '[Closing paragraph. Summarise the key takeaway and provide a clear next step. Include a call to action or state what will happen next, by when, and who will own it.]', font: 'Open Sans', size: 22, color: C.GREY })]
    }),

    // Closing
    new Paragraph({
      spacing: { before: 120, after: 600 },
      children: [new TextRun({ text: 'Sincerely,', font: 'Open Sans', size: 22, color: C.DARK })]
    }),

    // Signature block — quiet, no loud accent bar
    new Paragraph({ children: [new TextRun({ text: '[Sender Name]', font: 'Open Sans', size: 24, bold: true, color: C.DARK })] }),
    new Paragraph({ children: [new TextRun({ text: '[Title]',       font: 'Open Sans', size: 20, color: C.BLUE, bold: true })] }),
    new Paragraph({ children: [new TextRun({ text: COMPANY + ', Inc.' + (isIndia ? '  —  India Delivery Center' : ''), font: 'Open Sans', size: 20, color: C.GREY })] }),
    new Paragraph({
      spacing: { before: 40 },
      children: [
        new TextRun({ text: '+1 949.379.8499', font: 'Open Sans', size: 20, color: C.GREY }),
        new TextRun({ text: '   ·   ', font: 'Open Sans', size: 20, color: SUBTLE_GREY }),
        new TextRun({ text: '[email@technijian.com]', font: 'Open Sans', size: 20, color: C.BLUE }),
      ]
    }),
  ];
}

// ---- Document factory ------------------------------------------------------
function buildDoc(officeKey) {
  const office = TOKENS.offices[officeKey];
  const otherKey = officeKey === 'usa' ? 'india' : 'usa';
  const isIndia = officeKey === 'india';

  // Flatten token shape (DTCG → plain object)
  const flat = (o) => Object.fromEntries(
    Object.entries(o).map(([k, v]) => [k, typeof v === 'object' && v.$value !== undefined ? v.$value : v])
  );
  const officeFlat = flat(office);
  const otherFlat  = flat(TOKENS.offices[otherKey]);

  return new Document({
    creator: COMPANY,
    title: COMPANY + ' Letterhead — ' + officeFlat.label_short,
    description: 'Brand-compliant letterhead template for ' + officeFlat.label,
    styles: {
      default: { document: { run: { font: 'Open Sans', size: 22, color: C.GREY } } },
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 }, // US Letter (works for both offices for consistency)
          margin: { top: 2200, right: 1440, bottom: 1800, left: 1440 }
        }
      },
      headers: { default: buildHeader(officeFlat) },
      footers: { default: buildFooter(officeFlat, otherFlat, isIndia) },
      children: buildBody(officeFlat, isIndia),
    }]
  });
}

// ---- Build & write outputs -------------------------------------------------
const outDir = path.join(__dirname, '..', 'assets', 'print', 'templates');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function build() {
  const targets = [
    { key: 'usa',   filename: 'technijian-letterhead-usa.docx' },
    { key: 'india', filename: 'technijian-letterhead-india.docx' },
    // Legacy alias — same content as USA — preserves existing references
    { key: 'usa',   filename: 'technijian-letterhead-template.docx' },
  ];
  for (const t of targets) {
    const doc = buildDoc(t.key);
    const buf = await Packer.toBuffer(doc);
    const out = path.join(outDir, t.filename);
    fs.writeFileSync(out, buf);
    console.log('  Wrote ' + out + ' (' + (buf.length / 1024).toFixed(1) + ' KB)');
  }
}

build().catch(err => { console.error(err); process.exit(1); });
