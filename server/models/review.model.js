import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        review: {
        type: String,
        default: "",
        },
        rating: {
        type: Number,
        default: 0,
        },
        productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        },
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        },
    },
    { timestamps: true, versionKey: false }
);

const Review = mongoose.model("review", reviewSchema);

export default Review;