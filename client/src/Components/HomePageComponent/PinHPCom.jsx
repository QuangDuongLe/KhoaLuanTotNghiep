import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';


import { Button, Rate, Skeleton, Tooltip } from 'antd';
import Loading from '../LoadingComponents/Loading';
import { ProductHPStyle } from './ProductHPcss';
import { useSelector } from 'react-redux';

function PinHP() {
    const [products, setProducts] = useState([]);
    const [selectedMemories, setSelectedMemories] = useState({});
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [initialScrollLeft, setInitialScrollLeft] = useState(0);
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.getBoundingClientRect().left);
        setInitialScrollLeft(containerRef.current.scrollLeft);
        e.preventDefault(); // Ngăn chặn sự kiện mặc định
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

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return; // Nếu không đang kéo chuột, không thực hiện gì cả
        const currentX = e.pageX - containerRef.current.getBoundingClientRect().left;
        const walk = currentX - startX; // Khoảng cách chuột di chuyển
        containerRef.current.scrollLeft = initialScrollLeft - walk; // Điều chỉnh vị trí cuộn
    };

    const [banners, setBanners] = useState({});
    const fetchBanners = async (productIds) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/banner/getBannersByProductIds`, { productIds });
            const bannerData = res.data.data.reduce((acc, banner) => {
                banner.products.forEach(product => {
                    acc[product.productId] = banner;
                });
                return acc;
            }, {});
            setBanners(bannerData);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
                const categories = res.data.data;
                const categoryName = 'Pin dự phòng';
                const category = categories.find((cat) => cat.name === categoryName);
                if (!category) {
                    console.error('Không tìm thấy danh mục');
                    return;
                }
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/product/getIdByCategory/${category._id}`);
                const productsData = response.data.data;
                setProducts(productsData);

                const initialMemories = {};
                productsData.forEach((product) => {
                    initialMemories[product._id] = product.variant[0]?.memory;
                });

                setSelectedMemories(initialMemories);
                const productIds = productsData.map(product => product._id);
                await fetchBanners(productIds);
                setLoading(false);
            } catch (error) {
                console.error('Lỗi:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const calculateAverageRating = (ratings) => {
        if (ratings.length === 0) {
            return 0;
        }

        const totalRating = ratings.reduce((total, item) => total + item.rating, 0);
        return totalRating / ratings.length;
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
    const calculateTotalRatings = (product) => {
        return product.ratings.length;
      };
    
    return (
        <ProductHPStyle>
            {loading ? (
                <Skeleton style={{ padding: 10, minHeight:'395px'  }} active={true} />
            ) : (
                <div className='container-pd'
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp} // Xử lý sự kiện khi chuột rời container
                    onMouseMove={handleMouseMove}        
                >
                    {products
                        .filter((product) => !product.isHide)
                        .map((product) => (
                            <div className='card' key={product._id}>
                                <Tooltip title={product.name} mouseEnterDelay={0.5}>
                                    <NavLink to={`/product/${product.name}/${selectedMemories[product._id]}`}
                                     onClick={() => handleProductClick(product._id)}>
                                    {product.variant.map((variant) => (
                                        <div className='item-label'>
                                            {variant.oldPrice && variant.oldPrice > variant.newPrice && (
                                                <span className='lb-dis'>
                                                    Giảm {calculateDiscountPercentage(variant.newPrice, variant.oldPrice)}%
                                                </span>
                                            )}
                                        </div>

                                    ))}
                                        <div className='image' style={{marginTop:'10px'}}>
                                            <img src={product.thumnails[0]} alt={product.name} loading='lazy' />
                                        </div>
                                        <div className='desc'>
                                            <h1 className='name'>{product.name}</h1>
                                            <div>
 
                                                {product.ratings.length > 0 ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <Rate disabled allowHalf value={calculateAverageRating(product.ratings)} />
                                                        <span style={{ margin: 0, height: '25px', fontSize: '13px' }}>{calculateTotalRatings(product)} đánh giá</span>

                                                    </div>
                                                ) : null}
                                                <div style={{  height: '20px', margin: 0 }}>
                                                    <p style={{fontWeight: 'bold'}}>
                                                        {product.variant.find((variant) => variant.memory === selectedMemories[product._id]).newPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                    </p>
                                                </div>
                                                {product.variant
                                                    .filter((variant) => variant.memory === selectedMemories[product._id])
                                                    .map((variant) => (
                                                        <>
                                                            {variant.oldPrice && variant.oldPrice > variant.newPrice && (
                                                                <p style={{ color: '#000', textDecoration: 'line-through', height: '20px' }}>{product?.variant.find((variant) => variant.memory === selectedMemories[product._id])?.oldPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                                            )}
                                                        </>
                                                    ))}
                                            </div>
                                            <div className='div-img'>
                                                {banners[product._id] && (
                                                   
                                                        <img className='image' src={banners[product._id].image} alt='promo' />
                                                    
                                                )}
                                            </div>
                                        </div>
                                    </NavLink>
                                </Tooltip>
                            </div>
                        ))}
                </div>
            )}
        </ProductHPStyle>
    );
}

export default PinHP;
