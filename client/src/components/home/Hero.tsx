import carpet from "../../assets/carpet.jpg";
import woman from "../../assets/moroccan.old.woman.png";

const Hero = () => {
  return (
    <div className="w-full h-[450px] overflow-hidden rounded-lg relative">
      {/* Background Image */}
      <img
        src={carpet}
        alt="carpet background image"
        className="absolute w-full h-full bg-cover"
      />
      {/* Hero Content */}
      <div className="w-full h-full absolute z-10 p-8 bg-gradient-to-br from-blue-400/10 to-violet-500/85 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-10  backdrop-contrast-[100%]">
        <div className="w-full flex flex-row gap-5 justify-between items-center">
          {/* Text Content */}
          <div className="h-full flex flex-col gap-8">
            {/* Hero Heading */}
            <h1 className="text-3xl lg:text-5xl font-bold">
              Online - Carpet Shop
            </h1>
            {/* Hero Subheading */}
            <h3 className="text-1xl lg:text-3xl font-semibold mt-5">
              The best Moroccan's carpet store
            </h3>
            {/* Paragraph */}
            <p className="max-w-[350px] mt-5">
              Discover the timeless beauty of Moroccan handmade carpets, woven
              with tradition and artistry for your home
            </p>
          </div>
          {/* Image */}
          <img
            src={woman}
            alt="moroccan woman"
            className="hidden md:block w-[250px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
