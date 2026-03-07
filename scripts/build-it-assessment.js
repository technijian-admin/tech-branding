const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType, PageBreak, HeadingLevel,
        TableOfContents } = require('docx');
const fs = require('fs');
const path = require('path');
const h = require('./brand-helpers');

const logoPath = path.resolve(__dirname, '..', 'assets', 'logos', 'png', 'technijian-logo-full-color-600x125.png');
const logoData = fs.readFileSync(logoPath);

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Open Sans", size: 22, color: h.BRAND_GREY } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Open Sans", color: h.CORE_BLUE },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    ]
  },
  numbering: { config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  ] },
  sections: [
    // Cover
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: h.coverPage(logoData, "IT Assessment Report", "Prepared for [Client Name]", "Assessment Period: [Start Date] \u2013 [End Date]") },

    // Body
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 } } },
      headers: { default: h.brandedHeader(logoData) },
      footers: { default: h.brandedFooter() },
      children: [
        // TOC
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Table of Contents")] }),
        new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
        new Paragraph({ children: [new PageBreak()] }),

        // Executive Summary
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Executive Summary")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("Executive Summary"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.bodyText("[Provide a 2-3 paragraph summary of key findings. What is the overall health of the client\u2019s IT environment? What are the top 3 risks? What is the recommended course of action?]"),

        // Assessment highlights
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2340, 2340, 2340, 2340],
          rows: [new TableRow({
            children: [
              { num: "[X]", label: "Critical Findings", color: "CC0000" },
              { num: "[X]", label: "High Findings", color: h.CORE_ORANGE },
              { num: "[X]", label: "Medium Findings", color: h.TEAL },
              { num: "[X]", label: "Low Findings", color: h.BRAND_GREY },
            ].map(item => new TableCell({
              borders: h.noBorders, width: { size: 2340, type: WidthType.DXA },
              shading: { fill: h.OFF_WHITE, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 60, right: 60 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: item.num, font: "Open Sans", size: 48, bold: true, color: item.color })] }),
                new Paragraph({ alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: item.label, font: "Open Sans", size: 16, color: h.BRAND_GREY })] }),
              ]
            }))
          })]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // Assessment Scope
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Assessment Scope")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("Assessment Scope"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.bodyText("The following areas were evaluated during this assessment:"),
        ...["Network infrastructure (switches, routers, firewalls, wireless)",
            "Server environment (physical and virtual servers, storage)",
            "Endpoint devices (desktops, laptops, mobile devices)",
            "Cloud services (Microsoft 365, Azure/AWS resources)",
            "Security posture (antivirus, EDR, patching, access controls)",
            "Backup and disaster recovery systems",
            "Compliance readiness ([HIPAA/PCI/SOC 2] as applicable)"
        ].map(item => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ children: [new PageBreak()] }),

        // Findings
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Findings")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("Findings"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),

        // Network
        h.sectionHeader("Network Infrastructure", h.TEAL),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.bodyText("[Describe network findings. Include specifics about firewall configuration, switch age, wireless security, segmentation, etc.]"),

        // Endpoints
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.sectionHeader("Endpoint Security", h.CORE_ORANGE),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.bodyText("[Describe endpoint findings. Include OS patch status, antivirus coverage, EDR deployment, device age, and encryption status.]"),

        // Cloud & Identity
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.sectionHeader("Cloud & Identity", h.CORE_BLUE),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.bodyText("[Describe cloud and identity findings. Include MFA adoption, conditional access, license utilization, admin account security.]"),

        new Paragraph({ children: [new PageBreak()] }),

        // Risk Matrix
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Risk Matrix")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("Risk Matrix"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.statusTable(
          ["Finding", "Severity", "Impact", "Recommendation"],
          [["[Finding 1]", "Critical", "[Business impact]", "[Recommended action]"],
           ["[Finding 2]", "High", "[Business impact]", "[Recommended action]"],
           ["[Finding 3]", "Medium", "[Business impact]", "[Recommended action]"],
           ["[Finding 4]", "Medium", "[Business impact]", "[Recommended action]"],
           ["[Finding 5]", "Low", "[Business impact]", "[Recommended action]"]]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // Recommendations
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Recommendations")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("Recommendations"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),

        // Timeline cards
        ...["Immediate (0-30 days)", "Short-Term (30-90 days)", "Strategic (90+ days)"].map((period, idx) => {
          const colors = ["CC0000", h.CORE_ORANGE, h.TEAL];
          return [
            new Paragraph({ spacing: { before: 160 }, children: [] }),
            h.colorBanner(period, colors[idx], h.WHITE, 22),
            ...["[Action item 1 for this timeframe]", "[Action item 2 for this timeframe]", "[Action item 3 for this timeframe]"
            ].map(item => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
              children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),
          ];
        }).flat(),

        new Paragraph({ children: [new PageBreak()] }),

        // About Technijian
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("About Technijian")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("About Technijian"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.bodyText("Founded in 2000, Technijian delivers managed IT services, cybersecurity, cloud solutions, compliance support, and AI-driven development for small and mid-sized businesses. With offices in Irvine, CA and India, our dedicated Technijians pod model provides 24/7 support from a team that knows your infrastructure inside and out."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.ctaBanner(),
      ]
    }
  ]
});

const outPath = path.join(__dirname, '..', 'assets', 'print', 'templates', 'technijian-it-assessment-template.docx');
Packer.toBuffer(doc).then(buffer => { fs.writeFileSync(outPath, buffer); console.log('Created: ' + outPath); });
