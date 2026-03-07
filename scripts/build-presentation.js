const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Technijian";
pres.title = "Technijian Presentation Template";

// Brand colors (no # prefix)
const CORE_ORANGE = "F67D4B";
const CORE_BLUE = "006DB6";
const TEAL = "1EAAC8";
const DARK_CHARCOAL = "1A1A2E";
const BRAND_GREY = "59595B";
const OFF_WHITE = "F8F9FA";
const WHITE = "FFFFFF";
const LIGHT_GREY = "E9ECEF";

// Logo paths
const baseDir = path.resolve(__dirname, "..");
const logoLight = path.join(baseDir, "assets", "logos", "png", "technijian-logo-full-color-1200x251.png");
const logoDark = path.join(baseDir, "assets", "logos", "png", "technijian-logo-reverse-white-5000x1667.png");

// ============================================================
// SLIDE 1: Title Slide (dark charcoal background)
// ============================================================
const slide1 = pres.addSlide();
slide1.background = { color: DARK_CHARCOAL };

// Logo top-left (white version for dark bg)
slide1.addImage({ path: logoDark, x: 0.6, y: 0.4, w: 2.4, h: 0.5 });

// Title
slide1.addText("Presentation Title", {
  x: 0.6, y: 1.6, w: 8.8, h: 1.5,
  fontSize: 40, fontFace: "Open Sans", bold: true,
  color: WHITE, margin: 0
});

// Subtitle
slide1.addText("Subtitle or date goes here", {
  x: 0.6, y: 3.1, w: 8.8, h: 0.6,
  fontSize: 18, fontFace: "Open Sans",
  color: LIGHT_GREY, margin: 0
});

// Orange accent line at bottom
slide1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 5.35, w: 10, h: 0.08,
  fill: { color: CORE_ORANGE }
});

// Tagline bottom-right
slide1.addText("technology as a solution", {
  x: 5.5, y: 4.8, w: 4, h: 0.4,
  fontSize: 11, fontFace: "Open Sans", color: TEAL,
  align: "right", charSpacing: 3, margin: 0
});


// ============================================================
// SLIDE 2: Section Divider (Core Blue background)
// ============================================================
const slide2 = pres.addSlide();
slide2.background = { color: CORE_BLUE };

// Section number
slide2.addText("01", {
  x: 0.6, y: 1.0, w: 8.8, h: 1.0,
  fontSize: 60, fontFace: "Open Sans", bold: true,
  color: WHITE, align: "center", margin: 0,
  transparency: 30
});

// Section title
slide2.addText("Section Title", {
  x: 0.6, y: 2.2, w: 8.8, h: 1.2,
  fontSize: 36, fontFace: "Open Sans", bold: true,
  color: WHITE, align: "center", margin: 0
});

// Thin white line divider
slide2.addShape(pres.shapes.LINE, {
  x: 3.5, y: 3.5, w: 3, h: 0,
  line: { color: WHITE, width: 1.5, transparency: 50 }
});

// Section description
slide2.addText("Brief description of this section", {
  x: 2, y: 3.8, w: 6, h: 0.6,
  fontSize: 16, fontFace: "Open Sans",
  color: WHITE, align: "center", margin: 0,
  transparency: 20
});

// Logo bottom-left
slide2.addImage({ path: logoDark, x: 0.4, y: 5.0, w: 1.6, h: 0.33 });


// ============================================================
// SLIDE 3: Content Slide (white bg, blue header)
// ============================================================
const slide3 = pres.addSlide();
slide3.background = { color: WHITE };

// Blue header bar
slide3.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.9,
  fill: { color: CORE_BLUE }
});

// Logo in header (white for blue bg)
slide3.addImage({ path: logoDark, x: 0.4, y: 0.2, w: 1.5, h: 0.31 });

// Slide title
slide3.addText("Slide Title Here", {
  x: 0.6, y: 1.1, w: 8.8, h: 0.7,
  fontSize: 28, fontFace: "Open Sans", bold: true,
  color: CORE_BLUE, margin: 0
});

// Body text area
slide3.addText([
  { text: "Key point or paragraph text goes here. This is the main content area of the slide where you present information, data, or discussion points.", options: { breakLine: true, paraSpaceAfter: 12 } },
  { text: "Second paragraph or point. Use this area for your core message. Keep text concise and supplement with visuals where possible.", options: { breakLine: true, paraSpaceAfter: 12 } },
  { text: "Third point with supporting detail. Remember to lead with the client's challenge, then present the Technijian solution." }
], {
  x: 0.6, y: 1.9, w: 8.8, h: 3.0,
  fontSize: 15, fontFace: "Open Sans",
  color: BRAND_GREY, margin: 0, lineSpacingMultiple: 1.4
});

