import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone: string;
  company: string;
  location?: string;
  industry?: string;
  machineType?: string;
  requirement?: string;
  timeline?: string;
  targetVolume?: string;
  message: string;
  referenceProject?: string;
  read?: boolean;
  status?: "new" | "under-review" | "quoted" | "closed";
  priority?: "standard" | "high" | "urgent";
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your work email address"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Please provide your company or organization name"],
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    industry: {
      type: String,
      default: "Industrial Automation",
      trim: true,
    },
    machineType: {
      type: String,
      default: "Induction Hardening Machine",
      trim: true,
    },
    requirement: {
      type: String,
      default: "Turnkey Machine Manufacturing",
      trim: true,
    },
    timeline: {
      type: String,
      default: "1 - 3 Months",
      trim: true,
    },
    targetVolume: {
      type: String,
      default: "",
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Please describe your project or machinery specifications"],
      trim: true,
    },
    referenceProject: {
      type: String,
      default: "",
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["new", "under-review", "quoted", "closed"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["standard", "high", "urgent"],
      default: "standard",
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

const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

export default Enquiry;
