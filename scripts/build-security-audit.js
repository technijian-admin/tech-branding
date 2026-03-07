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
      children: h.coverPage(logoData, "Security Audit Report", "Prepared for [Client Name]", "Audit Period: [Start Date] \u2013 [End Date]") },

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

        // Security score card
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 3120, 3120],
          rows: [new TableRow({
            children: [
              { num: "[X/100]", label: "Overall Security Score", color: h.CORE_BLUE },
              { num: "[X]", label: "Critical Findings", color: "CC0000" },
              { num: "[X]", label: "Total Findings", color: h.DARK_CHARCOAL },
            ].map(item => new TableCell({
              borders: h.noBorders, width: { size: 3120, type: WidthType.DXA },
              shading: { fill: h.OFF_WHITE, type: ShadingType.CLEAR },
              margins: { top: 100, bottom: 100, left: 80, right: 80 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: item.num, font: "Open Sans", size: 48, bold: true, color: item.color })] }),
                new Paragraph({ alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: item.label, font: "Open Sans", size: 16, color: h.BRAND_GREY })] }),
              ]
            }))
          })]
        }),

        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.bodyText("[Provide a 2-3 paragraph executive summary. What is the overall security posture? What are the top 3 findings that require immediate attention?]"),

        new Paragraph({ children: [new PageBreak()] }),

        // Methodology
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Methodology")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("Methodology"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.bodyText("This security audit was conducted in accordance with the following industry standards and frameworks:"),
        ...["NIST Cybersecurity Framework (CSF) 2.0",
            "CIS Controls v8",
            "[HIPAA Security Rule / PCI DSS v4.0 / SOC 2 Type II] (as applicable)",
            "Technijian Security Assessment Methodology"
        ].map(item => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ children: [new PageBreak()] }),

        // Findings by Category
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Findings by Category")] }),

        ...["Network Security", "Endpoint Protection", "Identity & Access Management", "Data Protection", "Backup & Disaster Recovery"].map((cat, idx) => {
          const colors = [h.CORE_BLUE, h.CORE_ORANGE, h.TEAL, h.CORE_BLUE, h.CORE_ORANGE];
          return [
            new Paragraph({ spacing: { before: 200 }, children: [] }),
            h.sectionHeader(cat, colors[idx]),
            new Paragraph({ spacing: { before: 80 }, children: [] }),
            h.bodyText(`[Describe findings related to ${cat.toLowerCase()}. Include specific observations, evidence, and risk implications.]`),
            new Paragraph({ spacing: { before: 80 }, children: [] }),
            h.statusTable(
              ["Finding", "Severity", "Current State", "Recommended State"],
              [["[Finding 1]", "[Critical/High/Medium/Low]", "[Current state]", "[Recommended state]"],
               ["[Finding 2]", "[Critical/High/Medium/Low]", "[Current state]", "[Recommended state]"]]
            ),
          ];
        }).flat(),

        new Paragraph({ children: [new PageBreak()] }),

        // Compliance Status
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Compliance Status")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("Compliance Status"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.statusTable(
          ["Control Area", "Status", "Notes"],
          [["Access Control", "Pass", "MFA enabled for all admin accounts"],
           ["Data Encryption", "Partial", "At-rest encryption not enabled on all servers"],
           ["Patch Management", "Fail", "30% of servers running outdated OS"],
           ["Backup & Recovery", "Pass", "Daily backups verified, DR tested quarterly"],
           ["Security Awareness", "Partial", "Training completed by 75% of staff"],
           ["Incident Response", "Pass", "Documented IR plan in place"],
           ["Physical Security", "Pass", "Badge access, camera monitoring active"],
           ["Vendor Management", "Partial", "Not all vendors have current security reviews"]]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // Risk Register
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Risk Register")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("Risk Register"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.statusTable(
          ["ID", "Finding", "Risk Level", "Likelihood", "Impact"],
          [["R-001", "[Finding description]", "Critical", "High", "Business-stopping"],
           ["R-002", "[Finding description]", "High", "Medium", "Major degradation"],
           ["R-003", "[Finding description]", "Medium", "Medium", "Limited impact"],
           ["R-004", "[Finding description]", "Medium", "Low", "Minor inconvenience"],
           ["R-005", "[Finding description]", "Low", "Low", "Negligible"]]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // Remediation Roadmap
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Remediation Roadmap")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("Remediation Roadmap"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),

        ...["Immediate (0-30 days)", "Short-Term (30-90 days)", "Strategic (90+ days)"].map((period, idx) => {
          const colors = ["CC0000", h.CORE_ORANGE, h.TEAL];
          return [
            new Paragraph({ spacing: { before: 160 }, children: [] }),
            h.colorBanner(period, colors[idx], h.WHITE, 22),
            h.statusTable(
              ["Action", "Risk Addressed", "Effort"],
              [["[Remediation action 1]", "R-00X", "[Low/Medium/High]"],
               ["[Remediation action 2]", "R-00X", "[Low/Medium/High]"]]
            ),
          ];
        }).flat(),

        new Paragraph({ spacing: { before: 400 }, children: [] }),
        h.ctaBanner(),
      ]
    }
  ]
});

const outPath = path.join(__dirname, '..', 'assets', 'print', 'templates', 'technijian-security-audit-template.docx');
Packer.toBuffer(doc).then(buffer => { fs.writeFileSync(outPath, buffer); console.log('Created: ' + outPath); });
