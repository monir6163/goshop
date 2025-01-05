import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import UserMenuMobile from "../components/UserMenuMobile";
import AdminPermission from "../layouts/AdminPermission";
import Dashboard from "../layouts/Dashboard";
import ProtectedRoute from "../layouts/ProtectedRoute";
import Address from "../pages/Address";
import Brand from "../pages/Brand";
import CartMobile from "../pages/CartMobile";
import CategoryPage from "../pages/CategoryPage";
import CheckoutPage from "../pages/CheckoutPage";
import ForgotPassword from "../pages/Forgot-password";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyOrder from "../pages/MyOrder";
import OrderCancel from "../pages/OrderCancel";
import OrderSuccess from "../pages/OrderSuccess";
import OtpVerify from "../pages/Otp-verify";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import ProductListPage from "../pages/ProductListPage";
import ProductsPage from "../pages/ProductsPage";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import ResetPassword from "../pages/Reset-password";
import SearchPage from "../pages/SearchPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProductPage from "../pages/UploadProductPage";
import BrandProducts from "../pages/BrandProducts";
import BannerUpload from "../pages/BannerUpload";
import OrderMange from "../pages/OrderMange";
import EmailVerify from "../pages/EmailVerify";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "otp-verification",
        element: <OtpVerify />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: 'verify-email',
        element: <EmailVerify />,
      },
      {
        path: "user",
        element: <Dashboard />,
        children: [
          {
            path:'',
            element: <UserMenuMobile />,
          }
        ],
        
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "myorders",
            element: <MyOrder />,
          },
          {
            path: "address",
            element: <Address />,
          },
          {
            path: "banner",
            element: (
              <AdminPermission>
                <BannerUpload />
              </AdminPermission>
            ),
          },
          {
            path: "order-management",
            element: (
              <AdminPermission>
                <OrderMange />
              </AdminPermission>
            ),
          },
          {
            path: "category",
            element: (
              <AdminPermission>
                <CategoryPage />
              </AdminPermission>
            ),
          },
          {
            path: "subcategory",
            element: (
              <AdminPermission>
                <SubCategoryPage />
              </AdminPermission>
            ),
          },
          {
            path: "brand",
            element: (
              <AdminPermission>
                <Brand />
              </AdminPermission>
            ),
          },
          {
            path: "upload-product",
            element: (
              <AdminPermission>
                <UploadProductPage />
              </AdminPermission>
            ),
          },
          {
            path: "product",
            element: (
              <AdminPermission>
                <ProductsPage />
              </AdminPermission>
            ),
          },
        ],
      },
      // frontend
      {
        path: "cn/:category",
        children: [
          {
            path: ":subcategory",
            element: <ProductListPage />,
          },
        ],
      },
      {
        path: "product/:product",
        element: <ProductDisplayPage />,
      },
      {
        path: "brand/:brand",
        element: <BrandProducts />,
      },
      {
        path: "cart",
        element: <CartMobile />,
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "order-success",
        element: <OrderSuccess />,
      },
      {
        path: "order-cancel",
        element: <OrderCancel />,
      },
    ],
  },
]);

export default router;
