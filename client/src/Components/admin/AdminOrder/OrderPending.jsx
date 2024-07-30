import React, { useState, useEffect } from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { Button, Dropdown, Input, Menu, Modal, Tooltip, message, notification  } from 'antd';
import { AppstoreFilled, CaretDownOutlined } from '@ant-design/icons';
import axios from "axios";
import Search from "antd/es/input/Search";
import "./Order.css";
import { useSelector } from "react-redux";
import ProductOrder from "./ProductOrder";
import Loading from "../../LoadingComponents/Loading";

const OrderPending = () => {
    const user = useSelector((state) => state.user)
    const headers = {
        token: `Bearer ${user.access_token}`,
    };
    const [orderData, setOrderData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState('');
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [orderCode, setOrderCode] = useState('');
    const [orderSubtotal, setOrderSubtotal] = useState('');
    const [orderVoucher, setOrderVoucher] = useState('');
    const [ordertotalPay, setOrderTotalPay] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true)
    const [triggerSearch, setTriggerSearch] = useState(false);
    useEffect(() => {
        document.title = "Quản Lý Đơn Hàng Chờ Xác Nhận";
        if (!searchResults) {
            setLoading(true);
            fetchOrders(currentPage);
        } else {
            handleSearch(searchQuery, selectedShippingMethod, currentPage)
        }
    }, [currentPage]);
    useEffect(() => {
        if (triggerSearch) {
            const delayDebounceFn = setTimeout(() => {
                handleSearch(searchQuery, selectedShippingMethod);
                setTriggerSearch(false);
            }, 400);

            return () => clearTimeout(delayDebounceFn);
        }
    }, [triggerSearch]);

    const handleSearch = (query, shippingMethod, page = 1) => {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_URL}/order/searchOrderPending?q=${query}&page=${page}&shippingMethod=${shippingMethod}`, { headers })
            .then((response) => {
                setSearchResults(response.data.data);
                setTotalPages(response.data.pageInfo.totalPages)
                if (response.data.data.length === 0 && currentPage > 1) {
                    setCurrentPage(currentPage - 1)
                }
                setOrderData([])
                setLoading(false);
            })
            .catch((error) => {
                setSearchResults(null);
                setOrderData([]);
                console.error('Error searching products:', error);
                setLoading(false);
            });
    };
    const fetchOrders = (page = 1) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/order/getAllOrdersPending?page=${page}`, { headers })
            .then((response) => {
                setSearchResults(null);
                setOrderData(response.data.data);
                setTotalPages(response.data.pageInfo.totalPages);
                if (response.data.data.length === 0 && currentPage > 1) {
                    setCurrentPage(currentPage - 1)
                }
                setLoading(false)
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API: ', error);
                setLoading(false)
            });
    };

    const handleShippingMethodChange = (e) => {
        setSelectedShippingMethod(e.target.value);
    };
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const handleReset = () => {
        setLoading(true)
        setCurrentPage(1)
        fetchOrders(currentPage)
    };

    const handleMenuClick = (e, order) => {
        if (order.status === 'Chờ xác nhận') {
            if (e.key === 'confirm') {
                setSelectedOrder(order);
                setConfirmModalVisible(true);
            } else if (e.key === 'cancel') {
                setSelectedOrder(order);
                setCancelModalVisible(true);
            }
        }
    };

    const onClose = () => {
        setConfirmModalVisible(false);
        setSelectedOrder(null);
    };

    const onConfirm = () => {
        updateOrder(selectedOrder._id);
        setConfirmModalVisible(false);
        setSelectedOrder(null);
    };

    const onClose1 = () => {
        setCancelModalVisible(false);
        setSelectedOrder(null);
    };

    const onConfirm1 = () => {
        cancelOrder(selectedOrder._id);
        setCancelModalVisible(false);
        setSelectedOrder(null);
    };

    const updateOrder = (orderId) => {
        axios
            .put(`${process.env.REACT_APP_API_URL}/order/updateOrder/${orderId}`, { newStatus: 'Đang chuẩn bị đơn hàng' }, { headers })
            .then((response) => {
                setLoading(true)
                notification.success({
                    message: 'Thông báo',
                    description: 'Xác nhận thành công'
                  });
                if (!searchResults) {
                    fetchOrders(currentPage);
                }
                else {
                    handleSearch(searchQuery, selectedShippingMethod, currentPage)
                }
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật đơn hàng: ', error);
            });
    };

    const cancelOrder = (orderId) => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}/order/delete/${orderId}`, { headers })
            .then((response) => {
                setLoading(true)
                notification.success({
                    message: 'Thông báo',
                    description: 'Hủy thành công'
                  });
                if (!searchResults) {
                    fetchOrders(currentPage);
                }
                else {
                    handleSearch(searchQuery, selectedShippingMethod, currentPage)
                }
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật đơn hàng: ', error);
            });
    };

    const menu = (order) => (
        <Menu onClick={(e) => handleMenuClick(e, order)}>
            <>
                <Menu.Item key="confirm">Xác nhận</Menu.Item>
                <Menu.Item key="cancel">Huỷ đơn</Menu.Item>
            </>
        </Menu>
    );
    const [centredModal2, setCentredModal2] = useState(false);
    const [orderShippingFee, setOrderShippingFee] = useState(0);
    const toggleOpen2 = (order) => {
        setOrderCode(order.orderCode)
        setSelectedOrderItems(order.items);
        setOrderVoucher(order.voucher)
        setOrderSubtotal(order.subTotal)
        setOrderTotalPay(order.totalPay)
        setOrderShippingFee(order.shippingFee)
        setCentredModal2(true);
    };
    const closeModal2 = () => {
        setCentredModal2(false);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(1);
            setTriggerSearch(true);
        }
    };
    return (
        <div>
            <WrapperHeader>Danh sách đơn hàng</WrapperHeader>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%', marginRight: '10px' }}>
                    <Input style={{ width: '100%' }}
                        placeholder="Tìm kiếm đơn hàng"
                        enterButton
                        onChange={handleSearchInputChange}
                        onKeyDown={handleKeyDown}
                        size="large"
                    />
                </div>
                <div style={{ marginRight: '10px' }}>
                    <select
                        style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#fff', height:'40px' }}
                        onChange={handleShippingMethodChange}
                    >
                        <option value="">Tất cả đơn hàng</option>
                        <option value="Giao tận nơi">Giao tận nơi</option>
                        <option value="Nhận tại cửa hàng">Nhận tại cửa hàng</option>
                    </select>
                </div>
                <div style={{ justifyContent: 'start', width: '50%', display: 'flex', gap: "20px" }}>
                    <MDBBtn
                        style={{ backgroundColor: '#B63245' }}
                        onClick={() => {
                            setCurrentPage(1);
                            setTriggerSearch(true);
                        }}
                    >
                        Xác nhận
                    </MDBBtn>
                    <MDBBtn
                        style={{ backgroundColor: '#B63245' }}
                        onClick={handleReset}
                    >
                        Đặt lại
                    </MDBBtn>

                </div>

            </div>
            <div style={{ marginTop: '15px', overflowY: 'auto', overflowX: 'auto', scrollbarWidth: 'thin' }}>
                <Loading isLoading={loading}>
                    <MDBTable bordered align='middle' className='floating-table'>
                        <MDBTableHead>
                            <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Mã đơn hàng</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '200px' }}>Khách hàng</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Số điện thoại</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '250px' }}>Địa chỉ</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '200px' }}>Hình thức giao hàng</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Tình trạng</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Tình trạng thanh toán</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '250px' }}>Phương thức thanh toán</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '200px' }}>Thời gian đặt hàng</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Sản phẩm</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Thao tác</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>

                            {(searchResults && searchResults.length === 0 || !searchResults && orderData.length === 0) ? (
                                <tr style={{ textAlign: 'center' }}>
                                    <td colSpan="10">Không có đơn hàng</td>
                                </tr>
                            ) : searchResults ? (
                                searchResults.map((result) => (
                                    <tr key={result.orderCode} style={{ textAlign: 'center' }}>
                                        <td><p className='fw-bold mb-1'>{result.orderCode}</p></td>
                                        <td>{result.userName}</td>
                                        <td><p className='fw-normal mb-1'>{result.userPhone}</p></td>
                                        <td>{result.address}</td>
                                        <td><MDBBadge color='primary' pill style={{ fontSize: '13px' }}>{result.shippingMethod}</MDBBadge></td>
                                        <td><MDBBadge color='warning' pill style={{ fontSize: '13px' }}>{result.status}</MDBBadge></td>
                                        <td><MDBBadge color='success' pill style={{ fontSize: '13px' }}>{result.isPay}</MDBBadge></td>
                                        <td>{result.paymentMethod}</td>
                                        <td>{result.createDate}</td>
                                        <td>
                                            <Tooltip title="Danh sách sản phẩm của đơn hàng">
                                                <AppstoreFilled onClick={() => toggleOpen2(result)} />
                                            </Tooltip>
                                        </td>
                                        <td>
                                            <Dropdown overlay={menu(result)} >
                                                <Tooltip title="Thực hiện thao tác">
                                                    <CaretDownOutlined />
                                                </Tooltip>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                orderData.map(order => (
                                    <tr key={order._id} style={{ textAlign: 'center' }}>
                                        <td><p className='fw-bold mb-1'>{order.orderCode}</p></td>
                                        <td>{order.userName}</td>
                                        <td><p className='fw-normal mb-1'>   {order.userPhone}</p></td>
                                        <td>{order.address}</td>
                                        <td><MDBBadge color='primary' pill style={{ fontSize: '13px' }}>{order.shippingMethod}</MDBBadge></td>
                                        <td><MDBBadge color='warning' pill style={{ fontSize: '13px' }}>{order.status}</MDBBadge></td>
                                        <td><MDBBadge color='success' pill style={{ fontSize: '13px' }}>{order.isPay}</MDBBadge></td>
                                        <td>{order.paymentMethod}</td>
                                        <td>{order.createDate}</td>
                                        <td>
                                            <Tooltip title="Danh sách sản phẩm của đơn hàng">
                                                <AppstoreFilled onClick={() => toggleOpen2(order)} />
                                            </Tooltip>
                                        </td>
                                        <td>
                                            <Dropdown overlay={menu(order)} >
                                                <Tooltip title="Thực hiện thao tác">
                                                    <CaretDownOutlined />
                                                </Tooltip>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))
                            )}

                        </MDBTableBody>
                    </MDBTable>
                </Loading>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <nav aria-label='Page navigation example'>
                    <MDBPagination className='mb-0' style={{ padding: '10px 20px' }}>
                        <MDBPaginationItem disabled={currentPage === 1}>
                            <MDBPaginationLink
                                href='#'
                                style={{ fontSize: '15px' }}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                aria-label='Previous'
                            >
                                <span aria-hidden='true'>«</span>
                            </MDBPaginationLink>
                        </MDBPaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <MDBPaginationItem active={currentPage === page} key={page}>
                                <MDBPaginationLink
                                    href='#'
                                    style={{ fontSize: '15px' }}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </MDBPaginationLink>
                            </MDBPaginationItem>
                        ))}

                        <MDBPaginationItem disabled={currentPage === totalPages}>
                            <MDBPaginationLink
                                href='#'
                                style={{ fontSize: '15px' }}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                aria-label='Next'
                            >
                                <span aria-hidden='true'>»</span>
                            </MDBPaginationLink>
                        </MDBPaginationItem>
                    </MDBPagination>
                </nav>
            </div>

            <>
                <Modal
                    visible={centredModal2}
                    footer={null}
                    onCancel={closeModal2}
                    width={1400}
                    maskClosable={false}
                >
                    <ProductOrder closeModal={closeModal2} items={selectedOrderItems} orderCode={orderCode} orderVoucher={orderVoucher} orderSubtotal={orderSubtotal} ordertotalPay={ordertotalPay} orderShippingFee={orderShippingFee} />
                </Modal>
            </>
            {selectedOrder && (
                <Modal
                    title="Xác nhận đơn hàng"
                    visible={confirmModalVisible}
                    onCancel={onClose}
                    footer={[
                        <Button key="back" onClick={onClose}>
                            Huỷ
                        </Button>,
                        <Button key="submit" type="primary" onClick={onConfirm}>
                            Xác nhận
                        </Button>,
                    ]}
                >
                    Bạn có muốn xác nhận đơn hàng {selectedOrder.orderCode} này không?
                </Modal>
            )}
            {selectedOrder && (
                <Modal
                    title="Huỷ đơn hàng"
                    visible={cancelModalVisible}
                    onCancel={onClose1}
                    footer={[
                        <Button key="back" onClick={onClose1}>
                            Huỷ
                        </Button>,
                        <Button key="submit" type="primary" onClick={onConfirm1}>
                            Xác nhận
                        </Button>,
                    ]}
                >
                    Bạn có muốn huỷ đơn hàng {selectedOrder.orderCode} này không?
                </Modal>
            )}
        </div>
    );
};

export default OrderPending;
