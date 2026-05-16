const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  TabStopType, TabStopPosition, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak, ExternalHyperlink
} = require('docx');

// Brand colors (no #)
const CORE_BLUE = "006DB6";
const CORE_ORANGE = "F67D4B";
const TEAL = "1EAAC8";
const DARK_CHARCOAL = "1A1A2E";
const BRAND_GREY = "59595B";
const OFF_WHITE = "F8F9FA";
const WHITE = "FFFFFF";
const LIGHT_GREY = "E9ECEF";
const SUCCESS_GREEN = "28A745";
const ALERT_RED = "CC0000";

const FONT = "Open Sans";

// helpers
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY };
const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

function P(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 60, after: opts.after ?? 60, line: 300 },
    alignment: opts.align,
    children: [new TextRun({
      text,
      size: opts.size ?? 22,
      bold: opts.bold ?? false,
      italics: opts.italic ?? false,
      color: opts.color ?? BRAND_GREY,
      font: FONT,
    })],
  });
}

function blank(height = 60) {
  return new Paragraph({ spacing: { before: 0, after: height }, children: [new TextRun({ text: "", font: FONT })] });
}

function h2(text) {
  resetSteps();
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    keepNext: true,
    keepLines: true,
    children: [new TextRun({ text, font: FONT, bold: true, size: 28, color: CORE_BLUE })],
  });
}

function h3(text) {
  resetSteps();
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 220, after: 100 },
    keepNext: true,
    keepLines: true,
    children: [new TextRun({ text, font: FONT, bold: true, size: 24, color: DARK_CHARCOAL })],
  });
}

function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 40, after: 40, line: 280 },
    children: [new TextRun({ text, font: FONT, size: 22, color: BRAND_GREY, ...opts })],
  });
}

// Step counter — increments via S() / RS(). Reset with resetSteps().
let _step = 0;
function resetSteps() { _step = 0; }
function S(text) {
  _step += 1;
  return new Paragraph({
    spacing: { before: 40, after: 40, line: 280 },
    indent: { left: 600, hanging: 320 },
    children: [
      new TextRun({ text: `${_step}.  `, font: FONT, size: 22, bold: true, color: CORE_BLUE }),
      new TextRun({ text, font: FONT, size: 22, color: BRAND_GREY }),
    ],
  });
}
function RS(boldLead, rest) {
  _step += 1;
  return new Paragraph({
    spacing: { before: 40, after: 40, line: 280 },
    indent: { left: 600, hanging: 320 },
    children: [
      new TextRun({ text: `${_step}.  `, font: FONT, size: 22, bold: true, color: CORE_BLUE }),
      new TextRun({ text: boldLead, font: FONT, size: 22, bold: true, color: DARK_CHARCOAL }),
      new TextRun({ text: rest, font: FONT, size: 22, color: BRAND_GREY }),
    ],
  });
}

function note(text, kind = "NOTE") {
  const colorMap = { NOTE: TEAL, IMPORTANT: CORE_ORANGE, TIP: SUCCESS_GREEN, WARNING: ALERT_RED };
  const accent = colorMap[kind] || TEAL;
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [120, 9240],
    borders: noBorders,
    rows: [new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          shading: { fill: accent, type: ShadingType.CLEAR },
          borders: noBorders,
          width: { size: 120, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: "", font: FONT })] })],
        }),
        new TableCell({
          borders: noBorders,
          shading: { fill: OFF_WHITE, type: ShadingType.CLEAR },
          width: { size: 9240, type: WidthType.DXA },
          margins: { top: 140, bottom: 140, left: 200, right: 160 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 60 },
              children: [new TextRun({ text: kind, font: FONT, bold: true, size: 18, color: accent })],
            }),
            new Paragraph({
              spacing: { before: 0, after: 0, line: 280 },
              children: [new TextRun({ text, font: FONT, size: 22, color: DARK_CHARCOAL })],
            }),
          ],
        }),
      ],
    })],
  });
}

// Section-break accent header — resets step counter
function sectionBar(title, accent = CORE_BLUE) {
  resetSteps();
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [120, 9240],
    borders: noBorders,
    rows: [new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          shading: { fill: accent, type: ShadingType.CLEAR },
          borders: noBorders,
          width: { size: 120, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: "", font: FONT })] })],
        }),
        new TableCell({
          borders: noBorders,
          width: { size: 9240, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 200, right: 0 },
          children: [new Paragraph({
            spacing: { before: 0, after: 0 },
            keepNext: true,
            children: [new TextRun({ text: title, font: FONT, bold: true, size: 32, color: accent })],
          })],
        }),
      ],
    })],
  });
}

function kvTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3000, 6360],
    rows: rows.map((r, idx) => new TableRow({
      children: [
        new TableCell({
          width: { size: 3000, type: WidthType.DXA },
          borders: cellBorders,
          shading: { fill: idx % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 140, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: r[0], font: FONT, bold: true, size: 21, color: DARK_CHARCOAL })] })],
        }),
        new TableCell({
          width: { size: 6360, type: WidthType.DXA },
          borders: cellBorders,
          shading: { fill: idx % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 140, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: r[1], font: FONT, size: 21, color: BRAND_GREY })] })],
        }),
      ],
    })),
  });
}

function headerTable(headers, rows, widths, opts = {}) {
  const totalWidth = widths.reduce((a, b) => a + b, 0);
  const pad = opts.tight ? 50 : 90;
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: headers.map((h, i) => new TableCell({
          width: { size: widths[i], type: WidthType.DXA },
          borders: cellBorders,
          shading: { fill: CORE_BLUE, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 140, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: h, font: FONT, bold: true, size: 22, color: WHITE })] })],
        })),
      }),
      ...rows.map((row, ridx) => new TableRow({
        cantSplit: true,
        children: row.map((cell, i) => new TableCell({
          width: { size: widths[i], type: WidthType.DXA },
          borders: cellBorders,
          shading: { fill: ridx % 2 === 0 ? OFF_WHITE : WHITE, type: ShadingType.CLEAR },
          margins: { top: pad, bottom: pad, left: 140, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: cell, font: FONT, size: opts.tight ? 20 : 21, color: BRAND_GREY })] })],
        })),
      })),
    ],
  });
}

