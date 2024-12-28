import { Router } from "express";
import { createCashOrder, createStripeOrder, getAllOrders, stripeWebHook } from "../controllers/order.controller.js";
import { authProtect } from "../middleware/auth.middleware.js";

const orderRouter = Router();

orderRouter.post("/cash-on-delivery", authProtect, createCashOrder);
orderRouter.post("/stripe-payment", authProtect, createStripeOrder);
orderRouter.post("/webhook", stripeWebHook)
// zeal-uplift-ready-glitz
orderRouter.get("/get-all-orders", authProtect, getAllOrders);

export default orderRouter;
