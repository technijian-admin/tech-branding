const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, ImageRun, LevelFormat
} = require("docx");

const logoPath = path.join(__dirname, "..", "..", "assets", "logos", "png", "technijian-logo-full-color-600x125.png");
const logoData = fs.readFileSync(logoPath);

// Technijian brand colors
const BRAND = {
  red: "C41E3A",
  darkGray: "333333",
  medGray: "666666",
  lightGray: "F5F5F5",
  tableHeader: "2B2B2B",
  tableHeaderText: "FFFFFF",
  tableAlt: "F9F9F9",
  accent: "C41E3A",
  white: "FFFFFF",
  border: "DDDDDD",
};

const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: BRAND.border };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const noBorders = {
  top: { style: BorderStyle.NONE, size: 0 },
  bottom: { style: BorderStyle.NONE, size: 0 },
  left: { style: BorderStyle.NONE, size: 0 },
  right: { style: BorderStyle.NONE, size: 0 },
};

const cellMargins = { top: 60, bottom: 60, left: 120, right: 120 };

// Helper: header cell
function hCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: BRAND.tableHeader, type: ShadingType.CLEAR },
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text, bold: true, font: "Arial", size: 20, color: BRAND.tableHeaderText })] })],
  });
}

// Helper: regular cell
function cell(text, width, opts = {}) {
  const { bold, color, fill, align } = opts;
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({
      alignment: align || AlignmentType.LEFT,
      children: [new TextRun({ text, bold: !!bold, font: "Arial", size: 19, color: color || BRAND.darkGray })]
    })],
  });
}

// Helper: status cell with color coding
function statusCell(text, width) {
  let color = BRAND.darkGray;
  let fill = undefined;
  if (text === "FAILING" || text === "Critical" || text === "Fail") { color = "FFFFFF"; fill = BRAND.red; }
  else if (text === "Needs Work" || text === "Moderate") { color = "8B6914"; fill = "FFF3CD"; }
  else if (text === "Pass" || text === "Good" || text.includes("A")) { color = "155724"; fill = "D4EDDA"; }
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, font: "Arial", size: 19, color })] })],
  });
}

function heading(text, level) {
  const sizes = { 1: 32, 2: 26, 3: 22 };
  const colors = { 1: BRAND.red, 2: BRAND.darkGray, 3: BRAND.medGray };
  return new Paragraph({
    spacing: { before: level === 1 ? 360 : 240, after: 120 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: sizes[level], color: colors[level] })],
  });
}

function bodyText(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 20, color: BRAND.darkGray })],
  });
}

function bulletItem(text, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 20, color: BRAND.darkGray })],
  });
}

function boldBullet(label, desc, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60 },
    children: [
      new TextRun({ text: label + " ", bold: true, font: "Arial", size: 20, color: BRAND.darkGray }),
      new TextRun({ text: desc, font: "Arial", size: 20, color: BRAND.darkGray }),
    ],
  });
}

function spacer(pts) {
  return new Paragraph({ spacing: { before: pts || 120, after: 0 }, children: [] });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: BRAND.red } },
    children: [],
  });
}

