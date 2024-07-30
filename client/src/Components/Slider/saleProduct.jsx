import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { NavLink, useParams } from 'react-router-dom';


import { Button, Rate, Skeleton, Tooltip } from 'antd';
import { CardProd, WrapperCardProd } from '../../pages/HomePage/styled';
import { useSelector } from 'react-redux';

function SaleProduct({ userId }) {
  const [products, setProducts] = useState([]);;
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const recommendProduct = async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/recommend/recommendProduct`, { userId: userId, limit: 10 });
        const recommendedProducts = res.data.data;
        console.log(recommendedProducts)
        setProducts(recommendedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi:', error);
        setLoading(false);
      }
    };
    recommendProduct();
  }, [userId]);

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) {
      return 0;
    }

    const totalRating = ratings.reduce((total, item) => total + item.rating, 0);
    return totalRating / ratings.length;
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1224,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const PrevArrow = ({ onClick }) => {
    return <div className="slick-arrow slick-prev" onClick={onClick}></div>;
  };

  const NextArrow = ({ onClick }) => {
    return <div className="slick-arrow slick-next" onClick={onClick} ></div>;
  };
  const calculateDiscountPercentage = (newPrice, oldPrice) => {
    if (oldPrice) {
      const discount = oldPrice - newPrice;
      const discountPercentage = (discount / oldPrice) * 100;
      return discountPercentage.toFixed(0);
    } else {
      return 0;
    }
  };

  const calculateTotalRatings = (product) => {
    return product.ratings.length;
  };
  const user = useSelector((state) => state.user);
  const handleProductClick = async (productId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/recommend/saveAccess`, {
        userId: user._id,
        productId: productId
      });
          } catch (error) {
      console.error('Lỗi khi lưu thông tin truy cập:', error);
    }
  };
  return (
    <CardProd>
      {loading ? (
        <Skeleton style={{ padding: 10, minHeight: '395px' }} active={true} />
      ) : (
        <Slider {...settings} prevArrow={<PrevArrow />} nextArrow={<NextArrow />}>
          {products.filter((product) => !product.isHide).map((product) => (
            <div className='card' key={product._id + product.memory}>
              <Tooltip title={product.productName} mouseEnterDelay={0.5}>
                <a className='card' href={`/product/${product.productName}/${product?.memory || undefined
}`} onClick={() => handleProductClick(product.productId)}>
                  <div key={product._id} className='item-label'>
                    {product.oldPrice && (
                      <span className='lb-dis'>
                        Giảm {calculateDiscountPercentage(product.newPrice, product.oldPrice)}%
                      </span>
                    )}
                  </div>
                  <div className='image' >
                    <img src={product.thumnails[0]} loading="lazy" alt={product.productName} />
                  </div>
                  <div className='desc'>
                    <h1 className='name' style={{fontSize:"14px"}}>{product.productName} - {product.memory}</h1>
                    <div>
                      {product.ratings && product.ratings.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
                          <Rate disabled allowHalf value={calculateAverageRating(product.ratings)} />
                          <span style={{ margin: 0, height: '25px', fontSize: '13px' }}>{calculateTotalRatings(product)} đánh giá</span>
                        </div>
                      ) : (
                        null
                      )}
                      <div className='price-box'>
                        <p style={{ fontWeight: 700, height: '20px', fontSize:'20px' }}>
                          {product.newPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </p>
                        <p style={{ color: '#000', textDecoration: 'line-through', height: '20px',fontSize:'20px' }}>
                          {product.oldPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </Tooltip>
            </div>
          ))}
        </Slider>
      )}
    </CardProd>
  );
}

export default SaleProduct;
