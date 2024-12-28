import { Router } from "express";
import {
  addToCart,
  deleteCartItem,
  getCartItems,
  updateCartItem,
} from "../controllers/cart.controller.js";
import { authProtect } from "../middleware/auth.middleware.js";
const cartRouter = Router();

cartRouter.post("/add-to-cart", authProtect, addToCart);

cartRouter.get("/get-cart-items", authProtect, getCartItems);
cartRouter.put("/update-cart-item", authProtect, updateCartItem);
cartRouter.delete("/delete-cart-item/:id", authProtect, deleteCartItem);
export default cartRouter;
