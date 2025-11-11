import React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import bedroomImage from "@/assets/carousel/bedroom.png";
import livingroomImage from "@/assets/carousel/livingroom.png";
import diningroomImage from "@/assets/carousel/diningroom.png";
import { Button } from "../ui/button";

const OverviewSection = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnMouseEnter: true, active: true })
  );

  return (
    <div className="flex flex-col gap-10 my-10">
      {/* Section Heading */}
      <h1 className="text-center text-3xl">Styling Ideas</h1>
      {/* Carousel */}
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="mx-auto w-[calc(100%-95px)]"
      >
        <CarouselContent>
          {/* Living Room Carousel */}
          <CarouselItem key="living-room-card">
            <div className="p-1">
              <Card className="bg-transparent">
                <CardContent className="flex flex-col md:flex-row items-center justify-between gap-8 p-6">
                  <div className="flex-1">
                    <img src={livingroomImage} className="mx-auto w-[300px]" />
                  </div>
                  <div className="flex-1 flex flex-col gap-5 justify-center items-center">
                    <p className="max-w-[300px] text-md">
                      Infuse your living space with Moroccan soul—handwoven
                      carpets that define elegance.
                    </p>
                    <Button className="max-w-[100px]">Buy Now</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          {/* Dining Room Carousel */}
          <CarouselItem key="dining-room-card">
            <div className="p-1">
              <Card className="bg-transparent">
                <CardContent className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 p-6">
                  <div className="flex-1 flex flex-col gap-5 justify-center items-center">
                    <p className="max-w-[300px] text-md">
                      Ground your dining room in Moroccan heritage with our
                      artisanal hand-knotted carpets.
                    </p>
                    <Button className="max-w-[100px]">Buy Now</Button>
                  </div>
                  <div className="flex-1">
                    <img src={diningroomImage} className="mx-auto w-[300px]" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          {/* Living Room Carousel */}
          <CarouselItem key="bedroom-card">
            <div className="p-1">
              <Card className="bg-transparent">
                <CardContent className="flex flex-col md:flex-row items-center justify-between gap-8 p-6">
                  <div className="flex-1">
                    <img src={bedroomImage} className="mx-auto w-[300px]" />
                  </div>
                  <div className="flex-1 flex flex-col gap-5 justify-center items-center">
                    <p className="max-w-[300px] text-md">
                      Turn your bedroom into a sanctuary of Moroccan artistry
                      with our handmade carpets.
                    </p>
                    <Button className="max-w-[100px]">Buy Now</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default OverviewSection;
