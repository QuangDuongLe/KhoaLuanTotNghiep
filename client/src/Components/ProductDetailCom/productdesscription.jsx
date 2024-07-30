import React from 'react';
import { WrapperDesc } from './style';

const ProductDescription = ({ description }) => {
  return (
    <WrapperDesc>
      <div className="product-description" dangerouslySetInnerHTML={{ __html: description.replace(/<img/g, '<img class="product-image"') }}/>
    </WrapperDesc>
  );
};

export default ProductDescription;