function colorBar(color, heightPx = 8) {
  const dxa = Math.round(heightPx * 20);
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    borders: noBorders,
    rows: [new TableRow({
      height: { value: dxa, rule: "exact" },
      children: [new TableCell({
        width: { size: 9360, type: WidthType.DXA },
        borders: noBorders,
        shading: { fill: color, type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: "", font: FONT, size: 2 })] })],
      })],
    })],
  });
}

// =========================================================================
// COVER PAGE  (compact — must fit on 1 page)
// =========================================================================
const logoBuffer = fs.readFileSync(path.join(__dirname, 'logo.png'));

const coverChildren = [
  colorBar(CORE_BLUE, 8),
  blank(400),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 100 },
    children: [new ImageRun({
      type: "png",
      data: logoBuffer,
      transformation: { width: 240, height: 50 },
      altText: { title: "Technijian", description: "Technijian logo", name: "TechnijianLogo" },
    })],
  }),
  blank(120),
  new Table({
    width: { size: 1080, type: WidthType.DXA },
    columnWidths: [1080],
    alignment: AlignmentType.CENTER,
    borders: noBorders,
    rows: [new TableRow({
      height: { value: 50, rule: "exact" },
      children: [new TableCell({
        width: { size: 1080, type: WidthType.DXA },
        borders: noBorders,
        shading: { fill: CORE_ORANGE, type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: "", font: FONT, size: 2 })] })],
      })],
    })],
  }),
  blank(200),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: "Technijian My Disk", font: FONT, bold: true, size: 60, color: DARK_CHARCOAL })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text: "Client Machine Setup & Configuration Guide", font: FONT, size: 30, color: CORE_BLUE })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 320 },
    children: [new TextRun({ text: "Standard Operating Procedure  ·  v1.1  ·  May 2026", font: FONT, italics: true, size: 22, color: BRAND_GREY })],
  }),

  kvTable([
    ["Document Title", "Technijian My Disk – Client Setup Procedure"],
    ["Client", "Via Auto Finance (VAF)"],
    ["Version", "1.1"],
    ["Prepared By", "Technijian IT Team"],
    ["Department", "Information Technology"],
    ["Platform Basis", "Nextcloud (white-labeled as Technijian My Disk)"],
    ["Server URL", "https://vaf-mydisk2.technijian.com"],
    ["Support Email", "support@technijian.com"],
    ["SSO Domain", "viaautofinance.com"],
    ["Applies To", "All VAF client machines – Windows, macOS, iOS & Android"],
    ["Issue Date", "May 2026"],
    ["Classification", "Internal Use Only"],
  ]),

  blank(280),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60 },
    children: [new TextRun({ text: "CONFIDENTIAL  ·  INTERNAL USE ONLY", font: FONT, bold: true, size: 20, color: CORE_ORANGE })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 120 },
    children: [new TextRun({ text: "© Technijian  ·  technology as a solution", font: FONT, italics: true, size: 18, color: BRAND_GREY })],
  }),
  colorBar(CORE_ORANGE, 8),

  new Paragraph({ children: [new PageBreak()] }),
];

// =========================================================================
// SECTION 0 — About this document / TOC
// =========================================================================
const aboutSection = [
  sectionBar("About This Document"),
  blank(120),
  P("This document is the official setup and configuration procedure for Technijian My Disk — a secure, white-labeled cloud file-sharing platform delivered by Technijian to Via Auto Finance (VAF). My Disk is built on the Nextcloud open-source platform, hosted and managed by the Technijian Cloud team, and accessible at https://vaf-mydisk2.technijian.com.", { after: 100 }),
  P("Use this guide to install the desktop client on Windows or macOS, connect to the VAF tenant via SSO, sync shared and personal folders, and apply Technijian's recommended security baseline.", { after: 120 }),
  blank(140),
  h2("Contents at a Glance"),
  headerTable(
    ["#", "Section", "Audience"],
    [
      ["1", "Purpose & Scope", "All"],
      ["2", "Pre-Requisites", "IT, End-User"],
      ["3", "Downloading the Desktop Client", "End-User"],
      ["4", "Installation on Windows", "End-User, Helpdesk"],
      ["5", "Installation on macOS", "End-User, Helpdesk"],
      ["6", "First-Time Configuration & SSO Login", "End-User"],
      ["7", "Verifying the Connection", "End-User"],
      ["8", "File Sharing & Collaboration", "End-User"],
      ["9", "Two-Factor Authentication (2FA)", "All"],
      ["10", "Map as a Network Drive (WebDAV)", "Power Users"],
      ["11", "Mobile Apps – iOS & Android", "End-User"],
      ["12", "Web Portal Tour", "End-User"],
      ["13", "Recommended Settings & Best Practices", "All"],
      ["14", "Troubleshooting Common Issues", "Helpdesk"],
      ["15", "Uninstallation / Removal", "End-User, IT"],
      ["16", "Support & Contact Information", "All"],
      ["17", "Glossary of Terms", "All"],
      ["18", "Document Revision History", "Doc Owner"],
    ],
    [600, 6360, 2400],
    { tight: true },
  ),
];

// =========================================================================
// SECTION 1 — Purpose & Scope
// =========================================================================
const sec1 = [
  sectionBar("1. Purpose & Scope"),
  blank(100),
  P("This document provides step-by-step instructions for IT administrators and end-users at Via Auto Finance (VAF) to install, configure, and connect Technijian My Disk on client machines.", { after: 100 }),
  P("Technijian My Disk is VAF's branded cloud file-sharing platform, hosted at https://vaf-mydisk2.technijian.com — built on Nextcloud and managed by the Technijian IT team. Following this procedure ensures consistent, secure, and auditable access to shared drives and personal cloud storage across all company-managed devices."),
  h2("1.1 Scope of Application"),
  bullet("All Windows 10 / 11 workstations and laptops"),
  bullet("macOS 12 Monterey and later devices"),
  bullet("iOS 15+ and Android 10+ devices (mobile section)"),
  bullet("Devices managed under the Via Auto Finance (VAF) domain"),
  bullet("New-employee onboarding setups"),
  h2("1.2 Audience"),
  headerTable(
    ["Audience", "Usage"],
    [
      ["IT Administrators", "Deploy and configure Technijian My Disk for multiple users; manage shares and quotas"],
      ["End-Users", "Self-service setup on personal workstations and mobile devices"],
      ["Helpdesk Staff", "Assist users with connectivity, sync, and credential troubleshooting"],
      ["Security & Compliance", "Validate 2FA, audit trail, and data-handling controls"],
    ],
    [2600, 6760],
  ),
];

