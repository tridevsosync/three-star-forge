import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
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
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
