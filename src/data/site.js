import { IMAGES } from "./images";
export const COMPANY = {
  name: "THREE STAR ENTERPRISES",
  contactPerson: "V.A.Chavan",
  phone: "+91 9823463655 / 8788848977",
  email: "3starchavan@gmail.com",
  website: "www.threestarent.com",
  address:
    "Gat No 78, Near Parandwal Chowk Behind Atharva Hotel, Dehu Gaon, TQ: Haveli, Dist: Pune, Maharashtra - 412109",
  description:
    "THREE STAR ENTERPRISES is a Pune-based design and manufacturing company that provides comprehensive design, full turnkey manufacturing, and product management services to global Original Equipment Manufacturers (OEMs). Catering to the material handling, automation, pharmaceutical, food, and process industries, the company specializes in the New Product Introduction (NPI) process to efficiently identify and resolve challenges related to design optimization, procurement, and manufacturing setups.",
  vision:
    "Be the preferred Business partner for New Product Development and Manufacturing services in selected segments.",
  mission: "To assist customer with most innovative solutions having greatest value.",
  positioning:
    "A design services company with manufacturing and product management support to global OEMs of engineering equipment, process equipment, material handling equipment and line automation.",
};
export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Industries", to: "/industries" },
  { label: "Projects", to: "/projects" },
  { label: "Capabilities", to: "/capabilities" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];
