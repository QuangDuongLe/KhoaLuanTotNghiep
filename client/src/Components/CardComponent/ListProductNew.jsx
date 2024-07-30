import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Pagination, Rate } from 'antd';
import { WrapperFilterCard } from './styled';
import Loading from '../LoadingComponents/Loading';
import SaleProduct from '../Slider/saleProduct';
import { useSelector } from 'react-redux';

function ListProductNew({ minPrice, maxPrice, selectedMemory, nameProduct, sort }) {
    const { nameCategory, nameBrand } = useParams();
    const location = useLocation();
    const searchKeyword = new URLSearchParams(location.search).get('keyword');
    const [products, setProducts] = useState([]);
    const propertyNames = ["RAM", "Dung lượng pin", "Chip xử lý (CPU)"];
    const [loading, setLoading] = useState(true);
    const [noProductFound, setNoProductFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [categoryId, setCategoryId] = useState(null);
    const [brandId, setBrandId] = useState(null);
    const pageSize = 10;

    useEffect(() => {
        fetchCategoryAndBrandIds();
    }, [nameCategory, nameBrand, searchKeyword]);
    useEffect(() => {
        setCurrentPage(1);
    }, [minPrice, maxPrice, selectedMemory, nameProduct, sort, categoryId, brandId, searchKeyword]);

    const performSearch = (keyword, page) => {
        const params = {
            keyword,
            minPrice,
            maxPrice,
            memory: selectedMemory,
            sort,
            page,
            limit: pageSize,
            categoryId,
            brandId,
        };

        axios.get(`${process.env.REACT_APP_API_URL}/product/searchProduct`, { params })
            .then((response) => {
                const { productVariants, totalCount, totalPages } = response.data;
                setProducts(productVariants);
                setTotalPages(totalPages);
                setNoProductFound(productVariants.length === 0);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API tìm kiếm: ', error);
                setLoading(false);
            });
    };
    const [categoryAndBrandLoaded, setCategoryAndBrandLoaded] = useState(false);
    useEffect(() => {
        if (categoryAndBrandLoaded) {
            setLoading(true);
            if (searchKeyword) {
                performSearch(searchKeyword, currentPage);
            } else {
                fetchProducts(currentPage);
            }
        }
    }, [minPrice, maxPrice, selectedMemory, nameProduct, categoryId, brandId, sort, currentPage, searchKeyword, categoryAndBrandLoaded]);


    const fetchCategoryAndBrandIds = async () => {
        setLoading(true);
        try {
            const categoryResponse = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
            const category = categoryResponse.data.data.find(cat => cat.name === nameCategory);
            setCategoryId(category ? category._id : null);
    
            const brandResponse = await axios.get(`${process.env.REACT_APP_API_URL}/brand/getBrand`);
            const brand = brandResponse.data.data.find(br => br.name === nameBrand);
            setBrandId(brand ? brand._id : null);
        } catch (error) {
            console.error('Error fetching category or brand:', error);
            setCategoryId(null);
            setBrandId(null);
        }
        setCategoryAndBrandLoaded(true); // Đánh dấu đã tải xong categoryId và brandId
        setLoading(false);
    };

    const fetchProducts = async (page) => {
        setLoading(true);
        try {
            const params = {
                minPrice,
                maxPrice,
                memory: selectedMemory,
                page,
                limit: pageSize,
                sort,
                categoryId,
                brandId,
            };

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/product/productVariant`, { params });
            const { productVariants, totalCount, totalPages } = response.data;

            setProducts(productVariants);
            setTotalPages(totalPages);
            setNoProductFound(productVariants.length === 0);
        } catch (error) {
            console.error('Error fetching products:', error);
            setNoProductFound(true);
        }
        setLoading(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const calculateDiscountPercentage = (newPrice, oldPrice) => {
        return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    };

    const calculateAverageRating = (ratings) => {
        if (ratings.length === 0) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        return total / ratings.length;
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
        <Loading isLoading={loading}>
            <div style={{ width: '100%' }}>
                {searchKeyword && (
                    <div style={{ textAlign: 'left', marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '15px' }}>Kết quả tìm kiếm cho {searchKeyword} :</h3>
                    </div>
                )}
                {noProductFound ? (
                    <div style={{ textAlign: 'center', margin: '20px' }}>
                        <h3>Không tìm thấy sản phẩm nào</h3>
                        <h5>Có thể bạn quan tâm:</h5>
                        <SaleProduct />
                    </div>
                ) : (
                    <WrapperFilterCard>
                        <ul className='mainContainer' style={{ alignItems: 'center', justifyContent: 'center', listStyle: 'none' }}>
                            {products
                                .filter((product) => !product.productName.isHide)
                                .filter((product) => {
                                    const productName = product.productName.name.toLowerCase();
                                    return productName.includes(nameProduct.toLowerCase());
                                })
                                .map((product) => (
                                    <li className='box' key={product._id + product.memory} style={{ padding: '0' }}>
                                        <NavLink className='card' to={`/product/${product.productName.name}/${product.memory}`} onClick={() => handleProductClick(product.productName)}>
                                            <div key={product._id} className='item-label'>
                                                {product.oldPrice && (
                                                    <span className='lb-dis'>
                                                        Giảm {calculateDiscountPercentage(product.newPrice, product.oldPrice)}%
                                                    </span>
                                                )}
                                            </div>
                                            <div className='image' style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                                                <img src={product.productName.thumnails[0]} loading="lazy" />
                                            </div>
                                            <div className='desc' style={{ alignContent: 'start' }}>
                                                <div style={{ height: '3em' }}>
                                                    <h1 style={{ padding: 3, color:'#000' }}>{product.productName.name} - {product.memory}</h1>
                                                </div>
                                                <div>
                                                    {product.productName.ratings && product.productName.ratings.length > 0 ? (
                                                        <div style={{ display: "flex", flexDirection: 'column' }}>
                                                            <Rate className='stars' disabled allowHalf value={calculateAverageRating(product.productName.ratings)} />
                                                            <span style={{ margin: 0, height: '25px', fontSize: '13px', color:'#000' }}>Lượt đánh giá: {calculateTotalRatings(product.productName)}</span>
                                                        </div>
                                                    ) : (
                                                        null
                                                    )}
                                                    <div className='price-box' style={{ padding: '0 0 30px 0' }}>
                                                        <p style={{ fontWeight: 700, height: '20px' }}>
                                                            {product.newPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                        </p>
                                                        <p style={{ color: '#000', textDecoration: 'line-through', height: '20px' }}>
                                                            {product.oldPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                        </p>
                                                    </div>
                                                    {/* <div>
                                                        {propertyNames.map((propertyName, index) => {
                                                            const propertyValue = product.productName?.properties?.[propertyName];
                                                            if (propertyValue !== undefined) {
                                                                return (
                                                                    <div className='props' style={{ padding: '0 7px', display: 'flex', alignItems: 'center' }} key={index}>
                                                                        <i className="fas fa-circle" style={{ fontSize: 3 }}></i>
                                                                        <p style={{ fontSize: '13px', color: '#000', textAlign: 'left', paddingLeft: '10px', margin: '0', lineHeight: '19px' }} dangerouslySetInnerHTML={{ __html: `${propertyName}: ${propertyValue}` }} />
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </div> */}
                                                </div>
                                            </div>
                                        </NavLink>
                                    </li>
                                ))}
                        </ul>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                            <Pagination
                                current={currentPage}
                                total={totalPages * pageSize}
                                pageSize={pageSize}
                                onChange={handlePageChange}
                            />
                        </div>
                    </WrapperFilterCard>
                )}
            </div>
        </Loading>
    );
}

export default ListProductNew;
