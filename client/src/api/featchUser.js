import apiSummary from "./api";
import { Axios } from "./axios";

const featchLoggedInUser = async () => {
  const { data } = await Axios({
    ...apiSummary.userDetails,
  });
  return data?.data;
};

export default featchLoggedInUser;
