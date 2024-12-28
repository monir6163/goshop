import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
import { axiosToastError } from "../utils/axiosToastError";
import { decoded_Token } from "../utils/TokenVerify";

export default function RegisterComponent() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    decoded_Token(accessToken);
    if (user?._id || accessToken) {
      navigate("/");
    }
  }, [user, navigate]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    c_password: "",
  });
  const [loading, setLoading] = useState(false);

  const validValue = Object.values(formData).every((val) => val);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const toggleCPass = () => {
    setShowCPassword(!showCPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.password !== formData.c_password) {
      toast.error("Password and Confirm Password does not match");
      setLoading(false);
      return;
    }
    try {
      const { data } = await Axios({
        ...apiSummary.register,
        data: formData,
      });
      if (data.success) {
        toast.success(data.message);
        setLoading(false);
        navigate("/login");
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    } catch (error) {
      axiosToastError(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full items-center flex-1 flex-col py-12">
      <div className="w-full bg-white py-4 rounded">
        <div className="">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign Up to your account
          </h2>
        </div>

        <div className="mt-5 px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete={false}
                  placeholder="Enter Full Name"
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  placeholder="Enter Email"
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete={false}
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="relative mt-2">
                <input
                  placeholder="Enter Password"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete={false}
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <IoEyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <IoEye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="c_password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="relative mt-2">
                <input
                  placeholder="Enter Confirm Password"
                  id="c_password"
                  name="c_password"
                  type={showCPassword ? "text" : "password"}
                  required
                  autoComplete={false}
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={toggleCPass}
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
                  aria-label={showCPassword ? "Hide password" : "Show password"}
                >
                  {showCPassword ? (
                    <IoEyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <IoEye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                disabled={!validValue}
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-green-800"
              >
                {loading ? "Loading..." : "Register"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
