import React, { useState, useEffect } from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBBadge, MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from 'mdb-react-ui-kit';
import axios from "axios";
import moment from 'moment';
import { message } from "antd";
import { useSelector } from "react-redux";

const ProductOrder = ({ items, orderCode, orderVoucher, orderSubtotal, ordertotalPay, orderStatus, orderId,orderShippingFee }) => {
    const user = useSelector((state) => state.user)
    const [updatedItems, setUpdatedItems] = useState(items);
    const headers = {
        token: `Bearer ${user.access_token}`,
    };

    useEffect(() => {
        setUpdatedItems(items);
    }, [items]);

   
    return (
        <div>
            <WrapperHeader>Danh sách sản phẩm của đơn hàng {orderCode}</WrapperHeader>
            <div style={{ marginTop: '15px', overflowY: 'auto', overflowX: 'auto' }}>
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
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
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

export default ProductOrder;
