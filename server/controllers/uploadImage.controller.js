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
