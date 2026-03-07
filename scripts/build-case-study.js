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

function sectionHeader(title) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [120, 9240],
    rows: [new TableRow({
      children: [
        new TableCell({ borders: noBorders, width: { size: 120, type: WidthType.DXA },
          shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [] })] }),
        new TableCell({ borders: noBorders, width: { size: 9240, type: WidthType.DXA },
          margins: { top: 60, bottom: 60, left: 140, right: 0 },
          children: [new Paragraph({ children: [new TextRun({ text: title, font: "Open Sans", size: 30, bold: true, color: CORE_BLUE })] })] }),
      ]
    })]
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Open Sans", size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Open Sans", color: CORE_BLUE },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 0 } },
    ]
  },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
    }]
  },
  sections: [
    // PAGE 1
    {
      properties: {
        page: { size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              spacing: { after: 80 },
              border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: CORE_BLUE, space: 8 } },
              children: [
                new ImageRun({ type: "png", data: logoData, transformation: { width: 160, height: 33 },
                  altText: { title: "Technijian", description: "Logo", name: "logo" } }),
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Table({
              width: { size: 9360, type: WidthType.DXA },
              columnWidths: [9360],
              rows: [new TableRow({
                children: [new TableCell({ borders: noBorders, width: { size: 9360, type: WidthType.DXA },
                  shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
                  margins: { top: 2, bottom: 2, left: 0, right: 0 },
                  children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [] })] })]
              })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER, spacing: { before: 60 },
              children: [
                new TextRun({ text: "Technijian | technijian.com | 949.379.8500    \u2014    Page ", size: 16, color: BRAND_GREY }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: BRAND_GREY })
              ]
            })
          ]
        })
      },
      children: [
        // CASE STUDY label in teal banner
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [9360],
          rows: [new TableRow({
            children: [new TableCell({
              borders: noBorders, width: { size: 9360, type: WidthType.DXA },
              shading: { fill: TEAL, type: ShadingType.CLEAR },
              margins: { top: 60, bottom: 60, left: 200, right: 200 },
              children: [new Paragraph({
                children: [new TextRun({ text: "CASE STUDY", font: "Open Sans", size: 20, bold: true, color: WHITE, characterSpacing: 200 })]
              })]
            })]
          })]
        }),

        // Title
        new Paragraph({ spacing: { before: 200, after: 120 },
          children: [new TextRun({ text: "[Client Name or Industry]", size: 40, bold: true, color: DARK_CHARCOAL })] }),
        new Paragraph({ spacing: { after: 300 },
          children: [new TextRun({ text: "How Technijian [achieved outcome] for [client description]", size: 24, color: BRAND_GREY, italics: true })] }),

        // Quick stats - metric callout cards
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 3120, 3120],
          rows: [
            new TableRow({
              children: ["Industry", "Company Size", "Services"].map(h =>
                new TableCell({
                  borders: noBorders, width: { size: 3120, type: WidthType.DXA },
                  shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
                  margins: { top: 60, bottom: 60, left: 100, right: 100 },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: h, bold: true, color: WHITE, size: 18 })] })]
                })
              )
            }),
            new TableRow({
              children: ["[Healthcare / Finance / etc.]", "[50-200 employees]", "[Managed IT, Cybersecurity, Cloud]"].map(t =>
                new TableCell({
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY },
                    left: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY }, right: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY } },
                  width: { size: 3120, type: WidthType.DXA },
                  shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
                  margins: { top: 60, bottom: 60, left: 100, right: 100 },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: t, size: 20, color: BRAND_GREY })] })]
                })
              )
            })
          ]
        }),

        // The Challenge
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        sectionHeader("The Challenge"),
        new Paragraph({ spacing: { before: 80, after: 160 },
          children: [new TextRun({ text: "[Describe the client\u2019s situation before engaging Technijian. What problems were they facing? What risks existed? What had they tried before? Keep this to 2-3 paragraphs. Be specific about pain points \u2014 downtime hours, compliance gaps, security incidents, or technology limitations.]", size: 22, color: BRAND_GREY, italics: true })] }),

        // The Solution
        sectionHeader("The Solution"),
        new Paragraph({ spacing: { before: 80, after: 100 },
          children: [new TextRun({ text: "[Describe what Technijian implemented. Be specific about services, technologies, and approach.]", size: 22, color: BRAND_GREY, italics: true })] }),
        ...[
          "[Specific service or technology deployed]",
          "[Second implementation detail]",
          "[Third implementation detail]",
          "[Ongoing support or monitoring arrangement]",
        ].map(item => new Paragraph({
          numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: BRAND_GREY, italics: true })]
        })),

        new Paragraph({ children: [new PageBreak()] }),

        // The Results - metric callout cards
        sectionHeader("The Results"),
        new Paragraph({ spacing: { before: 80, after: 160 },
          children: [new TextRun({ text: "[Describe measurable outcomes. Use specific numbers wherever possible.]", size: 22, color: BRAND_GREY, italics: true })] }),

        // Big metric cards
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2340, 2340, 2340, 2340],
          rows: [new TableRow({
            children: [
              { num: "99.9%", label: "Uptime", color: CORE_BLUE },
              { num: "<15m", label: "Response Time", color: TEAL },
              { num: "X%", label: "Cost Reduction", color: CORE_ORANGE },
              { num: "X%", label: "Fewer Incidents", color: CORE_BLUE },
            ].map(item =>
              new TableCell({
                borders: noBorders, width: { size: 2340, type: WidthType.DXA },
                shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 60, right: 60 },
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: item.num, font: "Open Sans", size: 44, bold: true, color: item.color })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: item.label, font: "Open Sans", size: 16, color: BRAND_GREY })] }),
                ]
              })
            )
          })]
        }),

        new Paragraph({ spacing: { before: 200 }, children: [] }),

        // Detailed results table
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 4680],
          rows: [
            new TableRow({
              children: ["Metric", "Result"].map(h =>
                new TableCell({
                  borders, width: { size: 4680, type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: WHITE, size: 22 })] })]
                })
              )
            }),
            ...([
              ["System Uptime", "[99.9%+ monthly]"],
              ["Response Time", "[< 15 min for critical issues]"],
              ["Cost Impact", "[X% reduction in IT spend]"],
              ["Security Incidents", "[X% reduction year-over-year]"],
            ]).map((row, i) => new TableRow({
              children: [
                new TableCell({
                  borders, width: { size: 4680, type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: i % 2 === 0 ? WHITE : OFF_WHITE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: row[0], bold: true, size: 22, color: DARK_CHARCOAL })] })]
                }),
                new TableCell({
                  borders, width: { size: 4680, type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: i % 2 === 0 ? WHITE : OFF_WHITE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: row[1], size: 22, color: BRAND_GREY })] })]
                })
              ]
            }))
          ]
        }),

        // Client Testimonial with orange accent bar
        new Paragraph({ spacing: { before: 300 }, children: [] }),
        sectionHeader("Client Testimonial"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),

        // Pull quote with orange left bar
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [80, 9280],
          rows: [new TableRow({
            children: [
              new TableCell({ borders: noBorders, width: { size: 80, type: WidthType.DXA },
                shading: { fill: CORE_ORANGE, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [] })] }),
              new TableCell({ borders: noBorders, width: { size: 9280, type: WidthType.DXA },
                shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
                margins: { top: 120, bottom: 120, left: 200, right: 200 },
                children: [
                  new Paragraph({ spacing: { after: 80 },
                    children: [new TextRun({ text: "\u201C[Client quote about their experience with Technijian. Keep it authentic and focused on business outcomes. 2-3 sentences.]\u201D", size: 24, italics: true, color: DARK_CHARCOAL })] }),
                  new Paragraph({
                    children: [new TextRun({ text: "\u2014 [Client Name], [Title], [Company]", size: 20, color: BRAND_GREY, bold: true })] }),
                ]
              }),
            ]
          })]
        }),

        // CTA Banner
        new Paragraph({ spacing: { before: 300 }, children: [] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [9360],
          rows: [new TableRow({
            children: [new TableCell({
              borders: noBorders, width: { size: 9360, type: WidthType.DXA },
              shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "See how Technijian can help your business.", font: "Open Sans", size: 24, bold: true, color: WHITE })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40 },
                  children: [new TextRun({ text: "rjain@technijian.com  |  949.379.8500  |  technijian.com", font: "Open Sans", size: 20, color: WHITE })] }),
              ]
            })]
          })]
        }),
      ]
    }
  ]
});

const outPath = path.join(__dirname, '..', 'assets', 'print', 'templates', 'technijian-case-study-template.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Created: ' + outPath);
});
