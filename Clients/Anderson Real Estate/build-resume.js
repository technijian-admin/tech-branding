const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        ImageRun, Header, Footer, AlignmentType, PageBreak,
        BorderStyle, WidthType, ShadingType, PageNumber, LevelFormat } = require("docx");

const CORE_BLUE   = "006DB6";
const CORE_ORANGE = "F67D4B";
const DARK        = "1A1A2E";
const GREY        = "59595B";
const OFF_WHITE   = "F8F9FA";
const WHITE       = "FFFFFF";
const LIGHT_GREY  = "E9ECEF";
const TEAL        = "1EAAC8";

const noBorders = { top:{style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE}, left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE} };
const cm = { top:80, bottom:80, left:120, right:120 };

const logo = fs.readFileSync(path.resolve(__dirname, "../../assets/logos/png/technijian-logo-full-color-1200x251.png"));

// Helper: accent bar
function bar(color, h) {
  h = h || 20;
  return new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[9360],
    rows:[new TableRow({ children:[new TableCell({ borders:noBorders, width:{size:9360,type:WidthType.DXA},
      shading:{fill:color||CORE_BLUE,type:ShadingType.CLEAR}, margins:{top:h,bottom:h,left:0,right:0},
      children:[new Paragraph({children:[]})] })] })] });
}

// Helper: section heading with left accent bar
function section(title) {
  return new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[100,9260],
    rows:[new TableRow({ children:[
      new TableCell({ borders:noBorders, width:{size:100,type:WidthType.DXA},
        shading:{fill:CORE_BLUE,type:ShadingType.CLEAR}, children:[new Paragraph({children:[]})] }),
      new TableCell({ borders:noBorders, width:{size:9260,type:WidthType.DXA},
        margins:{top:80,bottom:80,left:160,right:0},
        children:[new Paragraph({ children:[new TextRun({text:title.toUpperCase(), font:"Open Sans", size:24, bold:true, color:CORE_BLUE})] })] })
    ] })] });
}

// Helper: body paragraph
function body(text, opts) {
  opts = opts || {};
  return new Paragraph({ spacing:{after:opts.after||100, before:opts.before||0},
    children:[new TextRun({text, font:"Open Sans", size:20, color:opts.color||GREY, bold:!!opts.bold, italics:!!opts.italics})] });
}

// Helper: two-column row (no borders)
function twoCol(left, right, widths) {
  const w = widths || [4680, 4680];
  return new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:w,
    rows:[new TableRow({ children:[
      new TableCell({ borders:noBorders, width:{size:w[0],type:WidthType.DXA}, margins:cm, children: Array.isArray(left)?left:[left] }),
      new TableCell({ borders:noBorders, width:{size:w[1],type:WidthType.DXA}, margins:cm, children: Array.isArray(right)?right:[right] }),
    ] })] });
}

// Capability bullet
function cap(text) {
  return new Paragraph({ spacing:{after:60},
    children:[
      new TextRun({text:"\u25B8 ", font:"Open Sans", size:20, color:CORE_ORANGE}),
      new TextRun({text, font:"Open Sans", size:20, color:GREY})
    ] });
}

// Experience bullet
function bullet(text) {
  return new Paragraph({ spacing:{after:60}, indent:{left:360, hanging:180},
    children:[
      new TextRun({text:"\u2022 ", font:"Open Sans", size:20, color:CORE_BLUE}),
      new TextRun({text, font:"Open Sans", size:20, color:GREY})
    ] });
}

// Tech tag
function tagRow(label, value) {
  return new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2200,7160],
    rows:[new TableRow({ children:[
      new TableCell({ borders:noBorders, width:{size:2200,type:WidthType.DXA}, margins:cm,
        shading:{fill:CORE_BLUE,type:ShadingType.CLEAR},
        children:[new Paragraph({children:[new TextRun({text:label, font:"Open Sans", size:18, bold:true, color:WHITE})]})] }),
      new TableCell({ borders:noBorders, width:{size:7160,type:WidthType.DXA}, margins:cm,
        shading:{fill:OFF_WHITE,type:ShadingType.CLEAR},
        children:[new Paragraph({children:[new TextRun({text:value, font:"Open Sans", size:18, color:GREY})]})] }),
    ] })] });
}

