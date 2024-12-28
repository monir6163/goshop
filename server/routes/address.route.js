import { Router } from "express";
import {
  deleteAddress,
  getAllAddress,
  storeAddress,
  updateAddress,
} from "../controllers/address.controller.js";
import { authProtect } from "../middleware/auth.middleware.js";

const addressRouter = Router();

addressRouter.post("/store-address", authProtect, storeAddress);

addressRouter.get("/get-all-address", authProtect, getAllAddress);

addressRouter.put("/update-address", authProtect, updateAddress);

addressRouter.delete("/delete-address/:id", authProtect, deleteAddress);

export default addressRouter;
