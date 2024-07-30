import React, { useState, useEffect } from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBBadge, MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import axios from "axios";
import moment from 'moment';
import { Modal, Tooltip, message, notification } from "antd";
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import Loading from "../../LoadingComponents/Loading";

const ProductChange = ({ items, orderCode, orderVoucher, orderSubtotal, ordertotalPay, orderShippingFee }) => {
    const user = useSelector((state) => state.user)
    const [updatedItems, setUpdatedItems] = useState(items);
    const headers = {
        token: `Bearer ${user.access_token}`,
    };
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setUpdatedItems(items);
        setLoading(false)
    }, [items]);
    const handleUpdateStatus = async (orderCode, productId, productVariantId, newStatus) => {
        setLoading(true);
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/order/update-change-status`, {
                orderCode,
                productId,
                productVariantId,
                newStatus
            }, { headers });
            if (response.data.success) {
                setUpdatedItems(response.data.order.items)
                notification.success({
                    message: 'Thông báo',
                    description: 'Đổi thành công'
                  });
            }
        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: error.response.data.error
              });

        } finally {
            setLoading(false);
        }
    };

    const showConfirm = (orderCode, productId, productVariantId, newStatus) => {
        console.log(productId)
        Modal.confirm({
            title: newStatus === 'Đã hoàn thành' ? 'Xác nhận đồng ý' : 'Xác nhận từ chối',
            content: `Bạn có chắc chắn muốn ${newStatus === 'Đã hoàn thành' ? 'đồng ý' : 'từ chối'} thay đổi này không?`,
            okText: 'Có',
            cancelText: 'Không',
            onOk() {
                handleUpdateStatus(orderCode, productId, productVariantId, newStatus);
            },
        });
    };

    return (
        <div>
            <WrapperHeader>Danh sách sản phẩm của đơn hàng {orderCode}</WrapperHeader>
            <div style={{ marginTop: '15px', overflowY: 'auto', overflowX: 'auto' }}>
                <Loading isLoading={loading}>
                    <MDBTable bordered align='middle' className='floating-table'>
                        <MDBTableHead>
                            <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                                <th scope='col' style={{ verticalAlign: 'middle' }}>Tên sản phẩm</th>
                                <th scope='col' style={{ verticalAlign: 'middle' }}>Mã sản phẩm</th>
                                <th scope='col' style={{ verticalAlign: 'middle' }}>Màu</th>
                                <th scope='col' style={{ verticalAlign: 'middle' }}>Số lượng</th>
                                <th scope='col' style={{ verticalAlign: 'middle' }}>Bảo hành</th>
                                <th scope='col' style={{ verticalAlign: 'middle' }}>Giá</th>
                                <th scope='col' style={{ verticalAlign: 'middle' }}>Tổng tiền</th>
                                <th scope='col' style={{ verticalAlign: 'middle' }}>Đổi sản phẩm</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {updatedItems && updatedItems.length > 0 && updatedItems.map((item, index) => (
                                <tr key={index} style={{ textAlign: 'center' }}>
                                    <td>
                                        <div className='d-flex align-items-center'>
                                            <img
                                                src={item.pictures}
                                                alt={item.product.name}
                                                style={{ width: '45px', height: '45px' }}
                                            />
                                            <div className='ms-3'>
                                                <p className='fw-bold mb-1'>{item.product.name} {item.memory}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{item.sku}</td>
                                    <td>{item.color}</td>
                                    <td><p className='fw-normal mb-1'>{item.quantity}</p></td>
                                    <td>{item.product.warrantyPeriod} tháng</td>
                                    <td>
                                        <MDBBadge color='danger' pill style={{ fontSize: '13px' }}>
                                            {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </MDBBadge>
                                    </td>
                                    <td>
                                        <MDBBadge color='danger' pill style={{ fontSize: '13px' }}>
                                            {item.subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </MDBBadge>
                                    </td>
                                    <td style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {['Đang xử lý'].includes(item.change.status) && (
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                                                    <Tooltip title="Đồng ý">
                                                        <MDBBtn
                                                            color="success"
                                                            onClick={() => showConfirm(orderCode, item.product._id, item.productVariant, 'Đã hoàn thành')}
                                                            disabled={loading}
                                                        >
                                                            <CheckOutlined />
                                                        </MDBBtn>
                                                    </Tooltip>
                                                    <Tooltip title="Từ chối">
                                                        <MDBBtn
                                                            color='danger'
                                                            onClick={() => showConfirm(orderCode, item.product._id, item.productVariant, 'Từ chối')}
                                                            disabled={loading}
                                                        >
                                                            <CloseOutlined />
                                                        </MDBBtn>
                                                    </Tooltip>
                                                </div>
                                                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                                    <div>Trạng thái: {item.change.status}</div>
                                                    <div>Ngày yêu cầu đổi: {item.change.changeDates}</div>
                                                    <div>Số lần đổi: {item.change.changeCount}</div>
                                                </div>
                                            </div>
                                        )}
                                        {['Từ chối', 'Đã hoàn thành'].includes(item.change.status) && (
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                                    <div>Trạng thái: {item.change.status}</div>
                                                    <div>
                                                        Ngày hoàn thành yêu cầu: {item.change.status === 'Từ chối' ? item.change.changeDates : item.change.changeDateComplete}
                                                    </div>
                                                    <div>Số lần đổi: {item.change.changeCount}</div>
                                                </div>
                                            </div>
                                        )}

                                    </td>
                                </tr>
                            ))}
                        </MDBTableBody>
                    </MDBTable>
                </Loading>
                <div>
                    <div style={{ textAlign: 'right', fontSize: '15px' }}>
                        <strong>Tạm tính:</strong> {orderSubtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </div>
                </div>
                <div>
                    <div style={{ textAlign: 'right', fontSize: '15px' }}>
                        <strong>Phí ship:</strong> +{orderShippingFee?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </div>
                </div>
                {orderVoucher && (
                    <div>
                        <div style={{ textAlign: 'right', fontSize: '15px' }}>
                            <strong>Mã giảm giá ({orderVoucher.code}):</strong> -
                            {Math.min(orderVoucher.discount * orderSubtotal, orderVoucher.maxPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </div>
                    </div>
                )}
                <div>
                    <div style={{ textAlign: 'right', fontSize: '15px' }}>
                        <strong>Tổng giá trị phải trả:</strong> {ordertotalPay.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductChange;
