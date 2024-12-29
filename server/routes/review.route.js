import { Router } from "express";

import { authProtect } from "../middleware/auth.middleware.js";
import { getAllProductReviews, storeProductReview } from "../controllers/rewview.controller.js";

const reviewRouter = Router();

reviewRouter.post("/store-product-review", authProtect, storeProductReview);
reviewRouter.get("/get-reviews-product-id", getAllProductReviews);


export default reviewRouter;
