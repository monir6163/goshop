import { Router } from "express";
import { createCashOrder, createStripeOrder, getAllOrders, getAllOrdersByAdmin, getOrderDetails, stripeWebHook, updateOrderStatus } from "../controllers/order.controller.js";
import { authorize, authProtect } from "../middleware/auth.middleware.js";

const orderRouter = Router();

orderRouter.post("/cash-on-delivery", authProtect, createCashOrder);
orderRouter.post("/stripe-payment", authProtect, createStripeOrder);
orderRouter.post("/webhook", stripeWebHook)
orderRouter.get("/get-all-orders", authProtect, getAllOrders);
orderRouter.get("/admin-all-orders", authProtect, authorize('Admin'), getAllOrdersByAdmin);
orderRouter.post("/update-order-status", authProtect, authorize('Admin'), updateOrderStatus);
orderRouter.get("/view-order", authProtect, authorize('Admin'), getOrderDetails);

export default orderRouter;
