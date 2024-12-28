/* eslint-disable react/prop-types */

import toast from "react-hot-toast";
import { HiOutlineExternalLink } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
import { logout } from "../redux/userSlice";
import { axiosToastError } from "../utils/axiosToastError";
import isAdmin from "../utils/isAdmin";
import Divider from "./Divider";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathName = useLocation().pathname;

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...apiSummary.logout,
      });
      if (response.data.success) {
        if (close) {
          close();
        }
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      axiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) {
      close();
    }
  };
  return (
    <div>
      <div className="font-semibold">My Account</div>
      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          {user.name || user.mobile}{" "}
          <span className="text-medium text-red-600">
            {user.role === "Admin" ? "(Admin)" : ""}
          </span>
        </span>
        <Link
          onClick={handleClose}
          to={"/dashboard/profile"}
          className="hover:text-primary-200"
        >
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />

      <div className="text-sm grid gap-1">
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/category"}
            className={`px-2 hover:bg-orange-200 py-1 ${
              pathName === "/dashboard/category" ? "bg-orange-200" : ""
            }`}
          >
            Category
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/subcategory"}
            className={`px-2 hover:bg-orange-200 py-1 ${
              pathName === "/dashboard/subcategory" ? "bg-orange-200" : ""
            }`}
          >
            Sub Category
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/brand"}
            className={`px-2 hover:bg-orange-200 py-1 ${
              pathName === "/dashboard/brand" ? "bg-orange-200" : ""
            }`}
          >
            Product Brand
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/upload-product"}
            className={`px-2 hover:bg-orange-200 py-1 ${
              pathName === "/dashboard/upload-product" ? "bg-orange-200" : ""
            }`}
          >
            Upload Product
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/product"}
            className={`px-2 hover:bg-orange-200 py-1 ${
              pathName === "/dashboard/product" ? "bg-orange-200" : ""
            }`}
          >
            Product
          </Link>
        )}

        <Link
          onClick={handleClose}
          to={"/dashboard/myorders"}
          className={`px-2 hover:bg-orange-200 py-1 ${
            pathName === "/dashboard/myorders" ? "bg-orange-200" : ""
          }`}
        >
          My Orders
        </Link>

        <Link
          onClick={handleClose}
          to={"/dashboard/address"}
          className={`px-2 hover:bg-orange-200 py-1 ${
            pathName === "/dashboard/address" ? "bg-orange-200" : ""
          }`}
        >
          Save Address
        </Link>

        <button
          onClick={handleLogout}
          className="text-left px-2 hover:bg-orange-200 py-1"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
