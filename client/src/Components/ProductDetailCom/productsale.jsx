import React from 'react';
import { WrapperDesc } from './style';

const ProductSale = ({ promotion }) => {
  return (
    <WrapperDesc>
      <div className="product-description" dangerouslySetInnerHTML={{ __html: promotion.replace(/<img/g, '<img class="product-image"') }}/>
    </WrapperDesc>
  );
};

export default ProductSale;
