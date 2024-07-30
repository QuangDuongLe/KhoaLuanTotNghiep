import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Rate } from 'antd';
import axios from 'axios';
import { WrapperCard } from './styled';
import { ProductHPStyle } from '../HomePageComponent/ProductHPcss';
import { MDBBtn } from 'mdb-react-ui-kit';

const calculateDiscountPercentage = (newPrice, oldPrice) => {
    return ((oldPrice - newPrice) / oldPrice * 100).toFixed(0);
};

const calculateAverageRating = (ratings) => {
    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return total / ratings.length;
};

const calculateTotalRatings = (product) => {
    return product.ratings.length;
};

const SingleProduct = () => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/product/getRandomProduct`);
                setProduct(response.data.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, []);

    if (!product) return <div>Loading...</div>;

    return (
        <ProductHPStyle>
            <div className='singlecard' key={product._id + product.memory} style={{ padding: '10px' }}>
                <NavLink to={`/product/${product.name}/${product.memory}`} onClick={() => console.log('Product clicked:', product.name)} style={{ display: 'flex', flexDirection: 'row' }}>
                    <div key={product._id} className='item-label'>
                        {product.oldPrice && (
                            <span className='lb-dis'>
                                Giảm {calculateDiscountPercentage(product.newPrice, product.oldPrice)}%
                            </span>
                        )}
                    </div>
                    <div className='image' style={{ marginTop: '10px' }}>
                        <img src={product.thumnails[0]} loading="lazy" alt={product.name} />
                    </div>
                    <div className='desc' >
                        <div>
                            <h1 style={{}}>{product.name} {product.memory}</h1>
                        </div>
                        <div>
                            {product.ratings && product.ratings.length > 0 ? (
                                <div style={{ display: "flex", flexDirection: 'column' }}>
                                    <Rate className='stars' disabled allowHalf value={calculateAverageRating(product.ratings)} />
                                    <span style={{ margin: 0, height: '25px', fontSize: '16px' }}>{calculateTotalRatings(product)} đánh giá</span>
                                </div>
                            ) : (
                                null
                            )}
                            <div className='price-box' style={{ padding: '0 0 30px 0', display: 'flex' }}>
                                <p style={{ color: '#000', textDecoration: 'line-through', height: '20px' }}>
                                    {product.oldPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </p>
                                <p style={{ fontWeight: 700, height: '20px' }}>
                                    {product.newPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </p>
                            </div>
                            <MDBBtn style={{ background: '#B63245', width:'auto' }} size='lg'>Xem chi tiết</MDBBtn>
                        </div>
                    </div>
                </NavLink>
            </div>
        </ProductHPStyle>
    );
};

export default SingleProduct;
