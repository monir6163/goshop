import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = async (image, folderName) => {
  try {
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

    const uploadImage = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: folderName }, (error, uploadResult) => {
          return resolve(uploadResult);
        })
        .end(buffer);
    });

    return uploadImage;
  } catch (error) {
    return null;
  }
};
const deleteOnCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};
export { cloudinaryUpload, deleteOnCloudinary };
