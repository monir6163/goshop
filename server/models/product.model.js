import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      index: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    image: {
      type: Array,
      default: [],
    },
    category_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
      },
    ],
    subCategory_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
      },
    ],
    brand_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand",
      },
    ],
    unit: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    more_info: {
      type: Object,
      default: {},
    },
    status: {
      type: Boolean,
      default: true,
    },
    // reviews: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "review",
    //   },
    // ],
  },
  { timestamps: true, versionKey: false }
);
productSchema.index({ name: "text", description: "text" });
const Product = mongoose.model("product", productSchema);

export default Product;
