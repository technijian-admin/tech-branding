const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        ImageRun, Header, Footer, AlignmentType, ExternalHyperlink,
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

function bar(color, h) {
  h = h || 20;
  return new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[9360],
    rows:[new TableRow({ children:[new TableCell({ borders:noBorders, width:{size:9360,type:WidthType.DXA},
      shading:{fill:color||CORE_BLUE,type:ShadingType.CLEAR}, margins:{top:h,bottom:h,left:0,right:0},
      children:[new Paragraph({children:[]})] })] })] });
}

function spacer(h) { return new Paragraph({spacing:{before:h||120},children:[]}); }

function bodyP(runs) {
  return new Paragraph({ spacing:{after:120}, children: runs.map(r => {
    if (typeof r === "string") return new TextRun({text:r, font:"Open Sans", size:22, color:GREY});
    return new TextRun({font:"Open Sans", size:22, color:GREY, ...r});
  }) });
}

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

function projectRow(name, desc) {
  const border = { style:BorderStyle.SINGLE, size:1, color:LIGHT_GREY };
  const borders = { top:border, bottom:border, left:border, right:border };
  return new TableRow({ children:[
    new TableCell({ borders, width:{size:2800,type:WidthType.DXA}, margins:cm,
      children:[new Paragraph({children:[new TextRun({text:name, font:"Open Sans", size:20, bold:true, color:DARK})]})] }),
    new TableCell({ borders, width:{size:6560,type:WidthType.DXA}, margins:cm,
      children:[new Paragraph({children:[new TextRun({text:desc, font:"Open Sans", size:20, color:GREY})]})] }),
  ] });
}

