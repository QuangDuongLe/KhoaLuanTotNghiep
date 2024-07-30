import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useLocation } from "react-router-dom";
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBRow,
    MDBInput,
} from 'mdb-react-ui-kit';
import { PageWrapper, WrapperPaymentInfo } from "./style";
import { Button, Cascader, Col, Row, Modal, FloatButton, message, Skeleton, Select, notification } from "antd";
import Header from "../../Components/Header/header";
import { ArrowLeftOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux";
import { Option } from "antd/es/mentions";
import { el } from "date-fns/locale";

const PaymentInfo = () => {
    const user1 = useSelector((state) => state.user)
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalShipping, setTotalShipping] = useState(0);
    const [shippingFee, setShippingFee] = useState(0)
    const [isLoading, setLoading] = useState(false)
    const [vouchers, setVouchers] = useState([]);

    const fetchVouchers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/voucher/availableVouchers`);
            const data = response.data.data;
            setVouchers(data);
        } catch (error) {
            console.error('Error fetching vouchers:', error);
        }
    };

    const calculateTotalPrice = (cartData) => {
        return cartData.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    };
    const [order, setOrder] = useState(
        {
            paymentMethod: 'Thanh toán khi nhận hàng',
            shippingMethod: 'Giao tận nơi'
        }
    );



    const addOrder = event => {
        event.preventDefault();
        setLoading(true);
        if (!/^\d{10}$/.test(order.userPhone)) {
            alert("Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại gồm 10 chữ số.");
            setLoading(false);
            return;
        }

        if (deliveryOption === 'storePickup' && !selectedStore) {
            alert('Vui lòng chọn địa chỉ cửa hàng trước khi thêm đơn hàng.');
            setLoading(false);
            return;
        }
        axios.post(`${process.env.REACT_APP_API_URL}/order/addOrder/${user1._id}`, order)
            .then((response) => {
                const orderCode = response.data.order.orderCode;
                if (order.paymentMethod === 'VNPAY') {
                    const paymentData = {
                        orderCode: orderCode,
                        amount: totalVoucher || totalShipping,
                        language: '',
                        bankCode: '',
                        orderinfo: `${user1.fullName} thanh toán, mã hoá đơn là: `
                    };
                    axios.post(`${process.env.REACT_APP_API_URL}/VNPAY/create_payment_url`, paymentData)
                        .then(response => {
                            window.location.href = response.data.data;
                        })
                        .catch(error => {
                            console.error(error);
                        });
                } else {
                    window.location.href = `/order-success?orderCode=${orderCode}`;
                }
                localStorage.removeItem('cartItems');
                setOrder({});
            })
            .catch((error) => {
                notification.error({
                    message: 'Thông báo',
                    description: error.response.data.error
                });

            })
            .finally(() => {
                setLoading(false);
            });
    };

    const goBack = () => {
        window.history.back();
    };

    const [voucherApplied, setVoucherApplied] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('atStore');
    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value);
        if (e.target.value === 'atStore') {
            setOrder((prevOrder) => ({
                ...prevOrder,
                paymentMethod: 'Thanh toán khi nhận hàng',
            }));
            if (voucherApplied) {
                setOrder((prevOrder) => ({
                    ...prevOrder,
                    vouchercode: null,
                    totalPay: total,
                }));
                settotalVoucher(null);
                setVoucherApplied(false);
                setVoucher(null)
            }
        } else if (e.target.value === 'vnpay') {
            setOrder((prevOrder) => ({
                ...prevOrder,
                paymentMethod: 'VNPAY',
            }));
            if (voucherApplied) {
                setOrder((prevOrder) => ({
                    ...prevOrder,
                    vouchercode: null,
                    totalPay: total,
                }));
                settotalVoucher(null);
                setVoucherApplied(false);
                setVoucher(null)
            }
        }
    };
    const onChange = event => {
        event.preventDefault();
        setOrder({ ...order, [event.target.name]: event.target.value })
    }
    const [deliveryOption, setDeliveryOption] = useState('homeDelivery');
    const [reload, setReload] = useState(false);

    const handleRadioChange = async (e) => {
        setDeliveryOption(e.target.value);

        if (e.target.value === 'homeDelivery') {
            setSelectedStore(null);

            setOrder((prevOrder) => ({
                ...prevOrder,
                shippingMethod: 'Giao tận nơi',
            }));

            if (voucher) {
                const defaultAddress = user1.addRess.find(address => address.isDefault);

                if (defaultAddress) {
                    const address = defaultAddress.address;

                    setOrder((prevOrder) => ({
                        ...prevOrder,
                        address
                    }));

                    const addressParts = address.split(',').map(part => part.trim());
                    const provinceName = addressParts[addressParts.length - 1];

                    const fetchedFee = await fetchShippingFee(provinceName);

                    if (fetchedFee !== 0) {
                        let discountedAmount = total * voucher.discount;
                        if (discountedAmount > voucher.maxPrice) {
                            discountedAmount = voucher.maxPrice;
                        }

                        setOrder((prevOrder) => ({
                            ...prevOrder,
                            shippingFee: fetchedFee,
                            totalPay: total + fetchedFee - discountedAmount,
                            vouchercode: voucher.code
                        }));

                        settotalVoucher(total + fetchedFee - discountedAmount);
                    }
                } else {
                    console.error('Không tìm thấy địa chỉ mặc định.');
                }
            } else {
                setReload(!reload);
            }
        }
    };
    const [selectedStore, setSelectedStore] = useState(null);
    const pickStore = (value) => {
        if (value && value.length > 0) {
            setSelectedStore(value[0]);
            setOrder((prevOrder) => ({
                ...prevOrder,
                shippingMethod: 'Nhận tại cửa hàng',
                address: value[0],
            }));
            if (voucher) {
                setShippingFee(0)
                let discountedAmount = total * voucher.discount;
                if (discountedAmount > voucher.maxPrice) {
                    discountedAmount = voucher.maxPrice;
                }
                settotalVoucher(total - discountedAmount)
                setOrder(prevOrder => ({
                    ...prevOrder,
                    shippingFee: 0,
                    totalPay: total - discountedAmount
                }));
            } else {
                setShippingFee(0)
                setTotalShipping(total)
                setOrder(prevOrder => ({
                    ...prevOrder,
                    shippingFee: 0,
                    totalPay: total
                }));
            }
        }
    };
    const options = [
        {
            value: 'Chi nhánh 1, Số 1 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, Thành phố Hồ Chí Minh',
            label: 'Chi nhánh 1, Số 1 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, Thành phố Hồ Chí Minh',
        },
        {
            value: 'Chi nhánh 2,Hà Nội',
            label: 'Hà Nội',
        },
    ];

    useEffect(() => {
        document.title = `Đặt Hàng`;
        fetchVouchers();
        const fetchData = async () => {
            const cartItems = localStorage.getItem('cartItems');
            if (cartItems) {
                const parsedCartItems = JSON.parse(cartItems);
                setData(parsedCartItems);
                const totalPrice = calculateTotalPrice(parsedCartItems);
                setSubTotal(totalPrice);
                setTotal(totalPrice);
                setOrder(prevOrder => ({
                    ...prevOrder,
                    subTotal: totalPrice,
                    totalPay: totalPrice,
                    items: parsedCartItems
                }));
            } else {
                if (user1 && user1._id) {
                    try {
                        const response = await axios.get(`${process.env.REACT_APP_API_URL}/cart/getCartChecked/${user1._id}`);
                        const cartData = response.data.data.filter(item => item.checked); // Lọc ra những mặt hàng đã được chọn
                        setData(cartData);
                        const totalPrice = calculateTotalPrice(cartData);
                        setSubTotal(totalPrice);
                        setTotal(totalPrice);
                        setOrder(prevOrder => ({
                            ...prevOrder,
                            subTotal: totalPrice,
                            totalPay: totalPrice,
                            items: cartData
                        }));
                    } catch (error) {
                        console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
                    }
                }
            }

            if (user1.addRess && user1.addRess.length > 0) {
                const defaultAddress = user1.addRess.find(address => address.isDefault);
                if (defaultAddress) {
                    const address = defaultAddress.address;
                    setOrder(prevOrder => ({
                        ...prevOrder,
                        address
                    }));

                    const addressParts = address.split(',').map(part => part.trim());
                    const provinceName = addressParts[addressParts.length - 1];

                    // Gọi fetchShippingFee chỉ khi useEffect đã cập nhật xong
                    fetchShippingFee(provinceName);
                }
            }

            setOrder(prevOrder => ({
                ...prevOrder,
                userName: user1.fullName,
                userEmail: user1.email,
                userPhone: user1.phone_number,
            }));
        };

        fetchData();
    }, [user1, reload]); // Chỉ gọi lại khi user1 thay đổi

    useEffect(() => {
        if (total !== 0) {
            setTotalShipping(total + shippingFee);
            setOrder(prevOrder => ({
                ...prevOrder,
                shippingFee: shippingFee,
                totalPay: total + shippingFee
            }));
        }
    }, [shippingFee, total]);
    const fetchShippingFee = async (provinceName) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/province/getShippingFeeByProvinceName`, { provinceName });
            if (response.data.success) {
                const fee = response.data.data.shippingFee;
                setShippingFee(fee);
                return fee;
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: response.data.message
                });


                return 0;
            }
        } catch (error) {
            console.error('Error fetching shipping fee:', error);
            notification.error({
                message: 'Thông báo',
                description: 'Không thể lấy phí vận chuyển. Vui lòng thử lại.'
            });
            return 0;
        }
    };


    const handleAddressChange = async (value) => {
        setOrder((prevOrder) => ({ ...prevOrder, address: value }));

        const addressParts = value.split(',').map(part => part.trim());
        const provinceName = addressParts[addressParts.length - 1];

        const fetchedFee = await fetchShippingFee(provinceName);

        if (voucher && fetchedFee !== 0) {
            let discountedAmount = total * voucher.discount;
            if (discountedAmount > voucher.maxPrice) {
                discountedAmount = voucher.maxPrice;
            }

            setOrder((prevOrder) => ({
                ...prevOrder,
                shippingFee: fetchedFee,
                totalPay: total + fetchedFee - discountedAmount,
                vouchercode: voucher.code
            }));

            settotalVoucher(total + fetchedFee - discountedAmount);
        }
    };


    const [data, setData] = useState(null);
    const [vouchercode, setVoucherCode] = useState('');
    const [voucher, setVoucher] = useState(null)
    const [totalVoucher, settotalVoucher] = useState(null);
    const checkVoucher = (data) => {
        setVoucherCode(data);

        axios.post(`${process.env.REACT_APP_API_URL}/voucher/useVoucher?userId=${user1._id}`, { code: data, paymentMethod: order.paymentMethod, items: order.items })
            .then((response) => {
                if (response.data.success) {
                    const voucher = response.data.data;
                    let discountedAmount = total * voucher.discount;
                    if (discountedAmount > voucher.maxPrice) {
                        discountedAmount = voucher.maxPrice;
                    }
                    setOrder(prevOder => ({
                        ...prevOder,
                        totalPay: totalShipping - discountedAmount,
                        vouchercode: voucher.code
                    }));
                    settotalVoucher(totalShipping - discountedAmount);
                    setVoucherApplied(true);
                    setVoucher(voucher)
                    notification.success({
                        message: 'Thông báo',
                        description: 'Áp dụng voucher thành công.'
                    });
                } else {
                    notification.error({
                        message: 'Thông báo',
                        description: response.data.error
                    });

                }
            })
            .catch((error) => {
                notification.error({
                    message: 'Thông báo',
                    description: error.response.data.error
                });

            });
    };
    let discountedAmount = 0;
    if (voucher) {
        discountedAmount = total * voucher.discount;
        if (discountedAmount > voucher.maxPrice) {
            discountedAmount = voucher.maxPrice;
        }
    }
    const handleCancelVoucher = () => {
        if (voucherApplied) {
            setOrder((prevOrder) => ({
                ...prevOrder,
                vouchercode: null,
                totalPay: total,
            }));
            settotalVoucher(null);
            setVoucherApplied(false);
            setVoucher(null)
            notification.success({
                message: 'Thông báo',
                description: 'Huỷ voucher thành công.'
            });

        }
    };
    const isSmallScreen = window.innerWidth <= 500;
    const isCartEmpty = !data || data.length === 0;

    const renderContent = () => {
        if (!isCartEmpty) {
            return (
                <PageWrapper>
                    <div className="container">
                        <WrapperPaymentInfo>
                            <div className="nav">
                                <button className="btn-back" onClick={goBack}>
                                    <ArrowLeftOutlined /> Quay lại
                                </button>
                                <div className="nav__item2">
                                    <span>Thanh toán</span>
                                </div>
                            </div>
                            <form onSubmit={addOrder}>
                                <div className="block-box">
                                    <div className="view-list">
                                        <div className="view-list__wrapper">
                                            {data && data.map((item) => (
                                                <div className="item" key={item.product._id}>
                                                    <img className='item__img' src={item.pictures} alt={item.product.name} />
                                                    <div className="item-info">
                                                        <div className="item-name">
                                                            <span>{item.product.name} {item.memory}</span>
                                                            <span>Màu: {item.color}</span>
                                                        </div>
                                                        <div className="item-price">
                                                            <div style={{ width: '50%' }}>
                                                                <div className="box-info__box-price">
                                                                    <span className="product__price--show">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(item.price)}</span>
                                                                    {item.productVariant.oldPrice && (
                                                                        <span className="product__price--through">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(item.productVariant.oldPrice)}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div style={{ width: '50%', justifyContent: 'space-between', display: 'flex' }}>
                                                                <span>Số lượng:<span style={{ color: 'red' }}> {item.quantity}</span>
                                                                </span>
                                                                <span>Bảo hành:<span style={{ color: 'red' }}> {item.product.warrantyPeriod} tháng</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <hr></hr>
                                    <div className="block-customer">
                                        <p>Thông tin khách hàng</p>
                                        <div className="cus-inf">
                                            <div className="cus-infor" >
                                                <MDBInput wrapperClass='mb-4' label='Họ và tên' name="userName" value={order.userName} onChange={onChange} type='text' tabIndex="1" />
                                            </div>
                                            <div className="cus-infor">
                                                <MDBInput
                                                    wrapperClass='mb-4'
                                                    label='Số điện thoại'
                                                    name="userPhone"
                                                    value={order.userPhone}
                                                    onChange={onChange}
                                                    type='tel'
                                                    required
                                                    pattern="[0-9]{10}"
                                                    maxLength="10"
                                                    tabIndex="3" />
                                            </div>
                                        </div>
                                        <MDBInput wrapperClass='mb-4' label='Email' name="userEmail" value={order.userEmail} onChange={onChange} type='email' tabIndex="4" />
                                        <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }} className="picking-address">
                                            <div style={{ width: '100%' }}>
                                                <input
                                                    type="radio"
                                                    name="deliveryOption"
                                                    value="homeDelivery"
                                                    checked={deliveryOption === 'homeDelivery'}
                                                    onChange={handleRadioChange}
                                                />
                                                <label>&nbsp;Giao tận nơi</label>
                                                {deliveryOption === 'homeDelivery' && (
                                                    <Select
                                                        style={{ width: '100%', marginTop: '10px' }}
                                                        value={order.address}
                                                        onChange={handleAddressChange}
                                                    >
                                                        {user1.addRess && user1.addRess.map((address, index) => (
                                                            <Option key={index} value={address.address}>
                                                                {address.address}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                )}
                                            </div>
                                            <div style={{ width: '100%' }}>
                                                <input
                                                    type="radio"
                                                    name="deliveryOption"
                                                    value="storePickup"
                                                    checked={deliveryOption === 'storePickup'}
                                                    onChange={handleRadioChange}
                                                />
                                                <label>&nbsp;Nhận tại cửa hàng</label>
                                                {deliveryOption === 'storePickup' && (
                                                    <div>
                                                        <Cascader
                                                            className="cascader"
                                                            options={options}
                                                            onChange={pickStore}
                                                            placeholder="Hãy chọn địa chỉ cửa hàng"
                                                            dropdownHeight={20}
                                                            dropdownRender={(menu) => (
                                                                <div
                                                                    style={{
                                                                        width: isSmallScreen ? '300px' : '100%', // Sử dụng điều kiện media để thiết lập width
                                                                        ...(isSmallScreen && { overflowX: 'auto' }),
                                                                    }}
                                                                >
                                                                    {menu}
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                )}
                                                <br></br>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="payment-quote">
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                value="atStore"
                                                checked={selectedPayment === 'atStore'}
                                                onChange={handlePaymentChange}
                                            />
                                            &nbsp; Thanh toán khi nhận hàng
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                value="vnpay"
                                                checked={selectedPayment === 'vnpay'}
                                                onChange={handlePaymentChange}
                                            />
                                            &nbsp; VNPAY  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABGlBMVEX////tHCQAWqkAW6rsAAAAV6cAn9wAUqYAod0AVKWludftFyAASKIAS6T6y8wAVKf83t7r8PcATqUqabD85+ftCBXV3uzzg4buOj8AlNMAmtr0jY/Bz+P71tftEx34+/2Qqc8AabP98PD3FRCbzuwAcblaUJTX6/cAgsUAYa4AjM2x2PDG4vQAldgAeb/5wsN5v+f4uLmyw93q9fun0+5IreDwUlbxYWTydnlAdLX5xMXL5fVkt+OBw+hErOD3rrD1nqDuLDL2pKbvR0zxZ2rtJi1jir8AP6BTf7p0lsX0k5WFocpWYKBPjMP3CADwWFx9SIRHO4q3Nl60EUl2ap5LUpiGdaHfLj5QbqtqTY2ZQHPNLUrN2OkANJxpzO3pAAAPG0lEQVR4nO2dCXfaOhbHhTfsAFlonIU2JiGkBExoWqBNG5KmTZtu89o3b+bNmvn+X2N0JUuWZLOEsB/9z2kKkjH6+V7dK8kLCGlpaWlpaWlpaWlpaWlpaWlpaWlpaWlp9dPO2tqz8rwbMUU9MwvZbDH/Y97tmJoO87YByj6Zd0umpMO8EWljNRFjwBVFFAFXElEGXEFEFXDlEJOAK4aYBrhSiOmAK4TYD3BlEPsDPgjx3fuX21Ns5SM0CHB0xKcW6E1lum0dS4MBR0W8tTIg31o8Mw4DHA3xtZ+hyi0c4nDAURDfMMDFQxwFcDjihZXJLChiKqBte5FseyTEpyJgYFl7ixNuUgBtzzw53S85WKX90xPTs4ci3oiA1uuD2bV/qJKAttHad12Hy3X3W9SQ/RHfS4A3CG2/fL8glAlA2zgleO5+4xSrsU/euKeGPQDxnQT4HlV+QV78sAh9MQHotQCodHpk4w4I8uyjUwcoW15fxAMVMOPT3jh/RBXQNvfBeieeLZV6J9iS7r5ppyNuSoAvUSUXLEpETQAeQb9T+EjFxgnEnaNUxE0rJwMGwaIkjQTgCbZUg2cH6qX8TQNXpiEmAP0gfj9fxKQFMQPpbcQzj1oQaVpHzKIbLVydDDcy4AsZcL6IhwXFFeu4C55EOHbLoQkD/20cUWrvxC0lkoYKuO3nMpnFQEymCQHQ8EquC4j0z36dlNsGMydHlAHfoW1LAZwfYsKCXsNxTr3YYxutOozZ6q0GMMY1EqIMuJ4GOC/EBCB0wn0Bg8cYPII7hQCUhqgCbqYBzgcxAWh4OBGaaiGrq+NUEePbLNyMCDgPxJSxKE4Up9By20wkQ2DajxGxA5Ok8fZAAjzoDzh7xJ3kbAJMaFNSTuLZ9bod5QoB0cPDcoxoPrdEgoGAM0d8mzRTnZkQJwiPmg0mGDCtoIwxIpgbj26eHwsAGPBgEOCMEcspE0Kc/urw/2mUMfD4jeQK/M+pc8QGR3T/ogAOtOCsEXcSYQactASt97ChNoxoeFM6bbVgWkHGagQxiqg49f92nBPaPtSCM0bcShJi5wQntU8iE8LwprVBJk+tFET7XxLgpjx9WgDEJOGRS8jsBh154uzvnkQBxztJIJrPxwGcJeK3DdWEJy7phthZiZFw3IkzvK0gbphikAHA9dEAZ4hYTgxocKAh9qIRlcUdmtsTiGMDzhBRTYgQQoHAdJ0WdVaHxJtGI4moBJnthwDODxETOtQ73YiQpD7cO6UUSLb9qgC+ewggfGRG66gyYj8b8izvMUTz+U8B0N9GLx4GmMn4b2ZDKCP27Yc8y0eIUpAJxgHEw4NZLYaLiBBLj4CjxGMpnRBKWR73RRmwgl4+HBAWAuaAGOdDMv7GWSOa7guIOPX/9lMADMYDhMWqOSDakXueuNGYJm2s1vpN6INBbkxAmEjOAREbjYQUm41L1SxvKEEmyFTkcxUPIJwdoIAIwVSeWyQQ5SDzCMCbWRLGiGx+aOD5IQs+EqI0Hww+V9DH8QD9XzMFjBH5HL/lOoksD4hfxSDzGY0N+HrGgBwReFrRtEJOgaS2JA7V/A/KCdGFBuSIOBXStTZPyvI08xvPJwR4OwdAhgiz+kYyy5OBgDQf9PeWDZAhwqy3pSDaRydkLCoEGQD8vmSA3FGd5EDGmCTg3twAI0Sy+qRkeSMF8OkSAjLElIGMAoj9bHcpAfsjmr+vCCBCm39NZvmGbf4hAr4ZH/DDvPmw1v9mm6aU5R3375n4YryM9Ua5dm10BYsAiBF//vGnGVnRNHH2/8c/j8WTS5+WHRAjWscf/vj9XzhpHP357//89/hYvOQAAN+MCfh53mRc61Yu8I9//vx5fHwsX1FBAf0+CMMAF+cqxf5Ln9YFQr/GBMwsEGBfRAB8vRKAfRCt3fEBcwsGmIr4GMBg4QBTEAHwdkxAfwEBE4iPAMwtJqCM6MP67diA8766tK/WLT9qItzgU/mwcoAIHXwi9y8Fu5sIvbSC4TRpgHO/PniItg8OoBMd3I43Ult8QKLNm70xDbgMgC/ATdWrYR8AuDlvgOF60On5ZQR8DOKSAI6PuDSAYyNaC3LD0ygaC3GZAMdCXC7AMRBneZZ+Mnog4vIBPhBxGQEfhLicgA9AtN7Nu6njakTE5QUcEXF216tNQyMgzvBytaloKOKyAw5FXH7AIYjW+3k3bxJa739bzGoAIrQZpC8rBsua6FP0JsWMOet2QVe2x9L6B2XxLbCCFYgxkl68tqzo/HDOt6y9VeMDVV7u3vqw1rh38X7hF0W1tLS0tLS0VkWVi10uperF7lOiFyje5qny6WgTLISeral6dS/+vsArsSYquxfKnkm7Fiq2Hof4yfIjqWe9KrQGT34+xtvcyNt8j2pghlR+UsgqKubv4uZtfYkrvjD0uzwvy0sk92zrwtvHAQpPU/O/K1VPyYQPbpfb41MGdbJHayz60bphqvLyh3zbbxu8OLvGCuPPeF+lPb+1SalRfPTvTNyy1ucySk0F4H1w3vgwqDdbk5oguuPsMJsgNM3iHdv2VVxt8EdJbeV5YUHy0+h45GXnHUfxjYKJM18+N9oun78HymX1n3OxYdcYguF5sTmLh0lCs7DDdnBY5Ni2uOOvxIbZb48GRCh2UyWOgH1yPn/JtpIj0l4KoVH/dlePcVgH++HFhBvxD4BE7gg4wq+CUNsa5gQA0QV/vq8vV3z3ObX47EN5aTCVEHxwrcBpIjtkhW5qZGOWAi8Xgg3lzu+gCSheCFTCSCbHPVd+uqM4s+1LKPTKAqm9L5qCinH/esWPhc3j5hrZOHs4CUCEcmwByb8Qi+GhKyz6SIQ58er6/oTIZLYpEkuQ0GGzMu8u3sdXHmSLUaLcKsjAj9R3HkakG6khurAMIhFKj3YYQMiNSNtdxHD23ROGmI+zQJn7L8sNxEeNwiNzPdd27KbiGTAoZaMAmVC843oA4Q5zyywQPoN32Wc83sYpETswTxnUtNRHC6/QpMRTov8pLoSnkuTY7SwKoZBYBhCWWbuJDe880iN5/rPFZ2R+430WYgvdZkPw48cqfvqB4KafwElvJELxmeMs8Q8gRCyCkKhSiCzEk0NBjJN8aGPUmY9uTA5QSIlCJrDEqEkIc8I96AG7p3UUQkgCxEkB9RXz3Q3xN7F2uJ9m1+gYIH8/SUKeEgMeQ8CuOT5+IYSWeGOMtTuUcKsQm4U4qVEUuWUjxUObLNlLdrK/CRY/jYt732vcN/2PCmGcWLi5BxCyBFhci/qkR1I/H4AXpSHnEz60SfTSSSjDWs7OhFUkJ+WE0thmewjhNy9uLPFN2vN45vekULJVEAnzk0oUTDfcTaPHGnz0hb4WE4oP9KCJvz9hmZLYRWgsjKPZyNpISYlIHNpQs09W26qbQsP9+MwmJ4y7bJT4+xNSE2ZtACROykLLYVpKRGw2QY6KPFWciF7zlPgxJoqngjGhMBsmiX/AyNswvGz0I4Kkhg1RuD8qo7IyN+LEBjOCeEqk8z8YyAXCczgEworYFQ/6EZbvvmSNJ3drkR++JU56/4zonic/pbfxjJGfPKCYEiGAkGmFcPpdIBQvSsDzrX6E0s6jyV4xEp8tbRzOkJD3LxjHHChOKhGKz4UIft0OyPhca2nLG6Y6qy9Pl5CnRBiLwrQiEJ8NJxGKtxsGkGaGEsq5TlBRHLhMmZAsuFA33aQjNnEqLxOiQL4kYRghddKioLRZ4tQJeUr0v6/LPElCdTI1hJCkh8L9TiwzNSVOmbASu+kFTgjBJ7FSIVSe5DWMEGa9cmY4ZCO3rDgHnDIh+sUXTuGFfLWkSkjmVqMSkvwnZ/d4liiCT5tQfoyj/GS4BCH6EIxMSJxUSX089ojl0yYUJw7KolQKoZT4BxNCglfnCvFixmFcOHVC8UGHyjXLSULx2auDCXcKZnJdkMdNw4gLC9MmFO9ZVh5fmEIoPC9pMOEPiCqJkSZfcxNS4vQJ0WeeMWQnRcn8gYSHmSRX9cXNyBJpQf0qvlwjxJoZELKfKEycRCOrcSo2+qRszac/4lCFno8pqOfINvjglJ+5me7cgumG3oqunMGIlqASl8J+pFtHhDu8hYbHgbbo+KWonCQTl/jzUU6MT9EY9hR/nL7y1LJ85fzStsWk3hxZuYDbgSlhuZDn+sJ64hYrlI2Iiwux/kdy5Y8vcUm+jqapFxfKmcTtA6aU2z9fXnymgbcsi9YmCqi2FCXLpmhELS0tLS2t6ai96tmrXBrjQ7Vw4u0Y+pWdsI16l4M2ueymFDZ77Xb65k6//XSb2O496VPjHKQH6tytVq+HEPbaV4mycq/WSdu27Lql6z77qYFXy7s6G62Vj1CbfsX5ZVit4f+b1TDqW/gVakKr2qgcVuFVu1olhx//j48HLoSjUqt2oBBvQS3XroZthxaXa7iY+STewAXCZrVTI2+jilK72sHfWO7gr7jEH6v28Yvx1exRQrcTli5RrxdWqd/gV1eohL/7vIlK1bB3ji6dTgdAy2dheI6PTCe8rqLQDTtnbeRUmz1imxou7rqocx12Sldh9zw8p/akG3QvURiGziW6vgrPqeef4e8p4X1Ww+7VdZPubTqEuO0YCQzaoxhQSgmb0PYz1K3RT9CqKrhoiRRiq3RR5G9X2DTYhg7+YNglkQj2gS57ZOse2UXzquyw7cnf63anCi/bUF+tTocQ+mF4VXajRqK2ywmx/5LmXbODG56dtxHxMozdBkLYuu2wI4XbX6IgsBOAJburuUBYve66VVJB0Alht02OFz2InUkTRmEyIoRWXjVjQvI2IuzG7hOelRkhsSE6P3PdmkIYCoSoRzbo1ZpdpUIi7E2DEJ3hNl1GhOishpMcIYFXqIsxnHYNt+XSQVfYWaGqjP90a81r8EN0TQjbDsv9IXaJag/1OpAayAEjIDWXzIQxIa6/Um143b7Ee8N7nIoNUbtbKvUQBNJmB9WuS26TFONXuNndkoPbGjolMOC5U4Jvb187JQxbxYVlhP0VBw/k9Loudfcrp9Qr41RScqr4L1ARENjgHF3VcEjDG5KKLqkAFwKnJ19xRfe2gAohFpUGDOGIo08/9Y2vWmNIvdNsdgaNTmCD6gyGL9MTztSdgaPwoRtoaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpja//A5CyoVvyMfctAAAAAElFTkSuQmCC" alt="Hình ảnh VNPAY" style={{ width: '100px', height: '100px' }} />
                                        </label>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="info-payment">
                                    <div className="block-promotion">
                                        <div className="block-promotion-input" style={{ width: '75%' }}>
                                            <Select
                                                placeholder="Chọn mã giảm giá"
                                                style={{ width: '100%', height: 'auto', overflowY: 'auto'}}
                                                onChange={checkVoucher}
                                                value={vouchercode}
                                                disabled={voucherApplied}

                                            >
                                                {vouchers.map(voucher => (
                                                    <Select.Option key={voucher._id} value={voucher.code}>
                                                        <div style={{ display: 'flex', gap: '20px', padding:'5px'  }}>
                                                            <img src="../../image/voucher.png" width={'170px'}></img>
                                                            <div>
                                                                {voucher.name}
                                                                <div>
                                                                    Giảm {voucher.discount * 100}% tối đa {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(voucher.maxPrice)}
                                                                </div>
                                                                <div>Áp dụng từ {voucher.startDate} đến {voucher.endDate}</div>
                                                            </div>
                                                        </div>
                                                    </Select.Option>
                                                ))}
                                            </Select>

                                        </div>
                                        <div className="button-vou">
                                            {voucherApplied ? (
                                                <Button
                                                    size='middle'
                                                    className="button__voucher"
                                                    onClick={handleCancelVoucher}
                                                    style={{color:'#B63245'}}
                                                >
                                                    Huỷ voucher
                                                </Button>
                                            ) : (
                                                <Button
                                                    size='middle'
                                                    className="button__voucher"
                                                    onClick={() => checkVoucher(vouchercode)}
                                                    style={{background:'#B63245', color:'#fff'}}

                                                >
                                                    Áp dụng
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="info-quote">
                                        <div className="info-quote__block">
                                            <div className="quote-block__item">
                                                <p className="quote-block__title">Tiền hàng (Tạm tính) </p>
                                                <p className="quote-block__value">
                                                    <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#FF3300' }}>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(subTotal)}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="quote-block__item">
                                                <p className="quote-block__title">Phí vận chuyển </p>
                                                <p className="quote-block__value">   <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#FF3300' }}>
                                                    + {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(shippingFee)}
                                                </span></p>
                                            </div>
                                            {discountedAmount !== 0 && (
                                                <div className="quote-block__item">

                                                    <p className="quote-block__title">Áp dụng voucher </p>
                                                    <p className="quote-block__value">
                                                        <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#FF3300' }}>
                                                            - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(discountedAmount)}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="info-quote__bottom">
                                            <p className="quote-bottom__title">Tổng tiền </p>
                                            <p className="quote-bottom__value">
                                                {totalVoucher ? (
                                                    <del style={{ fontSize: '17px' }}>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalShipping)} <br />
                                                    </del>
                                                ) : (
                                                    <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#FF3300' }}>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalShipping)}
                                                    </span>
                                                )}
                                                {totalVoucher && (
                                                    <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#FF3300' }}>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalVoucher)}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="bottom-bar">
                                    <div className="btn-submit">
                                        <button className="btn-next" type="submit" style={{ background: '#B63245' }}>{isLoading ? 'Đang đặt hàng...' : 'Đặt hàng'}</button>
                                    </div>
                                </div>
                            </form>
                        </WrapperPaymentInfo>
                    </div>
                    <FloatButton.BackTop />
                </PageWrapper >
            );
        } else if (isCartEmpty) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '25vh ', marginTop: '' }}>
                    <i style={{ fontSize: '100px', color: '#C13346' }} class="fas fa-box-open"></i>
                    <h2>BẠN CHƯA CÓ MÓN NÀO TRONG GIỎ HÀNG</h2>
                    <NavLink to={`/cart`}>
                        <Button size='large' style={{ background: '#C13346', color: '#fff' }}>
                            Đi Tới Giỏ Hàng
                        </Button>
                    </NavLink>
                </div>
            )
        }
    }
    return (
        <>
            {isLoading ? (
                <Skeleton style={{ padding: 10 }} active={true} />
            ) : (
                <>
                    {renderContent()}
                </>
            )}
        </>
    )
}

export default PaymentInfo;