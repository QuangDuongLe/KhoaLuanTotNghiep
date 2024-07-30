// src/CartPage/CartPage.js
import React from 'react';
import CartHeader from '../../Components/CartComponent/CartHeader';
import CartList from '../../Components/CartComponent/CartList';

function CartPage() {
  return (
    <div>
      <CartHeader/>
      <CartList/>
    </div>
  );
}

export default CartPage;
