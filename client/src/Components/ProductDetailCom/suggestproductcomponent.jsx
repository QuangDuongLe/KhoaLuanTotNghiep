import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TitleWrapper, WrapperSlider } from './style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { RightOutlined, LeftOutlined } from '@ant-design/icons'

function SuggestProduct({ suggested }) {
    const [products, setProducts] = useState([]);

    const CustomPrevArrow = (props) => (
        <div {...props} className="custom-prev-arrow" style={{ ...arrowStyleprev, left: 0 }}>
            <LeftOutlined style={{ fontSize: '30px' }} />
        </div>
    );

    const CustomNextArrow = (props) => (
        <div {...props} className="custom-next-arrow" style={{ ...arrowStyle, right: 0 }}>
            <RightOutlined style={{ fontSize: '30px' }} />
        </div>
    );

    const arrowStyleprev = {
        width: '5%',
        cursor: 'pointer',
        position: 'absolute',
        paddingLeft: '10px',
        zIndex: '1',
    };
    const arrowStyle = {
        width: '5%',
        cursor: 'pointer',
        position: 'absolute',
        paddingLeft: '10px',
        zIndex: '1',
    };
    if (window.innerWidth <= 500) {
        arrowStyle.transform = 'translateX(-150%)';
    }

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 6,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        responsive: [
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
        ],
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/product/searchProduct?keyword=${suggested}`)
            .then((response) => {
                setProducts(response.data)
            }
            ).catch((response) => {
                console.log(response.err)
            })
    }, [suggested]);

    const handleCardClick = (product) => {
        const url = `/product/${product.productName.name}/undefined`
        window.location.href = url;
    };

    return (
      <div style={{ width: '100%' }}>
      {products.length > 0 && (
        <>
          <TitleWrapper>
            <p>Sản phẩm gợi ý</p>
          </TitleWrapper>
          <WrapperSlider {...settings}>
            {products.map((product) => (
                <div className='box' key={product._id}>
                  <div className='card' onClick={() => handleCardClick(product)} style={{ cursor: 'pointer' }}>
                    <div className='image' onClick={() => handleCardClick(product)} style={{ display: 'flex', justifyContent: 'center' }}>
                      <img src={product.productName.thumnails[0]} alt={product.productName.name} />
                    </div>
                    <div className='desc'>
                      <h1>{product.productName.name}</h1>
                      <div>
                        <div style={{ margin: 0 }}>
                          <p style={{ fontWeight: 700, height: '20px' }}>
                            {product.newPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                          </p>
                        </div>
                        <div style={{}}>
                          <p style={{ color: '#000', textDecoration: 'line-through', height: '20px' }}>
                            {product.oldPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </WrapperSlider>
        </>
      )}
    </div>    
    );
}

export default SuggestProduct;
