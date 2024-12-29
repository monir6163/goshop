/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaCloudUploadAlt, FaPlus, FaTrash } from "react-icons/fa";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import apiSummary from "../../api/api";
import { Axios } from "../../api/axios";
import { setAllBrand } from "../../redux/productSlice";
import { axiosToastError } from "../../utils/axiosToastError";
import { uploadImage, uploadSingleImage } from "../../utils/UploadImage";
import AddMoreInfo from "./AddMoreInfo";
import UploadBrandModal from "./UploadBrandModal";
import ViewImage from "./ViewImage";

export default function UploadProducts() {
  const [data, setData] = useState({
    name: "",
    thumbnail: "",
    image: [],
    category_id: [],
    subcategory_id: [],
    brand_id: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_info: {},
  });
  const [imgLoading, setImgLoading] = useState(false);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openBrandModal, setOpenBrandModal] = useState(false);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [selectBrand, setSelectBrand] = useState("");
  const [viewImage, setViewImage] = useState("");
  const [viewThumbnail, setViewThumbnail] = useState("");
  const [moreInfoValue, setMoreInfoValue] = useState("");
  const [openMoreInfoModal, setOpenMoreInfoModal] = useState(false);
  const allCategory = useSelector((state) => state.product.allCategory);
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const allBrand = useSelector((state) => state.product.allBrand);
  const dispatch = useDispatch();

  const fetchBrands = async () => {
    try {
      const { data: bres } = await Axios({
        ...apiSummary.getBrands,
      });
      if (bres.success) {
        dispatch(setAllBrand(bres.data));
      }
    } catch (error) {
      axiosToastError(error);
    }
  };
  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAddMoreInfo = () => {
    setData((prev) => {
      return {
        ...prev,
        more_info: {
          ...prev.more_info,
          [moreInfoValue]: "",
        },
      };
    });
    setMoreInfoValue("");
    setOpenMoreInfoModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleUploadMoreImage = async (e) => {
    try {
      setImgLoading(true);
      const files = Array.from(e.target.files);
      if (!files.length) return;
      const uploadedImages = await uploadImage(files);

      uploadedImages?.data?.data?.forEach((img) => {
        setData((prev) => {
          return {
            ...prev,
            image: [...prev.image, img?.url],
          };
        });
      });
    } catch (error) {
      axiosToastError(error);
    } finally {
      setImgLoading(false);
    }
  };
  const handleUploadThumbnailImage = async (e) => {
    setThumbnailLoading(true);
    const file = e.target.files[0];
    if (!file) return;
    const { data } = await uploadSingleImage(file);
    setData((prev) => ({ ...prev, thumbnail: data.data.url }));
    if (data?.data?.url) {
      toast.success(data.message);
      setThumbnailLoading(false);
    }
    // axiosToastError(data);
  };

  // add product
  const handleProductSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { data: res } = await Axios({
        ...apiSummary.createProduct,
        data: data,
      });
      if (res.success) {
        toast.success(res.message);
        setData({
          name: "",
          thumbnail: '',
          image: [],
          category_id: [],
          subcategory_id: [],
          brand_id: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_info: {},
        });
      }
    } catch (error) {
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Upload Products</h2>
      </div>
      <div className="grid py-4 lg:p-4">
        <form onSubmit={handleProductSubmit} className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="name">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="bg-blue-50 p-2 outline-none border w-full focus:border-green-600 rounded"
              value={data.name}
              placeholder="Enter product name"
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="description">
              Description <span className="text-red-600">*</span>
            </label>

            <textarea
              type="text"
              id="description"
              name="description"
              rows={3}
              className="bg-blue-50 p-2 outline-none border w-full focus:border-green-600 rounded
              resize-none"
              value={data.description}
              placeholder="Enter product description"
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <p>
              Thumbnail Image <span className="text-red-600">*</span>
            </p>
            <div>
              <div className="bg-blue-50 h-24 rounded border flex items-center justify-center">
                {thumbnailLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                ) : (
                  <>
                    <label className="text-center flex items-center justify-center flex-col cursor-pointer hover:bg-blue-100 p-2 rounded">
                      <FaCloudUploadAlt size={35} className="" />
                      <p className="text-sm">Upload Thumbnail</p>
                      <input
                        type="file"
                        name="thumbnail"
                        id="thumbnail"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUploadThumbnailImage}
                      />
                    </label>
                  </>
                )}
              </div>
              {/* preview Image */}
              {data?.thumbnail && (<div className="flex lg:flex-row flex-col gap-2">
                <div className="mt-1 h-20 w-20 bg-blue-50 rounded border cursor-pointer relative group">
                    <img
                      src={data?.thumbnail}
                      alt="product"
                      className="h-full w-full object-cover"
                      onClick={() => setViewThumbnail(data?.thumbnail)}
                    />
                      <div>
                        <button
                          onClick={() => {
                            setData((prev)=>{
                              return {
                                ...prev,
                                thumbnail: '',
                              }
                            })
                          }}
                          className="absolute bottom-0 right-0 p-1 bg-red-500 rounded hidden group-hover:block"
                        >
                          <FaTrash size={14} className="text-white" />
                        </button>
                      </div>
                </div>
              </div>)}
            </div>
          </div>
          <div className="grid gap-1">
            <p>
              More Image <span className="text-red-600">*</span>
            </p>
            <div>
              <div className="bg-blue-50 h-24 rounded border flex items-center justify-center">
                {imgLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                ) : (
                  <>
                    <label className="text-center flex items-center justify-center flex-col cursor-pointer hover:bg-blue-100 p-2 rounded">
                      <FaCloudUploadAlt size={35} className="" />
                      <p className="text-sm">Upload Image</p>
                      <input
                        type="file"
                        name="image"
                        id="image"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleUploadMoreImage}
                      />
                    </label>
                  </>
                )}
              </div>
              {/* preview Image */}
              <div className="flex lg:flex-row flex-col gap-2">
                {data?.image?.map((img, index) => {
                  return (
                    <div
                      key={index}
                      className="mt-1 h-20 w-20 bg-blue-50 rounded border cursor-pointer relative group"
                    >
                      <img
                        src={img}
                        alt="product"
                        className="h-full w-full object-cover"
                        onClick={() => setViewImage(img)}
                      />
                      <div>
                        <button
                          onClick={() => {
                            const newImg = data.image.filter(
                              (image) => image !== img
                            );
                            setData((prev) => {
                              return {
                                ...prev,
                                image: newImg,
                              };
                            });
                          }}
                          className="absolute bottom-0 right-0 p-1 bg-red-500 rounded hidden group-hover:block"
                        >
                          <FaTrash size={14} className="text-white" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-1">
            <div className="grid gap-1">
              <label htmlFor="category_id">
                Category <span className="text-red-600">*</span>
              </label>
              <div>
                <select
                  name="category_id"
                  id="category_id"
                  value={selectCategory}
                  className="bg-blue-50 p-2 outline-none border w-full focus:border-green-600 rounded"
                  onChange={(e) => {
                    const { value } = e.target;
                    if (!value) return;
                    // check if category already exist
                    const exist = data.category_id.find(
                      (cat) => cat._id === value
                    );
                    if (exist) return;
                    const catF = allCategory.find((cat) => cat._id === value);

                    setData((prev) => {
                      return {
                        ...prev,
                        category_id: [...prev.category_id, catF],
                      };
                    });
                    setSelectCategory("");
                  }}
                >
                  <option value="">Select Category</option>
                  {allCategory?.map((cat, index) => (
                    <option key={index} value={cat?._id}>
                      {cat?.name}
                    </option>
                  ))}
                </select>
                {/* Selected Category */}
                <div className="flex w-full flex-wrap gap-2 overflow-x-auto">
                  {data.category_id?.map((cat, index) => (
                    <div key={index}>
                      {cat?.name ? (
                        <div className="bg-blue-50 p-1 rounded mt-1 gap-1 flex items-center justify-between">
                          <p className="text-sm">{cat?.name}</p>
                          <div
                            onClick={() => {
                              const newCat = data.category_id.filter(
                                (category) => category._id !== cat._id
                              );
                              setData((prev) => {
                                return {
                                  ...prev,
                                  category_id: newCat,
                                };
                              });
                            }}
                            className="bg-red-500 p-1 rounded cursor-pointer hover:bg-red-600"
                          >
                            <FaTrash size={10} className="text-white" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-1">
              <label htmlFor="subcategory_id">
                Sub Category <span className="text-red-600">*</span>
              </label>
              <div>
                <select
                  name="subcategory_id"
                  id="subcategory_id"
                  value={selectSubCategory}
                  className="bg-blue-50 p-2 outline-none border w-full focus:border-green-600 rounded"
                  onChange={(e) => {
                    const { value } = e.target;
                    if (!value) return;
                    // check if sub category already exist
                    const exist = data.subcategory_id.find(
                      (cat) => cat._id === value
                    );
                    if (exist) return;
                    const catSub = allSubCategory.find(
                      (scat) => scat._id === value
                    );
                    setData((prev) => {
                      return {
                        ...prev,
                        subcategory_id: [...prev.subcategory_id, catSub],
                      };
                    });
                    setSelectSubCategory("");
                  }}
                >
                  <option value="">Select Category</option>
                  {allSubCategory?.map((scat, index) => (
                    <option key={index} value={scat?._id}>
                      {scat?.name}
                    </option>
                  ))}
                </select>
                {/* Selected Category */}
                <div className="flex w-full flex-wrap gap-2 overflow-x-auto">
                  {data.subcategory_id?.map((scat, index) => (
                    <div key={index}>
                      {scat?.name ? (
                        <div className="bg-blue-50 p-1 rounded mt-1 gap-1 flex items-center justify-between">
                          <p className="text-sm">{scat?.name}</p>
                          <div
                            onClick={() => {
                              const newCat = data.subcategory_id.filter(
                                (subcat) => subcat._id !== scat._id
                              );
                              setData((prev) => {
                                return {
                                  ...prev,
                                  subcategory_id: newCat,
                                };
                              });
                            }}
                            className="bg-red-500 p-1 rounded cursor-pointer hover:bg-red-600"
                          >
                            <FaTrash size={10} className="text-white" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor="brand_id">
                  Product Brand <span className="text-red-600">*</span>
                </label>
                <div
                  onClick={() => setOpenBrandModal(true)}
                  className="cursor-pointer bg-green-600 text-white p-1 rounded"
                >
                  Add Brand
                </div>
                <div />
              </div>
              <div>
                <select
                  name="brand_id"
                  id="brand_id"
                  value={selectBrand}
                  className="bg-blue-50 p-2 outline-none border w-full focus:border-green-600 rounded"
                  onChange={(e) => {
                    const { value } = e.target;
                    if (!value) return;
                    // check if brand already exist
                    const exist = data.brand_id.find((b) => b._id === value);
                    if (exist) return;
                    const b = allBrand.find((b) => b._id === value);
                    setData((prev) => {
                      return {
                        ...prev,
                        brand_id: [...prev.brand_id, b],
                      };
                    });
                    setSelectBrand("");
                  }}
                >
                  <option value="">Select Brand</option>
                  {allBrand?.map((b, index) => (
                    <option key={index} value={b?._id}>
                      {b?.name}
                    </option>
                  ))}
                </select>
                {/* Selected Category */}
                <div className="flex w-full flex-wrap gap-2 overflow-x-auto">
                  {data?.brand_id?.map((b, index) => (
                    <div key={index}>
                      {b?.name ? (
                        <div className="bg-blue-50 p-1 rounded mt-1 gap-1 flex items-center justify-between">
                          <p className="text-sm">{b?.name}</p>
                          <div
                            onClick={() => {
                              const newCat = data.brand_id.filter(
                                (pb) => pb._id !== b._id
                              );
                              setData((prev) => {
                                return {
                                  ...prev,
                                  brand_id: newCat,
                                };
                              });
                            }}
                            className="bg-red-500 p-1 rounded cursor-pointer hover:bg-red-600"
                          >
                            <FaTrash size={10} className="text-white" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1">
            <div className="grid gap-1">
              <label htmlFor="unit">
                Product unit <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                className="bg-blue-50 p-2 outline-none border w-full focus:border-green-600 rounded"
                value={data.unit}
                placeholder="Enter product unit"
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="stock">
                Product Stock <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                className="bg-blue-50 p-2 outline-none border w-full focus:border-green-600 rounded"
                value={data.stock}
                placeholder="Enter product stock"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1">
            <div className="grid gap-1">
              <label htmlFor="price">
                Product Price <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="bg-blue-50 p-2 outline-none border w-full focus:border-green-600 rounded"
                value={data.price}
                placeholder="Enter product price"
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="discount">
                Product Discount <span className="text-red-600">(if have)</span>
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                className="bg-blue-50 p-2 outline-none border w-full focus:border-green-600 rounded"
                value={data.discount}
                placeholder="Enter product discount"
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            {Object?.keys(data?.more_info)?.map((key, index) => {
              return (
                <div key={index} className="relative grid gap-1">
                  <label htmlFor={key}>{key}</label>
                  <div className="relative">
                    <textarea
                      type="text"
                      id={key}
                      name={key}
                      value={data?.more_info[key]}
                      className="bg-blue-50 p-2 outline-none border w-full focus:border-green-600 rounded"
                      placeholder={`Enter ${key}`}
                      onChange={(e) => {
                        const { value } = e.target;
                        setData((prev) => {
                          return {
                            ...prev,
                            more_info: {
                              ...prev.more_info,
                              [key]: value,
                            },
                          };
                        });
                      }}
                    />
                    {/* Delete Icon */}
                    <FaTrash
                      size={14}
                      className="absolute -top-2 right-2 text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => {
                        setData((prev) => {
                          const obj = { ...prev.more_info };
                          const keys = Object.keys(obj);
                          delete obj[keys[index]];
                          return {
                            ...prev,
                            more_info: obj,
                          };
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-1">
            <div
              onClick={() => setOpenMoreInfoModal(true)}
              className="border border-green-400 hover:text-white p-2 cursor-pointer text-center flex items-center rounded w-36 hover:bg-green-800"
            >
              Add More Field <FaPlus size={10} className="ml-1" />
            </div>
          </div>
          <div className="grid gap-1">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white p-2 cursor-pointer text-center rounded hover:bg-green-800"
            >
              {loading ? "Loading..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
      {/* Image Preview Modal */}
      {viewImage && (
        <ViewImage url={viewImage} close={() => setViewImage("")} />
      )}
      {viewThumbnail && (
        <ViewImage url={viewThumbnail} close={()=> setViewThumbnail("")}/>
      )}
      {/* More Info Modal */}

      {openMoreInfoModal && (
        <AddMoreInfo
          close={() => setOpenMoreInfoModal(false)}
          value={moreInfoValue}
          onchange={(e) => setMoreInfoValue(e.target.value)}
          submit={handleAddMoreInfo}
        />
      )}

      {/* Brand Modal */}
      {openBrandModal && (
        <UploadBrandModal
          close={() => setOpenBrandModal(false)}
          fetchBrands={fetchBrands}
        />
      )}
    </>
  );
}
