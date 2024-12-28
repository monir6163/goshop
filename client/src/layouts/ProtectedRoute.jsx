/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../utils/LoadingSpinner";
import { decoded_Token } from "../utils/TokenVerify";

export default function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  decoded_Token(accessToken);
  useEffect(() => {
    if (user?._id !== "" || accessToken) {
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
        if (!accessToken) navigate("/login");
      }, 3000); // Redirect to login after a delay
    }
  }, [user, navigate, accessToken]);

  if (loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return user?._id ? children : null;
}
