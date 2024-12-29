export const baseUrl = import.meta.env.VITE_SERVER_URL;

const apiSummary = {
  register: {
    url: "/user/register",
    method: "POST",
  },
  login: {
    url: "/user/login",
    method: "POST",
  },
  forgotPassword: {
    url: "/user/forgot-password",
    method: "POST",
  },
  verifyOtp: {
    url: "/user/verify-otp",
    method: "POST",
  },
  resetPassword: {
    url: "/user/reset-password",
    method: "POST",
  },
  refreshToken: {
    url: "/user/refresh-token",
    method: "POST",
  },
  userDetails: {
    url: "/user/user-details",
    method: "GET",
  },
  updateProfile: {
    url: "/user/update",
    method: "PUT",
  },
  updatePassword: {
    url: "/user/update-password",
    method: "PUT",
  },
  updateAvater: {
    url: "/user/upload-avater",
    method: "PUT",
  },
  logout: {
    url: "/user/logout",
    method: "POST",
  },

  // Image Upload API
  uploadImage: {
    url: "/image/upload",
    method: "POST",
  },
  uploadSingleImage: {
    url: "/image/upload/single",
    method: "POST",
  },

  // Category API
  createCategory: {
    url: "/category/create",
    method: "POST",
  },
  getCategories: {
    url: "/category/get-categories",
    method: "GET",
  },
  getCategoryAdmin: {
    url: "/category/get-category-admin",
    method: "GET",
  },
  getAllCategories: {
    url: "/category/get-categories-client",
    method: "GET",
  },
  updateCategory: {
    url: "/category/update",
    method: "PUT",
  },
  deleteCategory: {
    url: "/category/delete/:id",
    method: "DELETE",
  },
  updateCategoryShowOnHome: {
    url: "/category/update-showonHome",
    method: "POST",
  },

  // SubCategory API
  createSubCategory: {
    url: "/subcategory/create",
    method: "POST",
  },
  getSubCategories: {
    url: "/subcategory/get-subCategories",
    method: "GET",
  },
  getSubCatAdmin: {
    url: "/subcategory/get-subcategory-admin",
    method: "GET",
  },
  updateSubCategory: {
    url: "/subcategory/update/:id",
    method: "PUT",
  },
  deleteSubCategory: {
    url: "/subcategory/delete/:id",
    method: "DELETE",
  },

  // Brand API
  createBrand: {
    url: "/brand/create",
    method: "POST",
  },
  getBrands: {
    url: "/brand/all-brands",
    method: "GET",
  },
  getBrandsAdmin: {
    url: "/brand/get-brands-admin",
    method: "GET",
  },
  updateBrand: {
    url: "/brand/update/:id",
    method: "PUT",
  },
  deleteBrand: {
    url: "/brand/delete/:id",
    method: "DELETE",
  },
  getBrandProducts: {
    url: "/brand/get-brand-products",
    method: "GET",
  },

  // Product API
  createProduct: {
    url: "/product/create",
    method: "POST",
  },
  getProducts: {
    url: "/product/get-products",
    method: "GET",
  },

  // get category products home page
  getCategoryProducts: {
    url: "/product/category-product/:id",
    method: "GET",
  },

  // get product by category and subcategory
  getProductByCategoryAndSubCat: {
    url: "/product/get-products-by-category",
    method: "POST",
  },

  //get product by id
  getProductById: {
    url: "/product/get-product-by-id/:id",
    method: "GET",
  },

  // update product details by id
  updateProduct: {
    url: "/product/update-product/:id",
    method: "PUT",
  },

  // delete product by id
  deleteProduct: {
    url: "/product/delete-product/:id",
    method: "DELETE",
  },

  // search product query string
  searchProduct: {
    url: "/product/search-product",
    method: "GET",
  },

  updateProductStatus: {
    url: "/product//update-product-status",
    method: "POST",
  },

  // Cart API
  addToCart: {
    url: "/cart/add-to-cart",
    method: "POST",
  },
  getCartItems: {
    url: "/cart/get-cart-items",
    method: "GET",
  },
  updateCartItem: {
    url: "/cart/update-cart-item",
    method: "PUT",
  },
  deleteCartItem: {
    url: "/cart/delete-cart-item/:id",
    method: "DELETE",
  },

  // Address API
  storeAddress: {
    url: "/address/store-address",
    method: "POST",
  },
  getAllAddress: {
    url: "/address/get-all-address",
    method: "GET",
  },
  updateAddress: {
    url: "/address/update-address",
    method: "PUT",
  },
  deleteAddress: {
    url: "/address/delete-address/:id",
    method: "DELETE",
  },

  // Order API
  createCashOrder: {
    url: "/order/cash-on-delivery",
    method: "POST",
  },
  createStripeOrder:{
    url:"order/stripe-payment",
    method:"POST",
  },
  getAllOrders: {
    url: "/order/get-all-orders",
    method: "GET",
  }
};

export default apiSummary;
