import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Button, Card, Rate } from 'antd';
import { NavLink } from 'react-router-dom';


const { Meta } = Card;


const HomeProductCard = () => {
    const [products, setProducts] = useState([]);
    const [selectedMemories, setSelectedMemories] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
                const categories = res.data.data;
                const categoryName = 'Điện thoại';
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
                setLoading(false);
            } catch (error) {
                console.error('Lỗi:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const calculateAverageRating = (product) => {
        if (product.length === 0) {
            return 0;
        }

        const totalRating = product.reduce((total, item) => total + item.rating, 0);
        return totalRating / product.length;
    }

    return (
        <div style={{ display: 'flex', flexWrap:'wrap', gap: '20px', alignItems: 'center' }}>
            {products
                .filter((product) => product.isHide === false)
                .map((product) => (
                    <NavLink to={`/product/${product.name}/${selectedMemories[product._id]}?nameCategory=categoryName&nameBrand=brandName`}>
                        <Card
                            className="custom-card"
                            key={product._id}
                            style={{ width: 150, height: 350, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow:'hidden'}}
                            cover={
                                <img style={{ margin: '10px', width: "150px" }} src={product.thumnails[0]} loading="lazy" />}>
                            <Meta
                                title={
                                    <div style={{ textOverflow: 'ellipsis', whiteSpace:'nowrap', overflow:'hidden', maxWidth:'100%' }}>
                                        {product?.name}
                                    </div>}
                                description={
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ display: 'flex' }}>
                                            {product?.variant.map((variant) => (
                                                <Button classNames={'memory'} className={` memory-button ${variant.memory === selectedMemories[product._id] ? 'selected' : ''}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedMemories((prevSelected) => ({
                                                            ...prevSelected,
                                                            [product._id]: variant.memory,
                                                        }));
                                                    }}
                                                    style={{ padding: '5px 5px', marginInlineEnd: '5px' }}>
                                                    {variant.memory}
                                                </Button>
                                            ))}
                                        </div>
                                        {product?.ratings.length > 0 ? (
                                            <div style={{ display: "flex", gap: '0', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: 5 }}>
                                                <Rate style={{ margin: 0 }} disabled allowHalf value={calculateAverageRating(product.ratings)} />
                                            </div>
                                        ) : (
                                            null
                                        )}
                                        <div style={{ marginTop: 5 }}>
                                            <p style={{ fontWeight: 700, color: 'red', height: '20px' }}>
                                                {product?.variant.find((variant) => variant.memory === selectedMemories[product._id])?.newPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                        </div>
                                    </div>
                                }
                            />
                        </Card>
                    </NavLink>
                ))}
        </div>
    );
};

export default HomeProductCard;