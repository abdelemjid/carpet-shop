import OverviewSection from "@/components/home/OverviewSection";
import FeaturesSection from "../components/home/FeaturesSection";
import Hero from "../components/home/HeroSection";
import AboutUsSection from "@/components/home/AboutUsSection";

const Home = () => {
  return (
    <div className="flex flex-col gap-3">
      {/* Hero Section */}
      <Hero />
      {/* Feature Section */}
      <FeaturesSection />
      {/* Overview Section */}
      <OverviewSection />
      {/* About Us Section */}
      <AboutUsSection />
    </div>
  );
};

export default Home;
