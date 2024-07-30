import React, { useState, useEffect } from 'react';
import './AdBanner.css'; // Import file CSS để tạo style cho component
import { CloseOutlined } from '@ant-design/icons';

const AdBanner = ({ banners }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [randomBanner, setRandomBanner] = useState(null);

  useEffect(() => {
    const adShown = sessionStorage.getItem('adShown');
    const seenBanners = JSON.parse(sessionStorage.getItem('seenBanners')) || [];

    if (!adShown && seenBanners.length < banners.length) {
      setIsVisible(true);
      sessionStorage.setItem('adShown', 'true');

      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * banners.length);
      } while (seenBanners.includes(randomIndex));

      setRandomBanner(banners[randomIndex]);
      seenBanners.push(randomIndex);
      sessionStorage.setItem('seenBanners', JSON.stringify(seenBanners));
    }

    return () => {
      sessionStorage.removeItem('adShown');
    };
  }, [banners]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !randomBanner) return null;

  return (
    <div className="ad-overlay">
      <div className="ad-banner">
        <div className="ad-content">
          <a href={randomBanner.link} rel="noopener noreferrer">
            <img src={randomBanner.image} alt="Ad" />
          </a>
          <button className="ad-close-button" onClick={handleClose}><CloseOutlined /></button>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
