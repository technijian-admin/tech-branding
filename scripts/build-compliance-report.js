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
      children: h.coverPage(logoData, "[Framework] Compliance\nAssessment", "Prepared for [Client Name]", "Assessment Date: [Month Day, Year]") },

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

        // Compliance readiness score
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 3120, 3120],
          rows: [new TableRow({
            children: [
              { num: "[X]%", label: "Compliance Readiness", color: h.CORE_BLUE },
              { num: "[X]", label: "Controls Assessed", color: h.DARK_CHARCOAL },
              { num: "[X]", label: "Gaps Identified", color: h.CORE_ORANGE },
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
        h.bodyText("[Provide a 2-3 paragraph summary of compliance readiness. What framework was assessed? What is the overall readiness score? What are the key gaps that need to be addressed?]"),

        new Paragraph({ children: [new PageBreak()] }),

        // Framework Overview
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Framework Overview")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("Framework Overview"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.bodyText("[Provide a brief description of the compliance framework being assessed. For HIPAA: explain the Security Rule requirements. For PCI DSS: explain the 12 requirements. For SOC 2: explain the Trust Service Criteria. For GDPR: explain the key data protection principles.]"),

        h.importantCallout("This assessment supports your compliance posture but does not constitute a formal audit or certification. Formal compliance certification requires engagement with an accredited auditor."),

        new Paragraph({ children: [new PageBreak()] }),

        // Control Assessment
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Control Assessment")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("Control Assessment"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),

        h.statusTable(
          ["Control ID", "Control Description", "Status", "Evidence"],
          [["[ID-001]", "Access control and authentication", "Compliant", "MFA enabled, RBAC configured"],
           ["[ID-002]", "Data encryption at rest", "Partial", "Encrypted on cloud; not all on-prem"],
           ["[ID-003]", "Audit logging and monitoring", "Compliant", "SIEM operational, 90-day retention"],
           ["[ID-004]", "Incident response procedures", "Compliant", "IR plan documented and tested"],
           ["[ID-005]", "Vulnerability management", "Partial", "Quarterly scans; remediation delayed"],
           ["[ID-006]", "Data backup and recovery", "Compliant", "Daily backups, DR tested quarterly"],
           ["[ID-007]", "Employee security training", "Partial", "75% completion rate"],
           ["[ID-008]", "Physical security controls", "Compliant", "Badge access, cameras, visitor logs"],
           ["[ID-009]", "Third-party risk management", "Fail", "No formal vendor review process"],
           ["[ID-010]", "Data retention and disposal", "Partial", "Retention policy exists; disposal gaps"]]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // Gap Analysis
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Gap Analysis")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("Gap Analysis"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.bodyText("The following controls were identified as non-compliant or partially compliant:"),

        ...["Data Encryption (ID-002)", "Vulnerability Management (ID-005)", "Security Training (ID-007)", "Third-Party Risk (ID-009)", "Data Disposal (ID-010)"].map(gap => [
          new Paragraph({ spacing: { before: 200 }, children: [] }),
          h.sectionHeader(gap, h.CORE_ORANGE),
          new Paragraph({ spacing: { before: 80 }, children: [] }),
          h.bodyText(`[Detailed description of the gap for ${gap}. What is the current state? What is required for compliance? What is the risk of non-compliance?]`),
        ]).flat(),

        new Paragraph({ children: [new PageBreak()] }),

        // Remediation Plan
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Remediation Plan")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("Remediation Plan"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),

        h.statusTable(
          ["Priority", "Control Gap", "Remediation Action", "Effort", "Timeline"],
          [["1", "Third-Party Risk (ID-009)", "Implement vendor review program", "Medium", "30 days"],
           ["2", "Data Encryption (ID-002)", "Enable encryption on on-prem servers", "High", "60 days"],
           ["3", "Vulnerability Mgmt (ID-005)", "Automate monthly scans, SLA for remediation", "Medium", "45 days"],
           ["4", "Security Training (ID-007)", "Mandate completion, add phishing simulations", "Low", "30 days"],
           ["5", "Data Disposal (ID-010)", "Implement certified disposal procedures", "Low", "45 days"]]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // Timeline & Investment
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Timeline & Investment")] }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.sectionHeader("Timeline & Investment"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.bodyText("The following estimated effort and investment are required to close all identified compliance gaps:"),

        new Paragraph({ spacing: { before: 120 }, children: [] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4000, 2680, 2680],
          rows: [
            new TableRow({ children: ["Remediation Item", "Estimated Hours", "Estimated Cost"].map(t =>
              new TableCell({ borders: h.borders, width: { size: t === "Remediation Item" ? 4000 : 2680, type: WidthType.DXA }, margins: h.cellMargins,
                shading: { fill: h.CORE_BLUE, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: t !== "Remediation Item" ? AlignmentType.RIGHT : AlignmentType.LEFT,
                  children: [new TextRun({ text: t, bold: true, color: h.WHITE, size: 20 })] })] })) }),
            ...([
              ["Vendor review program", "[XX] hours", "$X,XXX"],
              ["On-prem encryption deployment", "[XX] hours", "$X,XXX"],
              ["Vulnerability management automation", "[XX] hours", "$X,XXX"],
              ["Security training program", "[XX] hours", "$X,XXX"],
              ["Data disposal procedures", "[XX] hours", "$X,XXX"],
            ]).map((row, i) => new TableRow({ children: row.map((t, j) =>
              new TableCell({ borders: h.borders, width: { size: j === 0 ? 4000 : 2680, type: WidthType.DXA }, margins: h.cellMargins,
                shading: { fill: i % 2 === 0 ? h.WHITE : h.OFF_WHITE, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: j > 0 ? AlignmentType.RIGHT : AlignmentType.LEFT,
                  children: [new TextRun({ text: t, size: 20, color: h.BRAND_GREY })] })] })) })),
            new TableRow({ children: [
              new TableCell({ borders: h.borders, width: { size: 4000, type: WidthType.DXA }, margins: h.cellMargins, columnSpan: 2,
                shading: { fill: h.DARK_CHARCOAL, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: "Total Estimated Investment", bold: true, color: h.WHITE, size: 20 })] })] }),
              new TableCell({ borders: h.borders, width: { size: 2680, type: WidthType.DXA }, margins: h.cellMargins,
                shading: { fill: h.DARK_CHARCOAL, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: "$XX,XXX", bold: true, color: h.CORE_ORANGE, size: 22 })] })] }),
            ] }),
          ]
        }),

        // About Technijian
        new Paragraph({ spacing: { before: 400 }, children: [] }),
        h.sectionHeader("About Technijian"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.bodyText("Founded in 2000, Technijian delivers managed IT services, cybersecurity, cloud solutions, compliance support, and AI-driven development for small and mid-sized businesses. With offices in Irvine, CA and India, our dedicated Technijians pod model provides 24/7 support from a team that knows your infrastructure inside and out."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.ctaBanner(),
      ]
    }
  ]
});

const outPath = path.join(__dirname, '..', 'assets', 'print', 'templates', 'technijian-compliance-report-template.docx');
Packer.toBuffer(doc).then(buffer => { fs.writeFileSync(outPath, buffer); console.log('Created: ' + outPath); });
