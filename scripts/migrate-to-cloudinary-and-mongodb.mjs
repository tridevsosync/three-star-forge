import dotenv from "dotenv";
import dns from "node:dns";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// DNS fix for Windows / MongoDB SRV
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch {
  // Ignore in environments where custom DNS servers cannot be set
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

console.log("=================================================");
console.log("  THREE STAR FORGE - CLOUDINARY & MONGODB MIGRATION");
console.log("=================================================");
console.log(`Cloudinary Cloud: ${process.env.CLOUDINARY_CLOUD_NAME || "NOT CONFIGURED"}`);
console.log(`MongoDB URI: ${process.env.MONGODB_URI ? "Configured" : "MISSING"}`);
console.log("-------------------------------------------------");

// Mongoose Schemas
const ContentSchema = new mongoose.Schema(
  {
    section: { type: String, required: true, unique: true, trim: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, default: "Machines", trim: true },
    image: { type: String, default: "", trim: true },
    cloudinaryPublicId: { type: String, default: "" },
    description: { type: String, default: "", trim: true },
    featured: { type: Boolean, default: false },
    featuredInHero: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    image: { type: String, default: "", trim: true },
    short: { type: String, default: "", trim: true },
    featured: { type: Boolean, default: false },
    featuredInHero: { type: Boolean, default: false },
    featuredInHome: { type: Boolean, default: false },
    overview: { type: String, default: "", trim: true },
    challenge: { type: String, default: "", trim: true },
    solution: { type: String, default: "", trim: true },
    application: { type: String, default: "", trim: true },
    specs: { type: [{ label: String, value: String }], default: [] },
    highlights: { type: [String], default: [] },
  },
  { timestamps: true }
);

const QuotationSchema = new mongoose.Schema(
  {
    quoteNumber: { type: String, required: true, unique: true, trim: true, index: true },
    rfqId: { type: String, default: "", trim: true },
    client: {
      name: { type: String, required: true, default: "Client Representative", trim: true },
      company: { type: String, required: true, default: "Industrial Client", trim: true },
      designation: { type: String, default: "", trim: true },
      email: { type: String, default: "", trim: true, lowercase: true },
      phone: { type: String, default: "", trim: true },
      gstin: { type: String, default: "", trim: true, uppercase: true },
      billingAddress: { type: String, default: "", trim: true },
      plantLocation: { type: String, default: "", trim: true },
    },
    project: {
      title: { type: String, default: "Custom Industrial Machinery Build", trim: true },
      category: { type: String, default: "Induction Hardening", trim: true },
      referenceDocName: { type: String, default: "", trim: true },
      referenceDocUrl: { type: String, default: "", trim: true },
    },
    lineItems: { type: [mongoose.Schema.Types.Mixed], default: [] },
    subtotal: { type: Number, required: true, default: 0 },
    discountTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "INR", trim: true },
    commercialTerms: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["draft", "sent", "under-review", "accepted", "declined", "expired"],
      default: "draft",
      index: true,
    },
    issuedDate: { type: Date, default: Date.now },
    validUntil: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    preparedBy: { type: String, default: "Three Star Enterprises Engineering Division", trim: true },
    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

const FeedbackSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    company: { type: String, default: "", trim: true },
    rating: { type: Number, required: true, default: 5 },
    category: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: "", trim: true },
    cloudinaryPublicId: { type: String, default: "", trim: true },
    type: { type: String, enum: ["client", "general"], default: "client" },
    isApproved: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
    submittedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Content = mongoose.models.Content || mongoose.model("Content", ContentSchema);
const Gallery = mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
const Quotation = mongoose.models.Quotation || mongoose.model("Quotation", QuotationSchema);
const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);

// Image Upload Helper
async function uploadFile(filePath, folder = "three-star-forge") {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder,
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
}