// =========================================================================
// SECTION 2 — Pre-Requisites
// =========================================================================
const sec2 = [
  sectionBar("2. Pre-Requisites"),
  blank(100),
  P("Ensure all of the following requirements are met before beginning the installation."),
  h2("2.1 System Requirements"),
  headerTable(
    ["Component", "Minimum Requirement"],
    [
      ["Operating System", "Windows 10 (21H2+) or Windows 11 · macOS 12 Monterey and above"],
      ["RAM", "4 GB minimum  ·  8 GB recommended"],
      ["Disk Space", "500 MB for the desktop client  ·  plus enough free space for synced data"],
      ["Internet", "Stable broadband or corporate LAN  ·  minimum 10 Mbps recommended"],
      ["Browser (Web)", "Chrome 100+  ·  Firefox 100+  ·  Edge 100+  ·  Safari 15+"],
      ["Client Version", "Nextcloud Desktop Client 3.10 or newer"],
    ],
    [2800, 6560],
  ),
  h2("2.2 Account & Network Requirements"),
  bullet("A valid Technijian My Disk user account — provisioned by IT for VAF staff"),
  bullet("Corporate network access OR VPN connected (for VAF internal domain access)"),
  bullet("Server URL: https://vaf-mydisk2.technijian.com"),
  bullet("Firewall / proxy rules permitting HTTPS (port 443) to *.technijian.com"),
  bullet("If you use a corporate proxy, ensure the proxy allows WebSocket and HTTP/2 traffic"),
  blank(80),
  note("If you do not have credentials, raise a request via the IT helpdesk at support@technijian.com before proceeding. Your login will use your VAF domain account (username@viaautofinance.com).", "NOTE"),
];

// =========================================================================
// SECTION 3 — Downloading the Desktop Client
// =========================================================================
const sec3 = [
  sectionBar("3. Downloading the Desktop Client"),
  blank(100),
  P("Technijian My Disk uses the Nextcloud Desktop Client as its foundation. Download the client directly from the Technijian My Disk portal — this ensures version compatibility with the VAF tenant."),
  h2("3.1 Windows"),
  RS("Open your browser ", "and navigate to https://vaf-mydisk2.technijian.com"),
  RS("Log in ", "with your VAF credentials (username@viaautofinance.com)."),
  RS("Click your profile icon ", "(top-right) and select Apps or Downloads."),
  RS("Download the Windows Desktop Client ", "(.exe installer)."),
  RS("For mass deployment, ", "request the MSI package from IT for silent installation via Intune, SCCM, or Group Policy."),
  blank(60),
  note("The installer is also available from the IT software repository depending on your environment. Always use the version provided through Technijian to maintain version parity with the server.", "NOTE"),
  h2("3.2 macOS"),
  RS("Open your browser ", "and navigate to https://vaf-mydisk2.technijian.com"),
  RS("Log in ", "with your VAF credentials (username@viaautofinance.com)."),
  RS("Click your profile icon ", "and select Apps or Downloads."),
  RS("Download the macOS Desktop Client ", "(.pkg or .dmg file)."),
  RS("If prompted, ", "allow downloads from the Technijian domain in your browser settings."),
];

// =========================================================================
// SECTION 4 — Installation on Windows
// =========================================================================
const sec4 = [
  sectionBar("4. Installation on Windows"),
  blank(100),
  h2("4.1 Standard Installation"),
  RS("Locate the downloaded installer file ", "(e.g., Nextcloud-x.x.x-setup.exe)."),
  RS("Right-click ", "the installer and select Run as Administrator."),
  RS("Click Yes ", "on the User Account Control (UAC) prompt."),
  RS("The setup wizard opens — ", "click Next to proceed."),
  RS("Accept ", "the License Agreement and click Next."),
  RS("Choose the installation directory ", "(default: C:\\Program Files\\Nextcloud) and click Next."),
  RS("Click Install ", "and wait for the installation to complete."),
  RS("Check ", "\"Launch Nextcloud after installation\" and click Finish."),
  blank(60),
  note("Do NOT install under a network drive or redirected folder. Always install to local storage. Installing under a OneDrive- or roaming-profile-redirected path will cause sync conflicts.", "IMPORTANT"),
  h2("4.2 Optional — Enable Virtual Files (Files-on-Demand)"),
  P("Virtual Files lets My Disk show all server-side files in Explorer without downloading them locally until opened. This is ideal for laptops with limited disk space."),
  RS("After login, ", "in the Nextcloud client click your account avatar  →  Settings."),
  RS("Under the account, ", "click the three-dot menu next to the sync folder and select \"Enable virtual file support\"."),
  RS("Confirm ", "and allow the client to convert your sync folder. Existing local copies are preserved."),
  blank(60),
  note("Virtual Files requires Windows 10 build 1809 or later and the Cloud Files API (enabled by default on Windows 11).", "NOTE"),
];

// =========================================================================
// SECTION 5 — Installation on macOS
// =========================================================================
const sec5 = [
  sectionBar("5. Installation on macOS"),
  blank(100),
  h2("5.1 Standard Installation"),
  RS("Open ", "the downloaded .pkg or .dmg file."),
  RS("If using a .dmg: ", "drag the Nextcloud icon into your Applications folder."),
  RS("If using a .pkg: ", "follow the on-screen installer steps and click Install."),
  RS("If macOS Gatekeeper blocks the installer, ", "go to System Settings  →  Privacy & Security and click Open Anyway."),
  RS("Once installed, ", "open Nextcloud from your Applications folder or Launchpad."),
  blank(60),
  note("On Apple Silicon (M1/M2/M3/M4) Macs, the client runs natively — no Rosetta 2 emulation required for recent client versions.", "NOTE"),
  h2("5.2 Grant Required macOS Permissions"),
  P("On first launch, macOS will request several permissions. Approve each prompt so My Disk can work correctly with Finder."),
  bullet("Files and Folders — required for sync"),
  bullet("Login Items — recommended to start My Disk automatically"),
  bullet("Notifications — required to surface sync errors and share alerts"),
  bullet("Finder Extension — System Settings  →  Privacy & Security  →  Extensions  →  Added Extensions  →  enable Nextcloud Finder Integration"),
];

