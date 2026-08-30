import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Gallery from "@/models/Gallery";
import { PROJECTS, DEMO_GALLERY } from "@/data/site";
import { uploadToCloudinary } from "@/lib/cloudinary";
import fs from "node:fs";
import path from "node:path";

export async function POST() {
  try {
    await connectToDatabase();

    const coreImages = [
      { id: "induction", file: "induction-hardening-scanner.jpg" },
      { id: "cnc", file: "cnc-machining-bay.jpg" },
      { id: "conveyor", file: "automated-conveyor-system.jpg" },
      { id: "metrology", file: "metrology-quality-inspection.jpg" },
      { id: "workshop", file: "machine-assembly-workshop.jpg" },
      { id: "spm", file: "spm-automation-line.jpg" },
    ];

    const uploadedUrls: Record<string, string> = {};

    for (const item of coreImages) {
      try {
        const filePath = path.join(process.cwd(), "public", "images", item.file);
        if (fs.existsSync(filePath)) {
          const fileBuffer = fs.readFileSync(filePath);
          const base64 = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;
          const uploaded = await uploadToCloudinary(base64, "three-star-forge/core");
          if (uploaded?.secure_url) {
            uploadedUrls[item.id] = uploaded.secure_url;
          }
        }
      } catch (uploadErr) {
        console.warn(`Cloudinary upload warning for ${item.file}:`, uploadErr);
      }
    }

    // 1. Sync Gallery in MongoDB
    await Gallery.deleteMany({});
    const seededGallery = await Gallery.insertMany(
      DEMO_GALLERY.map((g: any, idx: number) => ({
        title: g.title,
        category: g.category,
        image: g.image || "/images/machine-assembly-workshop.jpg",
        featured: Boolean(g.featured),
        order: idx,
      })),
    );

    // 2. Sync Projects in MongoDB
    await Project.deleteMany({});
    const seededProjects = await Project.insertMany(
      PROJECTS.map((p: any) => ({
        title: p.title,
        industry: p.industry,
        category: p.category,
        image: p.image || "/images/cnc-machining-bay.jpg",
        description: p.description,
        challenge: p.challenge,
        solution: p.solution,
        features: p.features || [],
        specifications: p.specifications || {},
        gallery: p.gallery || [],
        results: p.results || [],
        scope: p.scope || [],
        timeline: p.timeline || "",
        status: p.status || "Completed",
      })),
    );

    return NextResponse.json({
      success: true,
      message: "Successfully synchronized all media assets and database records",
      uploadedCount: Object.keys(uploadedUrls).length,
      cloudinaryUrls: uploadedUrls,
      galleryCount: seededGallery.length,
      projectsCount: seededProjects.length,
    });
  } catch (error: any) {
    console.error("Media sync error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
