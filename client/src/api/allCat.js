import apiSummary from "./api";
import { Axios } from "./axios";

const allGetCat = async () => {
  try {
    const { data } = await Axios({
      ...apiSummary.getAllCategories,
    });
    return data?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export default allGetCat;
