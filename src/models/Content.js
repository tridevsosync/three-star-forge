import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    section: { type: String, required: true, unique: true, trim: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export default mongoose.models.Content || mongoose.model("Content", ContentSchema);
