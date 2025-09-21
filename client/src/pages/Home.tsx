import FeaturesSection from "../components/home/FeaturesSection";
import Hero from "../components/home/Hero";
import ProductSection from "../components/home/ProductSection";

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
