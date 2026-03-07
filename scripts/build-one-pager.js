const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        ImageRun, Header, Footer, AlignmentType, LevelFormat,
        HeadingLevel, BorderStyle, WidthType, ShadingType,
        PageNumber } = require('docx');
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

function sectionHeader(title) {
  return new Table({
    width: { size: 10080, type: WidthType.DXA },
    columnWidths: [100, 9980],
    rows: [new TableRow({
      children: [
        new TableCell({ borders: noBorders, width: { size: 100, type: WidthType.DXA },
          shading: { fill: CORE_BLUE, type: ShadingType.CLEAR }, children: [new Paragraph({ children: [] })] }),
        new TableCell({ borders: noBorders, width: { size: 9980, type: WidthType.DXA },
          margins: { top: 60, bottom: 60, left: 140, right: 0 },
          children: [new Paragraph({ children: [new TextRun({ text: title, font: "Open Sans", size: 28, bold: true, color: CORE_BLUE })] })] }),
      ]
    })]
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Open Sans", size: 20, color: BRAND_GREY } } },
  },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 270 } } } }]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1200, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Table({
            width: { size: 10080, type: WidthType.DXA },
            columnWidths: [5000, 5080],
            rows: [new TableRow({
              children: [
                new TableCell({ borders: noBorders, width: { size: 5000, type: WidthType.DXA },
                  children: [new Paragraph({
                    children: [new ImageRun({ type: "png", data: logoData, transformation: { width: 140, height: 29 },
                      altText: { title: "Technijian", description: "Logo", name: "logo" } })]
                  })] }),
                new TableCell({ borders: noBorders, width: { size: 5080, type: WidthType.DXA },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: "949.379.8500 | technijian.com", font: "Open Sans", size: 16, color: BRAND_GREY })] })] }),
              ]
            })]
          }),
          new Table({
            width: { size: 10080, type: WidthType.DXA },
            columnWidths: [10080],
            rows: [new TableRow({
              children: [new TableCell({ borders: noBorders, width: { size: 10080, type: WidthType.DXA },
                shading: { fill: CORE_ORANGE, type: ShadingType.CLEAR },
                margins: { top: 3, bottom: 3, left: 0, right: 0 },
                children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [] })] })]
            })]
          }),
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Table({
            width: { size: 10080, type: WidthType.DXA },
            columnWidths: [10080],
            rows: [new TableRow({
              children: [new TableCell({ borders: noBorders, width: { size: 10080, type: WidthType.DXA },
                shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
                margins: { top: 2, bottom: 2, left: 0, right: 0 },
                children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [] })] })]
            })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER, spacing: { before: 60 },
            children: [new TextRun({ text: "Technijian  |  Managed IT  \u2022  Cybersecurity  \u2022  Cloud  \u2022  AI Development", font: "Open Sans", size: 16, color: BRAND_GREY })]
          }),
        ]
      })
    },
    children: [
      // Title
      new Paragraph({ spacing: { after: 40 },
        children: [new TextRun({ text: "[Service Name]", font: "Open Sans", size: 36, bold: true, color: CORE_BLUE })] }),
      new Paragraph({ spacing: { after: 200 },
        children: [new TextRun({ text: "One-page overview of Technijian\u2019s [service] offering", font: "Open Sans", size: 22, color: BRAND_GREY })] }),

      // The Challenge
      sectionHeader("The Challenge"),
      new Paragraph({ spacing: { before: 80, after: 160 },
        children: [new TextRun({ text: "Brief description of the business challenge this service addresses. Lead with the client\u2019s pain point. What keeps IT leaders up at night? What business risks exist without this service?", size: 20, color: BRAND_GREY })] }),

      // Our Solution
      sectionHeader("Our Solution"),
      new Paragraph({ spacing: { before: 80, after: 80 },
        children: [new TextRun({ text: "Brief description of how Technijian solves this challenge.", size: 20, color: BRAND_GREY })] }),
      ...["Key capability or feature of the service", "Second key capability with specific detail",
        "Third capability that differentiates from competitors", "Fourth capability focused on business outcome",
      ].map(item => new Paragraph({
        numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 },
        children: [new TextRun({ text: item, size: 20, color: BRAND_GREY })]
      })),

      // Key Benefits cards
      new Paragraph({ spacing: { before: 160 }, children: [] }),
      sectionHeader("Key Benefits"),
      new Paragraph({ spacing: { before: 80 }, children: [] }),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [3360, 3360, 3360],
        rows: [
          new TableRow({
            children: ["Proactive Protection", "Cost Predictability", "Expert Team"].map(h =>
              new TableCell({
                borders: noBorders, width: { size: 3360, type: WidthType.DXA },
                shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, color: WHITE, size: 20 })] })]
              })
            )
          }),
          new TableRow({
            children: [
              "We monitor and prevent issues before they impact your business.",
              "Flat monthly pricing with no surprise bills or hidden fees.",
              "Your dedicated Technijians pod team knows your environment."
            ].map(t =>
              new TableCell({
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY },
                  left: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY }, right: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY } },
                width: { size: 3360, type: WidthType.DXA },
                shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: t, size: 18, color: BRAND_GREY })] })]
              })
            )
          })
        ]
      }),

      // Why Technijian
      new Paragraph({ spacing: { before: 160 }, children: [] }),
      sectionHeader("Why Technijian"),
      new Paragraph({ spacing: { before: 80 }, children: [] }),
      ...["25+ years serving SMBs and mid-market enterprises",
        "Dedicated pod model \u2014 your own team, not rotating strangers",
        "24/7 U.S. + India support included at no extra cost",
        "Cybersecurity-first approach powered by CrowdStrike",
      ].map(item => new Paragraph({
        numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 },
        children: [new TextRun({ text: item, size: 20, color: BRAND_GREY })]
      })),

      // CTA Banner
      new Paragraph({ spacing: { before: 200 }, children: [] }),
      new Table({
        width: { size: 10080, type: WidthType.DXA },
        columnWidths: [10080],
        rows: [new TableRow({
          children: [new TableCell({
            borders: noBorders, width: { size: 10080, type: WidthType.DXA },
            shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 200, right: 200 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Ready to get started?  ", font: "Open Sans", size: 22, bold: true, color: WHITE }),
                new TextRun({ text: "Contact Ravi Jain at rjain@technijian.com or call 949.379.8500", font: "Open Sans", size: 20, color: WHITE }),
              ]
            })]
          })]
        })]
      }),
    ]
  }]
});

const outPath = path.join(__dirname, '..', 'assets', 'print', 'templates', 'technijian-one-pager-template.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Created: ' + outPath);
});
