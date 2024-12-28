import BannerImgM from "../assets/banner-mobile.jpg";
import BannerImg from "../assets/banner.jpg";
export default function Banner() {
  return (
    <section className="container mx-auto">
      <div
        className={`w-full h-full min-h-48 rounded bg-green-200 ${
          !BannerImg && "animate-pulse my-2"
        }`}
      >
        <img
          src={BannerImg}
          alt="Banner"
          className="w-full h-full object-cover hidden lg:block"
        />
        <img
          src={BannerImgM}
          alt="Banner"
          className="w-full h-full object-cover lg:hidden"
        />
      </div>
    </section>
  );
}
