const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        ImageRun, Header, Footer, AlignmentType, LevelFormat,
        HeadingLevel, BorderStyle, WidthType, ShadingType,
        PageNumber, PageBreak, TableOfContents } = require('docx');
const fs = require('fs');
const path = require('path');

const logoPath = path.resolve(__dirname, '..', 'assets', 'logos', 'png', 'technijian-logo-full-color-600x125.png');
const logoData = fs.readFileSync(logoPath);

// Brand colors
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
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

// Column widths for pricing table (sum = 9360 DXA = full content width)
const colWidths = [2200, 4960, 2200];

// Visual helper: full-width colored banner
function colorBanner(text, bgColor, textColor, fontSize) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: noBorders,
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text, font: "Open Sans", size: fontSize || 28, bold: true, color: textColor || WHITE })]
        })]
      })]
    })]
  });
}

// Visual helper: section header with colored left bar accent
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
          margins: { top: 80, bottom: 80, left: 160, right: 0 },
          children: [new Paragraph({
            children: [new TextRun({ text: title, font: "Open Sans", size: 32, bold: true, color: CORE_BLUE })]
          })]
        }),
      ]
    })]
  });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Open Sans", size: 24, color: BRAND_GREY } }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Open Sans", color: CORE_BLUE },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Open Sans", color: CORE_BLUE },
        paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 }
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Open Sans", color: DARK_CHARCOAL },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 }
      }
    ]
  },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "\u2022",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]
    }]
  },
  sections: [
    // ========== COVER PAGE ==========
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        // Top accent bar - blue
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [9360],
          rows: [new TableRow({
            children: [new TableCell({
              borders: noBorders,
              width: { size: 9360, type: WidthType.DXA },
              shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
              margins: { top: 20, bottom: 20, left: 0, right: 0 },
              children: [new Paragraph({ children: [] })]
            })]
          })]
        }),

        new Paragraph({ spacing: { before: 1800 }, children: [] }),

        // Centered logo
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [
            new ImageRun({
              type: "png", data: logoData,
              transformation: { width: 280, height: 58 },
              altText: { title: "Technijian Logo", description: "Technijian - Technology as a Solution", name: "logo" }
            })
          ]
        }),

        // Orange divider line (centered via 3-column table)
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3280, 2800, 3280],
          rows: [new TableRow({
            children: [
              new TableCell({ borders: noBorders, width: { size: 3280, type: WidthType.DXA }, children: [new Paragraph({ children: [] })] }),
              new TableCell({
                borders: noBorders, width: { size: 2800, type: WidthType.DXA },
                children: [new Paragraph({
                  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_ORANGE, space: 0 } },
                  children: []
                })]
              }),
              new TableCell({ borders: noBorders, width: { size: 3280, type: WidthType.DXA }, children: [new Paragraph({ children: [] })] }),
            ]
          })]
        }),

        // Title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 200 },
          children: [
            new TextRun({ text: "IT Services Proposal", font: "Open Sans", size: 52, bold: true, color: DARK_CHARCOAL })
          ]
        }),

        // Subtitle
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "Prepared for ", font: "Open Sans", size: 28, color: BRAND_GREY }),
            new TextRun({ text: "[Client Name]", font: "Open Sans", size: 28, color: CORE_BLUE, bold: true })
          ]
        }),

        // Date
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "[Date]", font: "Open Sans", size: 24, color: BRAND_GREY })
          ]
        }),

        // Bottom accent bar - orange
        new Paragraph({ spacing: { before: 1600 }, children: [] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [9360],
          rows: [new TableRow({
            children: [new TableCell({
              borders: noBorders,
              width: { size: 9360, type: WidthType.DXA },
              shading: { fill: CORE_ORANGE, type: ShadingType.CLEAR },
              margins: { top: 20, bottom: 20, left: 0, right: 0 },
              children: [new Paragraph({ children: [] })]
            })]
          })]
        }),

        // Confidential notice
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 120 },
          children: [
            new TextRun({ text: "CONFIDENTIAL \u2014 For authorized use only", font: "Open Sans", size: 18, italics: true, color: BRAND_GREY })
          ]
        }),

        // Contact info
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8500  |  technijian.com", font: "Open Sans", size: 16, color: BRAND_GREY })
          ]
        })
      ]
    },

    // ========== TOC + CONTENT ==========
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              spacing: { after: 100 },
              border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: CORE_BLUE, space: 8 } },
              children: [
                new ImageRun({
                  type: "png", data: logoData,
                  transformation: { width: 160, height: 33 },
                  altText: { title: "Technijian", description: "Technijian logo", name: "header-logo" }
                })
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY, space: 8 } },
              children: [
                new TextRun({ text: "Technijian  |  18 Technology Dr., Ste 141, Irvine, CA 92618  |  949.379.8500  |  technijian.com    \u2014    Page ", font: "Open Sans", size: 16, color: BRAND_GREY }),
                new TextRun({ children: [PageNumber.CURRENT], font: "Open Sans", size: 16, color: BRAND_GREY })
              ]
            })
          ]
        })
      },
      children: [
        // TABLE OF CONTENTS
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("Table of Contents")]
        }),
        new TableOfContents("Table of Contents", {
          hyperlink: true,
          headingStyleRange: "1-3"
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // ========== EXECUTIVE SUMMARY ==========
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("Executive Summary")]
        }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        sectionHeader("Executive Summary"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "This proposal outlines a comprehensive IT services engagement designed to address [Client Name]\u2019s technology needs. Technijian will serve as your dedicated technology partner, providing proactive managed IT services, cybersecurity protection, and strategic consulting to ensure your infrastructure supports your business goals.", font: "Open Sans", size: 24, color: BRAND_GREY })]
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "[Customize this section with specific client challenges, goals discussed during discovery, and a high-level summary of the proposed solution. Keep it concise \u2014 2-3 paragraphs maximum.]", font: "Open Sans", size: 24, color: BRAND_GREY, italics: true })]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ========== SCOPE OF SERVICES ==========
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("Scope of Services")]
        }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        sectionHeader("Scope of Services"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "The following services are included in this engagement:", font: "Open Sans", size: 24, color: BRAND_GREY })]
        }),

        // Service pillar cards
        ...["Managed IT Services", "Cybersecurity", "Cloud Solutions"].map((pillar, idx) => {
          const items = [
            ["24/7 infrastructure monitoring and alerting", "Desktop and server support for [X] endpoints", "Network maintenance and optimization", "VoIP system management", "Dedicated Technijians pod team assigned to your account"],
            ["CrowdStrike endpoint protection deployment and management", "Continuous threat monitoring and incident response", "Security awareness training for staff", "Vulnerability assessments and remediation"],
            ["Microsoft 365 administration and support", "Cloud migration planning and execution", "Backup and disaster recovery configuration", "[Additional cloud services as discussed]"],
          ][idx];
          const colors = [CORE_BLUE, CORE_ORANGE, TEAL];
          return [
            // Pillar header bar
            new Table({
              width: { size: 9360, type: WidthType.DXA },
              columnWidths: [9360],
              rows: [new TableRow({
                children: [new TableCell({
                  borders: noBorders,
                  width: { size: 9360, type: WidthType.DXA },
                  shading: { fill: colors[idx], type: ShadingType.CLEAR },
                  margins: { top: 80, bottom: 80, left: 200, right: 200 },
                  children: [new Paragraph({
                    children: [new TextRun({ text: pillar, font: "Open Sans", size: 24, bold: true, color: WHITE })]
                  })]
                })]
              })]
            }),
            ...items.map(item => new Paragraph({
              numbering: { reference: "bullets", level: 0 },
              spacing: { after: 60 },
              children: [new TextRun({ text: item, font: "Open Sans", size: 24, color: BRAND_GREY })]
            })),
            new Paragraph({ spacing: { after: 160 }, children: [] }),
          ];
        }).flat(),

        new Paragraph({ children: [new PageBreak()] }),

        // ========== SERVICE LEVEL AGREEMENT ==========
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("Service Level Agreement")]
        }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        sectionHeader("Service Level Agreement"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Technijian commits to the following service levels for the duration of this engagement:", font: "Open Sans", size: 24, color: BRAND_GREY })]
        }),

        // SLA metric callout cards
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 3120, 3120],
          rows: [new TableRow({
            children: [
              { num: "99.9%", label: "Uptime Guarantee" },
              { num: "15 min", label: "Critical Response" },
              { num: "24/7", label: "Support Availability" },
            ].map(item =>
              new TableCell({
                borders: noBorders,
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 80, right: 80 },
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: item.num, font: "Open Sans", size: 48, bold: true, color: CORE_BLUE })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: item.label, font: "Open Sans", size: 18, color: BRAND_GREY })] }),
                ]
              })
            )
          })]
        }),

        new Paragraph({ spacing: { before: 200 }, children: [] }),

        // Detailed SLA table
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 6240],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders, width: { size: 3120, type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "Metric", bold: true, color: WHITE, font: "Open Sans", size: 22 })] })]
                }),
                new TableCell({
                  borders, width: { size: 6240, type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "Commitment", bold: true, color: WHITE, font: "Open Sans", size: 22 })] })]
                })
              ]
            }),
            ...([
              ["Response Time (Critical)", "15 minutes"],
              ["Response Time (High)", "1 hour"],
              ["Response Time (Normal)", "4 business hours"],
              ["System Uptime", "99.9% monthly"],
              ["Support Availability", "24/7/365"],
              ["Dedicated Pod Team", "Named technicians assigned to your account"],
            ]).map((row, i) => new TableRow({
              children: [
                new TableCell({
                  borders, width: { size: 3120, type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: i % 2 === 0 ? WHITE : OFF_WHITE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: row[0], bold: true, font: "Open Sans", size: 22, color: DARK_CHARCOAL })] })]
                }),
                new TableCell({
                  borders, width: { size: 6240, type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: i % 2 === 0 ? WHITE : OFF_WHITE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: row[1], font: "Open Sans", size: 22, color: BRAND_GREY })] })]
                })
              ]
            }))
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ========== INVESTMENT & PRICING ==========
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("Investment & Pricing")]
        }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        sectionHeader("Investment & Pricing"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "The following table outlines the monthly investment for the services described in this proposal. All pricing is transparent with no hidden fees.", font: "Open Sans", size: 24, color: BRAND_GREY })]
        }),

        // Pricing table
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: colWidths,
          rows: [
            // Header row
            new TableRow({
              children: [
                new TableCell({
                  borders, width: { size: colWidths[0], type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "Service", bold: true, color: WHITE, font: "Open Sans", size: 22 })] })]
                }),
                new TableCell({
                  borders, width: { size: colWidths[1], type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, color: WHITE, font: "Open Sans", size: 22 })] })]
                }),
                new TableCell({
                  borders, width: { size: colWidths[2], type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Monthly Cost", bold: true, color: WHITE, font: "Open Sans", size: 22 })] })]
                })
              ]
            }),
            // Data rows
            ...([
              ["Managed IT", "24/7 monitoring, desktop/server support, network maintenance", "$X,XXX"],
              ["Cybersecurity", "CrowdStrike endpoint protection, threat monitoring, incident response", "$X,XXX"],
              ["Cloud Services", "Microsoft 365 administration, backup, disaster recovery", "$X,XXX"],
              ["Strategic Consulting", "Quarterly business reviews, technology roadmapping", "$X,XXX"],
            ]).map((row, i) => new TableRow({
              children: [
                new TableCell({
                  borders, width: { size: colWidths[0], type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: i % 2 === 0 ? WHITE : OFF_WHITE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: row[0], bold: true, font: "Open Sans", size: 22, color: DARK_CHARCOAL })] })]
                }),
                new TableCell({
                  borders, width: { size: colWidths[1], type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: i % 2 === 0 ? WHITE : OFF_WHITE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: row[1], font: "Open Sans", size: 22, color: BRAND_GREY })] })]
                }),
                new TableCell({
                  borders, width: { size: colWidths[2], type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: i % 2 === 0 ? WHITE : OFF_WHITE, type: ShadingType.CLEAR },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: row[2], bold: true, font: "Open Sans", size: 22, color: DARK_CHARCOAL })] })]
                })
              ]
            })),
            // Total row
            new TableRow({
              children: [
                new TableCell({
                  borders, width: { size: colWidths[0], type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: DARK_CHARCOAL, type: ShadingType.CLEAR },
                  columnSpan: 2,
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Total Monthly Investment", bold: true, color: WHITE, font: "Open Sans", size: 22 })] })]
                }),
                new TableCell({
                  borders, width: { size: colWidths[2], type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: DARK_CHARCOAL, type: ShadingType.CLEAR },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "$XX,XXX", bold: true, color: CORE_ORANGE, font: "Open Sans", size: 24 })] })]
                })
              ]
            })
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ========== ABOUT TECHNIJIAN ==========
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("About Technijian")]
        }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        sectionHeader("About Technijian"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Founded in 2000, Technijian delivers managed IT services, cybersecurity, cloud solutions, compliance support, and AI-driven development for small and mid-sized businesses. With offices in Irvine, CA and India, our dedicated Technijians pod model provides 24/7 support from a team that knows your infrastructure inside and out.", font: "Open Sans", size: 24, color: BRAND_GREY })]
        }),

        // Why Technijian - visual cards
        new Paragraph({ spacing: { before: 100 }, children: [] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 4680],
          rows: [
            new TableRow({
              children: [
                { icon: "25+", title: "Years of Experience", desc: "Continuous operation serving SMBs and mid-market enterprises" },
                { icon: "Pod", title: "Dedicated Team Model", desc: "Your own Technijians team that knows your systems inside and out" },
              ].map(item =>
                new TableCell({
                  borders: { top: { style: BorderStyle.SINGLE, size: 2, color: CORE_BLUE }, bottom: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY }, left: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY }, right: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY } },
                  width: { size: 4680, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 160, right: 160 },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: item.icon, font: "Open Sans", size: 32, bold: true, color: CORE_BLUE })] }),
                    new Paragraph({ children: [new TextRun({ text: item.title, font: "Open Sans", size: 22, bold: true, color: DARK_CHARCOAL })] }),
                    new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: item.desc, font: "Open Sans", size: 20, color: BRAND_GREY })] }),
                  ]
                })
              )
            }),
            new TableRow({
              children: [
                { icon: "24/7", title: "Global Support", desc: "U.S. and India offices providing round-the-clock support at no extra cost" },
                { icon: "AI+", title: "Innovation-Forward", desc: "Cybersecurity-first approach with AI-driven tools and CrowdStrike protection" },
              ].map(item =>
                new TableCell({
                  borders: { top: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY }, bottom: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY }, left: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY }, right: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GREY } },
                  width: { size: 4680, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 160, right: 160 },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: item.icon, font: "Open Sans", size: 32, bold: true, color: CORE_BLUE })] }),
                    new Paragraph({ children: [new TextRun({ text: item.title, font: "Open Sans", size: 22, bold: true, color: DARK_CHARCOAL })] }),
                    new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: item.desc, font: "Open Sans", size: 20, color: BRAND_GREY })] }),
                  ]
                })
              )
            }),
          ]
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ========== NEXT STEPS ==========
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("Next Steps")]
        }),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        sectionHeader("Next Steps"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "We\u2019re ready to get started whenever you are. Here\u2019s what happens next:", font: "Open Sans", size: 24, color: BRAND_GREY })]
        }),

        // Numbered steps with visual treatment
        ...[
          "Review this proposal and let us know if you have any questions",
          "Schedule a follow-up call to discuss any adjustments",
          "Sign the service agreement and onboarding paperwork",
          "Kick off onboarding with your dedicated Technijians pod team",
          "Begin proactive monitoring and support"
        ].map((item, i) => new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [600, 8760],
          rows: [new TableRow({
            children: [
              new TableCell({
                borders: noBorders,
                width: { size: 600, type: WidthType.DXA },
                shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
                margins: { top: 60, bottom: 60, left: 0, right: 0 },
                children: [new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `${i + 1}`, font: "Open Sans", size: 24, bold: true, color: WHITE })]
                })]
              }),
              new TableCell({
                borders: noBorders,
                width: { size: 8760, type: WidthType.DXA },
                margins: { top: 60, bottom: 60, left: 160, right: 0 },
                children: [new Paragraph({
                  children: [new TextRun({ text: item, font: "Open Sans", size: 24, color: BRAND_GREY })]
                })]
              }),
            ]
          })]
        })),

        // CTA Banner
        new Paragraph({ spacing: { before: 400 }, children: [] }),
        colorBanner("Ready to talk? Contact Ravi Jain at rjain@technijian.com or call 949.379.8500", CORE_BLUE, WHITE, 22),
        new Paragraph({ spacing: { before: 80 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "technijian.com", font: "Open Sans", size: 22, color: CORE_BLUE })]
        }),
      ]
    }
  ]
});

const outPath = path.join(__dirname, '..', 'assets', 'print', 'templates', 'technijian-proposal-template.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Created: ' + outPath);
}).catch(err => console.error('Error:', err));
