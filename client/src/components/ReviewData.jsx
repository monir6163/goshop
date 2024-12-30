/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import { Rating } from "react-simple-star-rating";
import { useSelector } from "react-redux";
import { axiosToastError } from "../utils/axiosToastError";
import { Axios } from "../api/axios";
import apiSummary from "../api/api";
import toast from "react-hot-toast";
export default function ReviewData({ productId }) {
  const user = useSelector((state) => state.user);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const handleRating = (rate) => {
    setRating(rate);
  };
  const [data, setData] = useState({
    review: "",
  });
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const payload = {
        review: data.review,
        rating: rating,
        productId: productId,
      };
      console.log(payload);
      const { data: response } = await Axios({
        ...apiSummary.storeProductReview,
        data: payload,
      });
      if (response.success) {
        toast.success(response.message);
        featchReview();
      }
    } catch (error) {
      axiosToastError(error);
    } finally {
      setLoading(false);
      e.target.reset();
      setRating(0);
    }
  };

  const featchReview = async () => {
    try {
      const { data: response } = await Axios({
        ...apiSummary.getAllProductReviews,
        url: `${apiSummary.getAllProductReviews.url}?productId=${productId}`,
      });
      if (response.success) {
        setReviews(response.data);
      }
    } catch (error) {
      axiosToastError(error);
    }
  };

  useEffect(() => {
    featchReview();
  }, [productId]);

  const averageRating = Number(reviews?.averageRating) || 0;
  const starCounts = reviews?.starCounts || {};
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <div className="lg:col-span-4 col-span-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <Rating
              // key={rating}
              onClick={handleRating}
              ratingValue={rating}
              transition
              fillColor="orange"
              emptyColor="gray"
            />
          </div>

          <textarea
            id="review"
            name="review"
            rows="4"
            onChange={handleChange}
            required="true"
            className="block w-full p-3 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your review"
          ></textarea>

          <div className="">
            {user?._id ? (
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? "Please Wait..." : "Submit Review"}
              </button>
            ) : (
              <p className="text-sm w-full px-4 py-2 font-medium text-white bg-blue-600">
                Please login to submit review
              </p>
            )}
          </div>
        </form>

        <div className="mt-4 space-y-4 h-4 min-h-20 overflow-y-auto">
          {reviews?.reviews?.map((review) => (
            <div key={review._id} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-4">
                <StarRatings
                  rating={review.rating}
                  starRatedColor="orange"
                  numberOfStars={5}
                  name="rating"
                  starDimension="20px"
                  starSpacing="1px"
                />
                <p className="text-sm font-medium text-gray-900">
                  {review.userId.name}
                </p>
              </div>
              <p className="text-sm font-normal text-gray-500">
                {review.review}
              </p>
            <p className="text-sm font-normal text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
                </p>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-2 hidden lg:flex flex-col space-y-4">
        <div className="flex items-center">
          <StarRatings
            rating={averageRating}
            starRatedColor="orange"
            numberOfStars={5}
            name="rating"
            starDimension="20px"
            starSpacing="1px"
          />
          <p className="ml-2 text-xs font-normal text-gray-900">
            {reviews?.averageRating} out of 5
          </p>
        </div>
        <p className="text-sm font-medium text-gray-500">
          {reviews?.totalRatings} global ratings
        </p>
        {[5, 4, 3, 2, 1].map((star) => {
          const percentage =
            ((starCounts[star] || 0) / reviews?.totalRatings) * 100 || 0;

          return (
            <div key={star} className="flex items-center mt-2">
              <span className="text-sm font-medium text-blue-600 hover:underline shrink-0">
                {star} star
              </span>
              <div className="w-3/4 h-4 mx-2 bg-gray-200 rounded">
                <div
                  className="h-4 bg-yellow-400 rounded"
                  style={{ width: `${percentage.toFixed(1)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-500">
                {percentage.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
