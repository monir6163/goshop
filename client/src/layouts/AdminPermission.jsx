/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import isAdmin from "../utils/isAdmin";
import LoadingSpinner from "../utils/LoadingSpinner";
export default function AdminPermission({ children }) {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  return (
    <>
      {isAdmin(user?.role) ? (
        children
      ) : (
        <>
          {loading && (
            <>
              <LoadingSpinner />
            </>
          )}
        </>
      )}
    </>
  );
}