// =========================================================================
// SECTION 6 — First-Time Configuration & Account Setup
// =========================================================================
const sec6 = [
  sectionBar("6. First-Time Configuration & SSO Login"),
  blank(100),
  P("After installation, the Nextcloud Setup Wizard will launch automatically. Follow the steps below to connect the client to Technijian My Disk."),
  h2("6.1 Connecting to the My Disk Server"),
  RS("On the Welcome screen, ", "click Log in."),
  RS("In the Server Address field, ", "enter https://vaf-mydisk2.technijian.com"),
  RS("Click Next. ", "The client verifies the server connection."),
  RS("Your browser opens automatically ", "for authentication. Log in using your VAF SSO credentials (username@viaautofinance.com)."),
  RS("Once authenticated, ", "click Grant Access in the browser window."),
  RS("Return to the desktop client ", "— it will confirm the connection was successful."),
  blank(60),
  note("SSO is configured for the viaautofinance.com domain. You will be redirected to the VAF login portal — use your standard VAF Windows / Active Directory credentials (username@viaautofinance.com). If MFA is enforced, you will be prompted on your registered authenticator app or device.", "NOTE"),
  h2("6.2 Configuring Sync Folders"),
  RS("After login, ", "the client prompts you to choose what to sync."),
  RS("Select ", "\"Sync everything from server\" OR \"Choose what to sync\" to pick specific directories."),
  RS("Set the Local Folder path ", "— the default is:"),
  bullet("Windows: C:\\Users\\[VAFUsername]\\Technijian My Disk"),
  bullet("macOS: /Users/[VAFUsername]/Technijian My Disk"),
  RS("Optionally ", "set a size threshold for prompting on large folders (default 500 MB)."),
  RS("Click ", "\"Add Sync Connection\" to finalise."),
  RS("The initial sync begins ", "— duration depends on data volume."),
  blank(60),
  note("Do not power off or disconnect from the network during the initial synchronisation. Allow the sync to complete fully — an interrupted first sync may leave temporary .~lock or .part files that need manual cleanup.", "IMPORTANT"),
];

// =========================================================================
// SECTION 7 — Verifying the Connection
// =========================================================================
const sec7 = [
  sectionBar("7. Verifying the Connection"),
  blank(100),
  h2("7.1 Desktop Client Status Icons"),
  headerTable(
    ["Status Icon", "Meaning"],
    [
      ["Green check", "Fully synced — all files are up to date"],
      ["Blue spinning arrow", "Sync in progress — files are being transferred"],
      ["Yellow warning", "Sync paused or partial issue — check client for details"],
      ["Red cross", "Connection error — check credentials and network"],
      ["Grey cloud", "Virtual file — stored on server only, not downloaded locally"],
    ],
    [2800, 6560],
  ),
  h2("7.2 File Explorer / Finder Integration"),
  bullet("Windows: Open File Explorer — look for Technijian My Disk in the left navigation pane under Quick Access."),
  bullet("macOS: Open Finder — Technijian My Disk should appear in the sidebar under Favourites."),
  bullet("Create a test file in the sync folder and confirm it appears on the web portal within a few seconds."),
  bullet("Right-click any synced file to see Nextcloud options: Share, Versions, Activity, Lock."),
];

// =========================================================================
// SECTION 8 — File Sharing & Collaboration (NEW)
// =========================================================================
const sec8 = [
  sectionBar("8. File Sharing & Collaboration"),
  blank(100),
  P("Technijian My Disk supports three sharing modes. Always choose the most restrictive mode that still meets your business need."),
  h2("8.1 Sharing Modes"),
  headerTable(
    ["Mode", "Who Can Access", "When to Use"],
    [
      ["Internal Share", "Specific VAF users or groups", "Default for day-to-day collaboration with colleagues"],
      ["Link Share", "Anyone with the URL (optionally password-protected)", "Sharing with external partners — always add a password and expiry"],
      ["Federated Share", "Users on another trusted Nextcloud server", "Cross-organisation projects approved by IT"],
    ],
    [1800, 3960, 3600],
  ),
  h2("8.2 Sharing a File or Folder"),
  RS("Right-click ", "the file or folder in File Explorer / Finder."),
  RS("Select ", "\"Share with Nextcloud\" (or open the file in the web portal and click the share icon)."),
  RS("Choose the share type ", "— internal user/group or link."),
  RS("Set permissions ", "— read, edit, create, delete, re-share. Use the minimum permissions needed."),
  RS("For external link shares, ", "always set a password and expiry date (max 30 days recommended)."),
  RS("Click ", "Send or Copy Link."),
  blank(60),
  note("All shares are logged. IT and Compliance can audit shares via the admin portal at any time. Do not share regulated data (PII, financial data, customer records) externally without written approval from the VAF Compliance Officer.", "IMPORTANT"),
  h2("8.3 File Versions & Recovery"),
  P("My Disk automatically keeps prior versions of every file you edit. You can restore an older version without an IT ticket."),
  RS("Open the file in the web portal ", "at https://vaf-mydisk2.technijian.com"),
  RS("Click the ", "three-dot menu beside the file name  →  Details  →  Versions tab."),
  RS("Hover the version you want and click ", "Restore."),
  blank(60),
  note("Deleted files go to the Deleted Files bin in the web portal and are recoverable for 30 days. After 30 days, contact IT to attempt recovery from server backups.", "TIP"),
];