export const CAPABILITY_STRIP = [
  "Design Engineering",
  "Turnkey Manufacturing",
  "Product Management",
  "New Product Introduction",
  "Procurement",
  "Process Optimization",
];
export const WORKFLOW = [
  "Design",
  "Procurement",
  "Manufacturing",
  "Product Management",
  "Delivery",
];
export const NPI_STEPS = [
  {
    step: "Concept",
    body: "Requirement study, application context and functional intent captured with the OEM engineering team.",
  },
  {
    step: "Design",
    body: "Detailed mechanical design, assembly modelling and manufacturing drawings prepared for the build.",
  },
  {
    step: "Optimization",
    body: "Design reviewed for manufacturability, standardisation, cycle time and cost of the finished equipment.",
  },
  {
    step: "Procurement",
    body: "Bought-out selection, vendor development and sourcing of fabricated and machined content.",
  },
  {
    step: "Prototype / Manufacturing",
    body: "Fabrication, machining and assembly of the first build with in-process engineering support.",
  },
  {
    step: "Process Fine Tuning",
    body: "Setup trials, parameter refinement and correction of process and handling challenges.",
  },
  {
    step: "Final Manufacturing",
    body: "Stabilised build documentation handed over for repeat manufacturing and support.",
  },
];
export const WHY_POINTS = [
  {
    title: "OEM-focused engineering support",
    body: "We work as an extension of OEM engineering teams on equipment programmes, from first concept to a manufacturable build.",
  },
  {
    title: "Integrated design and manufacturing",
    body: "Design, procurement and build sit under one roof, so drawings are validated by the people who make the machine.",
  },
  {
    title: "NPI expertise",
    body: "A dedicated New Product Introduction approach that surfaces design, sourcing and setup issues early.",
  },
  {
    title: "Design optimization",
    body: "Existing designs reviewed for manufacturability, standardisation and simplified assembly.",
  },
  {
    title: "Manufacturing setup support",
    body: "Assistance in establishing fixtures, handling, loading and inspection setups around the equipment.",
  },
  {
    title: "Process fine tuning",
    body: "Trial support and iterative correction until the process runs repeatably on the shop floor.",
  },
  {
    title: "Multi-industry experience",
    body: "Material handling, automation, pharmaceutical, food, process and forging applications.",
  },
];
export const SERVICES = [
  {
    id: "design-engineering",
    code: "S-01",
    title: "Design Engineering",
    summary:
      "Comprehensive mechanical design for industrial equipment — concept layouts, detailed design, assembly modelling and manufacturing documentation.",
    points: [
      "Equipment and special purpose machine design",
      "Design optimization and design for manufacturability",
      "Product development support for OEM programmes",
      "Manufacturing-oriented drawings and assembly documentation",
    ],
    outcome:
      "A manufacturable design pack — layouts, assemblies and drawings ready to release to the shop floor.",
  },
  {
    id: "turnkey-manufacturing",
    code: "S-02",
    title: "Turnkey Manufacturing",
    summary:
      "Full turnkey manufacturing services covering fabrication, machining, assembly and commissioning support for engineering equipment.",
    points: [
      "Fabricated structures, frames and machine bases",
      "Machined and bought-out content management",
      "Mechanical assembly and integration",
      "Trials and handover support",
    ],
    outcome: "A built, assembled and trialled machine handed over with its build documentation.",
  },
  {
    id: "product-management",
    code: "S-03",
    title: "Product Management",
    summary:
      "Coordination across design, procurement and manufacturing so an equipment programme moves as one controlled build.",
    points: [
      "Single point of engineering coordination",
      "Change control across drawings and build",
      "Build schedule and milestone tracking",
      "Documentation for repeat manufacturing",
    ],
    outcome: "One accountable engineering owner across drawings, sourcing and build milestones.",
  },
  {
    id: "npi",
    code: "S-04",
    title: "New Product Introduction (NPI)",
    summary:
      "Our core differentiator: a structured NPI process where design optimization, procurement and manufacturing setup challenges are identified and resolved early.",
    points: [
      "Requirement to production route mapping",
      "Early identification of design and sourcing risk",
      "Manufacturing setup definition",
      "Validation and stabilised production release",
    ],
    outcome: "Design, sourcing and setup risks resolved before production, not during it.",
  },
  {
    id: "procurement",
    code: "S-05",
    title: "Procurement Support",
    summary:
      "Sourcing of mechanical, electrical and bought-out content with vendor development around the equipment build.",
    points: [
      "Bought-out selection and specification",
      "Vendor development and follow-up",
      "Fabrication and machining outsourcing control",
      "Inspection at source where required",
    ],
    outcome: "Specified, sourced and inspected bought-out content aligned to the build schedule.",
  },
  {
    id: "process-optimization",
    code: "S-06",
    title: "Manufacturing Process Optimization",
    summary:
      "Fine tuning of processes and manufacturing setups so equipment performs repeatably in production conditions.",
    points: [
      "Process parameter fine tuning",
      "Fixture and handling improvement",
      "Cycle time and ergonomics review",
      "Setup standardisation",
    ],
    outcome: "A process that runs repeatably at the expected cycle on the customer's floor.",
  },
  {
    id: "automation-material-handling",
    code: "S-07",
    title: "Automation & Material Handling Solutions",
    summary:
      "Conveying, loading, sorting, inspection and pick-and-place systems engineered around the customer's line.",
    points: [
      "Chain, slat, wire mesh, modular and honeycomb belt conveyors",
      "Automatic loading and unloading systems",
      "Accept-reject and sorting devices",
      "Inspection and crack detection handling systems",
    ],
    outcome: "Handling, conveying and inspection integrated into the existing line flow.",
  },
];
export const INDUSTRIES = [
  {
    id: "material-handling",
    name: "Material Handling",
    image: IMAGES.materialHandling,
    description:
      "Conveying and handling equipment for hot and cold components, engineered for forging, machining and assembly lines.",
    capabilities: [
      "Chain and slat conveyors",
      "Billet handling",
      "Transfer systems",
      "Loading devices",
    ],
  },
  {
    id: "industrial-automation",
    name: "Industrial Automation",
    image: IMAGES.automation,
    description:
      "Automation cells and handling systems that remove manual intervention from repetitive and hazardous operations.",
    capabilities: [
      "Pick and place",
      "Auto loading / unloading",
      "Sorting systems",
      "Inspection integration",
    ],
  },
  {
    id: "pharmaceutical",
    name: "Pharmaceutical",
    image: IMAGES.pharma,
    description:
      "Equipment design and manufacturing support for pharmaceutical OEMs where hygiene, finish and repeatability govern the build.",
    capabilities: [
      "Hygienic design",
      "Stainless fabrication",
      "Handling equipment",
      "Assembly support",
    ],
  },
  {
    id: "food",
    name: "Food Industry",
    image: IMAGES.food,
    description:
      "Food grade conveying and handling equipment, including modular belt conveyors built for food manufacturing lines.",
    capabilities: [
      "Food grade conveyors",
      "Modular belt systems",
      "Washdown-friendly structures",
      "Line integration",
    ],
  },
  {
    id: "process",
    name: "Process Industry",
    image: IMAGES.process,
    description:
      "Process equipment engineering and manufacturing support for plants where equipment must run continuously.",
    capabilities: [
      "Process equipment build",
      "Fabrication support",
      "Setup optimization",
      "Maintenance engineering",
    ],
  },
  {
    id: "engineering-equipment",
    name: "Engineering Equipment",
    image: IMAGES.engineeringEquipment,
    description:
      "Special purpose machines and heavy engineering equipment designed, built and assembled for OEM programmes.",
    capabilities: [
      "Special purpose machines",
      "Machine assembly",
      "Refurbishment",
      "Fixtures and tooling",
    ],
  },
  {
    id: "line-automation",
    name: "Line Automation",
    image: IMAGES.lineAutomation,
    description:
      "End-to-end line automation combining conveying, inspection, sorting and hardening equipment into a single flow.",
    capabilities: [
      "Line layout",
      "Interlinked conveying",
      "Inspection stations",
      "Accept-reject devices",
    ],
  },
];
const genericChallenge =
  "The programme required equipment that suited the customer's existing layout, cycle expectations and handling conditions, with design decisions fixed before manufacturing began.";