function spacer(h) { return new Paragraph({spacing:{before:h||120},children:[]}); }

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Open Sans", size: 20 } } }
  },
  sections: [
    // ─── PAGE 1: HEADER + PROFILE + CAPABILITIES ───
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
        }
      },
      headers: {
        default: new Header({ children:[
          new Paragraph({ border:{bottom:{style:BorderStyle.SINGLE,size:2,color:CORE_BLUE,space:6}},
            children:[new ImageRun({type:"png", data:logo, transformation:{width:140,height:29},
              altText:{title:"Technijian",description:"Logo",name:"logo"}})] })
        ] })
      },
      footers: {
        default: new Footer({ children:[
          new Paragraph({ alignment:AlignmentType.CENTER,
            border:{top:{style:BorderStyle.SINGLE,size:1,color:LIGHT_GREY,space:6}},
            children:[
              new TextRun({text:"Technijian Corporation | technijian.com | 949.379.8500  \u2022  Page ", font:"Open Sans", size:16, color:GREY}),
              new TextRun({children:[PageNumber.CURRENT], font:"Open Sans", size:16, color:GREY}),
            ] })
        ] })
      },
      children: [
        // Name banner
        new Table({ width:{size:10080,type:WidthType.DXA}, columnWidths:[10080],
          rows:[new TableRow({ children:[new TableCell({ borders:noBorders, width:{size:10080,type:WidthType.DXA},
            shading:{fill:DARK,type:ShadingType.CLEAR}, margins:{top:160,bottom:100,left:200,right:200},
            children:[
              new Paragraph({ children:[new TextRun({text:"RAVI JAIN", font:"Open Sans", size:40, bold:true, color:WHITE})] }),
              new Paragraph({ spacing:{before:40}, children:[
                new TextRun({text:"AI Strategy & Implementation Consultant", font:"Open Sans", size:22, color:TEAL}),
                new TextRun({text:"  |  ", font:"Open Sans", size:22, color:GREY}),
                new TextRun({text:"Founder & CEO, Technijian", font:"Open Sans", size:22, color:CORE_ORANGE}),
              ] }),
              new Paragraph({ spacing:{before:60}, children:[
                new TextRun({text:"Irvine, CA  \u2022  rjain@technijian.com  \u2022  (949) 379-8499 x201  \u2022  technijian.com", font:"Open Sans", size:18, color:LIGHT_GREY}),
              ] }),
            ] })] })] }),

        spacer(200),

        // Executive Profile
        section("EXECUTIVE PROFILE"),
        spacer(60),
        body("AI and technology consulting executive with a blend of boardroom-level strategy, enterprise transformation leadership, and hands-on implementation capability. I help organizations move from AI exploration to operational deployment by aligning business goals, security requirements, data architecture, workflow automation, and user adoption."),
        spacer(40),
        body("My work sits at the intersection of AI strategy, enterprise software architecture, automation, cybersecurity, compliance, and managed operations. Known for translating ambiguity into execution: defining roadmaps, architecting systems, selecting tools, designing workflows, building governance guardrails, and driving delivery through to production. 25+ years as a technology operator give me a practitioner\u2019s lens that pure strategists rarely bring."),

        spacer(200),

        // Core Consulting Capabilities
        section("CORE CONSULTING CAPABILITIES"),
        spacer(80),
        twoCol(
          [cap("Enterprise AI strategy & adoption roadmaps"),
           cap("AI use case discovery, prioritization & business-case development"),
           cap("Hands-on AI implementation for internal operations & client services"),
           cap("LLM workflow design, guardrails, approval flows & secure tool integration"),
           cap("AI-enabled service delivery for MSP, IT, security & compliance")],
          [cap("Enterprise software & platform architecture"),
           cap("Process automation & workflow orchestration"),
           cap("Security-first AI design, RBAC, auditability & policy controls"),
           cap("Multi-tenant SaaS & operational platform design"),
           cap("AI product strategy, feature definition & delivery oversight")]
        ),

        spacer(200),

        // Representative Value
        section("REPRESENTATIVE VALUE TO CLIENTS"),
        spacer(80),
        new Table({ width:{size:10080,type:WidthType.DXA}, columnWidths:[2400,7680],
          rows:[
            ["AI to Execution", "Turn AI from a vague initiative into an executable roadmap with clear phases, ownership, controls, and ROI logic"],
            ["Built for Real Business", "Design solutions that are usable inside real businesses with security, compliance, and operational constraints"],
            ["Strategy + Implementation", "Combine consulting judgment with hands-on implementation depth, reducing the gap between recommendations and deployment"],
            ["Operator Mindset", "Bring 25+ years of running a technology business to AI engagements \u2014 adoption, workflows, governance, and measurable outcomes"],
          ].map((r,i) => new TableRow({ children:[
            new TableCell({ borders:noBorders, width:{size:2400,type:WidthType.DXA}, margins:cm,
              shading:{fill:i%2===0?CORE_BLUE:TEAL,type:ShadingType.CLEAR},
              children:[new Paragraph({children:[new TextRun({text:r[0], font:"Open Sans", size:18, bold:true, color:WHITE})]})] }),
            new TableCell({ borders:noBorders, width:{size:7680,type:WidthType.DXA}, margins:cm,
              shading:{fill:i%2===0?OFF_WHITE:WHITE,type:ShadingType.CLEAR},
              children:[new Paragraph({children:[new TextRun({text:r[1], font:"Open Sans", size:18, color:GREY})]})] }),
          ] }))
        }),

        // PAGE BREAK
        new Paragraph({children:[new PageBreak()]}),

        // Professional Experience
        section("PROFESSIONAL EXPERIENCE"),
        spacer(80),
        new Paragraph({ children:[
          new TextRun({text:"CEO & AI / Technology Consulting Leader", font:"Open Sans", size:22, bold:true, color:DARK}),
          new TextRun({text:"  |  ", font:"Open Sans", size:22, color:GREY}),
          new TextRun({text:"Technijian Corporation", font:"Open Sans", size:22, bold:true, color:CORE_BLUE}),
        ] }),
        new Paragraph({ spacing:{after:100}, children:[
          new TextRun({text:"2000 \u2013 Present  \u2022  Irvine, California  \u2022  technijian.com", font:"Open Sans", size:18, italics:true, color:GREY}),
        ] }),
        body("Lead a technology services and consulting business focused on helping organizations modernize operations, improve security posture, and adopt practical automation and AI solutions across managed IT, cybersecurity, cloud, compliance, and custom software."),

        spacer(80),
        new Paragraph({ spacing:{after:60}, children:[new TextRun({text:"Enterprise Consulting & Advisory", font:"Open Sans", size:20, bold:true, color:TEAL})] }),
        bullet("Advise clients on enterprise AI adoption \u2014 opportunity mapping, workflow redesign, governance requirements, and phased implementation strategy"),
        bullet("Work with executive stakeholders to identify where AI can improve service delivery, reduce manual effort, accelerate documentation, improve decision support, and strengthen operational consistency"),
        bullet("Bridge business and technical teams by translating strategic goals into implementation plans, architectural requirements, delivery milestones, and measurable outcomes"),

        spacer(80),
        new Paragraph({ spacing:{after:60}, children:[new TextRun({text:"Hands-On Implementation Leadership", font:"Open Sans", size:20, bold:true, color:TEAL})] }),
        bullet("Translate consulting strategy into delivery by shaping solution architecture, system design, operational workflows, data structures, APIs, and deployment patterns"),
        bullet("Lead implementation initiatives: LLM-enabled assistants, workflow automation, policy-aware AI tooling, enterprise documentation systems, security & compliance operations workflows"),
        bullet("Stay involved below the strategy layer: architecture reviews, feature definition, edge-case analysis, process mapping, and execution troubleshooting"),

        spacer(80),
        new Paragraph({ spacing:{after:60}, children:[new TextRun({text:"AI / Platform / Product Leadership", font:"Open Sans", size:20, bold:true, color:TEAL})] }),
        bullet("Architected multi-agent AI SEO automation platform integrating Claude, GPT-4o, and Gemini with MCP servers; reduced content production time by ~70%"),
        bullet("Designed SDLC v7.0 (\"Claude Code Native\") \u2014 AI-first software development methodology covering discovery through post-release monitoring"),
        bullet("Architected ScamShield, an AI scam-detection product using LLM Council (Claude + GPT-4o + Gemini), Weaviate RAG, IPQS/Twilio risk scoring, and Whisper transcription \u2014 designed for 70\u201380% gross margins"),
        bullet("Deployed AI-driven document intelligence to auto-populate complex vendor questionnaires for FINRA-registered broker-dealers \u2014 cutting RFP response time from days to minutes"),
        bullet("Implemented Weaviate and Obsidian.md hybrid memory systems for enterprise AI agents, enabling persistent knowledge retrieval across sessions"),

        // PAGE BREAK
        new Paragraph({children:[new PageBreak()]}),

        // Technology & Domain Areas
        section("TECHNOLOGY & DOMAIN AREAS"),
        spacer(80),
        tagRow("AI / Automation", "Claude (Sonnet/Opus), GPT-4o, Gemini, Whisper | MCP Protocol & Apps | Claude Code | Multi-agent orchestration | LLM workflow design | Weaviate, Chroma, Pinecone (RAG/vector) | Obsidian.md knowledge systems | Prompt & system design | AI governance patterns"),
        spacer(40),
        tagRow("Architecture", "Multi-tenant platforms | Enterprise web apps | API-first services | Backend orchestration | MCP server integration (SEMrush, GA4, Perplexity, Firecrawl, DataForSEO, Asana, Gmail, Google Calendar) | .NET 8, React, WordPress"),
        spacer(40),
        tagRow("Security / Compliance", "Access control & RBAC | Audit trails | Compliance evidence workflows | HIPAA, PCI DSS, SOC 2, GDPR | CrowdStrike | DLP-oriented design | Zero Trust principles"),
        spacer(40),
        tagRow("Cloud & Infra", "AWS | Microsoft Azure | Microsoft 365 | Private datacenter | SD-WAN | 24/7 managed operations"),

        spacer(200),

        // Engagement Models
        section("ENGAGEMENT MODELS"),
        spacer(80),
        twoCol(
          [cap("Fractional AI CTO / Advisor"),
           cap("AI Strategy Workshops"),
           cap("Enterprise Roadmap Development"),
           cap("AI Implementation Planning")],
          [cap("AI Product / Service Design"),
           cap("Operational Automation Consulting"),
           cap("Security-Aware AI Workflow Design"),
           cap("Executive Advisory + Delivery Oversight")],
        ),

        spacer(200),

        // Industries
        section("INDUSTRIES SERVED"),
        spacer(80),
        body("Financial Services & FINRA-Registered Broker-Dealers  \u2022  Healthcare & HIPAA-Regulated Organizations  \u2022  Legal & Professional Services  \u2022  Real Estate & Property Management  \u2022  Technology & SaaS  \u2022  Manufacturing & Distribution  \u2022  Non-Profit & Education  \u2022  Retail & eCommerce"),

        spacer(200),

        // Education
        section("EDUCATION"),
        spacer(80),
        new Paragraph({ children:[
          new TextRun({text:"M.S., Electrical Engineering \u2014 Systems Engineering Concentration", font:"Open Sans", size:20, bold:true, color:DARK}),
        ] }),
        body("California State University, Fullerton (CSUF)", {italics:false}),
        spacer(60),
        new Paragraph({ children:[
          new TextRun({text:"B.S., Physics", font:"Open Sans", size:20, bold:true, color:DARK}),
        ] }),
        body("University of California, Los Angeles (UCLA)"),
        spacer(40),
        body("Ongoing professional development through Anthropic, AWS, Microsoft, CrowdStrike, and cybersecurity/compliance certification programs.", {italics:true}),

        spacer(200),
        bar(CORE_ORANGE, 10),
        spacer(60),
        new Paragraph({ alignment:AlignmentType.CENTER, children:[
          new TextRun({text:"rjain@technijian.com  \u2022  (949) 379-8499 x201  \u2022  technijian.com", font:"Open Sans", size:20, bold:true, color:CORE_BLUE}),
        ] }),
      ]
    }
  ]
});

const outDir = path.resolve(__dirname);
Packer.toBuffer(doc).then(buf => {
  const outPath = path.join(outDir, "Ravi_Jain_AI_Consulting_Resume_Technijian.docx");
  fs.writeFileSync(outPath, buf);
  console.log("Resume written to:", outPath);
});