// =========================================================================
// SECTION 9 — Two-Factor Authentication (NEW)
// =========================================================================
const sec9 = [
  sectionBar("9. Two-Factor Authentication (2FA)"),
  blank(100),
  P("Two-factor authentication is required for all VAF users accessing My Disk. 2FA is enforced at the SSO layer (VAF identity provider) and may also be configured directly inside My Disk for app passwords."),
  h2("9.1 Setting Up 2FA via SSO"),
  P("If MFA has not been enrolled in your VAF identity account, you will be prompted on your first My Disk login. Follow the on-screen instructions from your IT department — the most common method uses Microsoft Authenticator or another TOTP app."),
  h2("9.2 App Passwords for Desktop & Mobile Clients"),
  P("Some older desktop or mobile clients cannot complete the browser-based SSO flow. In that case, generate an app password from the web portal:"),
  RS("Log in ", "to https://vaf-mydisk2.technijian.com"),
  RS("Click your profile icon  →  ", "Settings  →  Security."),
  RS("Scroll to ", "\"Devices & sessions\"."),
  RS("Enter a name ", "(e.g., \"Work Laptop – Outlook\") and click Create new app password."),
  RS("Copy the generated password ", "— it will only be shown once."),
  RS("Use that app password ", "in the desktop / mobile client in place of your SSO password."),
  blank(60),
  note("App passwords bypass the browser SSO flow but still require your account to be active and in good standing. Revoke them immediately if a device is lost or stolen — Settings  →  Security  →  Devices & sessions  →  Revoke.", "WARNING"),
];

// =========================================================================
// SECTION 10 — WebDAV
// =========================================================================
const sec10 = [
  sectionBar("10. Optional: Map as a Network Drive (WebDAV)"),
  blank(100),
  P("For users who prefer traditional mapped-drive access without installing the desktop client, Technijian My Disk supports WebDAV mounting."),
  h2("10.1 Windows — Map Network Drive via WebDAV"),
  RS("Open File Explorer ", "and click on This PC."),
  RS("Click ", "Map Network Drive in the ribbon (or right-click This PC  →  Map Network Drive)."),
  RS("Choose a drive letter ", "(e.g., Z:)."),
  RS("In the Folder field, enter the WebDAV URL: ", "https://vaf-mydisk2.technijian.com/remote.php/dav/files/[VAFUsername]/"),
  RS("Check ", "\"Reconnect at sign-in\" and \"Use different credentials\"."),
  RS("Click Finish ", "and enter your VAF username and an app password (username@viaautofinance.com)."),
  RS("The drive appears ", "as a mapped network drive in File Explorer."),
  blank(60),
  note("WebDAV performance may be slower than the desktop client for large file transfers. The desktop client is recommended for heavy usage. If SSO is enforced, you must use an app password (see Section 9.2) — your regular AD password will fail.", "NOTE"),
  h2("10.2 macOS — Mount via Finder"),
  RS("Open Finder ", "and press Cmd + K (or Go  →  Connect to Server)."),
  RS("Enter the WebDAV URL: ", "https://vaf-mydisk2.technijian.com/remote.php/dav/files/[VAFUsername]/"),
  RS("Click Connect ", "and authenticate with your VAF credentials (or app password if SSO is enforced)."),
  RS("The share mounts ", "in Finder under Network locations."),
];

