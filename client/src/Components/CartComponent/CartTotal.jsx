import { Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component

function CartTotal({ data , isCartEmpty}) {
  // Check if data is null or undefined
  if (data === null || data === undefined) {
    return null; // Return null or handle the case when data is not available
  }

  // Calculate the total price based on cart items
  const total = data.reduce((acc, item) => {
    const itemPrice = item.price * item.quantity;
    return acc + itemPrice;
  }, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px', alignItems: 'center' }}>
        <span style={{ fontWeight: 600 }}>Tổng giá:&nbsp;</span>
        <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#FF3300' }}>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(total)}
        </span>
        <Link to="/payment-infor">
          <Button size='large' style={{ marginLeft: '100px', background: '#C13346', color: '#fff' }}  disabled={isCartEmpty} >Mua hàng</Button>
        </Link>
      </div>
    </div>
  );
}

export default CartTotal;
