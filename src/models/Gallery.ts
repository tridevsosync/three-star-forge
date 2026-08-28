import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGallery extends Document {
  title: string;
  category: string;
  image?: string;
  cloudinaryPublicId?: string;
  description?: string;
  featured?: boolean;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for the gallery photograph"],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: "Machines",
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
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

const Gallery: Model<IGallery> =
  mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);

export default Gallery;
