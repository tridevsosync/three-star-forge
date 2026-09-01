import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Quotation from "@/models/Quotation";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }
    if (category && category !== "all") {
      query["project.category"] = category;
    }
    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { quoteNumber: { $regex: s, $options: "i" } },
        { "client.name": { $regex: s, $options: "i" } },
        { "client.company": { $regex: s, $options: "i" } },
        { "client.email": { $regex: s, $options: "i" } },
        { "client.phone": { $regex: s, $options: "i" } },
        { "project.title": { $regex: s, $options: "i" } },
        { "client.plantLocation": { $regex: s, $options: "i" } },
      ];
    }

    // If no quotations exist, seed initial samples
    const totalCountInDb = await Quotation.countDocuments({});
    if (totalCountInDb === 0) {
      await Quotation.insertMany([
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
            deliveryTimeline: "8 – 10 Weeks from drawing approval & advance receipt.",
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
            deliveryTimeline: "6 – 8 Weeks from layout signoff.",
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
      ]);
    }

    const quotations = await Quotation.find(query).sort({ createdAt: -1 }).lean();
    const normalized = quotations.map((q: any) => ({
      ...q,
      id: q._id ? q._id.toString() : q.id,
    }));

    // Pipeline summary calculations
    const allQuotes = await Quotation.find({}).lean();
    const totalCount = allQuotes.length;
    const totalPipelineValue = allQuotes.reduce((acc, q) => acc + (q.grandTotal || 0), 0);
    const acceptedQuotes = allQuotes.filter((q) => q.status === "accepted");
    const acceptedValue = acceptedQuotes.reduce((acc, q) => acc + (q.grandTotal || 0), 0);
    const acceptedCount = acceptedQuotes.length;
    const winRate = totalCount > 0 ? Math.round((acceptedCount / totalCount) * 100) : 0;

    return NextResponse.json({
      success: true,
      count: normalized.length,
      data: normalized,
      stats: {
        totalCount,
        totalPipelineValue,
        acceptedValue,
        acceptedCount,
        winRate,
      },
    });
  } catch (error: any) {
    console.error("Fetch quotations error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const {
      quoteNumber: customQuoteNumber,
      rfqId,
      client,
      project,
      lineItems = [],
      currency = "INR",
      commercialTerms = {},
      status = "draft",
      validityDays = 30,
      preparedBy,
      notes,
    } = body;

    if (!client || (!client.name && !client.company)) {
      return NextResponse.json(
        { success: false, error: "Client name or company name is required." },
        { status: 400 },
      );
    }

    // Auto-generate consecutive quote number if not provided or if duplicate exists
    let finalQuoteNumber = customQuoteNumber ? String(customQuoteNumber).trim() : "";
    const year = new Date().getFullYear();

    if (!finalQuoteNumber) {
      let seqNum = (await Quotation.countDocuments({})) + 1;
      finalQuoteNumber = `TSE/QT/${year}/${String(seqNum).padStart(4, "0")}`;
      while (await Quotation.exists({ quoteNumber: finalQuoteNumber })) {
        seqNum += 1;
        finalQuoteNumber = `TSE/QT/${year}/${String(seqNum).padStart(4, "0")}`;
      }
    } else {
      // If user-provided quote number already exists in DB, make unique by appending suffix
      const existing = await Quotation.findOne({ quoteNumber: finalQuoteNumber });
      if (existing) {
        finalQuoteNumber = `${finalQuoteNumber}-${Date.now().toString().slice(-4)}`;
      }
    }

    // Compute line item amounts & totals
    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;

    const itemsToProcess = Array.isArray(lineItems) && lineItems.length > 0 ? lineItems : [{}];
    const computedLineItems = itemsToProcess.map((item: any, idx: number) => {
      const qty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
      const rate = Number(item.unitPrice) >= 0 ? Number(item.unitPrice) : 0;
      const discPct = Number(item.discountPercent) || 0;
      const taxPct = Number(item.taxPercent) ?? 18;

      const baseAmount = qty * rate;
      const discountAmount = (baseAmount * discPct) / 100;
      const taxableAmount = baseAmount - discountAmount;
      const itemTax = (taxableAmount * taxPct) / 100;
      const itemTotal = taxableAmount + itemTax;

      subtotal += baseAmount;
      discountTotal += discountAmount;
      taxTotal += itemTax;

      return {
        description: item.description?.trim() || `Industrial Machinery Scope Item #${idx + 1}`,
        hsnCode: item.hsnCode?.trim() || "8479",
        quantity: qty,
        unit: item.unit || "Nos",
        unitPrice: rate,
        discountPercent: discPct,
        taxPercent: taxPct,
        amount: Math.round(itemTotal * 100) / 100,
      };
    });

    const grandTotal = Math.round((subtotal - discountTotal + taxTotal) * 100) / 100;
    const issuedDate = new Date();
    const validUntil = new Date(issuedDate.getTime() + (validityDays || 30) * 24 * 60 * 60 * 1000);

    const clientName = (client.name || "Client Representative").trim();
    const clientCompany = (client.company || clientName || "Client Enterprise").trim();

    const newQuotation = await Quotation.create({
      quoteNumber: finalQuoteNumber.trim(),
      rfqId: rfqId ? String(rfqId).trim() : "",
      client: {
        name: clientName,
        company: clientCompany,
        designation: client.designation ? client.designation.trim() : "",
        email: client.email ? client.email.trim().toLowerCase() : "",
        phone: client.phone ? client.phone.trim() : "",
        gstin: client.gstin ? client.gstin.trim().toUpperCase() : "",
        billingAddress: client.billingAddress ? client.billingAddress.trim() : "",
        plantLocation: client.plantLocation ? client.plantLocation.trim() : "",
      },
      project: {
        title: project?.title ? project.title.trim() : "Custom Industrial Machinery Build",
        category: project?.category ? project.category.trim() : "Induction Hardening",
        referenceDocName: project?.referenceDocName ? project.referenceDocName.trim() : "",
        referenceDocUrl: project?.referenceDocUrl ? project.referenceDocUrl.trim() : "",
      },
      lineItems: computedLineItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discountTotal: Math.round(discountTotal * 100) / 100,
      taxTotal: Math.round(taxTotal * 100) / 100,
      grandTotal,
      currency: currency || "INR",
      commercialTerms: {
        paymentTerms: commercialTerms.paymentTerms || "30% Advance with PO, 60% against FAT trial approval in Pune, 10% after commissioning.",
        deliveryTimeline: commercialTerms.deliveryTimeline || "8 – 12 Weeks from drawing approval & advance.",
        validityDays: Number(validityDays) || 30,
        warranty: commercialTerms.warranty || "12 Months from commissioning / 18 months from dispatch.",
        freightTerms: commercialTerms.freightTerms || "Ex-Works Pune Plant. Freight & insurance extra at actuals.",
        inspectionFAT: commercialTerms.inspectionFAT || "100% FAT trial & cycle trial at Pune plant prior to dispatch.",
        specialNotes: commercialTerms.specialNotes || "",
      },
      status: status || "draft",
      issuedDate,
      validUntil,
      preparedBy: preparedBy || "Three Star Enterprises Engineering Division",
      notes: notes ? notes.trim() : "",
    });

    const result = {
      ...newQuotation.toObject(),
      id: newQuotation._id.toString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: `Quotation ${finalQuoteNumber} created successfully`,
        data: result,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Create quotation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const { ids } = body;

    if (Array.isArray(ids) && ids.length > 0) {
      await Quotation.deleteMany({ _id: { $in: ids } });
      return NextResponse.json({ success: true, message: `Deleted ${ids.length} quotations` });
    }

    return NextResponse.json({ success: false, error: "No quotation IDs provided" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
