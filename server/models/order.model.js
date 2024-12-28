import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    order_id: {
      type: String,
      required: [true, "Please provide order id"],
      unique: true,
    },
    products: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        product_details: {
          name: String,
          image: Array,
        },
        qty: Number,
      }
    ],
    payment_id: {
      type: String,
      default: "",
    },
    payment_type: {
      type: String,
      default: "",
    },
    payment_status: {
      type: String,
      default: "",
    },
    delivary_address: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
    },
    sub_total_amount: {
      type: Number,
      default: 0,
    },
    total_amount: {
      type: Number,
      default: 0,
    },
    invoice_recipt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Order = mongoose.model("order", OrderSchema);

export default Order;
