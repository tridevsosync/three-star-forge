import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
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
      required: [true, "Please provide an image URL"],
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
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
