import { Router } from "express";

import {
  deleteProduct,
  getCategoryProducts,
  getProductByCatAndSubCat,
  getProductById,
  getProducts,
  searchProduct,
  storeProduct,
  UpdateProductDetails,
} from "../controllers/product.controller.js";
import { authorize, authProtect } from "../middleware/auth.middleware.js";

const productRouter = Router();

productRouter.post("/create", authProtect, authorize("Admin"), storeProduct);
productRouter.get("/get-products", getProducts); // admin
productRouter.get("/category-product/:id", getCategoryProducts); // home page
productRouter.post("/get-products-by-category", getProductByCatAndSubCat); // client side
productRouter.get("/get-product-by-id/:id", getProductById); // client side
productRouter.put(
  "/update-product/:id",
  authProtect,
  authorize("Admin"),
  UpdateProductDetails
);
productRouter.delete(
  "/delete-product/:id",
  authProtect,
  authorize("Admin"),
  deleteProduct
);

// search product query string
productRouter.get("/search-product", searchProduct);
export default productRouter;
