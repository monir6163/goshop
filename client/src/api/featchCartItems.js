import apiSummary from "./api";
import { Axios } from "./axios";

const featchCartItems = async () => {
  try {
    const { data } = await Axios({
      ...apiSummary.getCartItems,
    });
    return data?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export default featchCartItems;
