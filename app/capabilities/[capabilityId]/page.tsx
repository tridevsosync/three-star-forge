import { CAPABILITIES } from "@/data/site";
import { CapabilityDetail } from "./CapabilityDetail";
import type { Metadata } from "next";

export function generateStaticParams() {
  return CAPABILITIES.map((cap) => ({
    capabilityId: cap.id,
  }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ capabilityId: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const cap = CAPABILITIES.find(
    (c) =>
      c.id === resolvedParams?.capabilityId ||
      c.code.toLowerCase() === resolvedParams?.capabilityId?.toLowerCase(),
  );

  if (!cap) {
    return {
      title: "Engineering Capability Specifications — Three Star Enterprises",
      description:
        "Special purpose machinery, induction hardening, automation, material handling and metrology capabilities at Three Star Enterprises in Pune.",
    };
  }

  return {
    title: `${cap.title} — Capability | Three Star Enterprises`,
    description: cap.description,
  };
}

export default async function CapabilityPage({
  params,
}: {
  params: Promise<{ capabilityId: string }>;
}) {
  const resolvedParams = await params;
  return <CapabilityDetail capabilityId={resolvedParams?.capabilityId} />;
}
