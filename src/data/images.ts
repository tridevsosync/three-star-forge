// Central image registry. Every image is used exactly once across the site.
import p1_1 from "@/assets/pdf/img_p1_1.jpg.asset.json";
import p3_1 from "@/assets/pdf/img_p3_1.jpg.asset.json";
import p3_2 from "@/assets/pdf/img_p3_2.jpg.asset.json";
import p3_3 from "@/assets/pdf/img_p3_3.jpg.asset.json";
import p4_1 from "@/assets/pdf/img_p4_1.jpg.asset.json";
import p4_2 from "@/assets/pdf/img_p4_2.jpg.asset.json";
import p4_3 from "@/assets/pdf/img_p4_3.jpg.asset.json";
import p5_1 from "@/assets/pdf/img_p5_1.jpg.asset.json";
import p5_2 from "@/assets/pdf/img_p5_2.jpg.asset.json";
import p5_3 from "@/assets/pdf/img_p5_3.jpg.asset.json";
import p6_1 from "@/assets/pdf/img_p6_1.jpg.asset.json";
import p6_2 from "@/assets/pdf/img_p6_2.jpg.asset.json";
import p7_1 from "@/assets/pdf/img_p7_1.jpg.asset.json";
import p7_2 from "@/assets/pdf/img_p7_2.jpg.asset.json";
import p7_3 from "@/assets/pdf/img_p7_3.jpg.asset.json";
import p8_1 from "@/assets/pdf/img_p8_1.jpg.asset.json";
import p8_2 from "@/assets/pdf/img_p8_2.jpg.asset.json";
import p9_1 from "@/assets/pdf/img_p9_1.jpg.asset.json";
import p9_2 from "@/assets/pdf/img_p9_2.jpg.asset.json";
import p9_3 from "@/assets/pdf/img_p9_3.jpg.asset.json";
import p9_4 from "@/assets/pdf/img_p9_4.jpg.asset.json";
import p10_1 from "@/assets/pdf/img_p10_1.jpg.asset.json";
import p10_2 from "@/assets/pdf/img_p10_2.jpg.asset.json";
import p11_1 from "@/assets/pdf/img_p11_1.jpg.asset.json";
import p11_2 from "@/assets/pdf/img_p11_2.jpg.asset.json";
import p12_1 from "@/assets/pdf/img_p12_1.jpg.asset.json";
import p12_2 from "@/assets/pdf/img_p12_2.jpg.asset.json";
import p13_1 from "@/assets/pdf/img_p13_1.jpg.asset.json";
import p13_2 from "@/assets/pdf/img_p13_2.jpg.asset.json";

import heroIndustrial from "@/assets/hero-industrial.jpg";
import aboutDesign from "@/assets/about-design.jpg";
import indMaterialHandling from "@/assets/ind-material-handling.jpg";
import indAutomation from "@/assets/ind-automation.jpg";
import indPharma from "@/assets/ind-pharma.jpg";
import indFood from "@/assets/ind-food.jpg";
import indProcess from "@/assets/ind-process.jpg";
import indEngineeringEquipment from "@/assets/ind-engineering-equipment.jpg";
import indLineAutomation from "@/assets/ind-line-automation.jpg";
import ctaWorkshop from "@/assets/cta-workshop.jpg";
import capabilitiesMetrology from "@/assets/capabilities-metrology.jpg";
import npiBlueprints from "@/assets/npi-blueprints.jpg";
import pageAbout from "@/assets/page-about-workshop.jpg";
import pageServices from "@/assets/page-services-design.jpg";
import pageCapabilities from "@/assets/page-capabilities-induction.jpg";
import pageProjects from "@/assets/page-projects-line.jpg";
import pageContact from "@/assets/page-contact-facility.jpg";
import galleryInspection from "@/assets/gallery-inspection-bench.jpg";

export const IMAGES = {
  // Site-level
  hero: heroIndustrial,
  about: aboutDesign,
  cta: ctaWorkshop,
  metrology: capabilitiesMetrology,
  blueprints: npiBlueprints,

  // Page heroes (each used once)
  pageAbout,
  pageServices,
  pageCapabilities,
  pageProjects,
  pageContact,

  // Industries
  materialHandling: indMaterialHandling,
  automation: indAutomation,
  pharma: indPharma,
  food: indFood,
  process: indProcess,
  engineeringEquipment: indEngineeringEquipment,
  lineAutomation: indLineAutomation,

  // Projects (real photographs from the company presentation)
  verticalInduction: p4_1.url,
  horizontalInduction: p3_2.url,
  dualSpindle: p4_2.url,
  rotaryInduction: p3_3.url,
  crankShaft: p5_1.url,
  forgeToTrim: p6_1.url,
  autoBilletLoader: p6_2.url,
  honeycombConveyor: p7_3.url,
  eddyCurrent: p7_2.url,
  utHandling: p7_1.url,
  wireMeshConveyor: p8_1.url,
  slatConveyor: p8_2.url,
  acceptReject: p9_1.url,
  cutterLaminates: p9_2.url,
  bearingFixture: p9_3.url,
  modularConveyor: p9_4.url,
  pickAndPlace: p10_1.url,
  forgingAutomation: p10_2.url,
  grindingRefurb: p11_1.url,
  latheAssembly: p11_2.url,
  newMachineAssembly: p12_1.url,
  hmcMachine: p13_1.url,

  // Gallery-only
  galleryGears: p1_1.url,
  galleryInductionGlow: p3_1.url,
  galleryVerticalDetail: p4_3.url,
  galleryCrankDetail: p5_2.url,
  galleryCrankMechanism: p5_3.url,
  galleryOperatorPanel: p12_2.url,
  galleryMaintenance: p13_2.url,
  galleryInspection,
} as const;

export type ImageKey = keyof typeof IMAGES;
