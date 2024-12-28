/* eslint-disable react/prop-types */
import { useState } from "react";
import { toast } from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import apiSummary from "../../api/api";
import { Axios } from "../../api/axios";
import { uploadSingleImage } from "../../utils/UploadImage";

export default function EditCategory({
  close,
  fetchCategories,
  data: editData,
}) {
  const [data, setData] = useState({
    _id: editData._id,
    name: editData.name,
    image: editData.image,
    description: editData.description,
  });
  const [catLoading, setCatLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data: res } = await Axios({
        ...apiSummary.updateCategory,
        data: data,
      });
      if (res.success) {
        toast.success(res.message);
        setSubmitting(false);
        close();
        fetchCategories();
      }
    } catch (error) {
      setError(error.response?.data?.message);
    } finally {
      setData({
        name: "",
        image: "",
        description: "",
      });
      setSubmitting(false);
    }
  };
  const handleUploadCatImage = async (e) => {
    setCatLoading(true);
    const file = e.target.files[0];
    if (!file) return;
    const { data } = await uploadSingleImage(file);
    setData((prev) => ({ ...prev, image: data.data.url }));
    if (data?.data?.url) {
      toast.success(data.message);
      setCatLoading(false);
    }
    // axiosToastError(data);
  };
  return (
    <section className="fixed top-0 left-0 bottom-0 right-0 bg-neutral-800 bg-opacity-50 p-4 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-full p-4 rounded">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Edit Category</h2>
          <button onClick={close} className="w-fit block ml-auto animate-pulse">
            <IoClose size={24} />
          </button>
        </div>
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mt-2">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="py-5">
          <div>
            <label htmlFor="name" className="block text-sm pb-2">
              Category Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Category Name"
              className="w-full border rounded px-2 py-2 outline-none focus-within:border-green-600"
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm pb-2 pt-2">
              Category Image <span className="text-red-600">*</span>
            </label>
            <div className="flex flex-col items-center lg:flex-row lg:gap-4">
              <div className="border bg-blue-50 h-10 w-10 lg:w-36 lg:h-20 rounded-full lg:rounded flex items-center justify-center">
                {catLoading ? (
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
              {!catLoading && (
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
                    onChange={handleUploadCatImage}
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
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {submitting ? "Submitting..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
