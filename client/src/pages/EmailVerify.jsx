import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Axios } from "../api/axios";
import apiSummary from "../api/api";
import { axiosToastError } from "../utils/axiosToastError";
import toast from "react-hot-toast";

export default function EmailVerify() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    if (!queryParams.get("code")) {
      navigate("/login");
    }
    const verifyEmail = async () => {
      try {
        setVerified(true);
        const res = await Axios({
          ...apiSummary.verifyEmail,
          data: { code: queryParams.get("code") },
        });
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/login");
        }
      } catch (error) {
        axiosToastError(error);
      } finally {
        setVerified(false);
      }
    };
    verifyEmail();
  }, [queryParams, navigate]);
  return (
    <div className="container max-w-xl mx-auto">
      <div className="bg-green-100 text-green-700 text-center p-4 my-4">
        {verified ? "Verifying..." : "Email Verified"}
      </div>
    </div>
  );
}
