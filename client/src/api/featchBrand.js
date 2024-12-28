import apiSummary from "./api";
import { Axios } from "./axios";

const featchBrand = async () => {
  try {
    const { data } = await Axios({
      ...apiSummary.getBrands,
    });
    return data?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export default featchBrand;
