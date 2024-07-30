import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Col, Input, Modal, Row, message, Button, Select, Steps, notification } from "antd";
import ReviewModal from "./review";
import { ArrowLeftOutlined } from "@ant-design/icons"
import { WrapperDetailOrder } from "./order/style";
import Header from "../../Components/Header/header";
import { MDBBtn, MDBModalContent, MDBModalDialog } from "mdb-react-ui-kit";
import moment from 'moment';
import { useSelector } from "react-redux";
import Loading from "../../Components/LoadingComponents/Loading";
const { Option } = Select;

const OrderDetail = () => {
    const { orderCode } = useParams();
    const user = useSelector((state) => state.user)
    const [completeOrder, setCompleteOrder] = useState(false);
    const [cancelOrder, setCancelOrder] = useState(false);
    const [cancelOrder2, setCancelOrder2] = useState(false);
    const [changeProduct, setChangeProduct] = useState(false);
    const [centredModal1, setCentredModal1] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [loading, setLoading] = useState(true);
    const toggleShow1 = () => setCentredModal1(!centredModal1);
    const handleReviewClick = (productId) => {
        toggleShow1();
        setCurrentProductId(productId);
    };
    const [orderDetails, setOrderDetails] = useState(null);
    const [reason, setReason] = useState('');
    const [selectedReason, setSelectedReason] = useState('');
    const [reasonChange, setReasonChange] = useState('');
    const [selectedReasonChange, setSelectedReasonChange] = useState('');
    const predefinedReasons = [
        'Thay đổi ý định',
        'Tìm được giá rẻ hơn ở nơi khác',
        'Đặt nhầm sản phẩm',
        'Thay đổi địa chỉ',
    ];
    const ChangeReasons = [
        "Lỗi phần cứng (không khởi động, tự tắt nguồn, màn hình lỗi,...)",
        "Lỗi phần mềm (máy treo, ứng dụng lỗi, hệ điều hành không ổn định,...)",
        "Lỗi âm thanh (loa rè, micro không hoạt động,...)",
        "Lỗi kết nối (không nhận SIM, không kết nối được Wi-Fi,...)",
        "Lỗi camera (không mở được, hình ảnh/video mờ,...)",
        "Lỗi cảm biến (cảm biến vân tay, khuôn mặt không hoạt động,...)",
        "Lỗi ngoại hình (vết xước, móp từ nhà sản xuất,...)",
        "Sản phẩm không đúng như mô tả (màu sắc, dung lượng, cấu hình,...)",
        "Lỗi phụ kiện kèm theo (tai nghe, cáp sạc, củ sạc,...)",
        "Lỗi ốp lưng (bong tróc, không khớp với thiết bị,...)",
        "Lỗi tai nghe (âm thanh không rõ ràng, mất tính năng nhất định,...)",
        "Lỗi củ sạc (không sạc được, nóng máy khi sạc,...)",
        "Lỗi cáp sạc (không nhận thiết bị, bị hư hỏng dây,...)",
        "Lỗi sạc dự phòng (không sạc được, không duy trì pin,...)"
    ];

    const handleChangeReason1 = (e) => {
        setReasonChange(e.target.value);
        if (e.target.value) {
            setSelectedReasonChange('');
        }
    };

    const handleSelectReason1 = (value) => {
        setSelectedReasonChange(value);
        setReasonChange('');
    };
    const handleChangeReason = (e) => {
        setReason(e.target.value);
        if (e.target.value) {
            setSelectedReason('');
        }
    };

    const handleSelectReason = (value) => {
        setSelectedReason(value);
        setReason('');
    };

    const steps = [
        'Chờ xác nhận',
        'Đang chuẩn bị đơn hàng',
        'Đang giao hàng',
        'Đã giao hàng',
        'Đã hoàn thành',
        'Đã huỷ'
    ];

    useEffect(() => {
        document.title = "Chi Tiết Đơn Hàng";

        axios.get(`${process.env.REACT_APP_API_URL}/order/oderDetails/${orderCode}?userId=${user._id}`)
            .then((response) => {
                setOrderDetails(response.data.data)
                setLoading(false)
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API: ', error);
                setLoading(false)
            });
    }, [orderCode, user]);
    const updateOrderDetails = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/order/oderDetails/${orderCode}?userId=${user._id}`)
            .then((response) => {
                setOrderDetails(response.data.data)
                setLoading(false)
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API: ', error);
                setLoading(false)
            });
    };

    const goBack = () => {
        window.history.back();
    };
    const handleCompleteOrder = async (orderCode) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/order/completeOrderUser/${orderCode}?userId=${user._id}`);
            if (response.data.success) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Hoàn thành đơn hàng thành công'
                });

                window.history.back();
            }
        } catch (error) {
            console.error('Lỗi khi xác nhận đơn hàng:', error);
            notification.error({
                message: 'Thông báo',
                description: 'Đã xảy ra lỗi khi xác nhận đơn hàng'
            });

        }
    };
    const onClose1 = () => {
        setCancelOrder(false);
        setReason('');
        setSelectedReason('');
    };
    const onClose2 = () => {
        setCancelOrder2(false);
        setReason('');
        setSelectedReason('');
    };
    const onClose3 = () => {
        setChangeProduct(false);
        setReason('');
        setSelectedReason('');
        updateOrderDetails();
    };
    const [productId, setProductId] = useState('');
    const [productVariantId, setProductVariantId] = useState('');
    const handleChangeModal = (item) => {
        setChangeProduct(true);
        setProductId(item.product._id)
        setProductVariantId(item.productVariant)
    };
    const handleCancel = async () => {
        const finalReason = selectedReason || reason;

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/order/cancel/${orderCode}?userId=${user._id}`, { reason: finalReason });
            if (response.data.success) {
                setSelectedReason('')
                setReason('');
                notification.success({
                    message: 'Thông báo',
                    description: 'Huỷ đơn hàng thành công'
                });

                onClose1();
                window.location.href = "/cancel-order-success";
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: response.data.error || 'Đã xảy ra lỗi khi huỷ đơn hàng'
                });

            }
        } catch (error) {
            console.error('Lỗi khi xác nhận đơn hàng:', error);
            notification.error({
                message: 'Thông báo',
                description: 'Đã xảy ra lỗi khi xác nhận đơn hàng'
            });

        }
    };

    const handleCancel1 = async () => {
        const finalReason = selectedReason || reason;

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/order/cancel1/${orderCode}?userId=${user._id}`, { reason: finalReason });
            if (response.data.success) {
                setSelectedReason('')
                setReason('');
                notification.success({
                    message: 'Thông báo',
                    description: 'Huỷ đơn hàng thành công'
                });

                onClose1();
                window.location.href = "/cancel-order-success2";
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: response.data.error || 'Đã xảy ra lỗi khi huỷ đơn hàng'
                });

            }
        } catch (error) {
            console.error('Lỗi khi xác nhận đơn hàng:', error);
            notification.error({
                message: 'Thông báo',
                description: 'Đã xảy ra lỗi khi xác nhận đơn hàng'
            });
        }
    };
    const handleChange = async () => {
        const finalReason = selectedReasonChange || reasonChange;

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/order/request-item-change/${user._id}`,
                { orderCode: orderCode, productId: productId, productVariantId: productVariantId, reason: finalReason }
            );

            if (response.data.success) {
                setSelectedReasonChange('');
                setReasonChange('');
                notification.success({
                    message: 'Thông báo',
                    description: 'Yêu cầu đổi sản phẩm thành công'
                });

                onClose3();
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: response.data.error || 'Đã xảy ra lỗi khi yêu cầu đổi sản phẩm'
                });

            }
        } catch (error) {
            console.error('Lỗi khi yêu cầu đổi sản phẩm:', error);
            notification.error({
                message: 'Thông báo',
                description: 'Đã xảy ra lỗi khi yêu cầu đổi sản phẩm'
            });

        }
    };
    const handlePayment = () => {
        const paymentData = {
            orderCode: orderCode,
            amount: orderDetails.totalPay,
            language: '',
            bankCode: '',
            orderinfo: `${orderDetails.userName} thanh toán, mã hoá đơn là: `
        };

        axios.post(`${process.env.REACT_APP_API_URL}/VNPAY/create_payment_url`, paymentData)
            .then(response => {
                window.location.href = response.data.data;
            })
            .catch(error => {
                console.error(error);
            });
    };
    return (
        <div>
            <Loading isLoading={loading}>
                <WrapperDetailOrder>
                    <div className="mainContainer" >
                        {orderDetails && (
                            <div style={{ display: 'flex', gap: '30px' }}>
                                <div style={{ width: '75%' }}>
                                    <div className="nav" style={{ marginBottom: '20px' }}>
                                        <button className="btn-back" style={{ display: 'flex', alignItems: 'center' }} onClick={goBack}>
                                            <ArrowLeftOutlined />&nbsp;Quay lại
                                        </button>
                                        <div className="pagetitle" >Thông tin đơn hàng</div>
                                    </div>
                                    <div>
                                        <div>
                                            <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', border: '1px solid #efefef', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '4px', marginBottom: '20px' }}>
                                                <label style={{ margin: '0 0 5px 0', fontWeight: 600, textTransform: 'uppercase' }}>Thông tin nhận hàng:</label>
                                                <p style={{ margin: 0 }}>{orderDetails.userName}</p>
                                                <p style={{ margin: 0 }}>{orderDetails.userPhone}</p>
                                                <p style={{ margin: 0 }}>{orderDetails.address}</p>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #efefef', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '4px', marginBottom: '20px' }}>

                                                {orderDetails.items.map((item, index) => (
                                                    <div key={index} className='pre-order'>
                                                        <div className="img-con">
                                                            <img className='img-product' src={item.pictures} alt={`Product ${index + 1}`} />
                                                        </div>
                                                        <div className="inf-con">
                                                            <div style={{ width: '100%' }}>
                                                                <a href={`/product/${item.product.name}/${item.memory}`} className="pdname" style={{ margin: 0, color: '#000', fontWeight: 'bold' }}>{item.product.name} {item.memory}</a>
                                                            </div>
                                                            <div >
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <p style={{ margin: 0 }}>Phân loại:&nbsp;<span>{item.color}</span></p>
                                                                        <p style={{ margin: 0, textAlign: 'right' }}>x<span>{item.quantity}</span></p>
                                                                    </div>
                                                                    <p style={{ margin: 0, textAlign: 'right', color: '#B63245' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</p>
                                                                </div>
                                                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'right' }}>
                                                                    {orderDetails.completeDate && (
                                                                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'right' }}>
                                                                            <p style={{ margin: 0 }}>Hạn bảo hành:</p>
                                                                            <span style={{ margin: 0 }}>
                                                                                {item.change?.changeDateComplete ? (
                                                                                    moment(item.change?.changeDateComplete, 'DD/MM/YYYY HH:mm:ss')
                                                                                        .add(item.product.warrantyPeriod, 'months')
                                                                                        .format('DD-MM-YYYY')
                                                                                ) : (
                                                                                    moment(orderDetails.completeDate, 'DD/MM/YYYY HH:mm:ss')
                                                                                        .add(item.product.warrantyPeriod, 'months')
                                                                                        .format('DD-MM-YYYY')
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {orderDetails && orderDetails.status === "Đã hoàn thành" ? (
                                                                        item.rated ? (
                                                                            <span style={{ color: "#C13346", cursor: 'default', textAlign: 'right' }}>Đã đánh giá</span>
                                                                        ) : (
                                                                            <a style={{ color: "#C13346", cursor: 'pointer', textAlign: 'right' }} onClick={() => handleReviewClick(item.product)}> Đánh giá</a>
                                                                        )
                                                                    ) : null}
                                                                    {orderDetails && orderDetails.status === "Đã hoàn thành" ? (
                                                                        item.change.status === 'Đang xử lý' || item.change.status === 'Từ chối' ? (
                                                                            <>
                                                                                <span style={{ color: "#C13346", cursor: 'default', textAlign: 'right' }}>
                                                                                    Trạng thái đổi sản phẩm: {item.change.status}
                                                                                </span>
                                                                                <span style={{ color: "#C13346", cursor: 'default', textAlign: 'right' }}>
                                                                                    Thời gian {item.change.status === 'Đang xử lý' ? 'yêu cầu' : 'xử lý'} đổi sản phẩm: {item.change.changeDates}
                                                                                </span>

                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {item.change.changeDateComplete && (
                                                                                    <>
                                                                                        <span style={{ color: "#C13346", cursor: 'default', textAlign: 'right' }}>
                                                                                            Trạng thái đổi sản phẩm: {item.change.status}
                                                                                        </span>
                                                                                        <span style={{ color: "#C13346", cursor: 'default', textAlign: 'right' }}>
                                                                                            Thời gian hoàn thành yêu cầu đổi sản phẩm: {item.change.changeDateComplete}
                                                                                        </span>
                                                                                    </>
                                                                                )}
                                                                                <a
                                                                                    style={{ color: "#C13346", cursor: 'pointer', textAlign: 'right' }}
                                                                                    onClick={() => {
                                                                                        const today = moment();
                                                                                        const completeDate = moment(orderDetails.completeDate, 'DD/MM/YYYY HH:mm:ss');
                                                                                        let maxDate;
                                                                                        if (item.memory) {
                                                                                            if (item.change?.changeDateComplete) {
                                                                                                const changeDateComplete = moment(item.change.changeDateComplete, 'DD/MM/YYYY HH:mm:ss');
                                                                                                maxDate = moment(changeDateComplete).add(3, 'days');
                                                                                            } else {
                                                                                                maxDate = moment(completeDate).add(3, 'days');
                                                                                            }

                                                                                            if (today.isSameOrBefore(maxDate)) {
                                                                                                handleChangeModal(item);
                                                                                            } else {
                                                                                                notification.warning({
                                                                                                    message: 'Thông báo',
                                                                                                    description: 'Đã quá hạn yêu cầu gửi sản phẩm'
                                                                                                });

                                                                                            }
                                                                                        } else {
                                                                                            const warrantyEndDate = moment(completeDate).add(item.product.warrantyPeriod, 'months');
                                                                                            if (today.isSameOrBefore(warrantyEndDate)) {
                                                                                                handleChangeModal(item);
                                                                                            } else {
                                                                                                notification.warning({
                                                                                                    message: 'Thông báo',
                                                                                                    description: 'Đã quá hạn yêu cầu gửi sản phẩm'
                                                                                                });
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    Đổi sản phẩm
                                                                                </a>
                                                                            </>
                                                                        )
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <p style={{ textAlign: 'right', padding: '10px', background: '#fff', borderRadius: '4px', fontWeight: 600, border: '1px solid #efefef', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '20px' }}>
                                                VOUCHER: &nbsp;
                                                {orderDetails.voucher ? (
                                                    <span style={{ color: "#B63245" }}>
                                                        - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                                            orderDetails.voucher.discount * orderDetails.totalPay > orderDetails.voucher.maxPrice
                                                                ? orderDetails.voucher.maxPrice
                                                                : orderDetails.voucher.discount * orderDetails.totalPay
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: "#B63245" }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0)}</span>
                                                )}
                                                <br></br>
                                                PHÍ SHIP:&nbsp;<span style={{ color: "#B63245" }}>+ {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetails.shippingFee)}</span>
                                                <br></br>
                                                THÀNH TIỀN:&nbsp;<span style={{ color: "#B63245" }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetails.totalPay)}</span>
                                            </p>
                                            <div style={{ padding: '10px', border: '1px solid #efefef', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px', borderRadius: '4px' }}>
                                                <h6 style={{ margin: '0 0 5px 0' }}>Phương thức thanh toán:</h6>
                                                <p>{orderDetails.paymentMethod}</p>
                                                <h6 style={{ margin: '0 0 5px 0' }}>Tình trạng thanh toán:</h6>
                                                <p>{orderDetails.isPay}</p>
                                            </div>
                                            <div style={{ padding: '10px', background: '#fff', border: '1px solid #efefef', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px', borderRadius: '4px' }}>
                                                <p>Mã đơn hàng:<span> {orderDetails.orderCode}</span></p>
                                                <p>Thời gian đặt hàng: <span> {orderDetails.createDate}</span></p>
                                                <p>Thời gian hoàn thành đơn hàng: <span> {orderDetails?.completeDate}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                        {orderDetails && (orderDetails.status === "Chờ xác nhận" && orderDetails.paymentMethod !== "Thanh toán khi nhận hàng" && orderDetails.isPay === 'Đang chờ thanh toán') && (
                                            <MDBBtn style={{ backgroundColor: "#C13346", width: '49%' }} onClick={handlePayment}>Thanh toán đơn hàng</MDBBtn>
                                        )}
                                        {orderDetails && (orderDetails.status === "Chờ xác nhận") && (
                                            <MDBBtn style={{ backgroundColor: "#C13346", width: '49%' }} onClick={() => setCancelOrder(true)}>Yêu cầu hủy/trả hàng</MDBBtn>
                                        )}
                                        {orderDetails && (orderDetails.status === "Đang chuẩn bị đơn hàng") && (
                                            <MDBBtn style={{ backgroundColor: "#C13346", width: '49%' }} onClick={() => setCancelOrder2(true)}>Yêu cầu hủy/trả hàng</MDBBtn>
                                        )}
                                        {orderDetails && orderDetails.status === "Đã giao hàng" && (
                                            <MDBBtn style={{ color: '#C13346', backgroundColor: '#FFF', width: '49%' }} onClick={() => setCompleteOrder(true)}>Đã nhận được hàng</MDBBtn>
                                        )}
                                        <Modal
                                            title="Hoàn thành đơn hàng"
                                            visible={completeOrder}
                                            onOk={() => {
                                                handleCompleteOrder(orderCode)
                                                setCompleteOrder(false);
                                            }}
                                            onCancel={() => setCompleteOrder(false)}
                                        >
                                            <p>Bạn có chắc chắn muốn hoàn thành đơn hàng này</p>
                                        </Modal>
                                        <Modal
                                            title="Huỷ đơn hàng"
                                            visible={cancelOrder}
                                            onCancel={onClose1}
                                            footer={[
                                                <Button key="back" onClick={onClose1}>
                                                    Huỷ
                                                </Button>,
                                                <Button key="submit" type="primary" onClick={handleCancel} disabled={!reason && !selectedReason}>
                                                    Xác nhận
                                                </Button>,
                                            ]}
                                        >
                                            <p>Bạn có muốn huỷ đơn hàng {orderCode} này không?</p>
                                            <Select
                                                placeholder="Chọn lý do huỷ đơn"
                                                style={{ width: '100%', marginBottom: '10px' }}
                                                onChange={handleSelectReason}
                                                value={selectedReason}
                                                allowClear
                                            >
                                                {predefinedReasons.map((reason, index) => (
                                                    <Option key={index} value={reason}>
                                                        {reason}
                                                    </Option>
                                                ))}
                                            </Select>
                                            <p>hoặc</p>
                                            <Input
                                                placeholder="Nhập lý do huỷ đơn"
                                                value={reason}
                                                onChange={handleChangeReason}
                                                disabled={!!selectedReason}
                                            />
                                        </Modal>
                                        <Modal
                                            title="Huỷ đơn hàng"
                                            visible={cancelOrder2}
                                            onCancel={onClose2}
                                            footer={[
                                                <Button key="back" onClick={onClose2}>
                                                    Huỷ
                                                </Button>,
                                                <Button key="submit" type="primary" onClick={handleCancel1} disabled={!reason && !selectedReason}>
                                                    Xác nhận
                                                </Button>,
                                            ]}
                                        >
                                            <p>Bạn có muốn huỷ đơn hàng {orderCode} này không?</p>
                                            <Select
                                                placeholder="Chọn lý do huỷ đơn"
                                                style={{ width: '100%', marginBottom: '10px' }}
                                                onChange={handleSelectReason}
                                                value={selectedReason}
                                                allowClear
                                            >
                                                {predefinedReasons.map((reason, index) => (
                                                    <Option key={index} value={reason}>
                                                        {reason}
                                                    </Option>
                                                ))}
                                            </Select>
                                            <p>hoặc</p>
                                            <Input
                                                placeholder="Nhập lý do huỷ đơn"
                                                value={reason}
                                                onChange={handleChangeReason}
                                                disabled={!!selectedReason} // Disable custom input when a predefined reason is selected
                                            />
                                        </Modal>
                                    </div>
                                </div>
                                <div style={{ padding: '1px 0' }}>
                                    <div className="pagetitle" >Tình trạng đơn hàng</div>
                                    <Steps
                                        style={{ marginTop: '20px' }}
                                        direction="vertical"
                                        size="large"
                                        current={steps.indexOf(orderDetails.status)}
                                        items={steps.map(step => ({ title: step }))}
                                    />
                                </div>
                            </div>
                        )}


                        <Modal
                            visible={centredModal1}
                            onCancel={toggleShow1}
                            footer={null}>
                            <MDBModalDialog size='xl'>
                                <ReviewModal productId={currentProductId} onClose={() => { toggleShow1(); updateOrderDetails(); }} orderCode={orderCode}></ReviewModal>
                            </MDBModalDialog>
                        </Modal>
                        <Modal
                            title="Đổi sản phẩm"
                            visible={changeProduct}
                            onCancel={onClose3}
                            footer={[
                                <Button key="back" onClick={onClose3}>
                                    Huỷ
                                </Button>,
                                <Button key="submit" type="primary" onClick={handleChange} disabled={!reasonChange && !selectedReasonChange}>
                                    Xác nhận
                                </Button>,
                            ]}
                        >
                            <p>Hãy chọn lý do đổi sản phẩm</p>
                            <Select
                                placeholder="Chọn lý do huỷ đơn"
                                style={{ width: '100%', marginBottom: '10px' }}
                                onChange={handleSelectReason1}
                                value={selectedReasonChange}
                                allowClear
                            >
                                {ChangeReasons.map((reason, index) => (
                                    <Option key={index} value={reason}>
                                        {reason}
                                    </Option>
                                ))}
                            </Select>
                            <p>hoặc</p>
                            <Input
                                placeholder="Nhập lý do huỷ đơn"
                                value={reasonChange}
                                onChange={handleChangeReason1}
                                disabled={!!selectedReasonChange}
                            />
                        </Modal>
                    </div>
                </WrapperDetailOrder>
            </Loading>
        </div>
    );
}

export default OrderDetail;
