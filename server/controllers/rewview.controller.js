import Review from "../models/review.model.js";

// store product review
export async function storeProductReview(req, res) {
  try {
    const userId = req?.userId;
    const { review, rating, productId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({
          message: "Invalid user",
          success: false,
          data: null,
          error: true,
        });
    }
    if (!review || !rating || !productId) {
      return res
        .status(400)
        .json({
          message: "All fields are required",
          success: false,
          data: null,
          error: true,
        });
    }

    // check if user already reviewed the product
    const alreadyReviewed = await Review.findOne({ productId, userId });
    if (alreadyReviewed) {
        return res
            .status(400)
            .json({
            message: "You have already reviewed this product",
            success: false,
            data: null,
            error: true,
            });
    }


    const reviewData = await Review.create({
      review,
      rating,
      productId,
      userId,
    });
    return res
      .status(200)
      .json({
        message: "Product review stored successfully",
        success: true,
        data: reviewData,
        error: false,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: error.message,
        success: false,
        data: null,
        error: true,
      });
  }
}

// get all product reviews by product id
export async function getAllProductReviews(req, res) {
  try {
    const { productId } = req.query;
    const reviews = await Review.find({ productId }).populate(
      "userId",
      "name email"
    ).sort({ createdAt: -1 });
    const totalRatings = reviews.length;
    const averageRating = (
      reviews.reduce((acc, review) => acc + review.rating, 0) / totalRatings
    ).toFixed(1);

    const starCounts = reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {});

    return res
      .status(200)
      .json({
        message: "Product reviews fetched successfully",
        success: true,
        data: {
          reviews,
          totalRatings,
          averageRating: Number(averageRating) || 0,
          starCounts
        },
        error: false,
        });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: error.message,
        success: false,
        data: null,
        error: true,
      });
  }
}