// ---- BUILD THE DOCUMENT ----

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: "bullets2",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: "bullets3",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: "bullets4",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: "bullets5",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: "bullets6",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
    ],
  },
  sections: [
    // ===== COVER PAGE =====
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new ImageRun({ type: "png", data: logoData, transformation: { width: 200, height: 42 }, altText: { title: "Technijian Logo", description: "Technijian company logo", name: "logo" } }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "COMPANY CONFIDENTIAL", font: "Arial", size: 16, color: BRAND.red, bold: true }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "18 Technology Dr. #141, Irvine, CA 92618  |  technijian.com  |  Page ", font: "Arial", size: 14, color: BRAND.medGray }),
                new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 14, color: BRAND.medGray }),
              ],
            }),
          ],
        }),
      },
      children: [
        spacer(1200),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({ type: "png", data: logoData, transformation: { width: 400, height: 84 }, altText: { title: "Technijian Logo", description: "Technijian company logo large", name: "logo-large" } }),
          ],
        }),
        spacer(400),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ text: "SEO & Digital Performance", font: "Arial", size: 40, bold: true, color: BRAND.red })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ text: "Strategy Report", font: "Arial", size: 36, bold: true, color: BRAND.darkGray })],
        }),
        spacer(200),
        divider(),
        spacer(100),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: "Prepared for:", font: "Arial", size: 22, color: BRAND.medGray })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: "Law Offices of David S. Chesley, Inc.", font: "Arial", size: 28, bold: true, color: BRAND.darkGray })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "chesleylawyers.com", font: "Arial", size: 22, color: BRAND.medGray })],
        }),
        divider(),
        spacer(200),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "March 2026", font: "Arial", size: 22, color: BRAND.medGray })],
        }),
        spacer(100),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "CONFIDENTIAL \u2014 For Client Use Only", font: "Arial", size: 18, color: BRAND.red, bold: true })],
        }),

        // ===== PAGE BREAK =====
        new Paragraph({ children: [new PageBreak()] }),

        // ===== EXECUTIVE SUMMARY =====
        heading("Executive Summary", 1),
        bodyText("This report summarizes the findings from our comprehensive SEO and digital performance audit of chesleylawyers.com, identifies the critical issues holding your website back from reaching its full potential, and presents a tailored Technijian My SEO service plan designed to resolve every issue and position the Law Offices of David S. Chesley as the dominant online presence for criminal defense and DUI law across California."),
        spacer(60),
        bodyText("Your website earned an overall grade of B+ with real strengths in social media presence (A+) and on-page SEO (A-). However, two critical performance failures \u2014 Cumulative Layout Shift and Time to First Byte \u2014 are actively costing you clients and search rankings every day. Combined with a coordinated fake-review extortion attack, a D- mobile usability grade, and a flat content architecture that leaves significant keyword territory unclaimed, the gap between your real-world reputation and your digital presence is substantial."),
        spacer(60),
        bodyText("The good news: every issue has a clear, executable solution. With the right plan in place, we project organic traffic growth from 4,800 to 10,000+ monthly visits within 6\u201312 months, 15+ non-branded keywords on Page 1, and mobile performance scores jumping from 49 to 80+."),

        // ===== CURRENT WEBSITE SCORECARD =====
        new Paragraph({ children: [new PageBreak()] }),
        heading("1. Current Website Scorecard", 1),
        bodyText("Below is a summary of every audit category, the current grade, and the key finding driving that grade:"),
        spacer(60),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2800, 1200, 5360],
          rows: [
            new TableRow({ children: [hCell("Audit Category", 2800), hCell("Grade", 1200), hCell("Key Finding", 5360)] }),
            new TableRow({ children: [cell("Overall Site Score", 2800), statusCell("B+", 1200), cell("Good foundation; critical gaps in UX and content depth", 5360)] }),
            new TableRow({ children: [cell("On-Page SEO", 2800, { fill: BRAND.tableAlt }), statusCell("A-", 1200), cell("Title tag too long; keyword consistency gaps across pages", 5360, { fill: BRAND.tableAlt })] }),
            new TableRow({ children: [cell("Usability / Mobile", 2800), statusCell("Fail", 1200), cell("Failing Core Web Vitals; mobile PageSpeed score of 49/100", 5360)] }),
            new TableRow({ children: [cell("Technical Performance", 2800, { fill: BRAND.tableAlt }), statusCell("A", 1200), cell("Good load speed and compression; iFrames and deprecated HTML present", 5360, { fill: BRAND.tableAlt })] }),
            new TableRow({ children: [cell("Social Media Presence", 2800), statusCell("A+", 1200), cell("All major platforms linked; Facebook Pixel missing", 5360)] }),
            new TableRow({ children: [cell("Local SEO", 2800, { fill: BRAND.tableAlt }), statusCell("Moderate", 1200), cell("GBP identified; NAP consistency risk across 40+ locations", 5360, { fill: BRAND.tableAlt })] }),
            new TableRow({ children: [cell("Reputation / Reviews", 2800), statusCell("Critical", 1200), cell("Targeted by coordinated fake-review extortion campaign", 5360)] }),
            new TableRow({ children: [cell("Content Architecture", 2800, { fill: BRAND.tableAlt }), statusCell("Needs Work", 1200), cell("Flat structure; no Pillar-Cluster model; thin city pages", 5360, { fill: BRAND.tableAlt })] }),
          ],
        }),

        // ===== CRITICAL ISSUES =====
        new Paragraph({ children: [new PageBreak()] }),
        heading("2. Critical Issues Identified", 1),
        bodyText("Our audit identified multiple issues organized by severity. Addressing the critical items first will yield the highest return on investment by removing active ranking penalties."),

        // 2.1 CLS
        heading("2.1 Cumulative Layout Shift (CLS) \u2014 FAILING", 2),
        bodyText("Your CLS score is 0.15, exceeding Google\u2019s target of < 0.10. Visual elements shift unexpectedly as pages load, causing users to misclick buttons, increasing bounce rates, and triggering a direct Google ranking penalty. On a law firm site where a stressed client is trying to tap \u201CCall Now,\u201D this is catastrophic."),
        spacer(60),
        heading("Root Causes:", 3),
        bulletItem("Images without defined width/height attributes \u2014 browser can\u2019t reserve space, causing content to jump", "bullets"),
        bulletItem("Late-loading chat widgets and promotional banners inject into the layout after initial render", "bullets"),
        bulletItem("Custom web fonts causing Flash of Unstyled Text (FOUT), shifting surrounding elements", "bullets"),
        bulletItem("12+ inline CSS declarations conflicting with the main stylesheet", "bullets"),

        // 2.2 TTFB
        heading("2.2 Time to First Byte (TTFB) \u2014 FAILING", 2),
        bodyText("TTFB measures how long the server takes to send the first byte of data. Google\u2019s target is under 200ms. Your site shows elevated latency well above this threshold, which delays every subsequent metric \u2014 LCP (7.7s vs. 2.5s target), FCP (3.9s vs. 1.8s target), and TTI (12.9s vs. 5s target)."),
        spacer(60),
        heading("Root Causes:", 3),
        bulletItem("Cloudflare caching misconfigured \u2014 requests bypass cache and hit the origin server directly", "bullets2"),
        bulletItem("WordPress database query overhead from 40+ city pages without object caching (Redis/Memcached)", "bullets2"),
        bulletItem("Possible hosting tier limitations during traffic spikes from news events", "bullets2"),
        bulletItem("Multiple redirect chains adding an estimated 0.63s of wasted latency per page load", "bullets2"),

        // 2.3 Mobile
        heading("2.3 Mobile Performance \u2014 Grade: D-", 2),
        bodyText("A mobile PageSpeed score of 49/100 means approximately 50% of mobile visitors are likely abandoning the site before it loads. In the legal sector, the majority of searches happen on mobile devices. This directly translates to lost consultations and revenue."),
        spacer(60),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 2080, 2080, 2080],
          rows: [
            new TableRow({ children: [hCell("Metric", 3120), hCell("Your Score", 2080), hCell("Google Target", 2080), hCell("Status", 2080)] }),
            new TableRow({ children: [cell("Largest Contentful Paint", 3120), cell("7.7s (Mobile)", 2080), cell("< 2.5s", 2080), statusCell("Fail", 2080)] }),
            new TableRow({ children: [cell("First Contentful Paint", 3120, { fill: BRAND.tableAlt }), cell("3.9s (Mobile)", 2080, { fill: BRAND.tableAlt }), cell("< 1.8s", 2080, { fill: BRAND.tableAlt }), statusCell("Fail", 2080)] }),
            new TableRow({ children: [cell("Time to Interactive", 3120), cell("12.9s (Mobile)", 2080), cell("< 5s", 2080), statusCell("Fail", 2080)] }),
            new TableRow({ children: [cell("Cumulative Layout Shift", 3120, { fill: BRAND.tableAlt }), cell("0.15", 2080, { fill: BRAND.tableAlt }), cell("< 0.10", 2080, { fill: BRAND.tableAlt }), statusCell("Fail", 2080)] }),
            new TableRow({ children: [cell("Mobile PageSpeed", 3120), cell("49/100", 2080), cell("90+", 2080), statusCell("Fail", 2080)] }),
            new TableRow({ children: [cell("Desktop PageSpeed", 3120, { fill: BRAND.tableAlt }), cell("85/100", 2080, { fill: BRAND.tableAlt }), cell("90+", 2080, { fill: BRAND.tableAlt }), statusCell("Needs Work", 2080)] }),
          ],
        }),

        // 2.4 On-Page
        heading("2.4 On-Page SEO Issues", 2),
        bulletItem("Title tag too long (67 characters) \u2014 gets truncated in search results, reducing click-through rates", "bullets3"),
        bulletItem("Duplicate canonical tags on homepage \u2014 confuses search engines about the authoritative URL", "bullets3"),
        bulletItem("Keyword consistency gaps \u2014 core money keywords like \u201CDUI attorney\u201D and \u201Cfelony defense\u201D not consistently present across title, meta, H1, and body", "bullets3"),
        bulletItem("2 images missing alt text \u2014 lost SEO signal and accessibility failure", "bullets3"),
        bulletItem("No llms.txt file \u2014 invisible to AI-powered search (ChatGPT, Gemini, Google AI Overviews)", "bullets3"),

        // 2.5 Local SEO
        heading("2.5 Local SEO \u2014 Multi-Location Risk", 2),
        bodyText("Operating from 40+ locations creates a significant NAP (Name, Address, Phone) consistency challenge. Inconsistent data across Avvo, Justia, Yelp, FindLaw, and Bing Places creates conflicting trust signals that directly suppress your Local Pack rankings."),
        bulletItem("NAP consistency audit required across all 40+ locations immediately", "bullets4"),
        bulletItem("City pages are thin \u2014 lack courthouse data, local case results, and hyper-local FAQs", "bullets4"),
        bulletItem("Competitors have deep, localized content for 31+ specific cities", "bullets4"),

        // 2.6 Reputation
        heading("2.6 Reputation \u2014 Fake Review Extortion Attack", 2),
        bodyText("In November 2025, 50 fake one-star reviews were posted across your Google Business Profile accounts within a 90-minute window. This coordinated extortion campaign originated from international IP addresses and is designed to destroy your Prominence score, suppress Local Pack rankings, and erode client trust. This requires an immediate, multi-pronged defensive response."),

        // 2.7 Content
        heading("2.7 Content Architecture \u2014 Flat Structure", 2),
        bodyText("The site uses a flat, horizontal content structure with thin content across many pages. Google in 2026 rewards \u201Cladder-like\u201D websites where practice areas are supported by deep networks of educational sub-pages. Your top non-branded keyword positions are in the 60\u201390 range precisely because there is insufficient topical depth to signal expertise."),
        bulletItem("Only 1% of keyword positions appear in AI Overviews \u2014 a major gap as AI search grows", "bullets5"),
        bulletItem("Blog content diluted by off-topic posts (e.g., political commentary) that weaken legal topical authority", "bullets5"),
        bulletItem("No Pillar-Cluster content model in place", "bullets5"),

        // ===== COMPETITIVE LANDSCAPE =====
        new Paragraph({ children: [new PageBreak()] }),
        heading("3. Competitive Landscape", 1),
        bodyText("Your site ranks for 6,200 keywords with 4,800 monthly organic visits. However, your primary competitor myrightslawgroup.com has over twice the keyword footprint at 12,265 keywords. The organic traffic ceiling for your market is 15,000+ monthly visits with the right technical and content foundation."),
        spacer(60),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3500, 1500, 1500, 2860],
          rows: [
            new TableRow({ children: [hCell("Competitor", 3500), hCell("Shared KW", 1500), hCell("Their KW", 1500), hCell("Key Differentiator", 2860)] }),
            new TableRow({ children: [cell("myrightslawgroup.com", 3500), cell("360", 1500, { align: AlignmentType.CENTER }), cell("12,265", 1500, { align: AlignmentType.CENTER }), cell("Massive keyword breadth \u2014 2x organic footprint", 2860)] }),
            new TableRow({ children: [cell("formerdistrictattorneys.com", 3500, { fill: BRAND.tableAlt }), cell("185", 1500, { fill: BRAND.tableAlt, align: AlignmentType.CENTER }), cell("5,116", 1500, { fill: BRAND.tableAlt, align: AlignmentType.CENTER }), cell("Prosecutorial authority positioning", 2860, { fill: BRAND.tableAlt })] }),
            new TableRow({ children: [cell("tarmanlaw.com", 3500), cell("145", 1500, { align: AlignmentType.CENTER }), cell("4,142", 1500, { align: AlignmentType.CENTER }), cell("Niche DUI specialization with deep content", 2860)] }),
            new TableRow({ children: [cell("chesleylawyers.com (You)", 3500, { fill: BRAND.tableAlt, bold: true }), cell("\u2014", 1500, { fill: BRAND.tableAlt, align: AlignmentType.CENTER }), cell("6,200", 1500, { fill: BRAND.tableAlt, align: AlignmentType.CENTER }), cell("Strong brand but broad, shallow content", 2860, { fill: BRAND.tableAlt })] }),
          ],
        }),

        spacer(120),
        bodyText("The opportunity is clear: with deeper content architecture, AI search optimization, and consistent blogging, chesleylawyers.com can close the gap and overtake competitors within 12 months."),

        // ===== RECOMMENDED TECHNIJIAN SERVICE PLAN =====
        new Paragraph({ children: [new PageBreak()] }),
        heading("4. Recommended Technijian My SEO Service Plan", 1),
        bodyText("Based on the audit findings, we recommend the following combination of Technijian My SEO services to address every critical issue and position chesleylawyers.com for dominant market presence:"),
        spacer(120),

        // Service 1 - SEO Optimization
        heading("Service 1: SEO Optimization \u2014 $750/month", 2),
        bodyText("Includes Website Design and Hosting. This is the foundation that fixes your critical technical issues and establishes ongoing SEO management."),
        spacer(60),
        heading("What This Fixes:", 3),
        boldBullet("Core Web Vitals (CLS + TTFB):", "Fix image dimensions, preload fonts, reserve widget space, configure Cloudflare caching, enable object caching, install WordPress caching plugin", "bullets"),
        boldBullet("On-Page SEO:", "Shorten title tag, remove duplicate canonical tags, fix keyword consistency, add alt text to all images", "bullets"),
        boldBullet("Technical Cleanup:", "Remove deprecated HTML, consolidate inline CSS, defer non-critical JavaScript, eliminate redirect chains, convert images to WebP", "bullets"),
        boldBullet("Website Hosting:", "Two WordPress environments (dev + production) with 100GB storage and daily backups for reliable, fast hosting", "bullets"),
        boldBullet("Competitive Analysis:", "Monthly monitoring of myrightslawgroup.com and other competitors to identify and exploit ranking opportunities", "bullets"),
        boldBullet("Analytics & Reporting:", "Monthly rank tracking, traffic analytics, and strategy adjustments", "bullets"),

        // Service 2 - Blogs
        heading("Service 2: Blogs for 5 Keywords \u2014 $1,000/month", 2),
        bodyText("Includes SEO Optimization. Builds the Pillar-Cluster content architecture that your site critically needs to compete."),
        spacer(60),
        heading("What This Fixes:", 3),
        boldBullet("Flat Content Architecture:", "Monthly keyword-focused blog articles building out the 4 core pillar topics: DUI Defense, Violent Crimes, Drug Offenses, and Post-Conviction Relief", "bullets2"),
        boldBullet("E-E-A-T Authority:", "Every article published under a specific attorney\u2019s byline with California State Bar credentials, reinforcing expertise signals", "bullets2"),
        boldBullet("Thin City Pages:", "Blog content interlinked with location pages to create depth and local relevance", "bullets2"),
        boldBullet("Keyword Gaps:", "Target high-intent keywords currently ranked 11\u201350 (the page-1 conversion zone) to push them onto the first page", "bullets2"),
        boldBullet("Blog Topical Focus:", "Exclusively California criminal law topics \u2014 no more off-topic posts diluting your legal authority signal", "bullets2"),
        spacer(60),
        bodyText("Example topics: \u201CWhat to Do When Arrested in Los Angeles,\u201D \u201CHow a DUI Affects Your CDL in California,\u201D \u201CUnderstanding Proposition 36 Drug Diversion Programs.\u201D"),

        // Service 3 - AI Search Optimization
        new Paragraph({ children: [new PageBreak()] }),
        heading("Service 3: AI Search Optimization \u2014 $200/month", 2),
        bodyText("This is essential for chesleylawyers.com. Currently only 1% of your keyword positions appear in AI Overviews, generating just 100 visits/month from AI search. As AI-powered search grows rapidly in 2026, this gap will widen without action."),
        spacer(60),
        heading("What This Fixes:", 3),
        boldBullet("AI Visibility Gap:", "Structure and tag content so AI search engines (ChatGPT, Gemini, Google AI) can find, understand, and recommend your firm", "bullets3"),
        boldBullet("Missing llms.txt:", "Create and maintain a /llms.txt file listing practice areas, attorney credentials, and page summaries for AI crawlers", "bullets3"),
        boldBullet("Featured Snippet Targeting:", "Craft content to capture \u201Czero-click\u201D answers and be quoted in AI-generated responses", "bullets3"),
        boldBullet("Schema Enhancement:", "Add FAQ, HowTo, Attorney, and expanded LegalService schema markup for AI readability", "bullets3"),
        boldBullet("Semantic SEO & Topic Authority:", "Build content clusters that demonstrate expertise, increasing odds of being cited by AI search bots", "bullets3"),
        boldBullet("Brand Entity Optimization:", "Increase brand visibility so AI associates \u201CDavid S. Chesley\u201D with criminal defense and DUI law in California", "bullets3"),
        boldBullet("Content Refreshes:", "Update existing pages to get pulled into AI search results", "bullets3"),

        // Service 4 - Backlinking
        heading("Service 4: Backlinking \u2014 Content Syndication + PR Releases \u2014 $350/month", 2),
        bodyText("Your Authority Score is 26 (target: 40+) and you have 644 referring domains. Building high-authority backlinks is critical for closing the gap with competitors and improving Local Pack visibility across all 40+ locations."),
        spacer(60),
        heading("Content Syndication ($200/month):", 3),
        bulletItem("Distribution to 250+ websites with coverage in media outlets and news channels", "bullets4"),
        bulletItem("Enhanced authority backlinks with premium syndication outlets", "bullets4"),
        bulletItem("100% safe second-tier link building with canonical and original credit links", "bullets4"),
        spacer(60),
        heading("PR Releases ($150/month, published quarterly):", 3),
        bulletItem("300+ live placements on FOX, ABC, NBC affiliates, and digitaljournal.com (DR:87 & DA:88)", "bullets5"),
        bulletItem("500+ word professionally written releases with 3 body links and 1 bio link", "bullets5"),
        bulletItem("Instant online exposure with natural anchor optimization", "bullets5"),
        spacer(60),
        heading("What This Fixes:", 3),
        boldBullet("Authority Score:", "Builds from 26 toward 40+ through consistent, high-quality backlink acquisition", "bullets6"),
        boldBullet("NAP Consistency:", "PR placements create consistent brand citations across authoritative domains", "bullets6"),
        boldBullet("Reputation Defense:", "Positive press placements on major news affiliates counterbalance the fake-review attack narrative", "bullets6"),

        // ===== INVESTMENT SUMMARY =====
        new Paragraph({ children: [new PageBreak()] }),
        heading("5. Investment Summary", 1),
        bodyText("The recommended service package addresses every critical, high-priority, and moderate issue identified in the audit:"),
        spacer(120),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 1560, 3120],
          rows: [
            new TableRow({ children: [hCell("Service", 4680), hCell("Monthly", 1560), hCell("Issues Addressed", 3120)] }),
            new TableRow({ children: [cell("Blogs for 5 Keywords (includes SEO Optimization + Website Design & Hosting)", 4680), cell("$1,000", 1560, { bold: true, align: AlignmentType.CENTER }), cell("CWV, TTFB, CLS, on-page SEO, content architecture, E-E-A-T", 3120)] }),
            new TableRow({ children: [cell("AI Search Optimization", 4680, { fill: BRAND.tableAlt }), cell("$200", 1560, { bold: true, fill: BRAND.tableAlt, align: AlignmentType.CENTER }), cell("AI visibility, llms.txt, schema, featured snippets", 3120, { fill: BRAND.tableAlt })] }),
            new TableRow({ children: [cell("Content Syndication", 4680), cell("$200", 1560, { bold: true, align: AlignmentType.CENTER }), cell("Authority score, backlinks, brand citations", 3120)] }),
            new TableRow({ children: [cell("PR Releases (quarterly)", 4680, { fill: BRAND.tableAlt }), cell("$150", 1560, { bold: true, fill: BRAND.tableAlt, align: AlignmentType.CENTER }), cell("Authority, reputation, press coverage", 3120, { fill: BRAND.tableAlt })] }),
            new TableRow({
              children: [
                new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, shading: { fill: BRAND.tableHeader, type: ShadingType.CLEAR }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "TOTAL MONTHLY INVESTMENT", bold: true, font: "Arial", size: 22, color: BRAND.tableHeaderText })] })] }),
                new TableCell({ borders, width: { size: 1560, type: WidthType.DXA }, shading: { fill: BRAND.tableHeader, type: ShadingType.CLEAR }, margins: cellMargins, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "$1,550", bold: true, font: "Arial", size: 24, color: BRAND.tableHeaderText })] })] }),
                new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: BRAND.tableHeader, type: ShadingType.CLEAR }, margins: cellMargins, children: [new Paragraph({ children: [new TextRun({ text: "Complete coverage of all audit findings", bold: true, font: "Arial", size: 20, color: BRAND.tableHeaderText })] })] }),
              ],
            }),
          ],
        }),

        spacer(200),
        bodyText("All plans include unlimited monthly service hours and require a 12-month commitment, ensuring consistent support and measurable results throughout the engagement."),

        // ===== EXPECTED OUTCOMES =====
        heading("6. Expected Outcomes (6\u201312 Months)", 1),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3800, 2280, 3280],
          rows: [
            new TableRow({ children: [hCell("Metric", 3800), hCell("Current", 2280), hCell("Projected", 3280)] }),
            new TableRow({ children: [cell("Monthly Organic Traffic", 3800), cell("4,800 visits", 2280), cell("10,000+ visits", 3280, { bold: true, color: "155724" })] }),
            new TableRow({ children: [cell("Non-Branded Page 1 Keywords", 3800, { fill: BRAND.tableAlt }), cell("5 keywords", 2280, { fill: BRAND.tableAlt }), cell("15+ keywords", 3280, { bold: true, color: "155724", fill: BRAND.tableAlt })] }),
            new TableRow({ children: [cell("Mobile PageSpeed Score", 3800), cell("49/100", 2280), cell("80+/100", 3280, { bold: true, color: "155724" })] }),
            new TableRow({ children: [cell("AI Overview Citations", 3800, { fill: BRAND.tableAlt }), cell("100 visits/mo", 2280, { fill: BRAND.tableAlt }), cell("500+ visits/mo", 3280, { bold: true, color: "155724", fill: BRAND.tableAlt })] }),
            new TableRow({ children: [cell("Authority Score", 3800), cell("26", 2280), cell("40+", 3280, { bold: true, color: "155724" })] }),
            new TableRow({ children: [cell("Google Review Rating", 3800, { fill: BRAND.tableAlt }), cell("Under attack", 2280, { fill: BRAND.tableAlt }), cell("4.7+ stabilized", 3280, { bold: true, color: "155724", fill: BRAND.tableAlt })] }),
            new TableRow({ children: [cell("Local Pack Visibility", 3800), cell("Limited", 2280), cell("All 40+ locations", 3280, { bold: true, color: "155724" })] }),
          ],
        }),

        // ===== WHY TECHNIJIAN =====
        new Paragraph({ children: [new PageBreak()] }),
        heading("7. Why Technijian", 1),
        bodyText("Every issue identified in this audit has a clear, executable solution. The Law Offices of David S. Chesley has a strong real-world foundation \u2014 proven credentials, a 15-year Client\u2019s Choice Award streak, AVVO Superb ratings, and genuine scale across California. Your digital strategy must now evolve to reflect that authority online."),
        spacer(120),
        boldBullet("Expertise:", "Our team has extensive experience in digital marketing for legal professionals, ensuring top-tier service tailored to the competitive California market.", "bullets"),
        boldBullet("AI-Forward Approach:", "We don\u2019t just optimize for traditional search \u2014 we ensure your firm is visible in ChatGPT, Gemini, and Google AI Overview results where the next generation of clients are searching.", "bullets"),
        boldBullet("Unlimited Service Hours:", "Every plan includes unlimited monthly service hours so nothing gets deprioritized or delayed.", "bullets"),
        boldBullet("Comprehensive Coverage:", "From technical fixes to content strategy to AI optimization to reputation defense \u2014 one partner handling everything means no gaps between vendors.", "bullets"),
        boldBullet("Transparent Reporting:", "Monthly analytics and performance reports with clear KPIs so you can see real progress, not vanity metrics.", "bullets"),
        boldBullet("Scalability:", "Our plans grow with your firm, ensuring that as your 40+ locations expand, our services scale accordingly.", "bullets"),

        spacer(300),
        divider(),
        spacer(100),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: "Ready to get started?", font: "Arial", size: 26, bold: true, color: BRAND.red })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: "Let\u2019s schedule a strategy call to walk through these findings", font: "Arial", size: 22, color: BRAND.darkGray })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: "and get your digital presence matching your real-world reputation.", font: "Arial", size: 22, color: BRAND.darkGray })],
        }),
        spacer(200),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Technijian  |  18 Technology Dr. #141, Irvine, CA 92618  |  technijian.com", font: "Arial", size: 20, bold: true, color: BRAND.medGray })],
        }),
      ],
    },
  ],
});

const outputPath = path.join(__dirname, "CHL_Technijian_SEO_Strategy_Report.docx");
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log("Report generated: " + outputPath);
});
