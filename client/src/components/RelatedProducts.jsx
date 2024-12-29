/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { axiosToastError } from "../utils/axiosToastError";
import { Axios } from "../api/axios";
import apiSummary from "../api/api";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

/* eslint-disable react/prop-types */
export default function RelatedProducts({category_id, subCategory_id, brand_id}) {
    const [products, setProducts] = useState([]);
     const containerRef = useRef();
     const [loading, setLoading] = useState(false);
      const loadingCardNumber = new Array(6).fill(null);
    const catId = category_id[0]?._id;
    const subCatId = subCategory_id[0]?._id;
    const brandId = brand_id[0]?._id;

    const featchRelatedProducts = async () => {
        try {
            setLoading(true);
            const res = await Axios({
                ...apiSummary.getRelatedProducts,
                data: {
                    category_id: catId,
                    subcategory_id: subCatId,
                    brand_id: brandId,
                },
            });
            if (res.data.success) {
                setProducts(res.data.data);
            }
        } catch (error) {
            axiosToastError(error);
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(catId || subCatId || brandId) {
            featchRelatedProducts();
        }
    }, [catId, subCatId, brandId]);

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200;
      };
    
      const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200;
      };
  return (
    <div>
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
  )
}