// Footer line
slide3.addShape(pres.shapes.LINE, {
  x: 0.6, y: 5.2, w: 8.8, h: 0,
  line: { color: LIGHT_GREY, width: 0.75 }
});

// Footer text
slide3.addText("technijian.com", {
  x: 0.6, y: 5.25, w: 4, h: 0.3,
  fontSize: 9, fontFace: "Open Sans", color: BRAND_GREY, margin: 0
});


// ============================================================
// SLIDE 4: Two-Column Layout
// ============================================================
const slide4 = pres.addSlide();
slide4.background = { color: WHITE };

// Header bar
slide4.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.9,
  fill: { color: CORE_BLUE }
});
slide4.addImage({ path: logoDark, x: 0.4, y: 0.2, w: 1.5, h: 0.31 });

// Slide title
slide4.addText("Two-Column Layout", {
  x: 0.6, y: 1.1, w: 8.8, h: 0.7,
  fontSize: 28, fontFace: "Open Sans", bold: true,
  color: CORE_BLUE, margin: 0
});

// Left column background
slide4.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 2.0, w: 4.2, h: 3.0,
  fill: { color: OFF_WHITE }
});

// Left column content
slide4.addText([
  { text: "Left Column", options: { bold: true, fontSize: 18, color: CORE_BLUE, breakLine: true, paraSpaceAfter: 8 } },
  { text: "Content for the left side. Use this for comparisons, before/after scenarios, or presenting two related topics side by side.", options: { fontSize: 14, color: BRAND_GREY } }
], {
  x: 0.9, y: 2.2, w: 3.6, h: 2.6,
  fontFace: "Open Sans", margin: 0
});

// Right column background
slide4.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 2.0, w: 4.2, h: 3.0,
  fill: { color: OFF_WHITE }
});

// Right column content
slide4.addText([
  { text: "Right Column", options: { bold: true, fontSize: 18, color: CORE_BLUE, breakLine: true, paraSpaceAfter: 8 } },
  { text: "Content for the right side. Mirror the structure of the left column for visual consistency. Keep both columns balanced in content length.", options: { fontSize: 14, color: BRAND_GREY } }
], {
  x: 5.5, y: 2.2, w: 3.6, h: 2.6,
  fontFace: "Open Sans", margin: 0
});

// Footer
slide4.addShape(pres.shapes.LINE, {
  x: 0.6, y: 5.2, w: 8.8, h: 0,
  line: { color: LIGHT_GREY, width: 0.75 }
});
slide4.addText("technijian.com", {
  x: 0.6, y: 5.25, w: 4, h: 0.3,
  fontSize: 9, fontFace: "Open Sans", color: BRAND_GREY, margin: 0
});


// ============================================================
// SLIDE 5: Image + Text Layout
// ============================================================
const slide5 = pres.addSlide();
slide5.background = { color: WHITE };

// Header bar
slide5.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.9,
  fill: { color: CORE_BLUE }
});
slide5.addImage({ path: logoDark, x: 0.4, y: 0.2, w: 1.5, h: 0.31 });

// Left: Image placeholder area
slide5.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 1.1, w: 4.4, h: 4.1,
  fill: { color: OFF_WHITE },
  line: { color: LIGHT_GREY, width: 1, dashType: "dash" }
});
slide5.addText("Image Placeholder", {
  x: 0.6, y: 2.8, w: 4.4, h: 0.5,
  fontSize: 14, fontFace: "Open Sans", color: BRAND_GREY,
  align: "center", margin: 0
});

// Right: Text content
slide5.addText("Content Title", {
  x: 5.4, y: 1.2, w: 4.2, h: 0.6,
  fontSize: 24, fontFace: "Open Sans", bold: true,
  color: CORE_BLUE, margin: 0
});

// Orange accent bar
slide5.addShape(pres.shapes.RECTANGLE, {
  x: 5.4, y: 1.85, w: 1.2, h: 0.05,
  fill: { color: CORE_ORANGE }
});

