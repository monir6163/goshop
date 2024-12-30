import mongoose from "mongoose";

const banerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: "",
    },
    imgType: {
      enum: ["desktop", "mobile"],
      type: String,
      default: "desktop",
    },
    banerLink: {
        type: String,
        default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Baner = mongoose.model("Baner", banerSchema);

export default Baner;
