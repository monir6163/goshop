import { Router } from "express";

import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  updateSubCategory,
} from "../controllers/subCat.controller.js";
import { authorize, authProtect } from "../middleware/auth.middleware.js";

const subCatRouter = Router();

subCatRouter.post(
  "/create",
  authProtect,
  authorize("Admin"),
  createSubCategory
);

subCatRouter.get("/get-subCategories", getSubCategories);

subCatRouter.put(
  "/update/:id",
  authProtect,
  authorize("Admin"),
  updateSubCategory
);

subCatRouter.delete(
  "/delete/:id",
  authProtect,
  authorize("Admin"),
  deleteSubCategory
);

export default subCatRouter;
