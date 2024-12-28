import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
import { axiosToastError } from "../utils/axiosToastError";

export default function ResetPasswordComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validValue = Object.values(formData).every((el) => el);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleCPass = () => {
    setShowCPassword(!showCPassword);
  };

  useEffect(() => {
    if (!location?.state?.data?.success && !location?.state?.email) {
      navigate("/");
    }

    if (location?.state?.email) {
      setFormData((preve) => {
        return {
          ...preve,
          email: location?.state?.email,
        };
      });
    }
  }, [location?.state?.data?.success, location?.state?.email, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Password and Confirm Password does not match");
      setLoading(false);
      return;
    }
    try {
      const { data } = await Axios({
        ...apiSummary.resetPassword,
        data: {
          email: formData.email,
          password: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
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
        <div className="mt-5 px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="newPassword"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  New Password
                </label>
              </div>
              <div className="relative mt-2">
                <input
                  placeholder="Enter Password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
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
                  htmlFor="confirmPassword"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="relative mt-2">
                <input
                  placeholder="Enter Confirm Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
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
        </div>
      </div>
    </div>
  );
}
