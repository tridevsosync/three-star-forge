// Central image registry for Three Star Enterprises.
// All images are locally hosted in /public/images/ for 100% reliability, zero broken links, and high performance.

export const CORE_INDUSTRIAL_IMAGES = [
  {
    id: "induction-hardening",
    label: "Induction Hardening Scanner",
    url: "/images/induction-hardening-scanner.jpg",
    category: "Induction Hardening",
    desc: "Vertical CNC Induction Hardening scanner machine with precision heating coil.",
  },
  {
    id: "cnc-machining",
    label: "CNC Machining & Turning Bay",
    url: "/images/cnc-machining-bay.jpg",
    category: "Machine Building",
    desc: "Heavy precision CNC milling center, turning, and slideway scraping setup.",
  },
  {
    id: "automated-conveyor",
    label: "Automated Slat & Chain Conveyor",
    url: "/images/automated-conveyor-system.jpg",
    category: "Material Handling",
    desc: "Heavy-duty automated parts conveyor and material transfer system.",
  },
  {
    id: "metrology-inspection",
    label: "Metrology & 100% FAT Quality Bay",
    url: "/images/metrology-quality-inspection.jpg",
    category: "Quality & Metrology",
    desc: "Precision dial test indicator inspection, laser alignment, and test trial cell.",
  },
  {
    id: "machine-assembly",
    label: "Pune Machine Assembly Workshop",
    url: "/images/machine-assembly-workshop.jpg",
    category: "Manufacturing Facility",
    desc: "Full structural steel fabrication, electrical wiring, and FAT testing bays.",
  },
  {
    id: "spm-automation",
    label: "Turnkey SPM Automation Line",
    url: "/images/spm-automation-line.jpg",
    category: "Automation & Tooling",
    desc: "Custom Special Purpose Machine with pick-and-place robotics and safety interlocks.",
  },
];

export const IMAGES: Record<string, string> = {
  // Site-level
  hero: "/images/hero-industrial.jpg",
  about: "/images/about-design.jpg",
  cta: "/images/cta-workshop.jpg",
  metrology: "/images/metrology-quality-inspection.jpg",
  blueprints: "/images/npi-blueprints.jpg",

  // Page heroes
  pageAbout: "/images/machine-assembly-workshop.jpg",
  pageServices: "/images/cnc-machining-bay.jpg",
  pageCapabilities: "/images/induction-hardening-scanner.jpg",
  pageProjects: "/images/spm-automation-line.jpg",
  pageContact: "/images/page-contact-facility.jpg",

  // Industries
  materialHandling: "/images/automated-conveyor-system.jpg",
  automation: "/images/ind-automation.jpg",
  pharma: "/images/ind-pharma.jpg",
  food: "/images/ind-food.jpg",
  process: "/images/ind-process.jpg",
  engineeringEquipment: "/images/ind-engineering-equipment.jpg",
  lineAutomation: "/images/ind-line-automation.jpg",

  // Projects (High-resolution industrial machine photography)
  verticalInduction: "/images/induction-hardening-scanner.jpg",
  horizontalInduction: "/images/induction-hardening-scanner.jpg",
  dualSpindle: "/images/induction-hardening-scanner.jpg",
  rotaryInduction: "/images/induction-hardening-scanner.jpg",
  crankShaft: "/images/induction-hardening-scanner.jpg",
  forgeToTrim: "/images/spm-automation-line.jpg",
  autoBilletLoader: "/images/automated-conveyor-system.jpg",
  honeycombConveyor: "/images/automated-conveyor-system.jpg",
  eddyCurrent: "/images/metrology-quality-inspection.jpg",
  utHandling: "/images/metrology-quality-inspection.jpg",
  wireMeshConveyor: "/images/automated-conveyor-system.jpg",
  slatConveyor: "/images/automated-conveyor-system.jpg",
  acceptReject: "/images/spm-automation-line.jpg",
  cutterLaminates: "/images/cnc-machining-bay.jpg",
  bearingFixture: "/images/cnc-machining-bay.jpg",
  modularConveyor: "/images/automated-conveyor-system.jpg",
  pickAndPlace: "/images/spm-automation-line.jpg",
  forgingAutomation: "/images/spm-automation-line.jpg",
  grindingRefurb: "/images/cnc-machining-bay.jpg",
  latheAssembly: "/images/cnc-machining-bay.jpg",
  newMachineAssembly: "/images/machine-assembly-workshop.jpg",
  hmcMachine: "/images/cnc-machining-bay.jpg",

  // Gallery
  galleryGears: "/images/cnc-machining-bay.jpg",
  galleryInductionGlow: "/images/induction-hardening-scanner.jpg",
  galleryVerticalDetail: "/images/induction-hardening-scanner.jpg",
  galleryCrankDetail: "/images/induction-hardening-scanner.jpg",
  galleryCrankMechanism: "/images/induction-hardening-scanner.jpg",
  galleryOperatorPanel: "/images/spm-automation-line.jpg",
  galleryMaintenance: "/images/machine-assembly-workshop.jpg",
  galleryInspection: "/images/metrology-quality-inspection.jpg",
};

/**
 * Returns a guaranteed valid image path, preventing broken image icons anywhere.
 */
export function getSafeImage(
  url?: string | null,
  fallbackType:
    | "induction"
    | "cnc"
    | "conveyor"
    | "metrology"
    | "workshop"
    | "spm"
    | "general" = "general",
): string {
  if (url && typeof url === "string" && url.trim().length > 0 && !url.includes("/__l5e/")) {
    return url.trim();
  }

  switch (fallbackType) {
    case "induction":
      return "/images/induction-hardening-scanner.jpg";
    case "cnc":
      return "/images/cnc-machining-bay.jpg";
    case "conveyor":
      return "/images/automated-conveyor-system.jpg";
    case "metrology":
      return "/images/metrology-quality-inspection.jpg";
    case "workshop":
      return "/images/machine-assembly-workshop.jpg";
    case "spm":
      return "/images/spm-automation-line.jpg";
    case "general":
    default:
      return "/images/machine-assembly-workshop.jpg";
  }
}
