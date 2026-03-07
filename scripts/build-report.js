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

const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const noBorders = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// ── Visual helper: Full-width colored banner with text ──
function colorBanner(text, bgColor, textColor, fontSize) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: noBorders,
        width: { size: 9360, type: WidthType.DXA },
        margins: { top: 160, bottom: 160, left: 200, right: 200 },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        children: [new Paragraph({
          children: [new TextRun({ text, font: "Open Sans", size: fontSize || 28, bold: true, color: textColor || WHITE })]
        })]
      })]
    })]
  });
}

// ── Visual helper: Metric callout card (big number + label) ──
function metricCard(number, label, color) {
  return new TableCell({
    borders: noBorders,
    width: { size: 2340, type: WidthType.DXA },
    margins: { top: 120, bottom: 120, left: 80, right: 80 },
    shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: number, font: "Open Sans", size: 52, bold: true, color: color || CORE_BLUE })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: label, font: "Open Sans", size: 16, color: BRAND_GREY })]
      })
    ]
  });
}

// ── Visual helper: Section header with blue left bar ──
function sectionHeader(title) {
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
          margins: { top: 100, bottom: 100, left: 200, right: 0 },
          children: [new Paragraph({
            children: [new TextRun({ text: title, font: "Open Sans", size: 32, bold: true, color: CORE_BLUE })]
          })]
        })
      ]
    })]
  });
}

// ── Table helpers ──
function headerRow(cols, widths) {
  return new TableRow({
    children: cols.map((h, i) =>
      new TableCell({
        borders, width: { size: widths[i], type: WidthType.DXA }, margins: cellMargins,
        shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: WHITE, size: 20, font: "Open Sans" })] })]
      })
    )
  });
}

function dataRow(cols, widths, shaded) {
  return new TableRow({
    children: cols.map((t, i) =>
      new TableCell({
        borders, width: { size: widths[i], type: WidthType.DXA }, margins: cellMargins,
        shading: shaded ? { fill: OFF_WHITE, type: ShadingType.CLEAR } : undefined,
        children: [new Paragraph({ children: [new TextRun({ text: t, size: 20, color: BRAND_GREY, font: "Open Sans" })] })]
      })
    )
  });
}

