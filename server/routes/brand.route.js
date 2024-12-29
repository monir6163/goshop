import { Router } from "express";

import {
  createBrand,
  deleteBrand,
  getBrands,
  getBrandsAdmin,
  updateBrand,
} from "../controllers/brand.controller.js";
import { authorize, authProtect } from "../middleware/auth.middleware.js";

const brandRouter = Router();

brandRouter.post("/create", authProtect, authorize("Admin"), createBrand);

brandRouter.get("/get-brands-admin", authProtect, authorize('Admin'), getBrandsAdmin)

brandRouter.get("/all-brands", getBrands);

brandRouter.put("/update/:id", authProtect, authorize("Admin"), updateBrand);

brandRouter.delete("/delete/:id", authProtect, authorize("Admin"), deleteBrand);

export default brandRouter;
