import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
import { axiosToastError } from "../utils/axiosToastError";
export default function ForgotPasswordComponent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const validValue = Object.values(formData).every((val) => val);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await Axios({
        ...apiSummary.forgotPassword,
        data: formData,
      });
      if (data.success) {
        toast.success(data.message);
        setLoading(false);
        navigate("/otp-verification", { state: { email: formData.email } });
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
              <button
                disabled={!validValue}
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-green-800"
              >
                {loading ? "Loading..." : "Send Otp"}
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
