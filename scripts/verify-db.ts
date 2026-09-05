import dotenv from "dotenv";
import dns from "node:dns";
import mongoose from "mongoose";

dotenv.config();
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch {}

async function check() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const db = mongoose.connection.db;

  const galleries = await db!.collection("galleries").find({}).toArray();
  const projects = await db!.collection("projects").find({}).toArray();
  const contents = await db!.collection("contents").find({}).toArray();
  const feedbacks = await db!.collection("feedbacks").find({}).toArray();
  const quotations = await db!.collection("quotations").find({}).toArray();

  console.log("=========================================");
  console.log("       DATABASE VERIFICATION REPORT      ");
  console.log("=========================================");
  console.log("Galleries count:", galleries.length);
  console.log("Sample Gallery Image:", galleries[0]?.image);
  console.log("Sample Gallery PublicId:", galleries[0]?.cloudinaryPublicId);
  console.log("Projects count:", projects.length);
  console.log("Sample Project Image:", projects[0]?.image);
  console.log("Contents count:", contents.length);
  console.log("Feedbacks count:", feedbacks.length);
  console.log("Quotations count:", quotations.length);
  console.log("=========================================");

  await mongoose.disconnect();
}

check().catch(console.error);
