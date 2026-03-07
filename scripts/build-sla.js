const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');
const h = require('./brand-helpers');

const logoPath = path.resolve(__dirname, '..', 'assets', 'logos', 'png', 'technijian-logo-full-color-600x125.png');
const logoData = fs.readFileSync(logoPath);

const doc = new Document({
  styles: { default: { document: { run: { font: "Open Sans", size: 22, color: h.BRAND_GREY } } } },
  numbering: { config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  ] },
  sections: [
    // Cover
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: h.coverPage(logoData, "Service Level Agreement", "Managed IT Services for [Client Name]", "Effective Date: [Month Day, Year]") },

    // Body
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 } } },
      headers: { default: h.brandedHeader(logoData) },
      footers: { default: h.brandedFooter() },
      children: [
        h.bodyText("This Service Level Agreement (\u201CSLA\u201D) is an exhibit to the Master Services Agreement dated [MSA Date] between Technijian (\u201CProvider\u201D) and [Client Name] (\u201CClient\u201D). It defines the service levels, metrics, and remedies for the managed IT services described herein."),

        // SLA Highlights - metric cards
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2340, 2340, 2340, 2340],
          rows: [new TableRow({
            children: [
              { num: "99.9%", label: "Uptime Target" },
              { num: "15 min", label: "Critical Response" },
              { num: "24/7", label: "Support Hours" },
              { num: "4 hr", label: "Critical Resolution" },
            ].map(item => new TableCell({
              borders: h.noBorders, width: { size: 2340, type: WidthType.DXA },
              shading: { fill: h.OFF_WHITE, type: ShadingType.CLEAR },
              margins: { top: 100, bottom: 100, left: 60, right: 60 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: item.num, font: "Open Sans", size: 44, bold: true, color: h.CORE_BLUE })] }),
                new Paragraph({ alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: item.label, font: "Open Sans", size: 16, color: h.BRAND_GREY })] }),
              ]
            }))
          })]
        }),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("1", "Service Description"),
        h.bodyText("This SLA covers the following managed IT services provided by Technijian:"),
        ...["24/7 infrastructure monitoring and alerting", "Desktop, laptop, and server support",
            "Network management and optimization", "CrowdStrike endpoint protection management",
            "Microsoft 365 administration", "Backup and disaster recovery monitoring"
        ].map(item => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("2", "Service Availability"),
        h.bodyText("Provider commits to maintaining [99.9]% uptime for monitored systems on a monthly basis. Uptime is measured from Provider\u2019s monitoring platform and excludes scheduled maintenance windows, force majeure events, and downtime caused by Client actions."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("3", "Response & Resolution Times"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),

        // Response time table with severity colors
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [1800, 3060, 2250, 2250],
          rows: [
            new TableRow({ children: ["Severity", "Description", "Response", "Resolution Target"].map(t =>
              new TableCell({ borders: h.borders, width: { size: t === "Description" ? 3060 : t === "Severity" ? 1800 : 2250, type: WidthType.DXA }, margins: h.cellMargins,
                shading: { fill: h.CORE_BLUE, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, color: h.WHITE, size: 20 })] })] })) }),
            ...([
              ["Critical", "Business down / major system failure", "15 minutes", "4 hours", "CC0000"],
              ["High", "Significant degradation of services", "30 minutes", "8 hours", h.CORE_ORANGE],
              ["Medium", "Limited impact to business operations", "2 hours", "24 hours", h.TEAL],
              ["Low", "Minor issue / information request", "4 hours", "48 hours", h.BRAND_GREY],
            ]).map((row, i) => new TableRow({
              children: [
                new TableCell({ borders: h.borders, width: { size: 1800, type: WidthType.DXA }, margins: h.cellMargins,
                  shading: { fill: i % 2 === 0 ? h.WHITE : h.OFF_WHITE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: row[0], bold: true, size: 20, color: row[4] })] })] }),
                new TableCell({ borders: h.borders, width: { size: 3060, type: WidthType.DXA }, margins: h.cellMargins,
                  shading: { fill: i % 2 === 0 ? h.WHITE : h.OFF_WHITE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: row[1], size: 20, color: h.BRAND_GREY })] })] }),
                new TableCell({ borders: h.borders, width: { size: 2250, type: WidthType.DXA }, margins: h.cellMargins,
                  shading: { fill: i % 2 === 0 ? h.WHITE : h.OFF_WHITE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row[2], bold: true, size: 20, color: h.DARK_CHARCOAL })] })] }),
                new TableCell({ borders: h.borders, width: { size: 2250, type: WidthType.DXA }, margins: h.cellMargins,
                  shading: { fill: i % 2 === 0 ? h.WHITE : h.OFF_WHITE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: row[3], bold: true, size: 20, color: h.DARK_CHARCOAL })] })] }),
              ]
            }))
          ]
        }),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("4", "Support Hours"),
        h.bodyText("Standard support: 24/7/365 via phone, email, and ticketing portal. After-hours support for Critical and High severity issues is included. Scheduled maintenance will be performed during agreed maintenance windows ([Saturdays 10 PM \u2013 2 AM PT]) with [48] hours advance notice."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("5", "Escalation Procedures"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.statusTable(
          ["Level", "Contact", "Timeframe"],
          [["Level 1: Support Team", "helpdesk@technijian.com / 949.379.8500", "Immediate"],
           ["Level 2: Pod Lead", "[Pod Lead Name] / [Direct Line]", "If unresolved after 2 hours"],
           ["Level 3: Director of Operations", "[Director Name] / [Direct Line]", "If unresolved after 4 hours"],
           ["Level 4: Executive", "Ravi Jain / rjain@technijian.com", "If unresolved after 8 hours"]]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        h.numberedSectionHeader("6", "Service Credits"),
        h.bodyText("If Provider fails to meet the monthly uptime target, Client is eligible for service credits as follows:"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.statusTable(
          ["Monthly Uptime", "Service Credit"],
          [["99.9% or above", "No credit"],
           ["99.0% \u2013 99.89%", "5% of monthly fees"],
           ["95.0% \u2013 98.99%", "10% of monthly fees"],
           ["Below 95.0%", "25% of monthly fees"]]
        ),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.importantCallout("Service credits are Client\u2019s sole and exclusive remedy for Provider\u2019s failure to meet service levels. Credits are applied to the next invoice and do not exceed 25% of monthly fees. Client must request credits within [30] days of the service failure."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("7", "Reporting"),
        h.bodyText("Provider will deliver the following reports:"),
        ...["Monthly Service Report \u2014 uptime, ticket volume, response times, resolution times",
            "Quarterly Business Review \u2014 trends, recommendations, security posture, roadmap",
            "Incident Reports \u2014 within [24] hours of any Critical severity incident"
        ].map(item => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("8", "Review & Amendment"),
        h.bodyText("This SLA will be reviewed annually by both parties. Amendments require written agreement signed by both parties. Provider may update service levels with [60] days written notice, provided the changes do not reduce the level of service below the minimums defined herein."),

        new Paragraph({ spacing: { before: 400 }, children: [] }),
        h.ctaBanner(),
      ]
    }
  ]
});

const outPath = path.join(__dirname, '..', 'assets', 'print', 'templates', 'technijian-sla-template.docx');
Packer.toBuffer(doc).then(buffer => { fs.writeFileSync(outPath, buffer); console.log('Created: ' + outPath); });