// =========================================================================
// SECTION 11 — Mobile Apps (NEW)
// =========================================================================
const sec11 = [
  sectionBar("11. Mobile Apps – iOS & Android"),
  blank(100),
  P("Technijian My Disk is fully accessible from mobile devices. The mobile app supports automatic photo upload, offline access, file sharing, and biometric unlock (Face ID / Touch ID / fingerprint). The same client serves both personal-folder access and any shared team folders your account has been granted."),
  blank(60),
  note("The mobile app is published under the \"Nextcloud\" name on both stores — it has not yet been fully white-labeled as \"My Disk\". Search for Nextcloud, look for the blue cloud icon, and confirm the publisher is \"Nextcloud GmbH\" before installing.", "NOTE"),

  h2("11.1 iOS — Install & Sign In"),
  RS("Unlock your iPhone or iPad ", "and open the App Store (blue \"A\" icon on your home screen)."),
  RS("Tap the Search tab ", "at the bottom of the screen."),
  RS("Type ", "Nextcloud in the search field and tap Search on the keyboard."),
  RS("Find the entry by ", "\"Nextcloud GmbH\" — the icon is a white cloud on a light-blue background — and tap GET."),
  RS("Authenticate with Face ID, Touch ID, or your Apple ID password ", "to start the download."),
  RS("Once installed, tap Open ", "(or tap the new Nextcloud icon on your home screen)."),
  RS("On the welcome screen, tap ", "\"Log in\"."),
  RS("In the Server Address field, enter: ", "https://vaf-mydisk2.technijian.com  — then tap the arrow to continue."),
  RS("Your default browser will open ", "(typically Safari) to the VAF SSO login page. Enter your VAF credentials (username@viaautofinance.com) and complete any MFA prompt."),
  RS("Tap ", "\"Grant access\" on the authorisation screen — the app returns to Nextcloud automatically."),
  RS("When prompted, allow Notifications ", "(required for share alerts and sync errors)."),
  RS("When prompted, allow access to Photos ", "only if you plan to use Auto Upload — otherwise deny."),

  h3("11.1.1 Enable App Lock (Face ID / Touch ID)"),
  RS("Tap the ", "\"...\" menu (top-left) or swipe right to open the sidebar."),
  RS("Tap Settings ", "near the bottom of the sidebar."),
  RS("Tap ", "\"Passcode lock\" and set a 4-digit passcode."),
  RS("Toggle on ", "\"Use Face ID\" (or Touch ID) to unlock with biometrics."),

  h2("11.2 Android — Install & Sign In"),
  RS("Open the Google Play Store ", "(the multi-colour triangle icon) — or F-Droid, if your device is managed by Technijian and Google Play is unavailable."),
  RS("Tap the search bar at the top ", "and type Nextcloud."),
  RS("Select the app by ", "\"Nextcloud GmbH\" (blue cloud icon) and tap Install."),
  RS("Wait for installation to complete, ", "then tap Open."),
  RS("On the welcome screen, tap ", "\"Log in\"."),
  RS("In the Server Address field, enter: ", "https://vaf-mydisk2.technijian.com  — then tap the arrow."),
  RS("Your default browser will open ", "(typically Chrome) to the VAF SSO login page. Enter your VAF credentials (username@viaautofinance.com) and complete MFA."),
  RS("Tap ", "\"Grant access\" on the authorisation screen — the app returns to Nextcloud."),
  RS("Allow Notifications ", "when prompted (required for sync alerts)."),
  RS("Allow Files & Media access only if needed ", "— deny Photos/Camera access if you do not plan to use Auto Upload."),

  h3("11.2.1 Enable App Lock (Fingerprint / PIN)"),
  RS("Tap your profile avatar ", "(top-left) and choose Settings."),
  RS("Tap ", "\"Lock app with PIN/fingerprint\"."),
  RS("Set a 4-digit PIN, then toggle on ", "\"Use fingerprint\" if your device supports it."),

  h2("11.3 Using the Mobile App"),
  P("The mobile app mirrors the web portal — but optimised for touch. Here is what you can do day-to-day."),
  bullet("Browse files — tap any folder to open it; pull down to refresh."),
  bullet("Open a file — tap once. PDFs, images, Office docs, and text files preview in-app. Other files download to a temp area, then open in the system viewer."),
  bullet("Download for offline — tap the \"...\" menu next to a file  →  \"Make available offline\". Offline files sync automatically when the file changes on the server."),
  bullet("Favourite a folder — tap the star icon next to it for a one-tap shortcut from the Favourites tab."),
  bullet("Upload from your device — tap the \"+\" floating button  →  \"Upload\" — pick photos, documents, or any file from your phone."),
  bullet("Share to Nextcloud from any other app — in the source app (Mail, Photos, Files, Drive, etc.) tap the system Share button and choose Nextcloud as the destination."),
  bullet("Share a My Disk file with someone — tap the \"...\" menu next to a file  →  Share  →  choose internal user, group, or public link."),
  bullet("View activity — swipe right (sidebar)  →  Activity for a feed of recent changes and share events on your files."),

  h2("11.4 Optional: Auto Upload of Camera Roll"),
  P("Auto Upload mirrors your phone's camera roll into a folder on My Disk. Useful for field staff who need photos captured on a phone to land in shared team folders automatically."),
  RS("Open Settings ", "in the sidebar (iOS or Android)."),
  RS("Tap ", "\"Auto upload\"."),
  RS("Toggle on ", "the source folder (e.g., Camera)."),
  RS("Choose the destination folder ", "on My Disk (recommended: a folder you control — never the root)."),
  RS("Configure upload behaviour: ", "Wi-Fi only (recommended), upload while charging only, and whether to keep originals on the phone after upload."),
  RS("Tap Save. ", "Auto Upload will begin the next time your device is on Wi-Fi (or immediately if you chose mobile-data uploads)."),
  blank(60),
  note("Auto Upload uploads EVERY photo and video from the selected folder, including personal content. Only enable Auto Upload on Technijian/VAF-managed devices, or for a camera-roll folder reserved for work photos. Camera roll content will count against your My Disk storage quota.", "WARNING"),

  h2("11.5 Mobile Troubleshooting"),
  headerTable(
    ["Issue", "Fix"],
    [
      ["Login loop / browser doesn't redirect back to the app", "Set Safari/Chrome as your default browser · Disable in-app browsers · Retry"],
      ["\"Account not authorised\" after SSO", "Sign out (Settings  →  Account  →  Remove) and re-add the account · Confirm 2FA enrolment is complete"],
      ["Auto Upload not running", "Disable battery optimisation for Nextcloud (Android: Settings  →  Apps  →  Nextcloud  →  Battery  →  Unrestricted)"],
      ["Cannot open Office files", "Install Microsoft 365 mobile app or use the web portal · Nextcloud opens Office files via the OS document handler"],
      ["Files won't download on cellular", "Check Settings  →  General  →  \"Use cellular data\" is enabled · Verify mobile-data quota with carrier"],
      ["Notifications not appearing", "iOS: Settings  →  Notifications  →  Nextcloud  →  Allow · Android: long-press app icon  →  Notifications  →  enable all channels"],
    ],
    [3400, 5960],
  ),
];

// =========================================================================
// SECTION 12 — Web Portal Tour (NEW)
// =========================================================================
const sec12 = [
  sectionBar("12. Web Portal Tour"),
  blank(100),
  P("The web portal at https://vaf-mydisk2.technijian.com provides everything the desktop client offers — plus admin and audit features. You do not need the desktop client installed to use the web portal."),
  h2("12.1 Main Navigation"),
  headerTable(
    ["Icon / Section", "What It Does"],
    [
      ["Files", "Browse, upload, share, and version-control your files and folders"],
      ["Photos", "Gallery view of image files across My Disk"],
      ["Activity", "Live feed of every share, edit, and access event on your files"],
      ["Talk", "Built-in secure chat and video calls (if enabled by IT)"],
      ["Deck", "Kanban boards for team task management (if enabled by IT)"],
      ["Mail / Calendar / Contacts", "Optional groupware modules (enabled per tenant)"],
      ["Settings", "Personal settings — security, notifications, app passwords, sessions"],
    ],
    [3000, 6360],
  ),
  h2("12.2 Useful Web-Only Features"),
  bullet("Bulk download — select multiple files and download as a single ZIP"),
  bullet("Server-side encryption status — view in Settings  →  Security"),
  bullet("End-to-end encrypted folders — opt-in encryption for highly sensitive folders (requires desktop client and recovery key)"),
  bullet("Tags — apply colour-coded tags to files for cross-folder organisation"),
  bullet("Full-text search — search file contents across the entire tenant (indexed nightly)"),
];

// =========================================================================
// SECTION 13 — Recommended Settings & Best Practices
// =========================================================================
const sec13 = [
  sectionBar("13. Recommended Settings & Best Practices"),
  blank(100),
  h2("13.1 Recommended Client Settings"),
  headerTable(
    ["Setting", "Recommended Value"],
    [
      ["Auto-start on login", "Enabled"],
      ["Bandwidth throttling", "Set upload limit during business hours if on a shared connection"],
      ["Selective sync", "Enable for users with limited local disk space"],
      ["Virtual Files (Windows)", "Enable on laptops with under 256 GB SSDs"],
      ["Notifications", "Enable for sync errors and share alerts"],
      ["Proxy settings", "Inherit system proxy (or configure as per IT policy)"],
      ["Confirm external storage", "Always prompt — protects against accidental syncs to USB drives"],
    ],
    [2800, 6560],
  ),
  h2("13.2 Security Best Practices"),
  bullet("Never share your Technijian My Disk credentials with anyone, including IT staff"),
  bullet("Use a strong password and 2FA — both are mandatory for VAF accounts"),
  bullet("Do not sync sensitive data to personal or unmanaged devices"),
  bullet("Lock your workstation when stepping away — sync continues in the background"),
  bullet("Regularly review and revoke file shares that are no longer required (Settings  →  Sharing)"),
  bullet("Revoke any device session you no longer use (Settings  →  Security  →  Devices & sessions)"),
  bullet("Report suspicious activity or unauthorised access to support@technijian.com immediately"),
  h2("13.3 Data Hygiene"),
  bullet("Keep personal files in your home folder; collaborative files in shared team folders"),
  bullet("Avoid storing very large media files (over 5 GB) unless required — they slow sync for the whole device"),
  bullet("Use folder structure, not long filenames, to keep paths under 255 characters (Windows limit)"),
  bullet("Avoid special characters in file names: \\ / : * ? \" < > | — they will fail to sync to Windows clients"),
];

