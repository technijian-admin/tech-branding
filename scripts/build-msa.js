const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        ImageRun, Header, Footer, AlignmentType, LevelFormat,
        HeadingLevel, BorderStyle, WidthType, ShadingType,
        PageNumber, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

const logoPath = path.resolve(__dirname, '..', 'assets', 'logos', 'png', 'technijian-logo-full-color-600x125.png');
const logoData = fs.readFileSync(logoPath);

const CORE_BLUE = "006DB6";
const CORE_ORANGE = "F67D4B";
const DARK_CHARCOAL = "1A1A2E";
const BRAND_GREY = "59595B";
const OFF_WHITE = "F8F9FA";
const WHITE = "FFFFFF";
const LIGHT_GREY = "E9ECEF";
const TEAL = "1EAAC8";

const noBorders = {
  top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }
};

const border = { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// Visual helper: full-width colored banner
function colorBanner(text, bgColor, textColor, fontSize) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: noBorders,
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text, font: "Open Sans", size: fontSize || 28, bold: true, color: textColor || WHITE })]
        })]
      })]
    })]
  });
}

// Visual helper: section header with colored left bar accent
function sectionHeader(number, title) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [120, 9240],
    rows: [new TableRow({
      children: [
        new TableCell({
          borders: noBorders,
          width: { size: 120, type: WidthType.DXA },
          shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [] })]
        }),
        new TableCell({
          borders: noBorders,
          width: { size: 9240, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 160, right: 0 },
          children: [new Paragraph({
            children: [new TextRun({ text: `${number}. ${title.toUpperCase()}`, font: "Open Sans", size: 28, bold: true, color: CORE_BLUE })]
          })]
        }),
      ]
    })]
  });
}

function subsectionHeading(number, title) {
  return new Paragraph({
    spacing: { before: 240, after: 100 },
    children: [new TextRun({ text: `${number} ${title}`, font: "Open Sans", size: 24, bold: true, color: DARK_CHARCOAL })]
  });
}

function bodyText(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: "Open Sans", size: 22, color: BRAND_GREY })]
  });
}

// Visual helper: key terms callout box
function calloutBox(title, items) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [new TableCell({
          borders: noBorders,
          width: { size: 9360, type: WidthType.DXA },
          shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 160, right: 160 },
          children: [new Paragraph({
            children: [new TextRun({ text: title, font: "Open Sans", size: 22, bold: true, color: WHITE })]
          })]
        })]
      }),
      ...items.map((item, i) => new TableRow({
        children: [new TableCell({
          borders: { top: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY }, right: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY } },
          width: { size: 9360, type: WidthType.DXA },
          shading: { fill: i % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR },
          margins: { top: 60, bottom: 60, left: 160, right: 160 },
          children: [new Paragraph({
            children: [
              new TextRun({ text: item.term, font: "Open Sans", size: 20, bold: true, color: DARK_CHARCOAL }),
              new TextRun({ text: ` \u2014 ${item.def}`, font: "Open Sans", size: 20, color: BRAND_GREY }),
            ]
          })]
        })]
      }))
    ]
  });
}

