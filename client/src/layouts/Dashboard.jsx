import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import UserMenu from "../components/UserMenu";

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  if (!user?._id) {
    return (
      <div className="container mx-auto p-3 flex justify-center items-center h-[75vh]">
        <h1 className="text-center text-2xl font-semibold text-red-500">
          Please login to access dashboard
        </h1>
      </div>
    );
  }
  return (
    <section className="bg-white">
      <div className="container mx-auto p-3 grid lg:grid-cols-[250px,1fr]  ">
        {/**left for menu */}
        <div className="py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r">
          <UserMenu />
        </div>

        {/**right for content */}
        <div className="bg-white min-h-[75vh]">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