// =========================================================================
// SECTION 14 — Troubleshooting
// =========================================================================
const sec14 = [
  sectionBar("14. Troubleshooting Common Issues"),
  blank(100),
  h2("14.1 Common Issues & Resolutions"),
  headerTable(
    ["Issue", "Resolution"],
    [
      ["Cannot connect to server", "Verify URL is https://vaf-mydisk2.technijian.com · Check VPN/network · Confirm firewall allows HTTPS port 443"],
      ["Credentials not accepted", "Reset password via VAF IT portal · Confirm username format (username@viaautofinance.com) · Try an app password (Section 9.2)"],
      ["Browser pop-up never appears during login", "Disable browser pop-up blockers · Set default browser to Edge or Chrome · Retry with Incognito / Private window"],
      ["Sync stuck or not progressing", "Pause and resume sync · Restart the client · Check available disk space · Look for files with illegal characters"],
      ["File name conflicts (_conflict-xxx files)", "Open the conflict file, compare versions, keep the correct one, delete the rest — never edit while syncing"],
      ["Files not appearing in File Explorer", "Confirm sync folder location · Check client status icon · Restart client · On Windows, re-enable Quick Access pin"],
      ["High bandwidth / CPU usage", "Enable bandwidth throttling in Settings  →  Network · Reduce parallel transfers from 6 to 3"],
      ["SSL certificate error", "Contact support@technijian.com to verify the domain certificate · Do not bypass SSL warnings"],
      ["WebDAV drive disconnects on reboot", "Ensure \"Reconnect at sign-in\" is checked · Confirm credentials are saved · Confirm app password (not SSO password) is used"],
      ["macOS Gatekeeper blocks install", "System Settings  →  Privacy & Security  →  click Open Anyway"],
      ["macOS Finder integration missing", "System Settings  →  Privacy & Security  →  Extensions  →  enable Nextcloud Finder Integration"],
      ["Virtual Files icons stuck on \"sync pending\"", "Right-click the folder  →  Always keep on this device, then revert if needed"],
    ],
    [3200, 6160],
  ),
  h2("14.2 Collecting Logs for Helpdesk"),
  P("If an issue persists, collect client logs and share them with the IT helpdesk at support@technijian.com."),
  bullet("Windows: Open the Nextcloud tray icon  →  Settings  →  General  →  Log  →  Open Log File"),
  bullet("macOS: Open the Nextcloud menu bar icon  →  Settings  →  General  →  Log  →  Open Log File"),
  bullet("Mobile: Settings  →  About  →  Send Feedback (auto-attaches the log)"),
  bullet("Attach the log file and a screenshot of the error to your IT helpdesk ticket for faster resolution"),
];

// =========================================================================
// SECTION 15 — Uninstallation
// =========================================================================
const sec15 = [
  sectionBar("15. Uninstallation / Removal"),
  blank(100),
  h2("15.1 Windows"),
  RS("Open ", "Settings  →  Apps  →  Installed Apps."),
  RS("Search for ", "Nextcloud and click Uninstall."),
  RS("Follow ", "the uninstaller prompts."),
  RS("Manually delete the local sync folder ", "if no longer needed — data on the server is NOT affected."),
  h2("15.2 macOS"),
  RS("Open ", "Finder  →  Applications."),
  RS("Drag the Nextcloud app to the Trash, ", "or right-click and select Move to Trash."),
  RS("Empty ", "the Trash."),
  RS("Optionally remove leftover config files ", "from ~/Library/Preferences/ and ~/Library/Application Support/Nextcloud."),
  blank(60),
  note("Uninstalling the client does NOT delete files from the Technijian My Disk server. Your data remains intact and accessible via https://vaf-mydisk2.technijian.com.", "NOTE"),
  h2("15.3 Revoking Device Access After Uninstall"),
  P("After uninstalling, log in to the web portal and revoke the device session so the access token cannot be reused if the machine is later compromised."),
  RS("Log in ", "to https://vaf-mydisk2.technijian.com"),
  RS("Click your profile icon  →  ", "Settings  →  Security  →  Devices & sessions."),
  RS("Find the device entry ", "and click the trash icon to revoke."),
];

// =========================================================================
// SECTION 16 — Support
// =========================================================================
const sec16 = [
  sectionBar("16. Support & Contact Information"),
  blank(100),
  headerTable(
    ["Support Channel", "Details"],
    [
      ["IT Helpdesk Email", "support@technijian.com"],
      ["Web Portal", "https://vaf-mydisk2.technijian.com"],
      ["Main Support Number", "949.379.8501"],
      ["Self-Service Portal", "FAQs and knowledge base articles on the Technijian IT intranet"],
      ["Account Manager", "Rishad Mohamed  ·  rmohamed@technijian.com"],
      ["Emergency Contact (after-hours)", "Rishad Mohamed — call 949.379.8501 and follow the on-call prompt"],
    ],
    [3000, 6360],
  ),
  blank(120),
  P("Technijian operates from offices in Irvine, California, and Panchkula, India, providing 24/7 follow-the-sun support to all VAF users at no additional cost.", { italic: true, after: 100 }),
];

