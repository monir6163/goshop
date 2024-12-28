import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
    qty: {
      type: Number,
      default: 1,
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CartProduct = mongoose.model("cartProduct", cartProductSchema);
export default CartProduct;
