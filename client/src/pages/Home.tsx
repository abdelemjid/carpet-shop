import FeaturesSection from "../components/home/FeaturesSection";
import ProductSection from "../components/home/ProductSection";
import Hero from "../components/home/Hero";

const Home = () => {
  return (
    <div className="flex flex-col gap-3">
      {/* Hero Section */}
      <Hero />
      {/* Feature Section */}
      <FeaturesSection />
      {/* Products Section */}
      <ProductSection />
    </div>
  );
};

export default Home;