slide5.addText("Description text goes here. This layout works well for showcasing a product screenshot, team photo, or data visualization alongside explanatory text.", {
  x: 5.4, y: 2.1, w: 4.2, h: 2.5,
  fontSize: 14, fontFace: "Open Sans",
  color: BRAND_GREY, margin: 0, lineSpacingMultiple: 1.5
});

// Footer
slide5.addShape(pres.shapes.LINE, {
  x: 0.6, y: 5.2, w: 8.8, h: 0,
  line: { color: LIGHT_GREY, width: 0.75 }
});
slide5.addText("technijian.com", {
  x: 0.6, y: 5.25, w: 4, h: 0.3,
  fontSize: 9, fontFace: "Open Sans", color: BRAND_GREY, margin: 0
});


// ============================================================
// SLIDE 6: Quote / Testimonial
// ============================================================
const slide6 = pres.addSlide();
slide6.background = { color: OFF_WHITE };

// Large quote mark
slide6.addText("\u201C", {
  x: 0.6, y: 0.6, w: 1.5, h: 1.5,
  fontSize: 120, fontFace: "Georgia",
  color: CORE_BLUE, margin: 0, transparency: 30
});

// Quote text
slide6.addText("Technijian transformed our IT infrastructure. Their dedicated pod team knows our systems better than we do, and their proactive approach means we rarely have issues anymore.", {
  x: 1.2, y: 1.8, w: 7.6, h: 2.0,
  fontSize: 22, fontFace: "Open Sans", italic: true,
  color: DARK_CHARCOAL, margin: 0, lineSpacingMultiple: 1.5
});

// Attribution line
slide6.addShape(pres.shapes.RECTANGLE, {
  x: 1.2, y: 4.0, w: 1.0, h: 0.04,
  fill: { color: CORE_ORANGE }
});

slide6.addText([
  { text: "Client Name", options: { bold: true, fontSize: 14, color: DARK_CHARCOAL, breakLine: true } },
  { text: "Title, Company Name", options: { fontSize: 12, color: BRAND_GREY } }
], {
  x: 1.2, y: 4.2, w: 5, h: 0.8,
  fontFace: "Open Sans", margin: 0
});

// Logo bottom-right
slide6.addImage({ path: logoLight, x: 7.2, y: 4.8, w: 2.2, h: 0.46 });


// ============================================================
// SLIDE 7: Closing / CTA Slide
// ============================================================
const slide7 = pres.addSlide();
slide7.background = { color: DARK_CHARCOAL };

// Logo centered at top
slide7.addImage({ path: logoDark, x: 3.0, y: 0.6, w: 4.0, h: 0.83 });

// "Let's Talk" heading
slide7.addText("Let\u2019s Talk", {
  x: 1, y: 1.8, w: 8, h: 0.9,
  fontSize: 40, fontFace: "Open Sans", bold: true,
  color: WHITE, align: "center", margin: 0
});

// Subheading
slide7.addText("Ready to make technology work for your business?", {
  x: 1, y: 2.6, w: 8, h: 0.6,
  fontSize: 16, fontFace: "Open Sans",
  color: LIGHT_GREY, align: "center", margin: 0
});

// CTA button shape (orange)
slide7.addShape(pres.shapes.RECTANGLE, {
  x: 3.2, y: 3.5, w: 3.6, h: 0.7,
  fill: { color: CORE_ORANGE },
  rectRadius: 0.06
});
slide7.addText("949.379.8500", {
  x: 3.2, y: 3.5, w: 3.6, h: 0.7,
  fontSize: 20, fontFace: "Open Sans", bold: true,
  color: WHITE, align: "center", valign: "middle", margin: 0
});

// Contact details
slide7.addText([
  { text: "rjain@technijian.com", options: { breakLine: true, color: TEAL, fontSize: 14 } },
  { text: "technijian.com", options: { breakLine: true, color: TEAL, fontSize: 14 } },
  { text: "", options: { breakLine: true, fontSize: 8 } },
  { text: "18 Technology Dr., Ste 141, Irvine, CA 92618", options: { color: BRAND_GREY, fontSize: 11 } }
], {
  x: 1, y: 4.4, w: 8, h: 1.0,
  fontFace: "Open Sans", align: "center", margin: 0
});


// ============================================================
// WRITE FILE
// ============================================================
const outPath = path.join(__dirname, "..", "assets", "presentations", "technijian-template.pptx");
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("Created: " + outPath);
}).catch(err => {
  console.error("Error:", err);
});