// ── Status badge cell (colored text) ──
function statusRow(cols, widths, shaded, statusIdx, statusColor) {
  return new TableRow({
    children: cols.map((t, i) =>
      new TableCell({
        borders, width: { size: widths[i], type: WidthType.DXA }, margins: cellMargins,
        shading: shaded ? { fill: OFF_WHITE, type: ShadingType.CLEAR } : undefined,
        children: [new Paragraph({ children: [new TextRun({
          text: t, size: 20, font: "Open Sans",
          color: (i === statusIdx && statusColor) ? statusColor : BRAND_GREY,
          bold: i === statusIdx
        })] })]
      })
    )
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Open Sans", size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Open Sans", color: CORE_BLUE },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Open Sans", color: CORE_BLUE },
        paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    // ═══════════════════════════════════════════
    // COVER PAGE
    // ═══════════════════════════════════════════
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 }
        }
      },
      children: [
        // Top blue accent bar
        new Table({
          width: { size: 12240, type: WidthType.DXA },
          columnWidths: [12240],
          rows: [new TableRow({
            children: [new TableCell({
              borders: noBorders,
              width: { size: 12240, type: WidthType.DXA },
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
              children: [
                new Paragraph({ spacing: { before: 40, after: 40 }, children: [] }),
              ]
            })]
          })]
        }),

        new Paragraph({ spacing: { before: 2000 }, children: [] }),

        // Logo centered
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          children: [
            new ImageRun({ type: "png", data: logoData, transformation: { width: 280, height: 58 },
              altText: { title: "Technijian", description: "Logo", name: "logo" } }),
          ]
        }),

        // Orange divider
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_ORANGE, space: 1 } },
          indent: { left: 3600, right: 3600 },
          children: []
        }),

        // Title
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [new TextRun({ text: "Quarterly Business Review", font: "Open Sans", size: 56, bold: true, color: DARK_CHARCOAL })]
        }),

        // Client name
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [
            new TextRun({ text: "Prepared for ", font: "Open Sans", size: 28, color: BRAND_GREY }),
            new TextRun({ text: "[Client Name]", font: "Open Sans", size: 28, color: CORE_BLUE, bold: true })
          ]
        }),

        // Quarter/Year
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 2000 },
          children: [new TextRun({ text: "[Quarter] [Year]", font: "Open Sans", size: 24, color: BRAND_GREY })]
        }),

        // Confidential
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "CONFIDENTIAL", font: "Open Sans", size: 18, color: BRAND_GREY, characterSpacing: 200 })]
        }),

        new Paragraph({ spacing: { before: 400 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8500  |  technijian.com", font: "Open Sans", size: 16, color: BRAND_GREY })]
        }),

        // Bottom orange accent bar
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        new Table({
          width: { size: 12240, type: WidthType.DXA },
          columnWidths: [12240],
          rows: [new TableRow({
            children: [new TableCell({
              borders: noBorders,
              width: { size: 12240, type: WidthType.DXA },
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              shading: { fill: CORE_ORANGE, type: ShadingType.CLEAR },
              children: [new Paragraph({ spacing: { before: 30, after: 30 }, children: [] })]
            })]
          })]
        }),
      ]
    },

    // ═══════════════════════════════════════════
    // CONTENT PAGES
    // ═══════════════════════════════════════════
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
              new ImageRun({ type: "png", data: logoData, transformation: { width: 160, height: 33 },
                altText: { title: "Technijian", description: "Logo", name: "logo" } }),
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
              new TextRun({ text: "Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8500  |  technijian.com    \u2014    Page ", font: "Open Sans", size: 16, color: BRAND_GREY }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Open Sans", size: 16, color: BRAND_GREY }),
            ]
          })]
        })
      },
      children: [
        // ── Executive Summary ──
        sectionHeader("Executive Summary"),
        new Paragraph({ spacing: { before: 200, after: 120 },
          children: [new TextRun({ text: "This Quarterly Business Review covers the performance of Technijian\u2019s managed IT services for [Client Name] during [Quarter] [Year].", size: 22, color: BRAND_GREY })] }),

        // ── KEY METRICS DASHBOARD (4 callout cards) ──
        new Paragraph({ spacing: { before: 240, after: 120 },
          children: [new TextRun({ text: "Key Performance Highlights", font: "Open Sans", size: 24, bold: true, color: DARK_CHARCOAL })] }),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2340, 2340, 2340, 2340],
          rows: [new TableRow({
            children: [
              metricCard("[XX.X]%", "SYSTEM UPTIME", CORE_BLUE),
              metricCard("[XXX]", "TICKETS RESOLVED", TEAL),
              metricCard("[XX]min", "AVG RESPONSE", CORE_ORANGE),
              metricCard("[XX]", "THREATS BLOCKED", DARK_CHARCOAL),
            ]
          })]
        }),

        new Paragraph({ spacing: { before: 200, after: 100 },
          children: [new TextRun({ text: "Summary highlights:", size: 22, color: BRAND_GREY })] }),
        ...["Overall system uptime of [XX.X]% against a [XX.X]% SLA target",
            "[XXX] support tickets resolved with an average response time of [XX] minutes",
            "[XX] security threats blocked and [XX] critical patches deployed",
            "[List any major projects or milestones completed]"
        ].map(item => new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: BRAND_GREY })]
        })),

        new Paragraph({ children: [new PageBreak()] }),

        // ── Service Performance ──
        sectionHeader("Service Performance"),
        new Paragraph({ spacing: { before: 200, after: 160 },
          children: [new TextRun({ text: "The following metrics summarize service delivery during the reporting period.", size: 22, color: BRAND_GREY })] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 3120, 3120],
          rows: [
            headerRow(["Metric", "SLA Target", "Actual"], [3120, 3120, 3120]),
            dataRow(["System Uptime", "99.9%", "[XX.X]%"], [3120, 3120, 3120], false),
            dataRow(["Avg Response (Critical)", "15 min", "[XX] min"], [3120, 3120, 3120], true),
            dataRow(["Avg Response (High)", "30 min", "[XX] min"], [3120, 3120, 3120], false),
            dataRow(["Avg Resolution (Medium)", "24 hours", "[XX] hours"], [3120, 3120, 3120], true),
            dataRow(["Tickets Resolved", "\u2014", "[XXX]"], [3120, 3120, 3120], false),
            dataRow(["Client Satisfaction", "95%+", "[XX]%"], [3120, 3120, 3120], true),
          ]
        }),

        // ── Ticket Analysis ──
        new Paragraph({ spacing: { before: 400 }, children: [] }),
        sectionHeader("Ticket Analysis"),
        new Paragraph({ spacing: { before: 200, after: 160 },
          children: [new TextRun({ text: "Support tickets broken down by category:", size: 22, color: BRAND_GREY })] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2800, 1560, 1560, 1720, 1720],
          rows: [
            headerRow(["Category", "Count", "% Total", "Avg Resolution", "Trend"], [2800, 1560, 1560, 1720, 1720]),
            dataRow(["Desktop Support", "[XX]", "[XX]%", "[X] hours", "\u2193 Down"], [2800, 1560, 1560, 1720, 1720], false),
            dataRow(["Network/Connectivity", "[XX]", "[XX]%", "[X] hours", "\u2192 Flat"], [2800, 1560, 1560, 1720, 1720], true),
            dataRow(["Email/Microsoft 365", "[XX]", "[XX]%", "[X] hours", "\u2193 Down"], [2800, 1560, 1560, 1720, 1720], false),
            dataRow(["Security Incidents", "[XX]", "[XX]%", "[X] hours", "\u2191 Up"], [2800, 1560, 1560, 1720, 1720], true),
            dataRow(["Other", "[XX]", "[XX]%", "[X] hours", "\u2192 Flat"], [2800, 1560, 1560, 1720, 1720], false),
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ── Security Overview ──
        sectionHeader("Security Overview"),
        new Paragraph({ spacing: { before: 200, after: 120 },
          children: [new TextRun({ text: "Security posture summary for the reporting period:", size: 22, color: BRAND_GREY })] }),

        // Security metrics in a colored callout box
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [9360],
          rows: [new TableRow({
            children: [new TableCell({
              borders: { top: { style: BorderStyle.SINGLE, size: 4, color: TEAL }, bottom: thinBorder, left: thinBorder, right: thinBorder },
              width: { size: 9360, type: WidthType.DXA },
              margins: { top: 160, bottom: 160, left: 200, right: 200 },
              shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
              children: [
                new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "SECURITY DASHBOARD", font: "Open Sans", size: 18, bold: true, color: TEAL, characterSpacing: 100 })] }),
                ...["Threats blocked by CrowdStrike: [XXX]",
                    "Phishing emails intercepted: [XXX]",
                    "Security patches deployed: [XX]",
                    "Vulnerability scans completed: [X]",
                    "Security incidents requiring response: [X]"
                ].map(item => new Paragraph({
                  spacing: { after: 40 },
                  children: [
                    new TextRun({ text: "\u2022  ", size: 20, color: TEAL }),
                    new TextRun({ text: item, size: 20, color: BRAND_GREY }),
                  ]
                })),
              ]
            })]
          })]
        }),

        // ── Projects Completed ──
        new Paragraph({ spacing: { before: 400 }, children: [] }),
        sectionHeader("Projects Completed"),
        new Paragraph({ spacing: { before: 200, after: 160 },
          children: [new TextRun({ text: "Projects delivered during this quarter:", size: 22, color: BRAND_GREY })] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2200, 4960, 2200],
          rows: [
            headerRow(["Project", "Description", "Status"], [2200, 4960, 2200]),
            statusRow(["[Project Name]", "[Brief description of project scope and outcome]", "Completed"], [2200, 4960, 2200], false, 2, "28A745"),
            statusRow(["[Project Name]", "[Brief description of project scope and outcome]", "Completed"], [2200, 4960, 2200], true, 2, "28A745"),
            statusRow(["[Project Name]", "[Brief description of project scope and outcome]", "In Progress"], [2200, 4960, 2200], false, 2, CORE_ORANGE),
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ── Recommendations ──
        sectionHeader("Recommendations"),
        new Paragraph({ spacing: { before: 200, after: 100 },
          children: [new TextRun({ text: "Based on this quarter\u2019s data, we recommend the following:", size: 22, color: BRAND_GREY })] }),
        ...["[Recommendation 1 \u2014 specific action and expected benefit]",
            "[Recommendation 2 \u2014 specific action and expected benefit]",
            "[Recommendation 3 \u2014 specific action and expected benefit]"
        ].map((item, i) => new Paragraph({
          numbering: { reference: "numbers", level: 0 },
          spacing: { after: 80 },
          children: [new TextRun({ text: item, size: 22, color: BRAND_GREY })]
        })),

        // ── Next Quarter Outlook ──
        new Paragraph({ spacing: { before: 300 }, children: [] }),
        sectionHeader("Next Quarter Outlook"),
        new Paragraph({ spacing: { before: 200, after: 100 },
          children: [new TextRun({ text: "Planned work and strategic initiatives:", size: 22, color: BRAND_GREY })] }),
        ...["[Planned initiative or project]",
            "[Upcoming renewal or license review]",
            "[Strategic technology improvement]"
        ].map(item => new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: BRAND_GREY })]
        })),

        // ── CTA Banner ──
        new Paragraph({ spacing: { before: 400 }, children: [] }),
        colorBanner("Questions about this report?", CORE_BLUE, WHITE, 28),
        new Paragraph({ spacing: { before: 120 },
          children: [
            new TextRun({ text: "Contact your Technijian account team at ", size: 22, color: BRAND_GREY }),
            new TextRun({ text: "949.379.8500", size: 22, color: CORE_BLUE, bold: true }),
            new TextRun({ text: " or visit ", size: 22, color: BRAND_GREY }),
            new TextRun({ text: "technijian.com", size: 22, color: CORE_BLUE }),
          ]
        }),
      ]
    }
  ]
});

const outPath = path.join(__dirname, '..', 'assets', 'print', 'templates', 'technijian-qbr-template.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Created: ' + outPath);
});
