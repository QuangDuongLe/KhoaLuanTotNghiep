import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { WrapperSuggestCard } from './styled';
import { Rate } from 'antd';
import Loading from '../LoadingComponents/Loading';

function SuggestCard({ searchKeyword }) {
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    if (searchKeyword) {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      setLoading(true);
      const timeout = setTimeout(() => {
        performSearch(searchKeyword);
      }, 500);
      setTypingTimeout(timeout);
    } else {
      setSearchedProducts([]);
    }
  }, [searchKeyword]);

  const performSearch = (keyword) => {
    const params = {
        keyword,
    };

    axios.get(`${process.env.REACT_APP_API_URL}/product/searchProduct`, { params })
        .then((response) => {
            const { productVariants, totalCount, totalPages } = response.data;
            setSearchedProducts(productVariants);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Lỗi khi gọi API tìm kiếm: ', error);
            setLoading(false);
        });
};

  const handleNavLinkClick = () => {
    setSearchedProducts([]);
  };

  if (!searchKeyword || searchedProducts.length === 0) {
    return null;
  }

  const calculateAverageRating = (product) => {
    if (product.length === 0) {
      return 0;
    }

    const totalRating = product.reduce((total, item) => total + item.rating, 0);
    return totalRating / product.length;
  }

  return (
    <WrapperSuggestCard>
        <Loading isLoading={loading} >
          <div className='view-list'>
          {searchedProducts.map((product) => (
              <NavLink className='view-list__wrapper' to={`/product/${product.productName.name}/${product.memory}`}  onClick={handleNavLinkClick} >
                <div className='item' >
                  <div className='item__img'>
                    <img src={product.productName.thumnails[0]} alt={product.productName.name} loading="lazy" />
                  </div>
                  <div className='item-info'>
                    <div className='item-name'>
                      <span>{product.productName.name} - {product.memory}</span>
                    </div>
                    <div className='item-price'>
                      <div className='box-info__box-price'>
                        <div style={{ display: 'flex', gap: '4px', height: '20px' }}>
                          <p className='product__price--show' style={{ fontWeight: '500' }}>
                            {product.newPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                          </p>
                          <p className='product__price--through' style={{ color: '#000', textDecoration: 'line-through', height: '20px' }}>
                            {product.oldPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                          </p>

                        </div>
                        {product?.productName.ratings.length > 0 ? (
                          <Rate className='stars' disabled allowHalf value={calculateAverageRating(product.productName.ratings)} />
                        ) : (
                          null
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </NavLink>
          ))}
          </div>
        </Loading>
    </WrapperSuggestCard>
  );
}

export default SuggestCard;
