const { Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat,
        BorderStyle, WidthType, ShadingType, PageBreak } = require('docx');
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
      children: h.coverPage(logoData, "Acceptable Use Policy", "IT Systems and Services \u2014 [Client Name]", "Effective Date: [Month Day, Year]") },

    // Body
    { properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 } } },
      headers: { default: h.brandedHeader(logoData) },
      footers: { default: h.brandedFooter() },
      children: [
        h.numberedSectionHeader("1", "Purpose & Scope"),
        h.bodyText("This Acceptable Use Policy (\u201CPolicy\u201D) defines the permitted and prohibited uses of IT systems, networks, and services managed by Technijian on behalf of [Client Name] (\u201CCompany\u201D). This Policy applies to all employees, contractors, vendors, and any individual granted access to Company IT systems."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("2", "Acceptable Use"),
        h.bodyText("Company IT systems are provided for business purposes. Limited personal use is permitted provided it does not interfere with job duties, consume excessive resources, or violate any section of this Policy. Users must:"),
        ...["Use IT systems in a professional, ethical, and lawful manner",
            "Protect their credentials and never share passwords or MFA tokens",
            "Report any suspected security incidents immediately",
            "Comply with all applicable laws, regulations, and Company policies",
            "Use only licensed and approved software"
        ].map(item => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("3", "Prohibited Activities"),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        h.importantCallout("The following activities are strictly prohibited and may result in disciplinary action, termination of access, or legal action."),
        new Paragraph({ spacing: { before: 120 }, children: [] }),
        ...["Unauthorized access to systems, data, or networks not assigned to the user",
            "Installing unauthorized software, malware, or hacking tools",
            "Attempting to bypass security controls, firewalls, or access restrictions",
            "Sharing, exporting, or exfiltrating confidential or proprietary data",
            "Using Company systems for illegal activities, harassment, or discrimination",
            "Connecting unauthorized devices to the Company network",
            "Using Company email for mass unsolicited messages (spam)",
            "Downloading or distributing copyrighted material without authorization",
            "Disabling or tampering with security software (antivirus, EDR, MFA)"
        ].map(item => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("4", "Security Requirements"),
        h.subsectionHeading("4.1", "Passwords & Authentication"),
        ...["Passwords must meet minimum complexity requirements (12+ characters, mixed case, numbers, symbols)",
            "Multi-factor authentication (MFA) is required for all remote access and cloud services",
            "Passwords must not be reused across systems or shared with others",
            "Password managers are recommended for secure credential storage"
        ].map(item => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        h.subsectionHeading("4.2", "Device Management"),
        ...["All devices accessing Company systems must be enrolled in the management platform",
            "Devices must have current operating system patches and security updates",
            "Full-disk encryption must be enabled on all devices",
            "Devices must lock automatically after [5] minutes of inactivity"
        ].map(item => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ children: [new PageBreak()] }),

        h.numberedSectionHeader("5", "Monitoring & Privacy"),
        h.bodyText("Company reserves the right to monitor, log, and audit all activity on Company IT systems. Users should have no expectation of privacy when using Company-provided equipment or services. Monitoring may include email, internet usage, file access, and system activity. All monitoring is conducted in accordance with applicable laws."),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("6", "Data Handling"),
        h.statusTable(
          ["Classification", "Definition", "Handling"],
          [["Confidential", "Trade secrets, PII, financial data, credentials", "Encrypted at rest and in transit; access restricted"],
           ["Internal", "Business plans, policies, internal communications", "Do not share externally; stored on Company systems"],
           ["Public", "Marketing materials, published content", "No restrictions on sharing"]]
        ),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("7", "Incident Reporting"),
        h.bodyText("Users must immediately report any suspected or actual security incidents to the Technijian support team:"),
        ...["Suspected phishing emails or social engineering attempts",
            "Unauthorized access or unusual system behavior",
            "Lost or stolen devices",
            "Accidental disclosure of confidential information",
            "Suspected malware infection"
        ].map(item => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),
        new Paragraph({ spacing: { before: 80 }, children: [] }),
        h.colorBanner("Report incidents: helpdesk@technijian.com | 949.379.8500", h.TEAL, h.WHITE, 22),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("8", "Enforcement"),
        h.bodyText("Violations of this Policy may result in:"),
        ...["Temporary or permanent revocation of system access",
            "Disciplinary action up to and including termination of employment",
            "Civil or criminal liability for illegal activities",
            "Reporting to relevant authorities as required by law"
        ].map(item => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
          children: [new TextRun({ text: item, size: 22, color: h.BRAND_GREY })] })),

        new Paragraph({ spacing: { before: 200 }, children: [] }),
        h.numberedSectionHeader("9", "Acknowledgment"),
        h.bodyText("By signing below, I acknowledge that I have read, understood, and agree to comply with this Acceptable Use Policy."),

        // Single-column signature (policy, not mutual agreement)
        new Paragraph({ spacing: { before: 300, after: 40 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: h.DARK_CHARCOAL, space: 4 } },
          children: [new TextRun({ text: " ", size: 22 })] }),
        new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Employee / User Signature", size: 18, italics: true, color: h.BRAND_GREY })] }),
        new Paragraph({ spacing: { before: 200, after: 40 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: h.LIGHT_GREY, space: 4 } },
          children: [new TextRun({ text: " ", size: 22 })] }),
        new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Printed Name", size: 18, italics: true, color: h.BRAND_GREY })] }),
        new Paragraph({ spacing: { before: 200, after: 40 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: h.LIGHT_GREY, space: 4 } },
          children: [new TextRun({ text: " ", size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: "Date", size: 18, italics: true, color: h.BRAND_GREY })] }),
      ]
    }
  ]
});

const outPath = path.join(__dirname, '..', 'assets', 'print', 'templates', 'technijian-aup-template.docx');
Packer.toBuffer(doc).then(buffer => { fs.writeFileSync(outPath, buffer); console.log('Created: ' + outPath); });
