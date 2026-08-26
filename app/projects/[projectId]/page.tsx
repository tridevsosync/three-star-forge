import { PROJECTS } from "@/data/site";
import { ProjectDetail } from "./ProjectDetail";
import type { Metadata } from "next";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    projectId: project.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const project = PROJECTS.find((p) => p.id === resolvedParams?.projectId);

  if (!project) {
    return {
      title: "Project unavailable — Three Star Enterprises",
    };
  }

  return {
    title: `${project.title} — Project | Three Star Enterprises`,
    description: project.short,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolvedParams = await params;
  return <ProjectDetail projectId={resolvedParams?.projectId} />;
}