// =========================================================================
// SECTION 17 — Glossary (NEW)
// =========================================================================
const sec17 = [
  sectionBar("17. Glossary of Terms"),
  blank(100),
  kvTable([
    ["My Disk", "Technijian's white-labeled, hosted file-sharing and collaboration platform, built on Nextcloud and operated by the Technijian Cloud team."],
    ["Nextcloud", "The open-source software platform that powers My Disk. Users will see \"Nextcloud\" wording in the desktop / mobile clients until full white-labeling is completed."],
    ["VAF Tenant", "The dedicated, isolated My Disk environment for Via Auto Finance at https://vaf-mydisk2.technijian.com"],
    ["SSO", "Single Sign-On — authenticating to My Disk using your VAF identity (username@viaautofinance.com) rather than a separate My Disk password."],
    ["2FA / MFA", "Two-Factor / Multi-Factor Authentication — a second proof of identity beyond a password, typically a code from an authenticator app."],
    ["App Password", "A long, randomly-generated password used by legacy clients that cannot complete the browser-based SSO flow."],
    ["WebDAV", "An HTTP-based protocol that allows mounting My Disk as a network drive without the desktop client."],
    ["Virtual Files / Files-on-Demand", "A Windows feature that shows server-side files in Explorer without downloading them until opened — saves disk space."],
    ["Sync Folder", "The local folder on your device that mirrors part of My Disk. Default location: C:\\Users\\[user]\\Technijian My Disk (Windows) or /Users/[user]/Technijian My Disk (macOS)."],
    ["Federated Share", "A share with a user on another trusted Nextcloud server — used for approved cross-organisation collaboration."],
    ["End-to-End Encryption (E2EE)", "Optional folder-level encryption where files are encrypted on the client before upload. The server cannot decrypt the content."],
    ["Conflict File", "A file named filename (conflicted copy yyyy-mm-dd).ext, created when the same file was edited on two devices simultaneously."],
  ]),
];

// =========================================================================
// SECTION 18 — Revision History
// =========================================================================
const sec18 = [
  sectionBar("18. Document Revision History"),
  blank(80),
  P("Reviewed annually, or whenever a major My Disk / Nextcloud platform release introduces changes to setup or authentication. Submit corrections or suggestions to support@technijian.com.", { italic: true, after: 120 }),
  headerTable(
    ["Version", "Date", "Author", "Change Description"],
    [
      ["1.0", "May 2025", "Technijian IT Team", "Initial release — base setup procedure for Windows and macOS"],
      ["1.1", "May 2026", "Technijian Brand & IT", "Rebrand to Brand Guide 2026; added §§8, 9, 11, 12, 17; expanded Troubleshooting; updated support contact (Rishad Mohamed · 949.379.8501)."],
    ],
    [1200, 1400, 2200, 4560],
  ),
];

// =========================================================================
// HEADER / FOOTER
// =========================================================================
const docHeader = new Header({
  children: [
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      borders: noBorders,
      rows: [new TableRow({
        children: [
          new TableCell({
            width: { size: 4680, type: WidthType.DXA },
            borders: noBorders,
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [new ImageRun({
                type: "png", data: logoBuffer,
                transformation: { width: 130, height: 27 },
                altText: { title: "Technijian", description: "Technijian logo", name: "TechnijianLogo" },
              })],
            })],
          }),
          new TableCell({
            width: { size: 4680, type: WidthType.DXA },
            borders: noBorders,
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: "Technijian My Disk – Setup Procedure", font: FONT, size: 18, color: BRAND_GREY })],
            })],
          }),
        ],
      })],
    }),
    new Paragraph({
      spacing: { before: 80, after: 0 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: CORE_BLUE, space: 1 } },
      children: [new TextRun({ text: "", font: FONT, size: 2 })],
    }),
  ],
});

const docFooter = new Footer({
  children: [
    new Paragraph({
      spacing: { before: 0, after: 60 },
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: CORE_ORANGE, space: 4 } },
      children: [new TextRun({ text: "", font: FONT, size: 2 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 20 },
      children: [
        new TextRun({ text: "Technijian", font: FONT, bold: true, size: 18, color: CORE_BLUE }),
        new TextRun({ text: "   ·   technology as a solution   ·   technijian.com   ·   949.379.8501", font: FONT, size: 18, color: BRAND_GREY }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0 },
      children: [
        new TextRun({ text: "CONFIDENTIAL · Internal Use Only   ·   Page ", font: FONT, size: 16, color: BRAND_GREY }),
        new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: BRAND_GREY }),
        new TextRun({ text: " of ", font: FONT, size: 16, color: BRAND_GREY }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: BRAND_GREY }),
      ],
    }),
  ],
});

// Blank header/footer for cover
const coverHeader = new Header({ children: [new Paragraph({ children: [new TextRun({ text: "", font: FONT })] })] });
const coverFooter = new Footer({ children: [new Paragraph({ children: [new TextRun({ text: "", font: FONT })] })] });

// =========================================================================
// DOCUMENT
// =========================================================================
const doc = new Document({
  creator: "Technijian IT Team",
  title: "Technijian My Disk – Client Setup Procedure",
  description: "Setup, configuration, and best-practice guide for Technijian My Disk (white-labeled Nextcloud) on Windows, macOS, and mobile.",
  styles: {
    default: { document: { run: { font: FONT, size: 22, color: BRAND_GREY } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: FONT, color: CORE_BLUE },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: FONT, color: CORE_BLUE },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: FONT, color: DARK_CHARCOAL },
        paragraph: { spacing: { before: 220, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 280 } } } }] },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 720, right: 1080, bottom: 720, left: 1080 },
        },
        titlePage: true,
      },
      headers: { default: coverHeader, first: coverHeader },
      footers: { default: coverFooter, first: coverFooter },
      children: coverChildren,
    },
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1800, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: { default: docHeader },
      footers: { default: docFooter },
      children: [
        ...aboutSection,
        ...sec1,
        ...sec2,
        ...sec3,
        ...sec4,
        ...sec5,
        ...sec6,
        ...sec7,
        ...sec8,
        ...sec9,
        ...sec10,
        ...sec11,
        ...sec12,
        ...sec13,
        ...sec14,
        ...sec15,
        ...sec16,
        ...sec17,
        ...sec18,
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  const outPath = path.join(__dirname, 'Technijian_MyDisk_Setup_Procedure.docx');
  fs.writeFileSync(outPath, buf);
  console.log("Wrote:", outPath, "size:", buf.length);
}).catch(err => { console.error(err); process.exit(1); });
