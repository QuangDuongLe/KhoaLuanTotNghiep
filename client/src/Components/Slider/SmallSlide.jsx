import React from 'react';
import { Carousel } from 'antd';
import { WrapperBanner } from "./style";



const SmallSlide = ({ banners }) => {
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
    <WrapperBanner>
      <Carousel className="custom-carousel" {...settings}>
        {banners.map((banner, index) => (
          <div key={index} style={{ borderRadius: '4px', overflow: 'hidden' }}>
            <a href={banner.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
              <img src={banner.image} alt={`Slide ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </a>
          </div>
        ))}
      </Carousel>
    </WrapperBanner>
  );
};

export default SmallSlide;
