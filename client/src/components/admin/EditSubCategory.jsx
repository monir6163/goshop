/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import apiSummary from "../../api/api";
import { Axios } from "../../api/axios";
import { uploadSingleImage } from "../../utils/UploadImage";

export default function EditSubCategory({
  close,
  editData,
  categories,
  fetchSubCategories,
}) {
  const [data, setData] = useState({
    name: editData?.name,
    image: editData?.image,
    category: editData?.category_id || [],
    description: editData?.description,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [subCatLoading, setSubCatLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setData({
      name: editData?.name,
      image: editData?.image,
      category: editData?.category_id || [],
      description: editData?.description,
    });
  }, [editData]);

  const handleSubCatImage = async (e) => {
    setSubCatLoading(true);
    const file = e.target.files[0];
    if (!file) return;
    const { data } = await uploadSingleImage(file);
    setData((prev) => ({ ...prev, image: data.data.url }));
    if (data?.data?.url) {
      toast.success(data.message);
      setSubCatLoading(false);
    }
    // axiosToastError(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data: res } = await Axios({
        ...apiSummary.updateSubCategory,
        url: apiSummary.updateSubCategory.url.replace(":id", editData._id),
        data: data,
      });
      if (res.success) {
        toast.success(res.message);
        fetchSubCategories();
        close();
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="fixed top-0 left-0 right-0 bottom-0 bg-neutral-800 z-50 bg-opacity-70 flex justify-center items-center p-4">
      <div className="bg-white max-w-2xl w-full p-4 rounded">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Edit SubCategory</h2>
          <button onClick={close} className="w-fit block ml-auto animate-pulse">
            <IoClose size={24} />
          </button>
        </div>
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mt-2">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="subcat">
              Sub Category Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="subcat"
              value={data.name}
              onChange={handleChange}
              placeholder="Sub Category Name"
              className="border p-1 py-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm pb-2 pt-2">
              SubCategory Image <span className="text-red-600">*</span>
            </label>
            <div className="flex flex-col items-center lg:flex-row lg:gap-4">
              <div className="border bg-blue-50 h-10 w-10 lg:w-36 lg:h-20 rounded-full lg:rounded flex items-center justify-center">
                {subCatLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                ) : (
                  <>
                    {data.image ? (
                      <img
                        src={data.image}
                        alt={data.name}
                        className="h-full w-full object-scale-down rounded-full"
                      />
                    ) : (
                      <p className="text-sm text-neutral-500">No Image</p>
                    )}
                  </>
                )}
              </div>
              {!subCatLoading && (
                <label htmlFor="category_image">
                  <div
                    className={`${
                      !data.name ? "bg-gray-300" : "bg-green-600"
                    } px-2 py-2 rounded text-white cursor-pointer`}
                  >
                    Upload Image
                  </div>
                  <input
                    disabled={!data.name}
                    type="file"
                    id="category_image"
                    name="image"
                    onChange={handleSubCatImage}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm pb-2 pt-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              id="description"
              value={data.description}
              onChange={handleChange}
              placeholder="Write Seo Friendly Description"
              className="w-full border rounded px-2 py-2 outline-none focus-within:border-green-600"
            ></textarea>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <label htmlFor="cat">
              Category Name <span className="text-red-600">*</span>
            </label>

            <div className="flex w-full flex-wrap gap-2 overflow-x-auto">
              {data.category.map((cat) => (
                <div key={cat?._id}>
                  {cat?.name ? (
                    <div className="bg-green-600 text-white p-1 rounded">
                      {cat?.name}
                      <button
                        onClick={() => {
                          setData((prev) => {
                            return {
                              ...prev,
                              category: prev.category.filter(
                                (category) => category?._id !== cat?._id
                              ),
                            };
                          });
                        }}
                        className="animate-pulse hover:text-red-600"
                      >
                        <IoClose size={16} />
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <select
              name="category"
              id="cat"
              className="border p-1 py-2 rounded"
              onChange={(e) => {
                const value = e.target.value;

                const catIndex = categories.find((cat) => cat?._id === value);
                setData((prev) => {
                  return { ...prev, category: [...prev.category, catIndex] };
                });
              }}
            >
              <option value="">Select Category</option>
              {categories?.map((cat) => (
                <option key={cat?._id} value={cat?._id}>
                  {cat?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {loading ? "Loading..." : "Update SubCategory"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
