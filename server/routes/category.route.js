import { Router } from "express";
import {
  createCategory,
  DeleteCategory,
  getAllCategories,
  getCategories,
  getCategoriesAdmin,
  updateCategory,
  updateCategoryShowOnHome,
} from "../controllers/cat.controller.js";
import { authorize, authProtect } from "../middleware/auth.middleware.js";

const catRouter = Router();

catRouter.post("/create", authProtect, authorize("Admin"), createCategory);

catRouter.get("/get-category-admin", authProtect, authorize("Admin"), getCategoriesAdmin)

catRouter.get("/get-categories", getCategories);

catRouter.put("/update", authProtect, authorize("Admin"), updateCategory);

catRouter.delete(
  "/delete/:id",
  authProtect,
  authorize("Admin"),
  DeleteCategory
);
catRouter.post(
  "/update-showonHome",
  authProtect,
  authorize("Admin"),
  updateCategoryShowOnHome
);

catRouter.get("/get-categories-client", getAllCategories);

export default catRouter;
