import apiSummary from "./api";
import { Axios } from "./axios";

const featchCat = async () => {
  try {
    const { data } = await Axios({
      ...apiSummary.getCategories,
    });
    return data?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export default featchCat;