const doc = new Document({
  styles: { default: { document: { run: { font: "Open Sans", size: 22 } } } },
  sections: [{
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
            new TextRun({text:"Technijian Corporation | 18 Technology Dr., Ste 141, Irvine, CA 92618 | 949.379.8500", font:"Open Sans", size:16, color:GREY}),
          ] })
      ] })
    },
    children: [
      // Date & address block
      spacer(60),
      new Paragraph({ children:[new TextRun({text:"April 7, 2026", font:"Open Sans", size:22, color:GREY})] }),
      spacer(200),
      new Paragraph({ children:[new TextRun({text:"Anderson Real Estate", font:"Open Sans", size:22, bold:true, color:DARK})] }),
      new Paragraph({ children:[new TextRun({text:"Attn: Executive Leadership", font:"Open Sans", size:22, color:GREY})] }),
      new Paragraph({ children:[new TextRun({text:"1800 Avenue of the Stars, Suite 200", font:"Open Sans", size:22, color:GREY})] }),
      new Paragraph({ children:[new TextRun({text:"Los Angeles, CA 90067", font:"Open Sans", size:22, color:GREY})] }),

      spacer(200),

      // Salutation
      new Paragraph({ children:[new TextRun({text:"Dear Anderson Real Estate Leadership Team,", font:"Open Sans", size:22, bold:true, color:DARK})] }),

      spacer(120),

      // Opening
      bodyP([
        "I\u2019m writing to introduce ",
        {text:"Technijian Corporation", bold:true, color:CORE_BLUE},
        " and the AI consulting services we provide to established real estate development and property management firms. With a portfolio of ",
        {text:"53+ properties spanning 3.1 million square feet across 9 markets", bold:true},
        " and 250+ tenants, Anderson Real Estate represents exactly the type of operationally complex, relationship-driven business where targeted AI adoption can create outsized returns \u2014 without disrupting what already works."
      ]),

      bodyP([
        "I\u2019m Ravi Jain, Founder & CEO of Technijian, an AI strategy and implementation consulting firm based in Irvine. I\u2019ve spent 25+ years helping organizations across ",
        {text:"real estate, financial services, healthcare, and professional services"},
        " move from AI curiosity to operational deployment. My approach is practical: identify where AI creates measurable value, design solutions that respect your existing workflows and compliance requirements, then implement and operationalize them."
      ]),

      spacer(120),

      // Why Anderson
      section("WHY ANDERSON REAL ESTATE"),
      spacer(80),

      bodyP([
        "Your organization has qualities that make AI adoption both high-impact and low-risk: a large, diversified portfolio across office, retail, mixed-use, and industrial assets; a 162-person team managing geographically dispersed properties from Beverly Hills to Hawaii; and a family-ownership culture that values long-term operational excellence over short-term disruption."
      ]),

      bodyP([
        "Based on my review of your portfolio and operations, I see several areas where AI can deliver ",
        {text:"immediate, measurable ROI", bold:true},
        " for Anderson Real Estate:"
      ]),

      spacer(120),

      // Proposed Projects
      section("PROPOSED AI CONSULTING PROJECTS"),
      spacer(80),

      // Projects table
      new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2800,6560],
        rows:[
          // Header
          new TableRow({ children:[
            new TableCell({ borders:noBorders, width:{size:2800,type:WidthType.DXA}, margins:cm,
              shading:{fill:CORE_BLUE,type:ShadingType.CLEAR},
              children:[new Paragraph({children:[new TextRun({text:"PROJECT", font:"Open Sans", size:18, bold:true, color:WHITE})]})] }),
            new TableCell({ borders:noBorders, width:{size:6560,type:WidthType.DXA}, margins:cm,
              shading:{fill:CORE_BLUE,type:ShadingType.CLEAR},
              children:[new Paragraph({children:[new TextRun({text:"DESCRIPTION", font:"Open Sans", size:18, bold:true, color:WHITE})]})] }),
          ] }),
          projectRow("AI Readiness Assessment", "Discovery engagement to map current workflows across leasing, property management, tenant communications, and finance; identify top AI opportunities ranked by ROI and feasibility; deliver an executive-ready roadmap"),
          projectRow("Tenant Intelligence Platform", "AI-powered analytics across your tenant base: lease renewal prediction, rent collection risk scoring, tenant satisfaction signals, and automated communication workflows"),
          projectRow("Portfolio Performance AI", "Automated performance dashboards across your properties and markets: occupancy trend analysis, revenue optimization modeling, market comparison intelligence, and anomaly detection"),
          projectRow("Smart Property Ops", "AI-assisted maintenance ticketing and prioritization, vendor management optimization, predictive maintenance scheduling, and energy usage intelligence across your engineering teams"),
          projectRow("AI Document Intelligence", "Automated lease abstraction, compliance document processing, vendor contract analysis, and AI-assisted RFP/questionnaire responses \u2014 dramatically reducing manual review time"),
          projectRow("Executive AI Briefing", "Half-day leadership workshop: real estate AI landscape, live demos tailored to Anderson\u2019s portfolio, competitive positioning, and prioritized opportunity assessment"),
        ]
      }),

      spacer(200),

      // Engagement Models
      section("ENGAGEMENT OPTIONS"),
      spacer(80),

      new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[3120,3120,3120],
        rows:[
          new TableRow({ children:[
            new TableCell({ borders:noBorders, width:{size:3120,type:WidthType.DXA}, margins:{top:120,bottom:120,left:160,right:160},
              shading:{fill:DARK,type:ShadingType.CLEAR},
              children:[
                new Paragraph({alignment:AlignmentType.CENTER, children:[new TextRun({text:"FIXED-SCOPE PROJECTS", font:"Open Sans", size:20, bold:true, color:WHITE})]}),
                new Paragraph({alignment:AlignmentType.CENTER, spacing:{before:80}, children:[new TextRun({text:"Defined scope, deliverables, and timeline. Pay for outcomes, not hours. Ideal for discrete initiatives like the AI Readiness Assessment or Document Intelligence.", font:"Open Sans", size:18, color:LIGHT_GREY})]}),
              ] }),
            new TableCell({ borders:noBorders, width:{size:3120,type:WidthType.DXA}, margins:{top:120,bottom:120,left:160,right:160},
              shading:{fill:CORE_BLUE,type:ShadingType.CLEAR},
              children:[
                new Paragraph({alignment:AlignmentType.CENTER, children:[new TextRun({text:"FLEXIBLE CONSULTING", font:"Open Sans", size:20, bold:true, color:WHITE})]}),
                new Paragraph({alignment:AlignmentType.CENTER, spacing:{before:80}, children:[new TextRun({text:"On-demand engagement for ongoing strategic guidance, architecture reviews, implementation support, or supplementing your team on AI initiatives as needs evolve.", font:"Open Sans", size:18, color:LIGHT_GREY})]}),
              ] }),
            new TableCell({ borders:noBorders, width:{size:3120,type:WidthType.DXA}, margins:{top:120,bottom:120,left:160,right:160},
              shading:{fill:TEAL,type:ShadingType.CLEAR},
              children:[
                new Paragraph({alignment:AlignmentType.CENTER, children:[new TextRun({text:"FRACTIONAL AI ADVISOR", font:"Open Sans", size:20, bold:true, color:WHITE})]}),
                new Paragraph({alignment:AlignmentType.CENTER, spacing:{before:80}, children:[new TextRun({text:"Retained monthly engagement providing ongoing strategic AI guidance, vendor evaluation, team enablement, and implementation oversight on a predictable cadence.", font:"Open Sans", size:18, color:LIGHT_GREY})]}),
              ] }),
          ] }),
        ]
      }),

      spacer(200),

      // Why Technijian
      section("WHY TECHNIJIAN"),
      spacer(80),

      bodyP([
        {text:"\u25B8 Real Estate Experience: ", bold:true, color:CORE_ORANGE},
        "We serve property management and real estate firms as a core vertical \u2014 we understand lease cycles, tenant relationships, CAM reconciliation, and the operational complexity of managing a diversified portfolio."
      ]),
      bodyP([
        {text:"\u25B8 Strategy + Implementation: ", bold:true, color:CORE_ORANGE},
        "Unlike pure strategy consultants, we don\u2019t hand you a slide deck and walk away. We architect, build, and operationalize solutions through to production."
      ]),
      bodyP([
        {text:"\u25B8 Security & Compliance First: ", bold:true, color:CORE_ORANGE},
        "Every solution we design includes access controls, audit trails, and data governance \u2014 critical when handling tenant PII, financial data, and lease documents."
      ]),
      bodyP([
        {text:"\u25B8 Proven AI Delivery: ", bold:true, color:CORE_ORANGE},
        "We\u2019ve deployed AI document intelligence for FINRA broker-dealers, multi-agent automation platforms, and enterprise-grade LLM workflows \u2014 with the same rigor we\u2019d bring to Anderson."
      ]),

      spacer(200),

      // Closing
      bodyP([
        "I\u2019d welcome the opportunity to schedule a 30-minute introductory call with your leadership team to discuss how AI can strengthen Anderson Real Estate\u2019s operations, tenant experience, and competitive positioning. An ",
        {text:"Executive AI Briefing", bold:true, color:CORE_BLUE},
        " is a great starting point \u2014 or we can begin with a comprehensive ",
        {text:"AI Readiness Assessment", bold:true, color:CORE_BLUE},
        " for a deeper, actionable engagement."
      ]),

      spacer(100),
      new Paragraph({ children:[new TextRun({text:"Looking forward to the conversation.", font:"Open Sans", size:22, color:GREY})] }),

      spacer(200),
      new Paragraph({ children:[new TextRun({text:"Ravi Jain", font:"Open Sans", size:22, bold:true, color:DARK})] }),
      new Paragraph({ children:[new TextRun({text:"Founder & CEO, Technijian Corporation", font:"Open Sans", size:22, color:CORE_BLUE})] }),
      new Paragraph({ children:[new TextRun({text:"AI Strategy & Implementation Consulting", font:"Open Sans", size:20, color:GREY})] }),
      new Paragraph({ children:[new TextRun({text:"rjain@technijian.com  \u2022  (949) 379-8499 x201  \u2022  technijian.com", font:"Open Sans", size:20, color:GREY})] }),

      spacer(120),
      bar(CORE_ORANGE, 10),
    ]
  }]
});

const outDir = path.resolve(__dirname);
Packer.toBuffer(doc).then(buf => {
  const outPath = path.join(outDir, "Cover_Letter_Anderson_Real_Estate.docx");
  fs.writeFileSync(outPath, buf);
  console.log("Cover letter written to:", outPath);
});
