import React, { useState, useEffect } from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { Button, Dropdown, Input, Menu, Modal, Tooltip, message } from 'antd';
import { AppstoreFilled, CaretDownOutlined } from '@ant-design/icons';
import axios from "axios";
import Search from "antd/es/input/Search";
import "./Order.css";
import { useSelector } from "react-redux";
import ProductOrder from "./ProductOrder";
import Loading from "../../LoadingComponents/Loading";

const OrderDelivered = () => {
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
    const [triggerSearch, setTriggerSearch] = useState(false);
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        document.title = "Quản Lý Đơn Hàng Đã Giao Hàng";
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
        axios.get(`${process.env.REACT_APP_API_URL}/order/searchOrderDelivered?q=${query}&page=${page}&shippingMethod=${shippingMethod}`, { headers })
            .then((response) => {
                setSearchResults(response.data.data);
                setTotalPages(response.data.pageInfo.totalPages)
                if (response.data.data.length === 0 && currentPage > 1) {
                    setCurrentPage(currentPage - 1)
                }
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
            .get(`${process.env.REACT_APP_API_URL}/order/getAllOrdersDelivered?page=${page}`, { headers })
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
            <div style={{ marginTop: '15px', overflowY: 'auto', overflowX: 'auto' }}>
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
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '200px' }}>Thời gian giao hàng</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Thao tác</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>

                            {( searchResults && searchResults.length === 0 || !searchResults && orderData.length === 0) ? (
                                <tr style={{ textAlign: 'center' }}>
                                    <td colSpan="10">Không có đơn hàng</td>
                                </tr>
                            ) : searchResults ? (
                                searchResults.map((result) => (
                                    <tr style={{ textAlign: 'center' }}>
                                        <td><p className='fw-bold mb-1'>{result.orderCode}</p></td>
                                        <td>{result.userName}</td>
                                        <td><p className='fw-normal mb-1'>   {result.userPhone}</p></td>
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
                                        <td>{order.completeDate}</td>
                                        <td>
                                            <Tooltip title="Danh sách sản phẩm của đơn hàng">
                                                <AppstoreFilled onClick={() => toggleOpen2(order)} />
                                            </Tooltip>
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
                    width={'70%'}
                    maskClosable={false}
                >
                    <ProductOrder closeModal={closeModal2} items={selectedOrderItems} orderCode={orderCode} orderVoucher={orderVoucher} orderSubtotal={orderSubtotal} ordertotalPay={ordertotalPay} orderShippingFee={orderShippingFee}/>
                </Modal>
            </>
        </div>
    );
};

export default OrderDelivered;
