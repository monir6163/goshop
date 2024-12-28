import mongoose from "mongoose";

const showOnHomeModel = new mongoose.Schema(
  {
    showOnHome: {
      type: Boolean,
      default: false,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);
const DynamicShow = mongoose.model("showOnHome", showOnHomeModel);
export default DynamicShow;
