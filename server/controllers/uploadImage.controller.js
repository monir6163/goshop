import Baner from "../models/baner.model.js";
import { cloudinaryUpload } from "../utils/uploadImageClodinary.js";

export async function uploadImageController(req, res) {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded",
        error: true,
        success: false,
      });
    }

    const uploadPromises = files?.map((file) =>
      cloudinaryUpload(file, "ecom/category")
    );
    const uploadResults = await Promise.all(uploadPromises);

    return res.status(201).json({
      message: "Images uploaded successfully",
      error: false,
      success: true,
      data: uploadResults,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
      error: true,
      success: false,
    });
  }
}

export async function uploadSingleImageController(req, res) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
        error: true,
        success: false,
      });
    }

    const uploadResult = await cloudinaryUpload(file, "ecom/category");

    return res.status(201).json({
      message: "Image uploaded successfully",
      error: false,
      success: true,
      data: uploadResult,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
      error: true,
      success: false,
    });
  }
}

// banner image upload

export async function uploadBannerImageController(req, res) {
  try {
    const { imgType, image, banerLink } = req.body;
    if(!image){
      return res.status(400).json({
        message: "No image uploaded",
        error: true,
        success: false,
      });
    }
    // check if image is already uploaded
    const existingBanner = await Baner.findOne({ imgType });
    if(existingBanner){
      // only update the image
      existingBanner.image = image;
      existingBanner.banerLink = banerLink;
      const data = await existingBanner.save();
    }else{
      const data = await Baner.create({ imgType, image, banerLink });
    }

    return res.status(201).json({
      message: "Banner image uploaded successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      error: true,
      success: false,
    });
  }
}

// get banner image

export async function getBannerImageController(req, res) {
  try {
    const data = await Baner.find();
    return res.status(200).json({
      message: "Banner image fetched successfully",
      error: false,
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      error: true,
      success: false,
    });
  }
}
