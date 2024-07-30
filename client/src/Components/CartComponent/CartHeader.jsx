// src/CartComponent/CartItem.js

import React, { useEffect, useState } from 'react';

import { HeaderWrapper } from './style';
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Breadcrumb } from 'antd';
import { NavLink } from 'react-router-dom';

function CartHeader({ product, removeFromCart }) {


  const goBack = () => {
    window.history.back();
  };

  return (
    <HeaderWrapper>
      <div className='cart-page-header'>
        <div className="btn-back">
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              <NavLink to="/">Home</NavLink>
            </Breadcrumb.Item>
              <Breadcrumb.Item>
                <NavLink to={`/cart`}>Giỏ hàng</NavLink>
              </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='cart-page-logo' >
          <NavLink viewBox="0 0 192 65" className='logo-icon' to="/">
            <img src='../../image/home-logo1.png' />
          </NavLink>
          <NavLink className='cart-page-name' to={`/cart`}>Giỏ hàng</NavLink>
        </div>
      </div>
    </HeaderWrapper>

  );
}

export default CartHeader;
