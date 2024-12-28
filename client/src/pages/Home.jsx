import Banner from "../components/Banner";
import Categories from "../components/Categories";

export default function Home() {
  return (
    <section className="bg-white">
      <Banner />
      <Categories />
      {/* <HomeCatProduct /> */}
    </section>
  );
}
