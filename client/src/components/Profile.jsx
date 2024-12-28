import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
import featchLoggedInUser from "../api/featchUser";
import { setUser, updateAvater } from "../redux/userSlice";
import { axiosToastError } from "../utils/axiosToastError";

/* eslint-disable react/prop-types */
export default function ProfileComponent({ user }) {
  const dispatch = useDispatch();
  const inputRef = useRef(null); // Ref for the input field
  const [avater, setAvater] = useState(null);
  const [avaterView, setAvaterView] = useState(null);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateProfile, setUpdateProfile] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  useEffect(() => {
    setUpdateProfile({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  }, [user]);

  const handleInputChange = (e) => {
    setUpdateProfile({ ...updateProfile, [e.target.name]: e.target.value });
  };

  // update user profile data
  const handleUpdateProfileData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await Axios({
        ...apiSummary.updateProfile,
        data: updateProfile,
      });
      if (data.success) {
        toast.success(data.message);
        const userData = await featchLoggedInUser();
        if (userData) {
          dispatch(setUser(userData));
        }
        setLoading(false);
      }
    } catch (error) {
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvater = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.readyState === 2) {
        setAvaterView(reader.result);
      }
    };
    setAvater(file);
    reader.readAsDataURL(file);
  };
  const handleRemoveAvater = () => {
    setAvater(null);
    setAvaterView(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  // update user profile image
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const formData = new FormData();
      formData.append("avater", avater);
      const { data } = await Axios({
        ...apiSummary.updateAvater,
        data: formData,
      });
      if (data.success) {
        toast.success(data.message);
        setAvater(null);
        setAvaterView(null);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        dispatch(updateAvater(data.data));
      }
    } catch (error) {
      axiosToastError(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="p-4">
      {/* left user image */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="relative">
          <div className="">
            <img
              src={avaterView || user.avater}
              alt={user.name}
              className="w-32 h-32 mb-3 rounded-full"
            />

            <input
              onChange={handleAvater}
              ref={inputRef}
              type="file"
              name="avater"
              id="avater"
              placeholder="Choose your image"
              className="p-2 w-full bg-blue-500 text-white rounded-md"
            />
          </div>
          {/* remove btn */}

          {avaterView && (
            <button
              onClick={handleRemoveAvater}
              className="absolute top-0 p-2 bg-red-500 text-white rounded-md"
            >
              <X />
            </button>
          )}
          {avaterView && (
            <button
              onClick={handleUpdateProfile}
              className="p-2 mt-3 bg-blue-500 text-white rounded-md"
              disabled={loader}
            >
              {loader ? "Loading..." : "Update Avater"}
            </button>
          )}
        </div>

        {/* right side user details update form */}
        <div className="w-full">
          <form
            onSubmit={handleUpdateProfileData}
            className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                name="name"
                placeholder="Full Name"
                value={updateProfile.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={updateProfile.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                Phone
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                type="text"
                placeholder="+8801747706163"
                name="phone"
                value={updateProfile.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
