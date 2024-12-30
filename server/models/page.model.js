import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, versionKey: false }
);

const pageModel = mongoose.model("Page", pageSchema);

export default pageModel;
