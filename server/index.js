import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory store for demo enquiries
const enquiries = [
  {
    id: "enq-1",
    name: "John Miller",
    company: "Apex Precision Engineering",
    email: "j.miller@apexeng.com",
    phone: "+91 98234 56789",
    industry: "Industrial Automation",
    requirement: "Turnkey induction hardening machine line automation",
    message: "Interested in discussing customized fixture design and cycle time optimization.",
    createdAt: new Date().toISOString(),
  },
];

// Company Information
const companyInfo = {
  name: "THREE STAR ENTERPRISES",
  contactPerson: "V.A.Chavan",
  address:
    "Gat No 78, Near Parandwal Chowk Behind Atharva Hotel, Dehu Gaon, TQ: Haveli, Dist: Pune, Maharashtra - 412109",
  phone: "+91 9823463655 / 8788848977",
  email: "3starchavan@gmail.com",
  website: "www.threestarent.com",
  positioning:
    "Comprehensive design, turnkey manufacturing, and product management services for global OEMs.",
};

// API Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
  });
});

app.get("/api/info", (req, res) => {
  res.json({ success: true, data: companyInfo });
});

app.get("/api/enquiries", (req, res) => {
  res.json({ success: true, count: enquiries.length, data: enquiries });
});

app.post("/api/enquiries", (req, res) => {
  const { name, company, email, phone, industry, requirement, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and message are required fields.",
    });
  }

  const newEnquiry = {
    id: `enq-${Date.now()}`,
    name,
    company: company || "",
    email,
    phone: phone || "",
    industry: industry || "General",
    requirement: requirement || "",
    message,
    createdAt: new Date().toISOString(),
  };

  enquiries.unshift(newEnquiry);
  console.log(`[API] New Enquiry received from ${name} (${company || "Individual"})`);

  res.status(201).json({
    success: true,
    message: "Enquiry submitted successfully.",
    data: newEnquiry,
  });
});

// Serve static build if available
const publicDirs = [
  path.join(rootDir, ".output", "public"),
  path.join(rootDir, "dist"),
  path.join(rootDir, "public"),
];

for (const dir of publicDirs) {
  if (fs.existsSync(dir)) {
    app.use(express.static(dir));
  }
}

// Fallback handler for client-side routing
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Endpoint not found" });
  }

  const indexPath = path.join(rootDir, ".output", "public", "index.html");
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  const distIndexPath = path.join(rootDir, "dist", "index.html");
  if (fs.existsSync(distIndexPath)) {
    return res.sendFile(distIndexPath);
  }

  res.json({
    message: "Three Star Forge Node.js Backend is running.",
    apiEndpoints: ["/api/health", "/api/info", "/api/enquiries"],
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  THREE STAR FORGE - Node.js Server`);
  console.log(`  Server running at http://localhost:${PORT}`);
  console.log(`  API Health: http://localhost:${PORT}/api/health`);
  console.log(`  Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`=========================================`);
});
