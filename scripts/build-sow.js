const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        ImageRun, AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
        PageNumber, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');
const h = require('./brand-helpers');

const logoPath = path.resolve(__dirname, '..', 'assets', 'logos', 'png', 'technijian-logo-full-color-600x125.png');
const logoData = fs.readFileSync(logoPath);

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Open Sans", size: 22, color: h.BRAND_GREY } } },
  },
  numbering: {
    config: [
      { reference: "alpha", levels: [{ level: 0, format: LevelFormat.LOWER_LETTER, text: "(%1)", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    // Cover Page
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: h.coverPage(logoData, "Statement of Work", "SOW-[Number] | [Project Name]", "Effective Date: [Month Day, Year]") },

    // Body
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 } } },
      headers: { default: h.brandedHeader(logoData) },
      footers: { default: h.brandedFooter() },
      children: [
        h.bodyText("This Statement of Work (\u201CSOW\u201D) is entered into pursuant to the Master Services Agreement dated [MSA Date] between Technijian (\u201CProvider\u201D) and [Client Name] (\u201CClient\u201D)."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("1", "Project Overview"),
        h.bodyText("[2-3 paragraph description of the engagement. What is the business need? What will Technijian deliver? What is the expected outcome?]"),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("2", "Scope of Work"),
        h.bodyText("Provider will deliver the following:"),
        ...["[Deliverable 1 \u2014 detailed description]", "[Deliverable 2 \u2014 detailed description]",
            "[Deliverable 3 \u2014 detailed description]", "[Deliverable 4 \u2014 detailed description]"
        ].map(item => new Paragraph({ numbering: { reference: "alpha", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("3", "Out of Scope"),
        h.bodyText("The following items are explicitly excluded from this SOW:"),
        ...["[Exclusion 1]", "[Exclusion 2]", "[Exclusion 3]"
        ].map(item => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("4", "Timeline & Milestones"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.statusTable(
          ["Milestone", "Description", "Target Date"],
          [["Phase 1: Discovery", "[Environment assessment and planning]", "[Date]"],
           ["Phase 2: Implementation", "[Deployment and configuration]", "[Date]"],
           ["Phase 3: Testing", "[UAT and validation]", "[Date]"],
           ["Phase 4: Go-Live", "[Production cutover and support]", "[Date]"]]
        ),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("5", "Deliverables"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.statusTable(
          ["Deliverable", "Format", "Acceptance Criteria"],
          [["[Deliverable 1]", "[Document / Config / System]", "[Criteria for acceptance]"],
           ["[Deliverable 2]", "[Document / Config / System]", "[Criteria for acceptance]"],
           ["[Deliverable 3]", "[Document / Config / System]", "[Criteria for acceptance]"]]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        h.numberedSectionHeader("6", "Client Responsibilities"),
        h.bodyText("Client will:"),
        ...["Provide timely access to systems, facilities, and personnel",
            "Designate a project sponsor and primary point of contact",
            "Review and approve deliverables within [5] business days",
            "Provide necessary data, credentials, and documentation"
        ].map(item => new Paragraph({ numbering: { reference: "alpha", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("7", "Investment"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),

        // Pricing table
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2500, 4360, 2500],
          rows: [
            new TableRow({ children: ["Phase / Item", "Description", "Fee"].map(t =>
              new TableCell({ borders: h.borders, width: { size: t === "Description" ? 4360 : 2500, type: WidthType.DXA }, margins: h.cellMargins,
                shading: { fill: h.CORE_BLUE, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: t === "Fee" ? AlignmentType.RIGHT : AlignmentType.LEFT,
                  children: [new TextRun({ text: t, bold: true, color: h.WHITE, size: 20 })] })] })) }),
            ...([["Phase 1: Discovery", "[Description]", "$X,XXX"], ["Phase 2: Implementation", "[Description]", "$X,XXX"],
                 ["Phase 3: Testing & Go-Live", "[Description]", "$X,XXX"]
            ]).map((row, i) => new TableRow({ children: row.map((t, j) =>
              new TableCell({ borders: h.borders, width: { size: j === 1 ? 4360 : 2500, type: WidthType.DXA }, margins: h.cellMargins,
                shading: { fill: i % 2 === 0 ? h.WHITE : h.OFF_WHITE, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: j === 2 ? AlignmentType.RIGHT : AlignmentType.LEFT,
                  children: [new TextRun({ text: t, size: 20, color: j === 0 ? h.DARK_CHARCOAL : h.BRAND_GREY, bold: j === 0 })] })] })) })),
            new TableRow({ children: [
              new TableCell({ borders: h.borders, width: { size: 2500, type: WidthType.DXA }, margins: h.cellMargins, columnSpan: 2,
                shading: { fill: h.DARK_CHARCOAL, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: "Total Investment", bold: true, color: h.WHITE, size: 20 })] })] }),
              new TableCell({ borders: h.borders, width: { size: 2500, type: WidthType.DXA }, margins: h.cellMargins,
                shading: { fill: h.DARK_CHARCOAL, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: "$XX,XXX", bold: true, color: h.CORE_ORANGE, size: 22 })] })] }),
            ] }),
          ]
        }),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("8", "Payment Schedule"),
        h.bodyText("[50]% due upon execution of this SOW. Remaining [50]% due upon completion and acceptance of all deliverables. Invoices are due Net 30."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("9", "Assumptions"),
        ...["Work will be performed during standard business hours (8 AM \u2013 6 PM PT) unless otherwise agreed",
            "Client environment meets minimum requirements as documented during discovery",
            "Timeline assumes timely client responses and approvals within [5] business days",
            "Scope changes will be handled through the change management process below"
        ].map(item => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("10", "Change Management"),
        h.bodyText("Changes to the scope of this SOW must be documented in a written change order signed by both parties. Provider will provide a cost and timeline estimate for any requested changes within [3] business days."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("11", "Acceptance"),
        h.bodyText("Client will review each deliverable and provide written acceptance or detailed feedback within [5] business days of delivery. If no response is received within this period, the deliverable will be deemed accepted."),

        // Signature Block
        new Paragraph({ children: [new PageBreak()] }),
        h.numberedSectionHeader("12", "Signatures"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.bodyText("IN WITNESS WHEREOF, the parties have executed this Statement of Work as of the date last signed below."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 4680],
          rows: [new TableRow({
            children: ["PROVIDER: Technijian", "CLIENT: [Client Name]"].map(label =>
              new TableCell({
                borders: h.noBorders, width: { size: 4680, type: WidthType.DXA },
                margins: { top: 0, bottom: 80, left: 0, right: 120 },
                children: [
                  new Table({ width: { size: 4560, type: WidthType.DXA }, columnWidths: [4560],
                    rows: [new TableRow({ children: [new TableCell({
                      borders: h.noBorders, width: { size: 4560, type: WidthType.DXA },
                      shading: { fill: h.DARK_CHARCOAL, type: ShadingType.CLEAR },
                      margins: { top: 60, bottom: 60, left: 120, right: 120 },
                      children: [new Paragraph({ children: [new TextRun({ text: label, font: "Open Sans", size: 20, bold: true, color: h.WHITE })] })]
                    })] })] }),
                  new Paragraph({ spacing: { before: 400, after: 40 },
                    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: h.DARK_CHARCOAL, space: 4 } },
                    children: [new TextRun({ text: " ", size: 22 })] }),
                  new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Signature", size: 18, italics: true, color: h.BRAND_GREY })] }),
                  new Paragraph({ spacing: { before: 200, after: 40 },
                    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: h.LIGHT_GREY, space: 4 } },
                    children: [new TextRun({ text: " ", size: 22 })] }),
                  new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Printed Name / Title", size: 18, italics: true, color: h.BRAND_GREY })] }),
                  new Paragraph({ spacing: { before: 200, after: 40 },
                    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: h.LIGHT_GREY, space: 4 } },
                    children: [new TextRun({ text: " ", size: 22 })] }),
                  new Paragraph({ children: [new TextRun({ text: "Date", size: 18, italics: true, color: h.BRAND_GREY })] }),
                ]
              })
            )
          })]
        }),

        new Paragraph({ spacing: { before: 400 }, children: [] }),
        h.ctaBanner(),
      ]
    }
  ]
});

const outPath = path.join(__dirname, '..', 'assets', 'print', 'templates', 'technijian-sow-template.docx');
Packer.toBuffer(doc).then(buffer => { fs.writeFileSync(outPath, buffer); console.log('Created: ' + outPath); });
