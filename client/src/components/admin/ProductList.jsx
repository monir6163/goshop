/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import apiSummary from "../../api/api";
import { Axios } from "../../api/axios";
import { axiosToastError } from "../../utils/axiosToastError";
import LoadingSpinner from "../../utils/LoadingSpinner";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const fetchProducts = async () => {
    try {
      const { data } = await Axios({
        ...apiSummary.getProducts,
        url: `${apiSummary.getProducts.url}?page=${page}&limit=18&search=${search}`,
      });
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pages);
      }
    } catch (error) {
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [page]);
  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };
  const handleNext = () => {
    if (page !== totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSearch = async (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    let flag = true;
    const interval = setTimeout(() => {
      if (flag) {
        fetchProducts();
        flag = false;
      }
    }, 300);
    return () => {
      clearTimeout(interval);
    };
  }, [search]);
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Product List- ({products?.length})</h2>
        <div>
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Search Product"
            className="p-1 border outline-none focus-within:border-green-500 rounded"
          />
        </div>
      </div>
      {!products[0] && (
        <div className="p-4 bg-white shadow-md mt-2">
          <p className="text-center font-semibold">No Products Found</p>
        </div>
      )}
      <div className="">
        <div className="min-h-[55vh]">
          <div className="py-2 lg:m-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {products?.map((product) => (
              <ProductCard
                key={product._id}
                data={product}
                fetchProducts={fetchProducts}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between my-4 px-2">
          <button
            onClick={handlePrevious}
            className="border border-green-500 rounded px-4 py-1 hover:text-white hover:bg-green-600"
          >
            Previous
          </button>
          <button className=" bg-slate-100">
            {page}/{totalPages}
          </button>
          <button
            onClick={handleNext}
            className="border border-green-500 rounded px-4 py-1 hover:text-white hover:bg-green-600"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
