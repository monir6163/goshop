import { Router } from "express";

import {
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

export default imgRouter;