// Visual helper: signature block with colored header
function signatureBlock(label, name) {
  return new TableCell({
    borders: noBorders,
    width: { size: 4680, type: WidthType.DXA },
    margins: { top: 0, bottom: 80, left: 0, right: 120 },
    children: [
      new Paragraph({
        spacing: { after: 0 },
        children: [] // spacer
      }),
      // Colored label bar
      new Table({
        width: { size: 4560, type: WidthType.DXA },
        columnWidths: [4560],
        rows: [new TableRow({
          children: [new TableCell({
            borders: noBorders,
            width: { size: 4560, type: WidthType.DXA },
            shading: { fill: DARK_CHARCOAL, type: ShadingType.CLEAR },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
            children: [new Paragraph({
              children: [new TextRun({ text: label, font: "Open Sans", size: 20, bold: true, color: WHITE })]
            })]
          })]
        })]
      }),
      // Signature line
      new Paragraph({ spacing: { before: 400, after: 40 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: DARK_CHARCOAL, space: 4 } },
        children: [new TextRun({ text: " ", size: 22 })] }),
      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Signature", size: 18, italics: true, color: BRAND_GREY })] }),
      new Paragraph({ spacing: { before: 200, after: 40 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY, space: 4 } },
        children: [new TextRun({ text: " ", size: 22 })] }),
      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Printed Name", size: 18, italics: true, color: BRAND_GREY })] }),
      new Paragraph({ spacing: { before: 200, after: 40 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY, space: 4 } },
        children: [new TextRun({ text: " ", size: 22 })] }),
      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Title", size: 18, italics: true, color: BRAND_GREY })] }),
      new Paragraph({ spacing: { before: 200, after: 40 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY, space: 4 } },
        children: [new TextRun({ text: " ", size: 22 })] }),
      new Paragraph({ children: [new TextRun({ text: "Date", size: 18, italics: true, color: BRAND_GREY })] }),
    ]
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Open Sans", size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Open Sans", color: CORE_BLUE },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
    ]
  },
  numbering: {
    config: [
      { reference: "alpha",
        levels: [{ level: 0, format: LevelFormat.LOWER_LETTER, text: "(%1)", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    // ========== COVER PAGE ==========
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        // Top accent bar
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [9360],
          rows: [new TableRow({
            children: [new TableCell({
              borders: noBorders,
              width: { size: 9360, type: WidthType.DXA },
              shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
              margins: { top: 20, bottom: 20, left: 0, right: 0 },
              children: [new Paragraph({ children: [] })]
            })]
          })]
        }),

        new Paragraph({ spacing: { before: 1800 }, children: [] }),

        // Centered logo
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({ type: "png", data: logoData, transformation: { width: 280, height: 58 },
              altText: { title: "Technijian", description: "Logo", name: "logo" } }),
          ]
        }),

        // Orange divider
        new Paragraph({ spacing: { before: 300 }, alignment: AlignmentType.CENTER, children: [] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3280, 2800, 3280],
          rows: [new TableRow({
            children: [
              new TableCell({ borders: noBorders, width: { size: 3280, type: WidthType.DXA }, children: [new Paragraph({ children: [] })] }),
              new TableCell({
                borders: noBorders, width: { size: 2800, type: WidthType.DXA },
                children: [new Paragraph({
                  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_ORANGE, space: 0 } },
                  children: []
                })]
              }),
              new TableCell({ borders: noBorders, width: { size: 3280, type: WidthType.DXA }, children: [new Paragraph({ children: [] })] }),
            ]
          })]
        }),

        // Title
        new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Master Services Agreement", font: "Open Sans", size: 52, bold: true, color: DARK_CHARCOAL })] }),

        // Parties
        new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Between", font: "Open Sans", size: 24, color: BRAND_GREY })] }),

        // Party names in styled boxes
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4380, 600, 4380],
          rows: [new TableRow({
            children: [
              new TableCell({
                borders: noBorders,
                width: { size: 4380, type: WidthType.DXA },
                shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
                margins: { top: 120, bottom: 120, left: 160, right: 160 },
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Technijian", font: "Open Sans", size: 28, bold: true, color: CORE_BLUE })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Provider", font: "Open Sans", size: 18, color: BRAND_GREY })] }),
                ]
              }),
              new TableCell({
                borders: noBorders,
                width: { size: 600, type: WidthType.DXA },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 },
                  children: [new TextRun({ text: "&", font: "Open Sans", size: 28, color: CORE_ORANGE })] })]
              }),
              new TableCell({
                borders: noBorders,
                width: { size: 4380, type: WidthType.DXA },
                shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
                margins: { top: 120, bottom: 120, left: 160, right: 160 },
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "[Client Name]", font: "Open Sans", size: 28, bold: true, color: DARK_CHARCOAL })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Client", font: "Open Sans", size: 18, color: BRAND_GREY })] }),
                ]
              }),
            ]
          })]
        }),

        // Effective date
        new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Effective Date: [Month Day, Year]", font: "Open Sans", size: 22, color: BRAND_GREY })] }),

        // Bottom accent bar + confidential notice
        new Paragraph({ spacing: { before: 800 }, children: [] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [9360],
          rows: [new TableRow({
            children: [new TableCell({
              borders: noBorders,
              width: { size: 9360, type: WidthType.DXA },
              shading: { fill: CORE_ORANGE, type: ShadingType.CLEAR },
              margins: { top: 20, bottom: 20, left: 0, right: 0 },
              children: [new Paragraph({ children: [] })]
            })]
          })]
        }),
        new Paragraph({ spacing: { before: 120 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "CONFIDENTIAL \u2014 For authorized use only", font: "Open Sans", size: 18, italics: true, color: BRAND_GREY })] }),
      ]
    },

    // ========== AGREEMENT BODY ==========
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            spacing: { after: 60 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: CORE_BLUE, space: 6 } },
            children: [
              new ImageRun({ type: "png", data: logoData, transformation: { width: 140, height: 29 },
                altText: { title: "Technijian", description: "Logo", name: "logo" } }),
              new TextRun({ text: "\tMaster Services Agreement", font: "Open Sans", size: 16, color: BRAND_GREY, italics: true }),
            ]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY, space: 6 } },
            children: [
              new TextRun({ text: "Technijian | 18 Technology Dr., Ste 141, Irvine, CA 92618 | 949.379.8500  \u2022  Page ", font: "Open Sans", size: 16, color: BRAND_GREY }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Open Sans", size: 16, color: BRAND_GREY }),
            ]
          })]
        })
      },
      children: [
        bodyText("This Master Services Agreement (\u201CAgreement\u201D) is entered into as of [Effective Date] (\u201CEffective Date\u201D) by and between Technijian, a California corporation with offices at 18 Technology Dr., Ste 141, Irvine, CA 92618 (\u201CProvider\u201D), and [Client Legal Name], a [State] [entity type] with offices at [Client Address] (\u201CClient\u201D)."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),

        // 1. Definitions - with callout box
        sectionHeader("1", "Definitions"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        calloutBox("Key Definitions", [
          { term: "Confidential Information", def: "Any non-public information disclosed by either party, designated as confidential or that a reasonable person would understand to be confidential." },
          { term: "Services", def: "The managed IT services, consulting, and related services described in one or more Statements of Work executed under this Agreement." },
          { term: "Statement of Work (SOW)", def: "A document executed by both parties that describes specific Services, deliverables, timelines, and fees." },
        ]),

        // 2. Scope of Services
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        sectionHeader("2", "Scope of Services"),
        subsectionHeading("2.1", "General"),
        bodyText("Provider will perform the Services described in each SOW executed under this Agreement. Each SOW is incorporated by reference and subject to the terms of this Agreement."),
        subsectionHeading("2.2", "Changes"),
        bodyText("Changes to the scope of any SOW must be documented in a written change order signed by both parties. Provider reserves the right to adjust fees for material scope changes."),

        // 3. Term and Renewal
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        sectionHeader("3", "Term and Renewal"),
        subsectionHeading("3.1", "Initial Term"),
        bodyText("This Agreement commences on the Effective Date and continues for a period of [12/24/36] months (\u201CInitial Term\u201D)."),
        subsectionHeading("3.2", "Renewal"),
        bodyText("This Agreement will automatically renew for successive [12]-month periods unless either party provides written notice of non-renewal at least [60] days prior to the end of the then-current term."),

        // 4. Fees and Payment - with visual table
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        sectionHeader("4", "Fees and Payment"),
        subsectionHeading("4.1", "Fees"),
        bodyText("Client will pay the fees specified in each SOW. Unless otherwise stated, fees are invoiced monthly in advance."),
        subsectionHeading("4.2", "Payment Terms"),

        // Payment terms visual summary
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 3120, 3120],
          rows: [
            new TableRow({
              children: ["Payment Due", "Late Interest", "Tax Responsibility"].map(h =>
                new TableCell({
                  borders: noBorders,
                  width: { size: 3120, type: WidthType.DXA },
                  shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: h, font: "Open Sans", size: 18, bold: true, color: WHITE })] })]
                })
              )
            }),
            new TableRow({
              children: [
                { num: "Net 30", desc: "From invoice date" },
                { num: "1.5%", desc: "Per month on overdue" },
                { num: "Client", desc: "All applicable taxes" },
              ].map(item =>
                new TableCell({
                  borders: noBorders,
                  width: { size: 3120, type: WidthType.DXA },
                  shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: item.num, font: "Open Sans", size: 28, bold: true, color: CORE_BLUE })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: item.desc, font: "Open Sans", size: 16, color: BRAND_GREY })] }),
                  ]
                })
              )
            }),
          ]
        }),

        new Paragraph({ spacing: { before: 120 }, children: [] }),
        bodyText("Invoices are due Net 30 from the date of invoice. Late payments bear interest at 1.5% per month or the maximum rate permitted by law, whichever is less. Fees do not include taxes. Client is responsible for all applicable sales, use, and other taxes, excluding taxes based on Provider\u2019s income."),

        // 5. Service Levels
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        sectionHeader("5", "Service Levels"),
        bodyText("Provider will use commercially reasonable efforts to meet the service levels defined in the applicable SOW or SLA exhibit. Service credits, if any, are the Client\u2019s sole remedy for failure to meet service levels."),

        // 6. Client Responsibilities
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        sectionHeader("6", "Client Responsibilities"),
        bodyText("Client will:"),
        ...["Provide timely access to systems, facilities, and personnel as reasonably required",
            "Designate a primary point of contact for service requests and communications",
            "Maintain accurate and current documentation of its IT environment",
            "Promptly notify Provider of any changes that may affect the Services"
        ].map(item => new Paragraph({
          numbering: { reference: "alpha", level: 0 },
          spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: BRAND_GREY })]
        })),

        // 7. Confidentiality
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        sectionHeader("7", "Confidentiality"),
        bodyText("Each party agrees to hold the other party\u2019s Confidential Information in strict confidence and not to disclose it to any third party except as necessary to perform its obligations under this Agreement. This obligation survives termination for a period of [3] years."),

        // 8. Intellectual Property
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        sectionHeader("8", "Intellectual Property"),
        subsectionHeading("8.1", "Work Product"),
        bodyText("All deliverables created by Provider specifically for Client under a SOW (\u201CWork Product\u201D) are owned by Client upon full payment. Provider retains ownership of all pre-existing intellectual property, tools, and methodologies."),
        subsectionHeading("8.2", "License"),
        bodyText("Provider grants Client a non-exclusive, perpetual license to use any Provider pre-existing IP incorporated into the Work Product, solely in connection with Client\u2019s use of the Work Product."),

        // 9. Limitation of Liability
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        sectionHeader("9", "Limitation of Liability"),
        // Visual callout for important clause
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [9360],
          rows: [new TableRow({
            children: [new TableCell({
              borders: { top: { style: BorderStyle.SINGLE, size: 2, color: CORE_ORANGE }, bottom: { style: BorderStyle.SINGLE, size: 2, color: CORE_ORANGE }, left: { style: BorderStyle.SINGLE, size: 6, color: CORE_ORANGE }, right: { style: BorderStyle.SINGLE, size: 2, color: CORE_ORANGE } },
              width: { size: 9360, type: WidthType.DXA },
              shading: { fill: "FEF3EE", type: ShadingType.CLEAR },
              margins: { top: 120, bottom: 120, left: 200, right: 200 },
              children: [new Paragraph({
                children: [new TextRun({ text: "EXCEPT FOR BREACHES OF CONFIDENTIALITY OR INDEMNIFICATION OBLIGATIONS, NEITHER PARTY\u2019S TOTAL LIABILITY UNDER THIS AGREEMENT WILL EXCEED THE FEES PAID BY CLIENT IN THE [12] MONTHS PRECEDING THE CLAIM. NEITHER PARTY WILL BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.", font: "Open Sans", size: 20, color: DARK_CHARCOAL })]
              })]
            })]
          })]
        }),

        // 10. Indemnification
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        sectionHeader("10", "Indemnification"),
        bodyText("Each party will indemnify, defend, and hold harmless the other party from and against any third-party claims arising from: (a) the indemnifying party\u2019s breach of this Agreement, or (b) the indemnifying party\u2019s negligence or willful misconduct."),

        // 11. Termination
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        sectionHeader("11", "Termination"),

        // Termination summary cards
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 3120, 3120],
          rows: [
            new TableRow({
              children: [
                { title: "For Cause", detail: "[30] days written notice if material breach remains uncured" },
                { title: "For Convenience", detail: "[90] days written notice for any reason" },
                { title: "Transition", detail: "[30] days transition assistance at standard rates" },
              ].map(item =>
                new TableCell({
                  borders: { top: { style: BorderStyle.SINGLE, size: 2, color: TEAL }, bottom: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY }, left: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY }, right: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY } },
                  width: { size: 3120, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 120, right: 120 },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: item.title, font: "Open Sans", size: 20, bold: true, color: TEAL })] }),
                    new Paragraph({ spacing: { before: 60 },
                      children: [new TextRun({ text: item.detail, font: "Open Sans", size: 18, color: BRAND_GREY })] }),
                  ]
                })
              )
            }),
          ]
        }),

        new Paragraph({ spacing: { before: 120 }, children: [] }),
        bodyText("Upon termination, Client will pay all fees for Services rendered through the termination date."),

        // 12. Dispute Resolution
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        sectionHeader("12", "Dispute Resolution"),
        bodyText("This Agreement is governed by the laws of the State of California. The parties will attempt to resolve disputes through good-faith negotiation. If unresolved after [30] days, disputes will be submitted to binding arbitration in Orange County, California."),

        // 13. General Provisions
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        sectionHeader("13", "General Provisions"),
        bodyText("This Agreement constitutes the entire agreement between the parties regarding its subject matter. Amendments must be in writing and signed by both parties. Neither party may assign this Agreement without the other\u2019s written consent. Failure to enforce any provision is not a waiver of that provision."),

        // 14. Signatures
        new Paragraph({ children: [new PageBreak()] }),
        sectionHeader("14", "Signatures"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        bodyText("IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),

        // Two-column signature layout
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 4680],
          rows: [
            new TableRow({
              children: [
                signatureBlock("PROVIDER: Technijian", "Technijian"),
                signatureBlock("CLIENT: [Client Name]", "[Client Name]"),
              ]
            })
          ]
        }),

        // CTA Banner
        new Paragraph({ spacing: { before: 400 }, children: [] }),
        colorBanner("Questions? Contact us at 949.379.8500 or rjain@technijian.com", CORE_BLUE, WHITE, 22),
      ]
    }
  ]
});

const outPath = path.join(__dirname, '..', 'assets', 'print', 'templates', 'technijian-msa-template.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Created: ' + outPath);
});
