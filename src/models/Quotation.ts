import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuotationLineItem {
  id?: string;
  description: string;
  hsnCode?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent?: number;
  taxPercent?: number;
  amount: number;
}

export interface IQuotationClient {
  name: string;
  company: string;
  designation?: string;
  email: string;
  phone: string;
  gstin?: string;
  billingAddress?: string;
  plantLocation?: string;
}

export interface IQuotationTerms {
  paymentTerms?: string;
  deliveryTimeline?: string;
  validityDays?: number;
  warranty?: string;
  freightTerms?: string;
  inspectionFAT?: string;
  specialNotes?: string;
}

export interface IQuotation extends Document {
  quoteNumber: string;
  rfqId?: string;
  client: IQuotationClient;
  project: {
    title: string;
    category?: string;
    referenceDocName?: string;
    referenceDocUrl?: string;
  };
  lineItems: IQuotationLineItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  currency: string;
  commercialTerms: IQuotationTerms;
  status: "draft" | "sent" | "under-review" | "accepted" | "declined" | "expired";
  issuedDate: Date;
  validUntil: Date;
  preparedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuotationLineItemSchema = new Schema<IQuotationLineItem>(
  {
    description: { type: String, required: true, trim: true },
    hsnCode: { type: String, default: "8479", trim: true },
    quantity: { type: Number, required: true, default: 1, min: 0.01 },
    unit: { type: String, default: "Nos", trim: true },
    unitPrice: { type: Number, required: true, default: 0, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    taxPercent: { type: Number, default: 18, min: 0, max: 100 },
    amount: { type: Number, required: true, default: 0 },
  },
  { _id: true },
);

const QuotationSchema = new Schema<IQuotation>(
  {
    quoteNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    rfqId: {
      type: String,
      default: "",
      trim: true,
    },
    client: {
      name: { type: String, required: true, trim: true },
      company: { type: String, required: true, trim: true },
      designation: { type: String, default: "", trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      gstin: { type: String, default: "", trim: true, uppercase: true },
      billingAddress: { type: String, default: "", trim: true },
      plantLocation: { type: String, default: "", trim: true },
    },
    project: {
      title: { type: String, required: true, default: "Custom Industrial Machinery Build", trim: true },
      category: { type: String, default: "Induction Hardening", trim: true },
      referenceDocName: { type: String, default: "", trim: true },
      referenceDocUrl: { type: String, default: "", trim: true },
    },
    lineItems: {
      type: [QuotationLineItemSchema],
      default: [],
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    discountTotal: {
      type: Number,
      default: 0,
    },
    taxTotal: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
      trim: true,
    },
    commercialTerms: {
      paymentTerms: {
        type: String,
        default: "30% Advance with Purchase Order, 60% against successful FAT trial inspection at Pune works, 10% after site commissioning.",
        trim: true,
      },
      deliveryTimeline: {
        type: String,
        default: "8 – 12 Weeks from drawing approval and advance receipt.",
        trim: true,
      },
      validityDays: {
        type: Number,
        default: 30,
      },
      warranty: {
        type: String,
        default: "12 Months from commissioning or 18 months from dispatch date, whichever is earlier.",
        trim: true,
      },
      freightTerms: {
        type: String,
        default: "Ex-Works Pune Plant. Freight, packing, and transit insurance extra at actuals.",
        trim: true,
      },
      inspectionFAT: {
        type: String,
        default: "100% Factory Acceptance Trials (FAT) and workpiece cycle testing conducted at Pune facility prior to dispatch.",
        trim: true,
      },
      specialNotes: {
        type: String,
        default: "",
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ["draft", "sent", "under-review", "accepted", "declined", "expired"],
      default: "draft",
      index: true,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    preparedBy: {
      type: String,
      default: "Three Star Enterprises Engineering Division",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  },
);

const Quotation: Model<IQuotation> =
  mongoose.models.Quotation || mongoose.model<IQuotation>("Quotation", QuotationSchema);

export default Quotation;
