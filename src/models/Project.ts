import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  industry: string;
  category: string;
  image?: string;
  short?: string;
  featured?: boolean;
  featuredInHero?: boolean;
  featuredInHome?: boolean;
  overview?: string;
  challenge?: string;
  solution?: string;
  application?: string;
  specs?: Array<{ label: string; value: string }>;
  highlights?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    image: { type: String, default: "", trim: true },
    short: { type: String, default: "", trim: true },
    featured: { type: Boolean, default: false },
    featuredInHero: { type: Boolean, default: false },
    featuredInHome: { type: Boolean, default: false },
    overview: { type: String, default: "", trim: true },
    challenge: { type: String, default: "", trim: true },
    solution: { type: String, default: "", trim: true },
    application: { type: String, default: "", trim: true },
    specs: { type: [{ label: String, value: String }], default: [] },
    highlights: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
