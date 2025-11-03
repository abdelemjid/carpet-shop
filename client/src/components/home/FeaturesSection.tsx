import { Headset, RefreshCcw, Shield, Truck } from "lucide-react";
import type { JSX } from "react";

const data = [
  {
    heading: "International Delivery",
    subheading: "Express Worldwide Shipping",
    icon: <Truck size={30} />,
  },
  {
    heading: "Support 24/7",
    subheading: "We Support 24 Hours a Day",
    icon: <Headset size={30} />,
  },
  {
    heading: "100% Money Back",
    subheading:
      "You Have 20 Days to Return Your Money, If You Find Your Product Damaged",
    icon: <RefreshCcw size={30} />,
  },
  {
    heading: "Secure Payment",
    subheading: "We Ensure Secure Payment",
    icon: <Shield size={30} />,
  },
];

const Feature = ({
  heading,
  subheading,
  icon,
}: {
  heading: string;
  subheading: string;
  icon: JSX.Element;
}) => {
  return (
    <div className="flex-1 flex flex-col gap-5 items-center">
      <div className="w-full flex justify-center ">{icon}</div>
      <h2 className="text-lg">{heading}</h2>
      <p className="text-gray-50/50 text-sm text-center">{subheading}</p>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <div className="w-full container mt-10 py-10 flex flex-col md:flex-row gap-8 justify-between">
      {data.map((feature, _) => (
        <Feature
          key={_}
          heading={feature.heading}
          subheading={feature.subheading}
          icon={feature.icon}
        />
      ))}
    </div>
  );
};

export default FeaturesSection;
