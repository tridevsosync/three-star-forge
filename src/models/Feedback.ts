import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeedback extends Document {
  fullName: string;
  company?: string;
  rating: number;
  category: string;
  message: string;
  avatarUrl?: string;
  cloudinaryPublicId?: string;
  type?: "client" | "general";
  isApproved: boolean;
  status: "pending" | "approved";
  submittedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    fullName: {
      type: String,
      required: [true, "Please provide your full name"],
      trim: true,
      maxlength: [80, "Full name cannot exceed 80 characters"],
    },
    company: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating from 1 to 5"],
      min: [1, "Rating must be at least 1 star"],
      max: [5, "Rating cannot exceed 5 stars"],
      default: 5,
    },
    category: {
      type: String,
      required: [true, "Please select an industrial equipment category"],
      default: "Vertical Induction Hardening Machines",
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Please provide your review message"],
      trim: true,
      minlength: [10, "Review message must be at least 10 characters"],
      maxlength: [500, "Review message cannot exceed 500 characters"],
    },
    avatarUrl: {
      type: String,
      default: "",
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["client", "general"],
      default: "client",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    submittedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default Feedback;
