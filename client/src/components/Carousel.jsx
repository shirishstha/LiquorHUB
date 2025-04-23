import React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const HeroCarousel = () => {
  const items = ["/slider_bg.png", "/slider_bg2.png", "slider_bg3.png"];

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
      className="w-[90vw]"
    >
      <CarouselContent className=" h-64 ">
        {items.map((item) => (
          <CarouselItem key={item}>
               
                  <span className="text-4xl font-semibold">
                    <img src={item} alt="" className=" w-full h-full object-cover" />
                  </span>
           
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default HeroCarousel;
