import { Router } from "express";

import {
  createBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from "../controllers/brand.controller.js";
import { authorize, authProtect } from "../middleware/auth.middleware.js";

const brandRouter = Router();

brandRouter.post("/create", authProtect, authorize("Admin"), createBrand);

brandRouter.get("/all-brands", getBrands);

brandRouter.put("/update/:id", authProtect, authorize("Admin"), updateBrand);

brandRouter.delete("/delete/:id", authProtect, authorize("Admin"), deleteBrand);

export default brandRouter;
