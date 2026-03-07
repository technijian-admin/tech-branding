const { Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat,
        BorderStyle, WidthType, ShadingType, PageBreak, Table, TableRow, TableCell } = require('docx');
const fs = require('fs');
const path = require('path');
const h = require('./brand-helpers');

const logoPath = path.resolve(__dirname, '..', 'assets', 'logos', 'png', 'technijian-logo-full-color-600x125.png');
const logoData = fs.readFileSync(logoPath);

const doc = new Document({
  styles: { default: { document: { run: { font: "Open Sans", size: 22, color: h.BRAND_GREY } } } },
  numbering: { config: [
    { reference: "alpha", levels: [{ level: 0, format: LevelFormat.LOWER_LETTER, text: "(%1)", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  ] },
  sections: [
    // Cover
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: h.coverPage(logoData, "Non-Disclosure Agreement", "Mutual NDA between Technijian and [Party Name]", "Effective Date: [Month Day, Year]") },

    // Body
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 } } },
      headers: { default: h.brandedHeader(logoData) },
      footers: { default: h.brandedFooter() },
      children: [
        h.bodyText("This Mutual Non-Disclosure Agreement (\u201CAgreement\u201D) is entered into as of [Effective Date] by and between Technijian, a California corporation (\u201CParty A\u201D), and [Party Name], a [State] [entity type] (\u201CParty B\u201D). Party A and Party B are each a \u201CParty\u201D and collectively the \u201CParties.\u201D"),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("1", "Purpose"),
        h.bodyText("The Parties wish to explore a potential business relationship (\u201CPurpose\u201D) and, in connection therewith, may disclose to each other certain confidential and proprietary information. This Agreement sets forth the terms under which such information will be disclosed and protected."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("2", "Definition of Confidential Information"),
        h.bodyText("\u201CConfidential Information\u201D means any non-public information disclosed by either Party to the other, whether orally, in writing, electronically, or by inspection, including but not limited to:"),
        ...["Business plans, strategies, and financial information",
            "Technical data, trade secrets, and know-how",
            "Customer lists, pricing, and marketing plans",
            "Software, source code, and system architecture",
            "Employee and organizational information"
        ].map(item => new Paragraph({ numbering: { reference: "alpha", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("3", "Exclusions"),
        h.bodyText("Confidential Information does not include information that:"),
        ...["Is or becomes publicly available through no fault of the receiving Party",
            "Was known to the receiving Party prior to disclosure, as documented",
            "Is independently developed by the receiving Party without use of Confidential Information",
            "Is rightfully obtained from a third party without restriction on disclosure",
            "Is required to be disclosed by law or regulation, provided the disclosing Party is given prompt notice"
        ].map(item => new Paragraph({ numbering: { reference: "alpha", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("4", "Obligations of Receiving Party"),
        h.bodyText("The receiving Party agrees to:"),
        ...["Hold all Confidential Information in strict confidence",
            "Not disclose Confidential Information to any third party without prior written consent",
            "Use Confidential Information solely for the Purpose",
            "Protect Confidential Information using at least the same degree of care used for its own confidential information, but no less than reasonable care",
            "Limit access to Confidential Information to employees and contractors who have a need to know and are bound by confidentiality obligations"
        ].map(item => new Paragraph({ numbering: { reference: "alpha", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("5", "Term"),
        h.bodyText("This Agreement is effective as of the Effective Date and continues for a period of [2] years. The confidentiality obligations survive termination for an additional [3] years."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("6", "Return of Information"),
        h.bodyText("Upon written request or termination of this Agreement, the receiving Party will promptly return or destroy all Confidential Information and certify in writing that it has done so."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("7", "Remedies"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.importantCallout("Each Party acknowledges that a breach of this Agreement may cause irreparable harm for which monetary damages may be inadequate. The non-breaching Party is entitled to seek injunctive relief in addition to any other remedies available at law or in equity."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("8", "General Provisions"),
        h.bodyText("This Agreement is governed by the laws of the State of California. This Agreement constitutes the entire agreement between the Parties regarding its subject matter. No amendment or waiver is effective unless in writing and signed by both Parties. Neither Party may assign this Agreement without the other\u2019s written consent."),

        // Signatures
        new Paragraph({ children: [new PageBreak()] }),
        h.numberedSectionHeader("9", "Signatures"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.bodyText("IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 4680],
          rows: [new TableRow({
            children: ["PARTY A: Technijian", "PARTY B: [Party Name]"].map(label =>
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

const outPath = path.join(__dirname, '..', 'assets', 'print', 'templates', 'technijian-nda-template.docx');
Packer.toBuffer(doc).then(buffer => { fs.writeFileSync(outPath, buffer); console.log('Created: ' + outPath); });
