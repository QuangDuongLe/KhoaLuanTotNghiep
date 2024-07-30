import React from 'react';
import Slider from "react-slick";
import { CarouselW } from "./style";

const Slide = ({ banners }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
  };

  return (
    <CarouselW className="custom-carousel" {...settings}>
      {banners.map((banner, index) => (
        <div key={index} style={{ borderRadius: '4px', overflow: 'hidden' }}>
          <a href={banner.link} rel="noopener noreferrer" style={{ display: 'block' }}>
            <img src={banner.image} alt={`Slide ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </a>
        </div>
      ))}
    </CarouselW>
  );
};

export default Slide;
