import apiSummary from "./api";
import { Axios } from "./axios";

const featchSubCat = async () => {
  try {
    const { data } = await Axios({
      ...apiSummary.getSubCategories,
    });
    return data?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export default featchSubCat;