const genericSolution =
  "Design was developed and optimized for manufacturability, bought-out content was sourced, and the equipment was fabricated, assembled and fine tuned during setup trials.";
export const PROJECTS = [
  {
    id: "vertical-induction-hardening-machine",
    title: "Vertical Induction Hardening Machine",
    industry: "Engineering Equipment",
    category: "Induction Hardening",
    image: IMAGES.verticalInduction,
    short:
      "Vertical scanning induction hardening setup for shafts and long components, with automatic handling options.",
    featured: true,
    overview:
      "A vertical scanning induction hardening machine built for long rotational components, supplied with the quench system, scanning axis and control setup required for repeatable case depth.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Shafts, axles and long rotational components requiring surface hardening.",
    specs: [
      { label: "Job Diameter", value: "30 mm – 400 mm" },
      { label: "Job Length", value: "300 mm – 3000 mm" },
      { label: "Maximum Power", value: "250 kW" },
      { label: "Frequency", value: "5 KHz" },
    ],
    highlights: [
      "Vertical scanning configuration",
      "Automatic loading / unloading option",
      "Integrated quench arrangement",
      "Inspection and sorting integration",
    ],
  },
  {
    id: "horizontal-induction-hardening-machine",
    title: "Horizontal Induction Hardening Machine",
    industry: "Engineering Equipment",
    category: "Induction Hardening",
    image: IMAGES.horizontalInduction,
    short: "Horizontal induction hardening setup for tubular components up to 600 mm length.",
    featured: true,
    overview:
      "A horizontal induction hardening setup configured for tube hardening, with the coil, drive and quench arrangement matched to the component envelope.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Tubes and short shafts requiring horizontal scanning or single-shot hardening.",
    specs: [
      { label: "Tube Length", value: "600 mm" },
      { label: "Job Diameter", value: "50 mm" },
      { label: "Power", value: "75 kW" },
      { label: "Frequency", value: "10 KHz" },
    ],
    highlights: [
      "Horizontal configuration",
      "Tube handling arrangement",
      "Quench circuit",
      "Repeatable setup",
    ],
  },
  {
    id: "dual-spindle-vertical-induction-hardening-machine",
    title: "Dual Spindle Vertical Induction Hardening Machine",
    industry: "Engineering Equipment",
    category: "Induction Hardening",
    image: IMAGES.dualSpindle,
    short: "Twin spindle vertical scanning machine for higher output on repetitive components.",
    featured: true,
    overview:
      "A dual spindle vertical induction hardening machine that allows load and unload on one spindle while the second spindle is in cycle.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Medium volume shaft and pin hardening where cycle overlap improves output.",
    specs: [
      { label: "Scan Length", value: "1200 mm" },
      { label: "Job Diameter", value: "50 mm" },
      { label: "Power", value: "150 kW" },
      { label: "Frequency", value: "10 KHz" },
    ],
    highlights: [
      "Dual spindle layout",
      "Overlapping cycle",
      "Common quench system",
      "Operator-friendly loading",
    ],
  },
  {
    id: "rotary-type-induction-machine",
    title: "Rotary Type Induction Machine",
    industry: "Automation",
    category: "Induction Hardening",
    image: IMAGES.rotaryInduction,
    short: "Four station rotary indexing induction machine on a 750 mm table.",
    featured: false,
    overview:
      "A rotary indexing induction machine with four stations on a single table, allowing load, heat, quench and unload to run in parallel.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Small components hardened in sequence on an indexing table.",
    specs: [
      { label: "Table Diameter", value: "750 mm" },
      { label: "Stations", value: "Four station" },
      { label: "Power", value: "75 kW" },
      { label: "Frequency", value: "100 KHz" },
    ],
    highlights: [
      "Four station indexing",
      "Parallel operations",
      "Compact footprint",
      "Consistent cycle",
    ],
  },
  {
    id: "crank-shaft-hardening-machine",
    title: "Crank Shaft Hardening Machine",
    industry: "Engineering Equipment",
    category: "Induction Hardening",
    image: IMAGES.crankShaft,
    short: "Drum type and thin transformer balancing type crank shaft hardening setups.",
    featured: true,
    overview:
      "Crank shaft hardening machines supplied in drum type and thin transformer balancing type configurations for journal and pin hardening.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Crank shaft journal and pin hardening for engine component manufacturers.",
    specs: [
      { label: "Drum Type", value: "1000 mm, Power 100 KHz" },
      { label: "Thin Transformer Balancing Type", value: "600 mm" },
      { label: "Power", value: "100 kW" },
      { label: "Frequency", value: "10 KHz" },
    ],
    highlights: [
      "Two configurations",
      "Journal and pin hardening",
      "Balanced transformer design",
      "Quench control",
    ],
  },
  {
    id: "forge-to-trim-press-chain-conveyor",
    title: "Forge to Trim Press Chain Conveyor",
    industry: "Material Handling",
    category: "Conveyors",
    image: IMAGES.forgeToTrim,
    short:
      "Chain conveyor carrying cold or hot steel billets up to 1200 °C between forge and trim press.",
    featured: true,
    overview:
      "A heavy duty chain conveyor engineered to carry steel billets, cold or hot up to 1200 °C, from the forging press to the trim press.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Forging lines transferring hot components between press operations.",
    specs: [
      { label: "Material Handled", value: "Steel billets, cold or hot" },
      { label: "Temperature", value: "Up to 1200 °C" },
      { label: "Type", value: "Chain conveyor" },
      { label: "Duty", value: "Heavy duty forging line" },
    ],
    highlights: [
      "High temperature duty",
      "Forge to trim transfer",
      "Heavy duty chain",
      "Line-matched speed",
    ],
  },
  {
    id: "auto-billet-loader",
    title: "Auto Billet Loader",
    industry: "Automation",
    category: "Handling Systems",
    image: IMAGES.autoBilletLoader,
    short: "Automatic billet lifting and feeding device for induction heaters.",
    featured: false,
    overview:
      "An automatic billet loader that lifts and feeds billets into an induction heater, removing manual loading from the forging line.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Induction heater feeding on forging lines.",
    specs: [
      { label: "Function", value: "Lift billet for induction heater" },
      { label: "Type", value: "Automatic loader" },
      { label: "Interface", value: "Heater infeed" },
      { label: "Operation", value: "Continuous feeding" },
    ],
    highlights: [
      "Removes manual loading",
      "Heater synchronised",
      "Robust structure",
      "Line integration",
    ],
  },
  {
    id: "honeycomb-belt-conveyor",
    title: "Honeycomb Belt Conveyor",
    industry: "Material Handling",
    category: "Conveyors",
    image: IMAGES.honeycombConveyor,
    short: "Honeycomb belt conveyor manufactured to established industry norms.",
    featured: false,
    overview:
      "Honeycomb belt conveyors manufactured for component transfer where an open belt surface and stable part support are required.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Component transfer between processing stations.",
    specs: [
      { label: "Belt Type", value: "Honeycomb" },
      { label: "Frame", value: "Fabricated steel" },
      { label: "Drive", value: "Geared motor" },
      { label: "Build", value: "As per industry norms" },
    ],
    highlights: [
      "Open belt surface",
      "Stable part support",
      "Simple maintenance",
      "Configurable lengths",
    ],
  },
  {
    id: "eddy-current-surface-crack-detection",
    title: "Eddy Current / Surface Crack Detection System",
    industry: "Automation",
    category: "Inspection Systems",
    image: IMAGES.eddyCurrent,
    short: "Surface crack detection system for cylinder liners.",
    featured: true,
    overview:
      "An eddy current based surface crack detection system with the handling required to present cylinder liners consistently to the probe.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Cylinder liner inspection in component manufacturing.",
    specs: [
      { label: "Method", value: "Eddy current" },
      { label: "Component", value: "Cylinder liners" },
      { label: "Function", value: "Surface crack detection" },
      { label: "Handling", value: "Integrated presentation" },
    ],
    highlights: [
      "Consistent part presentation",
      "Inline inspection",
      "Reject handling",
      "Operator interface",
    ],
  },
  {
    id: "handling-for-ut-machine",
    title: "Handling System for UT Machine",
    industry: "Automation",
    category: "Handling Systems",
    image: IMAGES.utHandling,
    short: "Loading and sorting system for crack detection on 2 metre long rods.",
    featured: false,
    overview:
      "A loading and sorting system built around an ultrasonic testing machine for crack detection on long rods.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Crack detection lines handling 2 metre long rods.",
    specs: [
      { label: "Component Length", value: "2 metre long rods" },
      { label: "Function", value: "Loading and sorting" },
      { label: "Process", value: "Crack detection" },
      { label: "Output", value: "Accept / reject separation" },
    ],
    highlights: [
      "Long component handling",
      "Automatic sorting",
      "Inspection integration",
      "Reduced manual handling",
    ],
  },
  {
    id: "wire-mesh-belt-conveyor",
    title: "Wire Mesh Belt Conveyor",
    industry: "Material Handling",
    category: "Conveyors",
    image: IMAGES.wireMeshConveyor,
    short: "Wire mesh belt conveyor for feeding hot billets and forging presses.",
    featured: true,
    overview:
      "Wire mesh belt conveyors designed in line with international quality standards, used for feeding hot billets and forging presses, and applied in food processing and steel and forging industries.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Hot billet feeding, forging presses, food processing and steel industries.",
    specs: [
      { label: "Belt Type", value: "Wire mesh" },
      { label: "Application", value: "Hot billet and forging press feeding" },
      { label: "Industries", value: "Food processing, steel and forging" },
      { label: "Design", value: "International quality standards" },
    ],
    highlights: [
      "High temperature capable",
      "Open mesh belt",
      "Multi-industry use",
      "Continuous feeding",
    ],
  },
  {
    id: "slat-conveyor",
    title: "Slat Conveyor",
    industry: "Material Handling",
    category: "Conveyors",
    image: IMAGES.slatConveyor,
    short: "Slat conveyor for forged components.",
    featured: false,
    overview:
      "A slat conveyor built to carry forged components, with a slat construction suited to heavy and abrasive parts.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Forged component transfer and accumulation.",
    specs: [
      { label: "Type", value: "Slat conveyor" },
      { label: "Component", value: "Forged components" },
      { label: "Construction", value: "Steel slats on chain" },
      { label: "Duty", value: "Heavy duty" },
    ],
    highlights: [
      "Heavy part handling",
      "Abrasion tolerant",
      "Long service life",
      "Configurable pitch",
    ],
  },
  {
    id: "accept-reject-device",
    title: "Accept-Reject Device",
    industry: "Line Automation",
    category: "Sorting Systems",
    image: IMAGES.acceptReject,
    short: "Sorting system for heated billets before the press.",
    featured: false,
    overview:
      "An accept-reject sorting device that separates heated billets before the press based on the inspection signal.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Heated billet sorting ahead of forging presses.",
    specs: [
      { label: "Function", value: "Accept / reject sorting" },
      { label: "Position", value: "Before press" },
      { label: "Component", value: "Heated billets" },
      { label: "Actuation", value: "Pneumatic diverter" },
    ],
    highlights: [
      "Fast diverting action",
      "Hot component duty",
      "Signal driven",
      "Line synchronised",
    ],
  },
  {
    id: "modular-belt-conveyor",
    title: "Modular Belt Conveyor",
    industry: "Food",
    category: "Conveyors",
    image: IMAGES.modularConveyor,
    short: "Food grade modular belt conveyor for a cake manufacturing company.",
    featured: true,
    overview:
      "A food grade modular belt conveyor supplied for a cake manufacturing line, built with a modular belt for easy cleaning and maintenance.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Food manufacturing lines requiring hygienic conveying.",
    specs: [
      { label: "Belt Type", value: "Modular plastic belt" },
      { label: "Grade", value: "Food grade" },
      { label: "Application", value: "Cake manufacturing" },
      { label: "Frame", value: "Stainless construction" },
    ],
    highlights: [
      "Hygienic build",
      "Easy belt replacement",
      "Washdown friendly",
      "Gentle product handling",
    ],
  },
  {
    id: "cutter-for-laminates",
    title: "Cutter for Laminates",
    industry: "Process Industry",
    category: "Special Purpose Machines",
    image: IMAGES.cutterLaminates,
    short: "Design and manufacturing assistance for laminate sheet cutting.",
    featured: false,
    overview:
      "Design and manufacturing assistance for a laminate sheet cutting machine, covering the cutting mechanism and sheet support.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Laminate sheet cutting operations.",
    specs: [
      { label: "Function", value: "Laminate sheet cutting" },
      { label: "Scope", value: "Design and manufacturing assistance" },
      { label: "Mechanism", value: "Guided cutting head" },
      { label: "Support", value: "Sheet clamping arrangement" },
    ],
    highlights: ["Clean cut edge", "Repeatable positioning", "Simple operation", "Low maintenance"],
  },
  {
    id: "bearing-fixture",
    title: "Bearing Fixture",
    industry: "Engineering Equipment",
    category: "Fixtures & Tooling",
    image: IMAGES.bearingFixture,
    short: "Fixture for bearing assembly and removal.",
    featured: false,
    overview:
      "A purpose-built fixture that supports bearing assembly and removal without damaging the mating components.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Bearing assembly and service operations.",
    specs: [
      { label: "Function", value: "Bearing assembly and removal" },
      { label: "Type", value: "Mechanical fixture" },
      { label: "Location", value: "Positive component location" },
      { label: "Use", value: "Assembly and service" },
    ],
    highlights: [
      "Damage-free handling",
      "Positive location",
      "Operator safety",
      "Quick changeover",
    ],
  },
  {
    id: "pick-and-place-system",
    title: "Pick and Place System",
    industry: "Automation",
    category: "Handling Systems",
    image: IMAGES.pickAndPlace,
    short: "Pick and place system for gears.",
    featured: true,
    overview:
      "A pick and place system engineered to transfer gears between stations with consistent orientation and cycle time.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Gear transfer between machining or inspection stations.",
    specs: [
      { label: "Component", value: "Gears" },
      { label: "Function", value: "Pick and place transfer" },
      { label: "Axes", value: "Linear pick and place motion" },
      { label: "Gripper", value: "Application specific" },
    ],
    highlights: [
      "Consistent orientation",
      "Repeatable cycle",
      "Compact envelope",
      "Station interlocking",
    ],
  },
  {
    id: "forging-automation-handling-system",
    title: "Forging Automation Handling System",
    industry: "Automation",
    category: "Forging Automation",
    image: IMAGES.forgingAutomation,
    short: "Handling system for forging piercing and chamfering operations.",
    featured: true,
    overview:
      "A handling system that automates component movement through forging piercing and chamfering operations.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Forging lines with piercing and chamfering stations.",
    specs: [
      { label: "Operations", value: "Piercing and chamfering" },
      { label: "Function", value: "Automated handling" },
      { label: "Environment", value: "Forging shop" },
      { label: "Integration", value: "Press synchronised" },
    ],
    highlights: [
      "Reduced manual exposure",
      "Press synchronised",
      "Robust in hot environment",
      "Stable cycle time",
    ],
  },
  {
    id: "grinding-machine-refurbishment",
    title: "Grinding Machine Refurbishment",
    industry: "Engineering Equipment",
    category: "Refurbishment",
    image: IMAGES.grindingRefurb,
    short: "Refurbishment of grinding machines to restore working accuracy.",
    featured: false,
    overview:
      "Refurbishment of grinding machines covering mechanical restoration, alignment and reassembly to bring the machine back into working condition.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Machine shops restoring existing grinding equipment.",
    specs: [
      { label: "Scope", value: "Mechanical refurbishment" },
      { label: "Work", value: "Stripping, restoration, reassembly" },
      { label: "Checks", value: "Alignment and geometry" },
      { label: "Outcome", value: "Restored working condition" },
    ],
    highlights: [
      "Extends machine life",
      "Alignment restored",
      "Component replacement",
      "Trial validation",
    ],
  },
  {
    id: "lathe-machine-assembly-work",
    title: "Lathe Machine Assembly Work",
    industry: "Engineering Equipment",
    category: "Machine Assembly",
    image: IMAGES.latheAssembly,
    short: "Assembly work on lathe machines including new machine assembly.",
    featured: false,
    overview:
      "Mechanical assembly work carried out on lathe machines, covering sub-assembly build, fitting and final assembly.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Machine tool builders requiring assembly support.",
    specs: [
      { label: "Scope", value: "Sub-assembly and final assembly" },
      { label: "Work", value: "Fitting and alignment" },
      { label: "Machine", value: "Lathe" },
      { label: "Support", value: "On-site or in-house" },
    ],
    highlights: ["Skilled fitting", "Alignment control", "Documentation", "Trial support"],
  },
  {
    id: "new-machine-assembly",
    title: "New Machine Assembly",
    industry: "Engineering Equipment",
    category: "Machine Assembly",
    image: IMAGES.newMachineAssembly,
    short: "Complete assembly of new machines from sub-assembly to final build.",
    featured: false,
    overview:
      "Complete new machine assembly, from sub-assembly build through integration, operator interface fitment and final checks.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "OEMs outsourcing new machine build and assembly.",
    specs: [
      { label: "Scope", value: "Full machine assembly" },
      { label: "Stages", value: "Sub-assembly to final build" },
      { label: "Checks", value: "Functional verification" },
      { label: "Support", value: "Build documentation" },
    ],
    highlights: ["End-to-end build", "Trained fitters", "Quality checks", "Repeatable process"],
  },
  {
    id: "hmc-machine-maintenance",
    title: "HMC Machine Maintenance",
    industry: "Engineering Equipment",
    category: "Maintenance",
    image: IMAGES.hmcMachine,
    short: "Maintenance and service work on horizontal machining centres.",
    featured: false,
    overview:
      "Maintenance work on horizontal machining centres, covering mechanical service, corrective repair and functional checks.",
    challenge: genericChallenge,
    solution: genericSolution,
    application: "Production shops maintaining machining centres.",
    specs: [
      { label: "Machine", value: "Horizontal machining centre" },
      { label: "Scope", value: "Mechanical maintenance" },
      { label: "Work", value: "Service and corrective repair" },
      { label: "Outcome", value: "Machine returned to production" },
    ],
    highlights: [
      "Reduced downtime",
      "Preventive checks",
      "Corrective repair",
      "Skilled technicians",
    ],
  },
];
export const GALLERY_CATEGORIES = [
  "All",
  "Machines",
  "Automation",
  "Material Handling",
  "Manufacturing",
  "Engineering",
  "Projects",
];
export const GALLERY = [
  {
    id: "g-1",
    title: "Precision Components & Engineering Drawings",
    category: "Engineering",
    image: IMAGES.galleryGears,
    featured: true,
  },
  {
    id: "g-2",
    title: "Induction Hardening in Process",
    category: "Machines",
    image: IMAGES.galleryInductionGlow,
    featured: true,
  },
  {
    id: "g-3",
    title: "Vertical Hardening Machine Detail",
    category: "Machines",
    image: IMAGES.galleryVerticalDetail,
    featured: false,
  },
  {
    id: "g-4",
    title: "Crank Shaft Machine Components",
    category: "Projects",
    image: IMAGES.galleryCrankDetail,
    featured: false,
  },
  {
    id: "g-5",
    title: "Crank Shaft Machine Mechanism",
    category: "Projects",
    image: IMAGES.galleryCrankMechanism,
    featured: false,
  },
  {
    id: "g-6",
    title: "Operator Interface on Assembled Machine",
    category: "Manufacturing",
    image: IMAGES.galleryOperatorPanel,
    featured: false,
  },
  {
    id: "g-7",
    title: "Machine Maintenance in Progress",
    category: "Manufacturing",
    image: IMAGES.galleryMaintenance,
    featured: false,
  },
  {
    id: "g-8",
    title: "Metrology & Dimensional Verification",
    category: "Engineering",
    image: IMAGES.galleryInspection,
    featured: true,
  },
  {
    id: "g-9",
    title: "Design Documentation for New Product Introduction",
    category: "Engineering",
    image: IMAGES.blueprints,
    featured: false,
  },
];
export const TESTIMONIALS = [
  {
    id: "t-1",
    quote:
      "Demo content — replace from the admin panel. Placeholder feedback describing design and manufacturing support on an equipment programme.",
    author: "Demo Entry",
    role: "OEM Engineering Team (demo)",
    enabled: true,
  },
  {
    id: "t-2",
    quote:
      "Demo content — replace from the admin panel. Placeholder feedback describing NPI support during a new machine build.",
    author: "Demo Entry",
    role: "Manufacturing Lead (demo)",
    enabled: true,
  },
];
export const FAQS = [
  {
    id: "f-1",
    question: "What does Three Star Enterprises do?",
    answer:
      "We provide design services, full turnkey manufacturing and product management support to global OEMs of engineering equipment, process equipment, material handling equipment and line automation.",
  },
  {
    id: "f-2",
    question: "Can you work from our concept or existing drawings?",
    answer:
      "Yes. We take up programmes from concept stage and also review, optimize and manufacture from existing customer drawings.",
  },
  {
    id: "f-3",
    question: "What is your NPI process?",
    answer:
      "Concept, design, optimization, procurement, prototype or manufacturing, process fine tuning and final manufacturing — with design, sourcing and setup issues resolved before production release.",
  },
  {
    id: "f-4",
    question: "Which industries do you serve?",
    answer:
      "Material handling, industrial automation, pharmaceutical, food, process industries, engineering equipment and line automation.",
  },
  {
    id: "f-5",
    question: "Can you share detailed project specifications?",
    answer: "Project details are available on request. Talk to our team about your requirement.",
  },
];
export const HOME_CONTENT = {
  eyebrow: "ENGINEERING • DESIGN • MANUFACTURING",
  heroTitle: "Engineering Ideas Into Industrial Reality.",
  heroSubtitle:
    "Design, turnkey manufacturing and product management solutions for global OEMs across material handling, automation, pharmaceutical, food and process industries.",
  primaryCta: "Explore Our Capabilities",
  secondaryCta: "Discuss Your Project",
  aboutHeading: "A design and manufacturing services partner for global OEMs",
  ctaHeading: "Have an Engineering Challenge? Let's Build the Solution.",
  ctaButton: "Discuss Your Requirement",
  clientsHeading: "Trusted by OEMs and engineering businesses",
};
export const ADMIN_CREDENTIALS = {
  email: "admin@threestar.local",
  password: "ThreeStar@123",
};
