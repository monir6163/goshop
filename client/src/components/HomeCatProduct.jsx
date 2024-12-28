/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
// import { setProducts } from "../redux/productSlice";
import { axiosToastError } from "../utils/axiosToastError";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";

export default function HomeCatProduct({ id, name, slug }) {
  // const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const containerRef = useRef();
  const loadingCardNumber = new Array(6).fill(null);
  // const products = useSelector((state) => state.product.products);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await Axios({
        ...apiSummary.getCategoryProducts,
        url: apiSummary.getCategoryProducts.url.replace(":id", id),
      });
      if (data?.success) {
        // dispatch(setProducts(data?.products));
        setProducts(data?.products);
      }
    } catch (error) {
      axiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchProducts();
    }
  }, [id]);

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 200;
  };

  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 200;
  };
  const handleRedirect = (id, slug) => {
    const subCat = allSubCategory?.find((sub) => {
      const findCat = sub?.category_id.some((c) => {
        return c._id === id;
      });
      return findCat ? true : null;
    });
    const url = `/cn/${slug}-${id}/${subCat?.slug}-${subCat?._id}`;
    return url;
  };
  const clickUrl = handleRedirect(id, slug);
  return (
    <div className="container mx-auto px-4 my-2 pt-4">
      {products.length > 0 && (
        <div className="flex justify-between items-center pb-4">
          <h2 className="font-semibold text-lg md:text-2xl">{name}</h2>
          <Link
            to={clickUrl}
            className="text-sm md:text-base bg-green-900 hover:bg-green-800 px-3 py-1 rounded text-white"
          >
            <span>
              See All <FaAngleRight className="w-4 h-4 inline-block ml-1" />
            </span>
          </Link>
        </div>
      )}

      <div className="relative flex items-center">
        <div
          className=" flex gap-2 lg:gap-3 container mx-auto overflow-x-scroll scrollbar-none scroll-smooth"
          ref={containerRef}
        >
          {loading &&
            loadingCardNumber.map((_, index) => {
              return (
                <CardLoading key={"CategorywiseProductDisplay123" + index} />
              );
            })}

          {products.length > 0 &&
            products?.map((p, index) => {
              return <CardProduct data={p} key={p._id + index} />;
            })}
        </div>
        {products.length > 0 && (
          <div className="w-full left-0 right-0 container mx-auto  px-2  absolute hidden lg:flex justify-between">
            <button
              onClick={handleScrollLeft}
              className="z-10 relative hover:text-green-900 bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={handleScrollRight}
              className="z-10 relative hover:text-green-900  bg-white hover:bg-gray-100 shadow-lg p-2 text-lg rounded-full"
            >
              <FaAngleRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
