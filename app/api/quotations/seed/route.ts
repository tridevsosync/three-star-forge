import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Quotation from "@/models/Quotation";

const SAMPLE_QUOTATIONS = [
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

export async function POST() {
  try {
    await connectToDatabase();
    const existing = await Quotation.countDocuments({});
    if (existing === 0) {
      await Quotation.insertMany(SAMPLE_QUOTATIONS);
      return NextResponse.json({ success: true, message: "Sample quotations seeded successfully", count: SAMPLE_QUOTATIONS.length });
    }
    return NextResponse.json({ success: true, message: "Quotations already exist", count: existing });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}