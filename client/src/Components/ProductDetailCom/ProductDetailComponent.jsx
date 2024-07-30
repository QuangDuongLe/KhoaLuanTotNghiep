import React, { useState, useEffect } from "react"
import { Button, Col, Image, Row, Table, Rate, message, Breadcrumb, Skeleton, notification } from 'antd'
import {
    WrapperStyleColImage,
    WrapperStyleImageSmall,
    WrapperStyleImageBig,
    WrapperStyleTextSell,
    WrapperPriceTextProduct,
    WrapperPropTable,
    WrapperDetail,
    WrapperPolicy,
} from "./style"
import { RetweetOutlined, PropertySafetyOutlined, DropboxOutlined, GiftOutlined } from '@ant-design/icons'
import ButtonComponent from "../ButtonComponent/ButtonComponent"
import ProductDescription from "./productdesscription"
import CommentBox from "./commentcomponent"
import axios from "axios"
import { NavLink, useParams } from "react-router-dom"
import { ArrowLeftOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons"
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Rating from "./ratecomponent"
import ProductSale from "./productsale"
import { useSelector } from "react-redux"
import { MDBBtn, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalHeader } from "mdb-react-ui-kit"
import './button.css'
import SaleProduct from "../Slider/saleProduct"


const { Column, ColumnGroup } = Table;

const ProductDetailComponents = () => {
    const user = useSelector((state) => state.user)
    const [productDetails, setProductDetails] = useState(null);
    const { productName, memory } = useParams();
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSold, setSelectedSold] = useState({});
    const [selectedMemories, setSelectedMemories] = useState({});
    const [selectedSKU, setSelectedSKU] = useState({});
    const [selectedQuantity, setSelectedQuantity] = useState({});
    const [expanded, setExpanded] = useState(false);
    const [propExpanded, setPropExpanded] = useState(false);
    const [centredModal, setCentredModal] = useState(false);
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const toggleShow = () => setCentredModal(!centredModal);
    const [inputValue, setInputValue] = useState('');

    const toggleExpand = () => {
        setExpanded(!expanded);
    };
    const collapse = () => {
        setExpanded(false);
    };
    const calculateTotalRatings = (product) => {
        if (!product || !product.ratings) {
            return 0;
        }

        return product.ratings.length;
    }
    const PrevArrow = ({ onClick }) => {
        return <div className="slick-arrow slick-prev" onClick={onClick}></div>;
    };

    const NextArrow = ({ onClick }) => {
        return <div className="slick-arrow slick-next" onClick={onClick} ></div>;
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1200,
        appendDots: (dots) => (
            <ul style={{ position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)', listStyle: 'none', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {dots}
            </ul>),

    };


    useEffect(() => {
        if (memory !== `undefined`) {
            axios.get(`${process.env.REACT_APP_API_URL}/product/getDetails/${productName}`)
                .then((response) => {
                    const productDetails = response.data.data;
                    setProductDetails(productDetails);
                    const { category, brand } = productDetails;
                    setCategory(category);
                    setBrand(brand);
                    const defaultMemory = memory;
                    const initialMemories = {
                        [productDetails._id]: defaultMemory
                    };
                    setSelectedMemories(initialMemories);
                    document.title = `${productName} - ${memory}`;

                    if (productDetails && productDetails.variant) {
                        productDetails.variant.forEach((variant) => {
                            if (variant.memory === defaultMemory && variant.attributes && variant.attributes.length > 0) {
                                const defaultColor = variant.attributes[0].color;
                                setSelectedColor((prevSelected) => ({
                                    ...prevSelected,
                                    [variant._id]: defaultColor,
                                }));
                                const selectedAttribute = variant.attributes.find((attribute) => attribute.color === defaultColor);
                                if (selectedAttribute) {
                                    setSelectedSold((prevSelected) => ({
                                        ...prevSelected,
                                        [variant._id]: selectedAttribute.sold,
                                    }));
                                    setSelectedSKU((prevSelected) => ({
                                        ...prevSelected,
                                        [variant._id]: selectedAttribute.sku,
                                    }));
                                    setSelectedQuantity((prevSelected) => ({
                                        ...prevSelected,
                                        [variant._id]: selectedAttribute.quantity,
                                    }));
                                }
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error fetching product details:', error);
                });
        } else {
            axios.get(`${process.env.REACT_APP_API_URL}/product/getDetails/${productName}`)
                .then((response) => {
                    const productDetails = response.data.data;
                    setProductDetails(productDetails);
                    const { category, brand } = productDetails;
                    setCategory(category);
                    setBrand(brand);
                    const initialMemories = {
                        [productDetails._id]: productDetails.variant[0].memory
                    };
                    setSelectedMemories(initialMemories);
                    document.title = `${productName}`;
                    if (productDetails && productDetails.variant) {
                        productDetails.variant.forEach((variant) => {
                            if (variant.memory === productDetails.variant[0].memory && variant.attributes && variant.attributes.length > 0) {
                                const defaultColor = variant.attributes[0].color;
                                setSelectedColor((prevSelected) => ({
                                    ...prevSelected,
                                    [variant._id]: defaultColor,
                                }));
                                const selectedAttribute = variant.attributes.find((attribute) => attribute.color === defaultColor);
                                if (selectedAttribute) {
                                    setSelectedSold((prevSelected) => ({
                                        ...prevSelected,
                                        [variant._id]: selectedAttribute.sold,
                                    }));
                                    setSelectedSKU((prevSelected) => ({
                                        ...prevSelected,
                                        [variant._id]: selectedAttribute.sku,
                                    }));
                                    setSelectedQuantity((prevSelected) => ({
                                        ...prevSelected,
                                        [variant._id]: selectedAttribute.quantity,
                                    }));
                                }
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error fetching product details:', error);
                });
        }
    }, [productName, memory]);
    let encodedProductName = encodeURIComponent(productName);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const handleAddToCart = async () => {
        try {
            setIsAddingToCart(true);
            if (memory !== 'undefined') {
                const selectedVariant = productDetails.variant.find((variant) => variant.memory === memory);
                if (selectedVariant) {
                    const selectedSKUName = selectedSKU[selectedVariant._id]
                    await axios.post(`${process.env.REACT_APP_API_URL}/cart/addCart?userId=${user._id}&productName=${encodedProductName}&SKU=${selectedSKUName}&quantity=${quantity}`)
                        .then((response) => {
                            if (response.data.success) {
                                notification.success({
                                    message: 'Thông báo',
                                    description: 'Thêm vào giỏ hàng thành công.'
                                });
                            }
                            else {
                                {
                                    notification.error({
                                        message: 'Thông báo',
                                        description: response.data.error
                                    });
                                }
                            }
                        })
                }
            } else {
                const selectValues = Object.values(selectedSKU);
                const selectedColorName = selectValues[selectValues.length - 1];
                await axios.post(`${process.env.REACT_APP_API_URL}/cart/addCart?userId=${user._id}&productName=${encodedProductName}&SKU=${selectedColorName}&quantity=${quantity}`)
                    .then((response) => {
                        if (response.data.success) {
                            notification.success({
                                message: 'Thông báo',
                                description: 'Thêm vào giỏ hàng thành công.'
                            });
                        }
                        else {
                            { 
                                notification.error({
                                    message: 'Thông báo',
                                    description: response.data.error
                                });
    
                            }
                        }
                    })

            }
        } catch (error) {
            console.error('Lỗi:', error);
            notification.error({
                message: 'Thông báo',
                description: error.response.data.error
            });

        }
        finally {
            setIsAddingToCart(false);
        }
    };
    const handleClickaddToCart = () => {
        if (!isAddingToCart) {
            handleAddToCart();
        }
    };
    const handleBuyNow = async () => {
        try {
            setIsAddingToCart(true);
            if (memory !== 'undefined') {
                const selectedVariant = productDetails.variant.find((variant) => variant.memory === memory);
                if (selectedVariant) {
                    const selectedSKUName = selectedSKU[selectedVariant._id];
                    await axios.post(`${process.env.REACT_APP_API_URL}/cart/saveToCart?userId=${user._id}&productName=${encodedProductName}&SKU=${selectedSKUName}&quantity=${quantity}`)
                        .then((response) => {
                            if (response.data.success) {
                                const cartItems = response.data.data.items;

                                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                                window.location.href = '/payment-infor';
                                notification.success({
                                    message: 'Thông báo',
                                    description: 'Thêm vào giỏ hàng thành công.'
                                });
                            } else {
                                notification.error({
                                    message: 'Thông báo',
                                    description: response.data.error
                                });
                    
                            }
                        });
                }
            } else {
                const selectValues = Object.values(selectedSKU);
                const selectedColorName = selectValues[selectValues.length - 1];
                await axios.post(`${process.env.REACT_APP_API_URL}/cart/saveToCart?userId=${user._id}&productName=${encodedProductName}&SKU=${selectedColorName}&quantity=${quantity}`)
                    .then((response) => {
                        if (response.data.success) {
                            const cartItems = response.data.data.items;
                            localStorage.setItem('cartItems', JSON.stringify(cartItems));
                            notification.success({
                                message: 'Thông báo',
                                description: 'Thêm vào giỏ hàng thành công.'
                            });

                            window.location.href = '/payment-infor';
                        } else {
                            notification.error({
                                message: 'Thông báo',
                                description: response.data.error
                            });
                
                        }
                    });
            }
        } catch (error) {
            console.error('Lỗi:', error);
            notification.error({
                message: 'Thông báo',
                description: error.response.data.error
            });
        } finally {
            setIsAddingToCart(false);
        }
    };
    const handleClickNBuyNow = () => {
        if (!isAddingToCart) {
            handleBuyNow();
        }
    };
    const [quantity, setQuantity] = useState(1);

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    const handleIncreaseQuantity = () => {
        const selectedVariant = productDetails?.variant?.find(variant => variant.memory === (memory !== 'undefined' ? memory : selectedMemories[productDetails._id]));
        const selectedAttribute = selectedVariant?.attributes?.find(attribute => attribute.color === selectedColor[selectedVariant._id]);
        const maxQuantity = memory !== 'undefined' ? (selectedAttribute?.quantity < 3 ? selectedAttribute?.quantity : 3) : selectedAttribute?.quantity || 1;

        if (quantity < maxQuantity) {
            setQuantity(quantity + 1);
        } else if (quantity >= maxQuantity && maxQuantity === 3) {
            notification.error({
                message: 'Thông báo',
                description: `Vượt quá số lượng cho phép (${maxQuantity}). Vui lòng liên hệ trực tiếp để mua nhiều hơn`
            });

        } else {
            notification.error({
                message: 'Thông báo',
                description: `Vượt quá số lượng tồn kho (${maxQuantity})`
            });

        }
    };

    const handleChange = (e) => {
        const value = Number(e.target.value.replace(/[^0-9]/g, ''));
        const selectedVariant = productDetails?.variant?.find(variant => variant.memory === (memory !== 'undefined' ? memory : selectedMemories[productDetails._id]));
        const selectedAttribute = selectedVariant?.attributes?.find(attribute => attribute.color === selectedColor[selectedVariant._id]);
        const maxQuantity = memory !== 'undefined' ? (selectedAttribute?.quantity < 3 ? selectedAttribute?.quantity : 3) : selectedAttribute?.quantity || 1;

        if (value < 1) {
            setQuantity(1);
        } else if (value > maxQuantity) {
            setQuantity(maxQuantity);
        } else {
            setQuantity(value)
        }
    };
    const dataSource = productDetails && productDetails.properties
        ? Object.keys(productDetails.properties).map((propertyKey) => ({
            key: propertyKey,
            prop: propertyKey,
            info: productDetails.properties[propertyKey] || 'N/A',
        }))
        : [];
    if (memory !== `undefined`) {
        dataSource.unshift({
            key: '0',
            prop: 'Dung lượng lưu trữ',
            info: memory,
        });
    }
    let totalRating = 0;
    let averageRating = 0;
    let hasRatings = false;

    if (productDetails?.ratings.length > 0) {
        totalRating = productDetails.ratings.reduce((total, review) => total + review.rating, 0);
        averageRating = totalRating / productDetails.ratings.length;
        hasRatings = true;

    }
    const goBack = () => {
        window.history.back();
    };
    const displayData = propExpanded ? dataSource : dataSource.slice(0, 7);

    return (
        <WrapperDetail>
            <div style={{ background: '#fff', padding: '10px' }}>
                <button style={{ border: 'none', background: 'transparent' }} onClick={goBack}>
                    <ArrowLeftOutlined /> Quay lại
                </button>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>
                        <NavLink to="/">Home</NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <NavLink to={`/products/${category.name}`}>{category.name}</NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <NavLink to={`/products/${category.name}/${brand.name}`}>{brand.name}</NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{productName}</Breadcrumb.Item>
                    {memory && memory !== 'undefined' && memory !== 'null' && <Breadcrumb.Item>{memory}</Breadcrumb.Item>}
                </Breadcrumb>
            </div>

            <Row style={{ background: '#fff' }}>
            </Row>
            <Row className="product-pick">
                <Col className="slider-col">
                    <Slider {...sliderSettings} className="slider" style={{ border: '1px solid #ccc', borderRadius: '4px' }} prevArrow={<PrevArrow />} nextArrow={<NextArrow />} >
                        {productDetails && productDetails.thumnails.slice(1).map((thumbnail, index) => (
                            <WrapperStyleImageBig key={index}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image src={thumbnail} alt={`Thumbnail ${index}`} className="slider-image" preview={false} />
                                </div>
                            </WrapperStyleImageBig>
                        ))}
                    </Slider>
                    <Row style={{ display: 'flex', marginTop: '10px', padding: '5px', alignItems: 'center', justifyContent: 'flex-start', border: '1px solid #ccc', borderRadius: '4px' }}>

                        {productDetails && productDetails.variant && selectedMemories[productDetails._id] ? (
                            productDetails.variant
                                .filter((variant) => variant.memory === selectedMemories[productDetails._id])
                                .map((variant) =>
                                    variant.attributes ? (
                                        variant.attributes.map((attribute, attributeIndex) => (
                                            <WrapperStyleColImage key={attributeIndex} span={3} >
                                                <WrapperStyleImageSmall src={attribute.pictures} alt={`Attribute ${attributeIndex}`} preview={false} />
                                            </WrapperStyleColImage>
                                        ))
                                    ) : null
                                )
                        ) : null}
                    </Row>
                </Col>
                <br></br>
                <Col className="pick-col">
                    <div className="name-row">
                        {productDetails ? (
                            memory !== `undefined` ? (
                                <div className="product-name">
                                    <h5 style={{ margin: 0 }}>
                                        {productDetails.name} {memory}
                                    </h5>
                                    <div className="rate-ave">
                                        {hasRatings ? (
                                            <>
                                                <Rate disabled allowHalf value={averageRating} />
                                                <span style={{ fontSize: 16 }}>{averageRating.toFixed(1)}</span>
                                                <span style={{ fontSize: 13 }}>({calculateTotalRatings(productDetails)} đánh giá)</span>
                                            </>
                                        ) : (
                                            <span>Chưa có đánh giá</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="product-name">
                                    <h5 style={{ margin: 0 }}>
                                        {productDetails.name}
                                    </h5>
                                    <div className="rate-ave">
                                        {hasRatings ? (
                                            <>
                                                <Rate disabled allowHalf value={averageRating} />
                                                <span style={{ fontSize: 16 }}>{averageRating.toFixed(1)}</span>
                                            </>
                                        ) : (
                                            <span>Chưa có đánh giá</span>
                                        )}
                                    </div>
                                </div>
                            )
                        ) : (
                            <Skeleton active />
                        )}


                    </div>
                    <div className="button-row" style={{ padding: '0 0 10px' }}>
                        {productDetails?.variant.map((variant) => (
                            variant?.memory && (
                                <NavLink to={`/product/${productName}/${variant.memory}`}>
                                    <Button
                                        className={` memory-button ${variant?.memory === selectedMemories[productDetails._id] ? 'selected' : ''}`}

                                        onClick={() => {
                                            setSelectedMemories((prevSelected) => ({
                                                ...prevSelected,
                                                [productDetails._id]: variant?.memory,
                                            }));
                                        }}
                                        style={{ padding: '5px 5px', marginInlineEnd: '5px' }}>
                                        {variant?.memory}
                                    </Button>
                                </NavLink>
                            )
                        ))}
                    </div>
                    <div >
                        {productDetails?.variant.map((variant) => {
                            if (variant.attributes && variant.attributes.length > 0) {
                                const colors = variant.attributes.map((attribute) => attribute.color);
                                const uniqueColors = [...new Set(colors)];
                                if (variant.memory === selectedMemories[productDetails._id]) {
                                    return (
                                        <div style={{ padding: '10xp' }} key={variant._id}>
                                            <div className="btn-color" >

                                                {uniqueColors.map((color, index) => (
                                                    <Button
                                                        key={index}
                                                        className={`memory-button ${color === selectedColor[variant._id] ? 'selected' : ''
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedColor((prevSelected) => ({
                                                                ...prevSelected,
                                                                [variant._id]: color,
                                                            }));
                                                            const selectedAttribute = variant.attributes.find(
                                                                (attribute) => attribute.color === color
                                                            );
                                                            if (selectedAttribute) {
                                                                setSelectedSold((prevSelected) => ({
                                                                    ...prevSelected,
                                                                    [variant._id]: selectedAttribute.sold,
                                                                }));
                                                                setSelectedSKU((prevSelected) => ({
                                                                    ...prevSelected,
                                                                    [variant._id]: selectedAttribute.sku,
                                                                }));
                                                                setSelectedQuantity((prevSelected) => ({
                                                                    ...prevSelected,
                                                                    [variant._id]: selectedAttribute.quantity,
                                                                }));
                                                            } else {
                                                                setSelectedSold((prevSelected) => ({
                                                                    ...prevSelected,
                                                                    [variant._id]: 'N/A',
                                                                }));
                                                                setSelectedSKU((prevSelected) => ({
                                                                    ...prevSelected,
                                                                    [variant._id]: 'N/A',
                                                                }));
                                                                setSelectedQuantity((prevSelected) => ({
                                                                    ...prevSelected,
                                                                    [variant._id]: 'N/A',
                                                                }));
                                                            }
                                                        }}
                                                        style={{ padding: '5px 5px', marginInlineEnd: '5px' }}
                                                    >
                                                        {color}
                                                    </Button>
                                                ))}
                                            </div>
                                            <WrapperStyleTextSell>
                                                <p>SKU: {selectedSKU[variant._id]}</p>
                                                <p>Đã bán: {selectedSold[variant._id]}</p>
                                            </WrapperStyleTextSell>
                                        </div>
                                    );
                                }
                            }
                            return null;
                        })}
                    </div>
                    {productDetails ? (
                        <div>
                            <WrapperPriceTextProduct>
                                {productDetails?.variant.find((variant) => variant.memory === selectedMemories[productDetails._id])?.newPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </WrapperPriceTextProduct>
                            <span style={{ color: '#000', textDecoration: 'line-through' }}>
                                {productDetails?.variant.find((variant) => variant.memory === selectedMemories[productDetails._id])?.oldPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </span>
                        </div>
                    ) : (
                        <Skeleton active />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {productDetails?.variant && productDetails.variant.map((variant) => (
                            variant.attributes && variant.attributes.length > 0 && (
                                <>
                                    {variant.memory === selectedMemories[productDetails._id] && (
                                        <>
                                            {selectedQuantity[variant._id] > 0 ? (
                                                <>
                                                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                                                        <div style={{ background: '#fff', display: 'flex', alignItems: 'center' }}>
                                                            <h7 style={{ marginRight: '10px' }}>Số lượng:</h7>
                                                            <button style={{
                                                                alignItems: 'center', background: 'transparent', border: 0, border: '1px solid rgba(0, 0, 0, .09)', borderRadius: '2px', color: 'rgba(0, 0, 0, .8)', cursor: 'pointer', display: 'flex',
                                                                fontSize: '.875rem', fontWeight: 300, height: '32px', justifyContent: 'center', letterSpacing: 0, lineHeight: 1, outline: 'none', transition: 'background-color .1s cubic-bezier(.4,0,.6,1)', width: '32px'
                                                            }}
                                                                onClick={handleDecreaseQuantity}><MinusOutlined /></button>
                                                            <input style={{
                                                                WebkitAppearance: 'none', borderLeft: 0, borderRight: 0, borderRadius: 0, boxSizing: 'border-box', cursor: 'text', fontSize: '16px', fontWeight: '400', height: '32px', textAlign: 'center', width: '50px', alignItems: 'center', background: 'transparent', border: 0, border: '1px solid rgba(0, 0, 0, .09)', color: 'rgba(0, 0, 0, .8)', display: 'flex', justifyContent: 'center', letterSpacing: 0, lineHeight: 1, outline: 'none', transition: 'background-color .1s cubic-bezier(.4,0,.6,1)'
                                                            }}
                                                                type="text"
                                                                pattern="[0-9]*"
                                                                inputmode="numeric"
                                                                min={1}
                                                                value={quantity}
                                                                onChange={handleChange}></input>
                                                            <button style={{
                                                                alignItems: 'center', background: 'transparent', border: 0, border: '1px solid rgba(0, 0, 0, .09)', borderRadius: '2px', color: 'rgba(0, 0, 0, .8)', cursor: 'pointer', display: 'flex',
                                                                fontSize: '.875rem', fontWeight: 300, height: '32px', justifyContent: 'center', letterSpacing: 0, lineHeight: 1, outline: 'none', transition: 'background-color .1s cubic-bezier(.4,0,.6,1)', width: '32px'
                                                            }}
                                                                onClick={handleIncreaseQuantity}><PlusOutlined /></button>
                                                            <span style={{ marginLeft: '10px' }}>
                                                                {productDetails?.variant && productDetails.variant.map((variant) => (
                                                                    variant.attributes && variant.attributes.length > 0 && (
                                                                        <>

                                                                            {variant.memory === selectedMemories[productDetails._id] && (
                                                                                <div>
                                                                                    {selectedQuantity[variant._id] !== 'N/A' ? `${selectedQuantity[variant._id]} sản phẩm có sẵn` : 'Sản phẩm không có sẵn'}
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    )))}
                                                            </span>

                                                        </div>
                                                    </div >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                                                        <ButtonComponent
                                                            bordered={false}
                                                            size={40}
                                                            styleButton={{
                                                                background: 'rgb(225,57,69)',
                                                                height: '48px',
                                                                width: '100%',
                                                                border: 'none',
                                                                borderRadius: '4px'
                                                            }}
                                                            onClick={handleClickNBuyNow}
                                                            textButton={'Mua Ngay'}
                                                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                                        />
                                                        <ButtonComponent
                                                            bordered={false}
                                                            size={40}
                                                            styleButton={{
                                                                background: 'rgb(225,57,69)',
                                                                height: '48px',
                                                                width: '100%',
                                                                border: 'none',
                                                                borderRadius: '4px'
                                                            }}
                                                            onClick={handleClickaddToCart}
                                                            textButton={'Thêm Vào Giỏ'}
                                                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <Button
                                                    type="primary"
                                                    size='medium'
                                                    style={{
                                                        background: '#ccc',
                                                        border: 'none',
                                                        color: '#000',
                                                        boxShadow: 'none',
                                                        borderRadius: '4px',
                                                        width: '100%',
                                                        height: '48px'
                                                    }}
                                                    disabled
                                                >
                                                    Hết Hàng
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </>
                            )
                        ))}
                    </div>
                    <br></br>
                </Col>
                <Row>
                    <Col className="policy-col">
                        <WrapperPolicy>
                            <div className="policy_intuitive cate42 scenarioNomal">
                                <div className="policy">
                                    <ul className="policy__list">
                                        <li className="policy-item">
                                            <RetweetOutlined style={{ fontSize: '30px', left: 0, position: 'absolute', top: '18px' }}></RetweetOutlined>
                                            <p>
                                                1 đổi 1 trong&nbsp;
                                                <b>3 ngày&nbsp;</b>đối với sản phẩm là điện thoại và trong thời gian bảo hành đối với sản phẩm là phụ kiện&nbsp;
                                                <a href="/" title="Chính sách dổi trả">Xem chi tiết</a>
                                            </p>
                                        </li>
                                        {productDetails && productDetails.warrantyPeriod ? (
                                            <li className="policy-item" data-field="IsSameBHAndDT">
                                                <PropertySafetyOutlined style={{ fontSize: '30px', left: 0, position: 'absolute', top: '18px' }}></PropertySafetyOutlined>
                                                <p>Bảo hành chính hãng điện thoại&nbsp;
                                                    <b>{productDetails.warrantyPeriod} tháng</b> tại các trung tâm bảo hành hãng&nbsp;
                                                    <a href="/" title="Chính sách bảo hành">Xem chính sách bảo hành</a>
                                                </p>
                                            </li>
                                        ) : (
                                            <li className="policy-item" data-field="IsSameBHAndDT">
                                                <PropertySafetyOutlined style={{ fontSize: '30px', left: 0, position: 'absolute', top: '18px' }}></PropertySafetyOutlined>
                                                <p> Không bảo hành
                                                </p>
                                            </li>
                                        )}
                                        {productDetails && productDetails.include ? (
                                            <li className="policy-item">
                                                <DropboxOutlined style={{ fontSize: '30px', left: 0, position: 'absolute', top: '18px' }}></DropboxOutlined>
                                                <p>Bộ sản phẩm gồm: {productDetails.include} </p>
                                            </li>
                                        ) : null}
                                    </ul>

                                </div>
                            </div>
                        </WrapperPolicy>
                    </Col>
                    <Col className="sale-col">
                        <Row style={{ height: 'auto', textAlign: 'justify' }}>
                            {productDetails && productDetails.promotion ? (
                                <div style={{ fontSize: '14px' }}>
                                    <div style={{ fontSize: '20px', color: 'red' }}> <GiftOutlined /> Khuyến mãi </div>
                                    <div>(chỉ áp dụng tại cửa hàng)</div>
                                    <ProductSale promotion={productDetails.promotion} />
                                </div>
                            ) : (
                                null
                            )}
                        </Row>
                    </Col>
                </Row>
            </Row>
            <hr className="my-4" />
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
                <Col className="des-col">
                    <div
                        style={{
                            height: expanded ? 'auto' : '50em',
                            overflowY: 'hidden',
                            textAlign: 'justify',
                            position: 'relative',
                        }}
                    >
                        {productDetails ? (
                            <ProductDescription description={productDetails.desc} />
                        ) : (
                            <Skeleton active />
                        )}

                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            background: 'linear-gradient(to bottom, transparent, white)',
                            boxSizing: 'border-box',
                            display: 'flex',
                            paddingTop: '20px',
                            justifyContent: 'center',
                        }}
                    >
                        {!expanded ? (
                            <Button onClick={toggleExpand} style={{ width: '200px', textTransform: 'uppercase', cursor: 'pointer' }}>
                                Xem thêm
                            </Button>
                        ) : (
                            <Button onClick={collapse} style={{ width: '200px', textTransform: 'uppercase', cursor: 'pointer' }}>
                                Thu gọn
                            </Button>
                        )}
                    </div>

                </Col>
                <Col className="prop-col">
                    <WrapperPropTable dataSource={displayData} pagination={false}>
                        <ColumnGroup title="Thông số kỹ thuật">
                            <Column dataIndex="prop" key="prop" />
                            <Column
                                dataIndex="info"
                                key="info"
                                render={(text, record) => {
                                    const containsHTML = /<[a-z][\s\S]*>/i.test(text);
                                    return containsHTML ? (
                                        <div dangerouslySetInnerHTML={{ __html: text }} />
                                    ) : (
                                        text
                                    );
                                }}
                            />
                        </ColumnGroup>
                    </WrapperPropTable>
                    {!propExpanded && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                            <Button onClick={toggleShow}>Xem thêm</Button>
                        </div>
                    )}
                </Col>
            </Row>
            <hr className="my-4" />
            <Row>
                <Rating productName={productName}></Rating>
            </Row>
            <hr className="my-4" />
            <div style={{ background: '#B63245', padding: '10px', borderRadius: '4px' }}>
                <h3 style={{ margin: '0 10px 10px 0', color: '#fff', fontWeight: 'bold' }}>
                    {user._id ? 'Sản phẩm dành cho bạn:' : 'Có thể bạn quan tâm:'}
                </h3>
                <SaleProduct userId={user._id} ></SaleProduct></div>
            <hr className="my-4" />
            <Row >
                <CommentBox />
            </Row>
            <hr className="my-4" />
            <MDBModal tabIndex='-1' show={centredModal} setShow={setCentredModal}  >
                <MDBModalDialog centered style={{ maxHeight: '80%', overflow: 'auto' }}>
                    <MDBModalContent >
                        <MDBModalHeader>
                            <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }} >
                            <Table dataSource={dataSource} pagination={false}>
                                <ColumnGroup title="Thông số kỹ thuật">
                                    <Column dataIndex="prop" key="prop" />
                                    <Column
                                        dataIndex="info"
                                        key="info"
                                        render={(text, record) => {
                                            const containsHTML = /<[a-z][\s\S]*>/i.test(text);
                                            return containsHTML ? (
                                                <div dangerouslySetInnerHTML={{ __html: text }} />
                                            ) : (
                                                text
                                            );
                                        }}
                                    />
                                </ColumnGroup>
                            </Table>
                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </WrapperDetail>
    )
}

export default ProductDetailComponents;