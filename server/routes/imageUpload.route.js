import { Router } from "express";

import {
  getBannerImageController,
  uploadBannerImageController,
  uploadImageController,
  uploadSingleImageController,
} from "../controllers/uploadImage.controller.js";
import { authorize, authProtect } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const imgRouter = Router();

imgRouter.post(
  "/upload",
  authProtect,
  authorize("Admin"),
  upload.array("image"),
  uploadImageController
);

imgRouter.post(
  "/upload/single",
  authProtect,
  authorize("Admin"),
  upload.single("image"),
  uploadSingleImageController
);

// banner image upload

imgRouter.put("/upload/banner", authProtect, authorize("Admin"), uploadBannerImageController);
imgRouter.get("/get-banner", getBannerImageController);

export default imgRouter;
