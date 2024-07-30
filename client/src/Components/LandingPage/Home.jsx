import React from "react";
import Navbar from "./Navbar";
import { ArrowRightOutlined } from '@ant-design/icons';
import { WrapperA } from "./style";
import { NavLink } from "react-router-dom";

const Home = () => {
  const name ="Điện thoại";
  return (
    <WrapperA>
      <div className="home-container">
        <Navbar />
        <div className="home-banner-container">
          <div className="home-bannerImage-container">
            <img src="../../image/home-banner-background.png" alt="" />
          </div>
          <div className="home-text-section">
            <h1 className="primary-heading">
              DI ĐỘNG GEN Z
            </h1>
            <p className="primary-text">
              Chào mừng đến với trải nghiệm mua sắm điện thoại tiện lợi và đầy thú vị tại didonggenz.com!
            </p>
            <NavLink  to={`/lowtoHigh/${name}`}>
              <button className="secondary-button">
                Khám phá ngay <ArrowRightOutlined />{" "}
              </button>
            </NavLink>
          </div>
          <div className="home-image-section">
            <img src="../../image/about-background-image.png" alt="" />
          </div>
        </div>
      </div>
    </WrapperA>
  );
};

export default Home;