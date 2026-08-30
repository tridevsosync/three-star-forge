import mongoose from "mongoose";
import dns from "node:dns";
import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch {}

const MONGODB_URI = process.env.MONGODB_URI;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully to MongoDB!");

  const coreImages = [
    { id: "induction", file: "induction-hardening-scanner.jpg" },
    { id: "cnc", file: "cnc-machining-bay.jpg" },
    { id: "conveyor", file: "automated-conveyor-system.jpg" },
    { id: "metrology", file: "metrology-quality-inspection.jpg" },
    { id: "workshop", file: "machine-assembly-workshop.jpg" },
    { id: "spm", file: "spm-automation-line.jpg" },
  ];

  const uploadedUrls = {};

  for (const item of coreImages) {
    try {
      const filePath = path.join(process.cwd(), "public", "images", item.file);
      if (fs.existsSync(filePath)) {
        console.log(`Uploading ${item.file} to Cloudinary...`);
        const fileBuffer = fs.readFileSync(filePath);
        const base64 = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;
        const res = await cloudinary.uploader.upload(base64, {
          folder: "three-star-forge/core",
          public_id: item.file.replace(".jpg", ""),
          overwrite: true,
        });
        if (res && res.secure_url) {
          uploadedUrls[item.id] = res.secure_url;
          console.log(`✓ Uploaded ${item.file}: ${res.secure_url}`);
        }
      }
    } catch (err) {
      console.warn(`Upload error for ${item.file}:`, err.message);
    }
  }

  const db = mongoose.connection.db;

  // 1. Update Projects collection
  const projects = await db.collection("projects").find({}).toArray();
  console.log(`Found ${projects.length} projects in MongoDB. Updating images...`);
  for (const p of projects) {
    let img = p.image || "";
    if (!img || img.includes("/__l5e/") || img.includes("blob:")) {
      if (p.category?.includes("Induction") || p.title?.includes("Induction")) {
        img = uploadedUrls.induction || "/images/induction-hardening-scanner.jpg";
      } else if (p.category?.includes("Conveyor") || p.title?.includes("Conveyor") || p.title?.includes("Billet")) {
        img = uploadedUrls.conveyor || "/images/automated-conveyor-system.jpg";
      } else if (p.category?.includes("Inspection") || p.title?.includes("Inspection") || p.title?.includes("Testing")) {
        img = uploadedUrls.metrology || "/images/metrology-quality-inspection.jpg";
      } else if (p.category?.includes("Automation") || p.title?.includes("Automation") || p.title?.includes("SPM")) {
        img = uploadedUrls.spm || "/images/spm-automation-line.jpg";
      } else {
        img = uploadedUrls.cnc || "/images/cnc-machining-bay.jpg";
      }
      await db.collection("projects").updateOne({ _id: p._id }, { $set: { image: img } });
    }
  }
  console.log("✓ Projects collection images verified and updated!");

  // 2. Update Gallery collection
  const gallery = await db.collection("galleries").find({}).toArray();
  console.log(`Found ${gallery.length} gallery items in MongoDB. Updating images...`);
  for (let i = 0; i < gallery.length; i++) {
    const g = gallery[i];
    let img = g.image || "";
    if (!img || img.includes("/__l5e/") || img.includes("blob:")) {
      const coreKeys = ["induction", "cnc", "conveyor", "metrology", "workshop", "spm"];
      const chosenKey = coreKeys[i % coreKeys.length];
      img = uploadedUrls[chosenKey] || `/images/${coreImages[i % coreImages.length].file}`;
      await db.collection("galleries").updateOne({ _id: g._id }, { $set: { image: img } });
    }
  }
  console.log("✓ Gallery collection images verified and updated!");

  // 3. Update Content collection
  const contents = await db.collection("contents").find({}).toArray();
  console.log(`Found ${contents.length} content documents in MongoDB.`);
  for (const c of contents) {
    let modified = false;
    const data = c.data;
    if (data && typeof data === "object") {
      // replace any dead __l5e links inside content
      const replaceDeadLinks = (obj) => {
        for (const k in obj) {
          if (typeof obj[k] === "string" && obj[k].includes("/__l5e/")) {
            obj[k] = uploadedUrls.workshop || "/images/machine-assembly-workshop.jpg";
            modified = true;
          } else if (typeof obj[k] === "object" && obj[k] !== null) {
            replaceDeadLinks(obj[k]);
          }
        }
      };
      replaceDeadLinks(data);
      if (modified) {
        await db.collection("contents").updateOne({ _id: c._id }, { $set: { data } });
        console.log(`✓ Cleaned dead links in content section: ${c.section}`);
      }
    }
  }

  console.log("ALL MEDIA SYNCHRONIZATION COMPLETED SUCCESSFULLY!");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