async function runMigration() {
  const imagesDir = path.join(rootDir, "public", "images");
  if (!fs.existsSync(imagesDir)) {
    throw new Error(`Images directory not found: ${imagesDir}`);
  }

  const files = fs.readdirSync(imagesDir).filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f));
  console.log(`[1/4] Found ${files.length} images in public/images to process for Cloudinary.`);

  const imageMap = new Map(); // filename & path -> { url, publicId }

  for (const file of files) {
    const fullPath = path.join(imagesDir, file);
    try {
      console.log(`  Uploading to Cloudinary: ${file}...`);
      const res = await uploadFile(fullPath, "three-star-forge/assets");
      const mapping = {
        url: res.secure_url,
        publicId: res.public_id,
        filename: file,
      };

      imageMap.set(file, mapping);
      imageMap.set(`/images/${file}`, mapping);
      imageMap.set(`images/${file}`, mapping);
      console.log(`  ✓ Uploaded ${file} -> ${res.secure_url}`);
    } catch (err) {
      console.error(`  ✗ Failed to upload ${file}:`, err.message || err);
    }
  }

  console.log(`\n[2/4] Successfully mapped ${imageMap.size / 3} images to Cloudinary CDN URLs.\n`);

  // Helper to replace local image URLs with Cloudinary CDN URLs
  function mapUrl(url) {
    if (!url || typeof url !== "string") return url;
    const clean = url.trim();
    if (imageMap.has(clean)) {
      return imageMap.get(clean).url;
    }
    const basename = path.basename(clean);
    if (imageMap.has(basename)) {
      return imageMap.get(basename).url;
    }
    return url;
  }

  function deepReplaceImages(obj) {
    if (!obj) return obj;
    if (typeof obj === "string") {
      return mapUrl(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => deepReplaceImages(item));
    }
    if (typeof obj === "object") {
      const result = {};
      for (const [key, val] of Object.entries(obj)) {
        if (key === "image" || key === "avatarUrl" || key === "url" || key === "photo") {
          result[key] = mapUrl(val);
        } else {
          result[key] = deepReplaceImages(val);
        }
      }
      return result;
    }
    return obj;
  }

  // Connect to MongoDB
  console.log("[3/4] Connecting to MongoDB Atlas...");
  await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 15000,
  });
  console.log("✓ Connected to MongoDB successfully.");

  // Import source site.ts dynamically / evaluate contents
  const siteModule = await import("../src/data/site.ts");
  const feedbackData = JSON.parse(
    fs.readFileSync(path.join(rootDir, "src", "data", "feedback.json"), "utf8")
  );

  console.log("\n[4/4] Inserting and Updating MongoDB Collections with Cloudinary URLs...");

  // 1. Migrate Gallery
  const demoGallery = siteModule.DEMO_GALLERY || [];
  const galleryDocs = demoGallery.map((g, idx) => {
    const imgInfo = imageMap.get(path.basename(g.image || "")) || {
      url: mapUrl(g.image),
      publicId: "",
    };
    return {
      title: g.title,
      category: g.category || "Machines",
      image: imgInfo.url || mapUrl(g.image),
      cloudinaryPublicId: imgInfo.publicId || "",
      description: g.caption || g.description || "",
      featured: Boolean(g.featured),
      featuredInHero: Boolean(g.featuredInHero),
      order: typeof g.order === "number" ? g.order : idx,
    };
  });

  await Gallery.deleteMany({});
  const insertedGallery = await Gallery.insertMany(galleryDocs);
  console.log(`  ✓ Inserted ${insertedGallery.length} Gallery photographs into MongoDB.`);

  // 2. Migrate Projects
  const demoProjects = siteModule.PROJECTS || [];
  const projectDocs = demoProjects.map((p) => ({
    title: p.title,
    industry: p.industry,
    category: p.category,
    image: mapUrl(p.image),
    short: p.short || "",
    featured: Boolean(p.featured),
    featuredInHero: Boolean(p.featuredInHero),
    featuredInHome: Boolean(p.featuredInHome),
    overview: p.overview || "",
    challenge: p.challenge || "",
    solution: p.solution || "",
    application: p.application || "",
    specs: Array.isArray(p.specs) ? p.specs : [],
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
  }));

  await Project.deleteMany({});
  const insertedProjects = await Project.insertMany(projectDocs);
  console.log(`  ✓ Inserted ${insertedProjects.length} Projects into MongoDB.`);

  // 3. Migrate Content Sections
  const sectionsToMigrate = {
    company: siteModule.COMPANY,
    home: siteModule.HOME_CONTENT,
    services: siteModule.SERVICES,
    engagementModels: siteModule.ENGAGEMENT_MODELS,
    industries: siteModule.INDUSTRIES,
    capabilities: siteModule.CAPABILITIES,
    faqs: siteModule.FAQS,
    testimonials: siteModule.TESTIMONIALS,
    servicesSpotlight: siteModule.DEFAULT_SERVICES_SPOTLIGHT,
  };

  let contentCount = 0;
  for (const [section, data] of Object.entries(sectionsToMigrate)) {
    const processedData = deepReplaceImages(data);
    await Content.findOneAndUpdate(
      { section },
      { section, data: processedData },
      { upsert: true, new: true }
    );
    contentCount++;
  }
  console.log(`  ✓ Upserted ${contentCount} Content sections into MongoDB.`);

  // 4. Migrate Feedback
  if (Array.isArray(feedbackData) && feedbackData.length > 0) {
    const feedbackDocs = feedbackData.map((fb) => ({
      fullName: fb.fullName,
      company: fb.company || "",
      rating: fb.rating || 5,
      category: fb.category || "General",
      message: fb.message,
      avatarUrl: mapUrl(fb.avatarUrl || ""),
      cloudinaryPublicId: fb.cloudinaryPublicId || "",
      type: fb.type || "client",
      isApproved: fb.isApproved !== undefined ? fb.isApproved : true,
      status: fb.status || "approved",
      submittedDate: fb.submittedDate ? new Date(fb.submittedDate) : new Date(),
    }));

    await Feedback.deleteMany({});
    const insertedFeedback = await Feedback.insertMany(feedbackDocs);
    console.log(`  ✓ Inserted ${insertedFeedback.length} Feedback reviews into MongoDB.`);
  }

  // 5. Migrate Sample Quotations (ensure they exist with proper structure)
  const existingQuoteCount = await Quotation.countDocuments({});
  if (existingQuoteCount === 0) {
    const sampleQuotes = [
      {
        quoteNumber: "TSE/QT/2026/0001",
        client: {
          name: "Vikram Sharma",
          company: "Bharat Forge Ltd",
          designation: "Head of Plant Engineering",
          email: "v.sharma@bharatforge.com",
          phone: "+91 98220 12345",
          gstin: "27AAACB1234F1Z5",
          billingAddress: "Plot 45, Chakan Industrial Area Phase II, Pune - 410501",
          plantLocation: "Chakan Plant, Pune Works",
        },
        project: {
          title: "Vertical CNC Induction Hardening Scanner System - 250 kW",
          category: "Induction Hardening",
          referenceDocName: "Crankshaft-Drawing-Rev-4.pdf",
        },
        lineItems: [
          {
            description: "Vertical Induction Hardening Machine (250 kW / 10-30 kHz) with Siemens S7-1500 PLC & Servo Drive Control System",
            hsnCode: "8479",
            quantity: 1,
            unit: "Nos",
            unitPrice: 2450000,
            discountPercent: 0,
            taxPercent: 18,
            amount: 2891000,
          },
          {
            description: "Custom Induction Heating Coil & Magnetic Flux Concentrator Fixture Set for Crankshaft Journals",
            hsnCode: "8514",
            quantity: 2,
            unit: "Sets",
            unitPrice: 180000,
            discountPercent: 5,
            taxPercent: 18,
            amount: 403560,
          },
          {
            description: "Closed-Loop Polymer Quench Re-circulation & Heat Exchanger System with Digital Temperature Monitoring",
            hsnCode: "8419",
            quantity: 1,
            unit: "Nos",
            unitPrice: 320000,
            discountPercent: 0,
            taxPercent: 18,
            amount: 377600,
          },
          {
            description: "100% Factory Acceptance Trial (FAT) at Pune Plant, Transport to Site & Site Commissioning Protocol",
            hsnCode: "9987",
            quantity: 1,
            unit: "Lots",
            unitPrice: 150000,
            discountPercent: 0,
            taxPercent: 18,
            amount: 177000,
          },
        ],
        subtotal: 3280000,
        discountTotal: 18000,
        taxTotal: 587160,
        grandTotal: 3849160,
        currency: "INR",
        commercialTerms: {
          paymentTerms: "30% Advance with Purchase Order, 60% against successful FAT trial inspection at Pune works, 10% after site commissioning.",
          deliveryTimeline: "8 - 10 Weeks from drawing approval & advance receipt.",
          validityDays: 30,
          warranty: "12 Months from date of commissioning or 18 months from dispatch date.",
          freightTerms: "Ex-Works Pune Plant. Freight, packing, and transit insurance extra at actuals.",
          inspectionFAT: "100% FAT trial & cycle trial at Pune plant prior to dispatch.",
          specialNotes: "Tooling coils designed for 50-70 HRC case depth specification on EN19 / AISI 4140 steel alloy.",
        },
        status: "sent",
        issuedDate: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        preparedBy: "Technical Sales & SPM Engineering Division",
      },
      {
        quoteNumber: "TSE/QT/2026/0002",
        client: {
          name: "Rajesh Kulkarni",
          company: "Kirloskar Oil Engines Ltd",
          designation: "Senior Manager - Manufacturing Automation",
          email: "r.kulkarni@kirloskar.com",
          phone: "+91 98900 67890",
          gstin: "27AABCK5678G2Z1",
          billingAddress: "Khadki Works, Pune - 411003, Maharashtra",
          plantLocation: "Khadki Pune Plant",
        },
        project: {
          title: "Automated Roller Conveyor Transfer Line with Pneumatic Lifters",
          category: "Material Handling & Conveyors",
          referenceDocName: "Engine-Block-Transfer-Layout-V2.dwg",
        },
        lineItems: [
          {
            description: "Heavy-Duty Motorized Powered Roller Conveyor (12 Meters) with Variable Frequency Drive (VFD)",
            hsnCode: "8428",
            quantity: 1,
            unit: "Nos",
            unitPrice: 850000,
            discountPercent: 0,
            taxPercent: 18,
            amount: 1003000,
          },
          {
            description: "Pneumatic Workpiece Indexing & 90-Degree Turntable Transfer Station with Festo Pneumatics",
            hsnCode: "8479",
            quantity: 2,
            unit: "Sets",
            unitPrice: 220000,
            discountPercent: 0,
            taxPercent: 18,
            amount: 519200,
          },
        ],
        subtotal: 1290000,
        discountTotal: 0,
        taxTotal: 232200,
        grandTotal: 1522200,
        currency: "INR",
        commercialTerms: {
          paymentTerms: "40% Advance with PO, 50% on FAT inspection approval in Pune, 10% on handover.",
          deliveryTimeline: "6 - 8 Weeks from layout signoff.",
          validityDays: 30,
          warranty: "12 Months comprehensive warranty on mechanical & electrical assemblies.",
          freightTerms: "Ex-Works Pune.",
          inspectionFAT: "FAT testing with simulated load at Pune facility.",
        },
        status: "accepted",
        issuedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        validUntil: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        preparedBy: "Automation & Robotics Design Cell",
      },
    ];
    const insertedQuotes = await Quotation.insertMany(sampleQuotes);
    console.log(`  ✓ Inserted ${insertedQuotes.length} initial Quotation proposals into MongoDB.`);
  } else {
    console.log(`  ✓ MongoDB already has ${existingQuoteCount} Quotations preserved.`);
  }

  await mongoose.disconnect();

  console.log("\n=================================================");
  console.log("  MIGRATION COMPLETE!");
  console.log("  All image assets uploaded to Cloudinary.");
  console.log("  All data persisted in MongoDB Atlas.");
  console.log("=================================================");
}

runMigration().catch((err) => {
  console.error("Migration failed with error:", err);
  process.exit(1);
});
