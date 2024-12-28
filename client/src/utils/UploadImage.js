import apiSummary from "../api/api";
import { Axios } from "../api/axios";

const uploadImage = async (images) => {
  try {
    const formData = new FormData();
    images?.forEach((image) => {
      formData.append("image", image);
    });
    const res = await Axios({
      ...apiSummary.uploadImage,
      data: formData,
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const uploadSingleImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const res = await Axios({
      ...apiSummary.uploadSingleImage,
      data: formData,
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

export { uploadImage, uploadSingleImage };
