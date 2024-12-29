/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import apiSummary from "../api/api";
import { Axios } from "../api/axios";
import BestPrice from "../assets/Best_Prices_Offers.png";
import SuperFastD from "../assets/minute_delivery.png";
import WideAsset from "../assets/Wide-Assortment.jpg";
import AddToCartButton from "../components/AddToCartButton";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import Loading from "../utils/Loading";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import RelatedProducts from "../components/RelatedProducts";
export default function ProductDisplayPage() {
  const [productData, setProductData] = useState({
    name: "",
    image: [],
    subCategory_id: [],
    category_id: [],
    brand_id: [],
  });
  const [thumbnail, setThumbnail] = useState(0);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const imgContainer = useRef(null);
  const productId = params?.product?.split("-")?.slice(-1)[0];
  const fetchProductById = async () => {
    try {
      setLoading(true);
      const { data } = await Axios({
        ...apiSummary.getProductById,
        url: apiSummary.getProductById.url.replace(":id", productId),
      });
      if (data?.success) {
        setProductData(data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductById();
  }, [params]);

  const handleNext = () => {
    imgContainer.current.scrollLeft += 100;
  };
  const handlePrev = () => {
    imgContainer.current.scrollLeft -= 100;
  };

  // top scroll
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productData]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
            <section className="container mx-auto p-4 grid md:grid-cols-2 lg:grid-cols-2">
            {/* product image gellary */}
            <div className="order-1">
              {productData?.image?.length > 0 && (
                <>
                  <div className="bg-white md:min-h-[65vh] md:max-h-[65vh] lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full">
                    <img
                      src={productData?.image[thumbnail]}
                      alt={productData?.name}
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-3 my-2">
                    {productData?.image?.map((img, index) => {
                      return (
                        <div
                          key={index}
                          className={`bg-slate-200 w-3 h-3 md:w-5 md:h-5 lg:w-5 lg:h-5 rounded-full cursor-pointer ${
                            thumbnail === index
                              ? "bg-slate-300 border-2 border-slate-400"
                              : ""
                          }`}
                        ></div>
                      );
                    })}
                  </div>
                  <div className="grid relative">
                    <div
                      ref={imgContainer}
                      className="flex relative z-10 gap-4 w-full scroll-smooth overflow-x-auto"
                    >
                      {productData?.image?.map((img, index) => {
                        return (
                          <div
                            key={index}
                            className="w-20 h-20 min-h-20 min-w-20 shadow-md rounded cursor-pointer"
                          >
                            <img
                              src={img}
                              alt=""
                              onClick={() => setThumbnail(index)}
                              className={`w-full h-full object-scale-down rounded ${
                                thumbnail === index
                                  ? "border-2 border-green-300"
                                  : ""
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                    {productData?.image?.length > 7 && (
                      <div className="hidden absolute -ml-3 md:flex lg:flex justify-between h-full w-full items-center">
                        {thumbnail === 0 ? (
                          <button
                            disabled
                            onClick={handlePrev}
                            className="bg-white opacity-0 relative z-10 p-2 rounded-full shadow-lg hover:bg-gray-100"
                          >
                            <FaArrowLeft />
                          </button>
                        ) : (
                          <button
                            onClick={handlePrev}
                            className="bg-white relative z-10 p-2 rounded-full shadow-lg hover:bg-gray-100"
                          >
                            <FaArrowLeft />
                          </button>
                        )}
                        {thumbnail < productData?.image?.length - 1 && (
                          <button
                            onClick={handleNext}
                            className="bg-white relative z-10 p-2 rounded-full shadow-lg hover:bg-gray-100"
                          >
                            <FaArrowRight />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {/* divider */}
                  <div className="my-2 border-b border-gray-200"></div>
                </>
              )}
            </div>

            {/* product details */}
            <div className="p-4 order-2 lg:pl-7 text-base lg:text-lg">
              {/* Home/SubcatName/product name breadcumb */}
              <div className="hidden lg:block text-ellipsis line-clamp-1 font-thin text-xs mb-2">
                <Link to="/" className="text-black hover:text-green-600">
                  Home
                </Link>
                <span className="mx-1">/</span>
                <Link
                  to={
                    productData?.category_id &&
                    `/cn/${productData?.category_id[0]?.slug}-${productData?.category_id[0]?._id}/${productData?.subCategory_id[0]?.slug}-${productData?.subCategory_id[0]?._id}`
                  }
                  className="text-black hover:text-green-600"
                >
                  {productData?.subCategory_id &&
                    productData?.subCategory_id[0]?.name}
                </Link>
                <span className="mx-1">/</span>
                <span className="text-slate-400 ">{productData?.name}</span>
              </div>
              <p className="bg-green-200 w-fit px-2 mb-2 rounded-full text-xs">
                {productData?.discount ? `${productData?.discount}% off` : ""}
              </p>
              <h2 className="text-lg font-semibold lg:text-2xl mb-2">
                {productData?.name}
              </h2>
              <div className="flex gap-5 items-center">
                <p className="bg-green-200 w-fit px-2 rounded text-sm">
                  {productData?.unit}
                </p>
                <p className="text-xs bg-green-200 px-2 w-fit rounded">
                  {productData?.stock
                    ? `In stock (${productData?.stock})`
                    : "Out of stock"}
                </p>
              </div>
              {/* brand name with link */}
              <div className="my-2 w-fit">
                <Link to={`/brand/${productData?.brand_id[0]?.slug}-${productData?.brand_id[0]?._id}`}
                  className="text-green-900 hover:text-green-800"
                >
                  <p className="text-sm font-semibold">
                    View All By {productData?.brand_id[0]?.name} 
                    <IoMdArrowDropright size={16} className="inline" />
                  </p>
                </Link>
              </div>
              {/* divider */}
              <div className="my-2 border-b border-gray-200"></div>
              <div className="flex items-center gap-2">
                <p className="text-lg text-gray-500">Price:</p>
                <p className="text-base font-semibold text-green-800">
                  {productData?.discount
                    ? DisplayPriceInRupees(
                        pricewithDiscount(
                          productData?.price,
                          productData?.discount
                        )
                      )
                    : DisplayPriceInRupees(productData?.price)}
                </p>
                <div className="text-sm text-gray-500 line-through">
                  {productData?.discount
                    ? DisplayPriceInRupees(productData?.price)
                    : ""}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">(Inclusive of all taxes)</p>
              </div>
              <div className="my-4">
                {productData?.stock == 0 ? (
                  <p className="text-red-500 text-sm">Out of stock</p>
                ) : (
                  <AddToCartButton data={productData} />
                )}
              </div>
              {/* divider */}
              <div className="my-2 border-b border-gray-200"></div>
              <div>
                <h2 className="font-semibold">Why Shop From GoShop?</h2>
                <div className="flex items-center gap-4 my-4">
                  <img className="w-14 h-14" src={SuperFastD} alt="" />
                  <div>
                    <h4 className="text-sm font-semibold text-black">
                      Superfast Delivery
                    </h4>
                    <p className="text-xs text-[#666]">
                      Get your order delivered to your doorstep at the earliest
                      from dark stores near you.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 my-4">
                  <img className="w-14 h-14" src={BestPrice} alt="" />
                  <div>
                    <h4 className="text-sm font-semibold text-black">
                      Best Prices & Offers
                    </h4>
                    <p className="text-xs text-[#666]">
                      Best price destination with offers directly from the
                      manufacturers.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 my-4">
                  <img
                    className="w-14 h-14 rounded-full"
                    src={WideAsset}
                    alt=""
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-black">
                      Wide Assortment
                    </h4>
                    <p className="text-xs text-[#666]">
                      Choose from 5000+ products across food, personal care,
                      household & other categories.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* description */}
            <div className="order-3 grid gap-3">
              <div>
                <h2 className="font-semibold my-2 text-lg">Description</h2>
                <p className="text-base text-gray-500">
                  {productData?.description}
                </p>
              </div>
              <div>
                <h2 className="font-semibold my-2 text-lg">Unit</h2>
                <p className="text-base text-gray-500">
                  {productData?.unit || "Not available"}
                </p>
              </div>
              {/* more info object */}
              <div>
                {/* <h2 className="font-semibold my-2 text-lg border border-green-500 py-1 text-center rounded w-1/3">
                      More Info
                    </h2> */}
                <div className="grid gap-2">
                  {Object.keys(productData?.more_info || {}).map((key) => (
                    <div key={key} className="grid gap-1">
                      <h3 className="text-lg font-semibold">{key}</h3>
                      <p className="text-base text-gray-700">
                        {productData?.more_info[key]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* review part */}
            <div className="p-4 order-4 lg:pl-7 text-base lg:text-lg">
              <h1>Review</h1>
            </div>
          </section>

          {/* related product */}
          <section className="container mx-auto p-4">
            <h1 className="text-lg font-semibold">Related Products</h1>
            <RelatedProducts category_id={productData?.category_id} subCategory_id={productData?.subCategory_id} brand_id={productData?.brand_id}/>
          </section>
        </>
      )}
    </>
  );
}
