const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        ImageRun, Header, Footer, AlignmentType,
        BorderStyle, WidthType, ShadingType, PageNumber } = require('docx');
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

const noBorders = {
  top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }
};

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Open Sans", size: 24, color: BRAND_GREY } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [
          // Header with logo and contact info in a professional layout
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [5000, 4360],
            rows: [new TableRow({
              children: [
                new TableCell({
                  borders: noBorders,
                  width: { size: 5000, type: WidthType.DXA },
                  margins: { top: 0, bottom: 0, left: 0, right: 0 },
                  children: [new Paragraph({
                    children: [
                      new ImageRun({ type: "png", data: logoData, transformation: { width: 160, height: 33 },
                        altText: { title: "Technijian", description: "Logo", name: "logo" } }),
                    ]
                  })]
                }),
                new TableCell({
                  borders: noBorders,
                  width: { size: 4360, type: WidthType.DXA },
                  margins: { top: 0, bottom: 0, left: 0, right: 0 },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      children: [new TextRun({ text: "18 Technology Dr., Ste 141, Irvine, CA 92618", font: "Open Sans", size: 16, color: BRAND_GREY })]
                    }),
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      children: [
                        new TextRun({ text: "949.379.8500", font: "Open Sans", size: 16, color: BRAND_GREY }),
                        new TextRun({ text: "  |  ", font: "Open Sans", size: 16, color: LIGHT_GREY }),
                        new TextRun({ text: "technijian.com", font: "Open Sans", size: 16, color: CORE_BLUE }),
                      ]
                    }),
                  ]
                }),
              ]
            })]
          }),
          // Orange accent line under header
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [9360],
            rows: [new TableRow({
              children: [new TableCell({
                borders: noBorders,
                width: { size: 9360, type: WidthType.DXA },
                shading: { fill: CORE_ORANGE, type: ShadingType.CLEAR },
                margins: { top: 4, bottom: 4, left: 0, right: 0 },
                children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [] })]
              })]
            })]
          }),
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          // Blue thin line above footer
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [9360],
            rows: [new TableRow({
              children: [new TableCell({
                borders: noBorders,
                width: { size: 9360, type: WidthType.DXA },
                shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
                margins: { top: 2, bottom: 2, left: 0, right: 0 },
                children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [] })]
              })]
            })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80 },
            children: [
              new TextRun({ text: "Technijian  |  Managed IT  \u2022  Cybersecurity  \u2022  Cloud  \u2022  AI Development", font: "Open Sans", size: 16, color: BRAND_GREY }),
            ]
          }),
        ]
      })
    },
    children: [
      // Date
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 360 },
        children: [new TextRun({ text: "[Month Day, Year]", font: "Open Sans", size: 24, color: BRAND_GREY })]
      }),

      // Recipient block
      new Paragraph({ children: [new TextRun({ text: "[Recipient Name]", size: 24, bold: true, color: DARK_CHARCOAL })] }),
      new Paragraph({ children: [new TextRun({ text: "[Title]", size: 24, color: DARK_CHARCOAL })] }),
      new Paragraph({ children: [new TextRun({ text: "[Company Name]", size: 24, color: DARK_CHARCOAL })] }),
      new Paragraph({ children: [new TextRun({ text: "[Street Address]", size: 24, color: DARK_CHARCOAL })] }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun({ text: "[City, State ZIP]", size: 24, color: DARK_CHARCOAL })]
      }),

      // Salutation
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "Dear [Recipient Name],", size: 24, color: DARK_CHARCOAL })]
      }),

      // Body paragraphs
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "[Opening paragraph. State the purpose of the letter clearly and directly. Reference any prior conversations, proposals, or agreements.]", size: 24, color: BRAND_GREY })]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "[Body paragraph. Provide supporting details, key information, or value propositions. Keep paragraphs concise \u2014 2-3 sentences each.]", size: 24, color: BRAND_GREY })]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "[Closing paragraph. Summarize the key takeaway and provide a clear next step. Include a call to action or state what will happen next.]", size: 24, color: BRAND_GREY })]
      }),

      // Closing
      new Paragraph({
        spacing: { after: 600 },
        children: [new TextRun({ text: "Sincerely,", size: 24, color: DARK_CHARCOAL })]
      }),

      // Signature block with accent
      new Table({
        width: { size: 5000, type: WidthType.DXA },
        columnWidths: [80, 4920],
        rows: [new TableRow({
          children: [
            new TableCell({
              borders: noBorders,
              width: { size: 80, type: WidthType.DXA },
              shading: { fill: CORE_ORANGE, type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [] })]
            }),
            new TableCell({
              borders: noBorders,
              width: { size: 4920, type: WidthType.DXA },
              margins: { top: 40, bottom: 40, left: 120, right: 0 },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "[Sender Name]", size: 24, bold: true, color: DARK_CHARCOAL })]
                }),
                new Paragraph({
                  children: [new TextRun({ text: "[Title]", size: 22, color: CORE_BLUE })]
                }),
                new Paragraph({
                  children: [new TextRun({ text: "Technijian", size: 22, color: BRAND_GREY })]
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "[direct phone]", size: 22, color: BRAND_GREY }),
                    new TextRun({ text: "  |  ", size: 22, color: LIGHT_GREY }),
                    new TextRun({ text: "[email@technijian.com]", size: 22, color: CORE_BLUE }),
                  ]
                }),
              ]
            }),
          ]
        })]
      }),
    ]
  }]
});

const outPath = path.join(__dirname, '..', 'assets', 'print', 'templates', 'technijian-letterhead-template.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Created: ' + outPath);
});
