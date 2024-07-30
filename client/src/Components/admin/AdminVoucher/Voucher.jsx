import React, { useState, useEffect } from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

import { Dropdown, Menu, Modal, Switch, Tooltip, message, notification } from 'antd';
import axios from "axios";
import Search from "antd/es/input/Search";

import { CaretDownOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import NewVoucher from "./NewVoucher";
import Loading from "../../LoadingComponents/Loading";
import EditVoucher from "./EditVoucher";


const Voucher = () => {
    const user = useSelector((state) => state.user)
    const headers = {
        token: `Bearers ${user.access_token}`,
    };
    const [voucher, setVoucher] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [reloadData, setReloadData] = useState(false);
    const [voucherId, setVoucherId] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        document.title = "Quản Lý Voucher";
        setLoading(true)
        if (searchQuery.trim() === '') {
            fetchData(currentPage);
        }
    }, [currentPage, reloadData]);
    const [triggerSearch, setTriggerSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const handleSearch = (query) => {
        setSearchQuery(query);
        setTriggerSearch(!triggerSearch);
    };

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            axios.get(`${process.env.REACT_APP_API_URL}/voucher/searchVoucher?keyword=${searchQuery}`, { headers })
                .then((response) => {
                    setSearchResults(response.data.data);
                    setLoading(false)
                })
                .catch((error) => {
                    setSearchResults(null);
                    setVoucher([]);
                    setLoading(false)
                });
        } else {
            setSearchQuery('');
            setSearchResults(null);
            setLoading(false)
        }
    }, [searchQuery, triggerSearch, reloadData]);
    const fetchData = (page) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/voucher/getVoucher`, {
                headers,
                params: {
                    page: page
                }
            })
            .then((response) => {
                setSearchQuery('');
                setSearchResults(null);
                setVoucher(response.data.data);
                setTotalPages(response.data.pageInfo.totalPages);
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching vouchers:', error);
                setLoading(false)
            });
    };
    const [centredModal, setCentredModal] = useState(false);

    const toggleOpen = () => {
        setCentredModal(true);
    };
    const closeModal = () => {
        setCentredModal(false);
        setReloadData(!reloadData);
    };
    const [centredModal1, setCentredModal1] = useState(false);

    const toggleOpen1 = (voucherId) => {
        setCentredModal1(true);
        setVoucherId(voucherId);
    };
    const closeModal1 = () => {
        setCentredModal1(false);
        setReloadData(!reloadData);
    };
    const handleDeleteVoucher = (voucherId) => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}/voucher/deleteVoucher/${voucherId}`, { headers })
            .then((response) => {
                setLoading(true)
                setReloadData(!reloadData);
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API xóa voucher: ', error);
                notification.error({
                    message: 'Thông báo',
                    description: 'Lỗi khi xóa voucher'
                  });
            
            });
    };

    const handleMenuClick = (e, voucher) => {
        if (e.key === 'edit') {
            toggleOpen1(voucher._id);
        } else if (e.key === 'delete') {
            toggleDeleteConfirmationModal(voucher._id);
        }
    };
    const [deleteConfirmationProductId, setDeleteConfirmationProductId] = useState(null);

    const toggleDeleteConfirmationModal = (voucherId) => {
        setDeleteConfirmationProductId(voucherId);
    };

    const menu = (voucher) => (
        <Menu onClick={(e) => handleMenuClick(e, voucher)}>
            <>
                <Menu.Item key="edit">Chỉnh sửa</Menu.Item>
                <Menu.Item key="delete">Xoá voucher</Menu.Item>
            </>
        </Menu>
    );
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleAll = () => {
        setSearchQuery('');
    };
    return (
        <div>
            <WrapperHeader>Danh sách voucher</WrapperHeader>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                    <Search style={{ width: '100%' }}
                        placeholder="Tìm kiếm voucher"
                        enterButton
                        onSearch={handleSearch} 
                        size="large"/>
                        
                </div>
                <div style={{ justifyContent: 'start', width: '25%', display: 'flex', paddingLeft: '20px' }}>
                    <MDBBtn style={{ backgroundColor: '#B63245' }} onClick={handleAll}>
                        Đặt lại
                    </MDBBtn>
                </div>

                <div style={{ justifyContent: 'end', width: '25%', display: 'flex' }}>
                    <MDBBtn rounded style={{ backgroundColor: '#B63245' }} onClick={toggleOpen}>
                        Thêm voucher
                    </MDBBtn>
                </div>
            </div>
            <div style={{ marginTop: '15px', overflowX: 'auto', overflowY: 'auto' }}>
                <Loading isLoading={loading}>
                    <MDBTable bordered align='middle' className='floating-table'>

                        <MDBTableHead>
                            <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '250px' }}>Tên voucher</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Mã voucher</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Ngày bắt đầu</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Ngày kết thúc</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Số lượng</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Khuyến mãi/%</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Tối đa</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '200px' }}>Áp dụng cho phương thức thanh toán</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '250px' }}>Áp dụng cho loại sản phẩm</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Thao tác</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {searchResults && searchResults.length === 0 ? (
                                <tr style={{ textAlign: 'center' }}>
                                    <td colSpan="10">Không có voucher</td>
                                </tr>
                            ) : searchResults ? (
                                searchResults.map(result => (
                                    <tr key={result._id} style={{ textAlign: 'center' }}>
                                        <td>
                                            <p className='fw-bold mb-1'>{result.name}</p>
                                        </td>
                                        <td>
                                            <MDBBadge color="primary" style={{ fontSize: '13px' }} pill>
                                                {result.code}
                                            </MDBBadge>
                                        </td>
                                        <td>{result.startDate}</td>
                                        <td>{result.endDate}</td>
                                        <td>{result.quantity}</td>
                                        <td>{result.discount * 100}</td>
                                        <td>
                                            {result.maxPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </td>
                                        <td>{result.applicablePaymentMethod}</td>
                                        <td>
                                            {Array.isArray(result.applicableProductTypes) ?
                                                result.applicableProductTypes.join(", ") :
                                                ""}
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
                                voucher.map(voucherItem => (
                                    <tr key={voucherItem._id} style={{ textAlign: 'center' }}>
                                        <td>
                                            <p className='fw-bold mb-1'>{voucherItem.name}</p>
                                        </td>
                                        <td>
                                            <MDBBadge color="primary" style={{ fontSize: '13px' }} pill>
                                                {voucherItem.code}
                                            </MDBBadge>
                                        </td>
                                        <td>{voucherItem.startDate}</td>
                                        <td>{voucherItem.endDate}</td>
                                        <td>{voucherItem.quantity}</td>
                                        <td>{voucherItem.discount * 100}</td>
                                        <td>
                                            {voucherItem.maxPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </td>
                                        <td>{voucherItem.applicablePaymentMethod}</td>
                                        <td>
                                            {Array.isArray(voucherItem.applicableProductTypes) ?
                                                voucherItem.applicableProductTypes.join(", ") :
                                                ""}
                                        </td>
                                        <td>
                                            <Dropdown overlay={menu(voucherItem)} >
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
            {!searchResults && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <nav aria-label='Page navigation example'>
                        <MDBPagination className='mb-0' style={{ padding: '10px 20px' }}>
                            <MDBPaginationItem disabled={currentPage === 1}>
                                <MDBPaginationLink style={{ fontSize: '15px' }} href='#' aria-label='Previous' onClick={() => handlePageChange(currentPage - 1)} >
                                    <span aria-hidden='true'>«</span>
                                </MDBPaginationLink>
                            </MDBPaginationItem>
                            {[...Array(totalPages).keys()].map((page) => (
                                <MDBPaginationItem key={page} className={currentPage === page + 1 ? 'active' : ''}>
                                    <MDBPaginationLink style={{ fontSize: '15px' }} href='#' onClick={() => handlePageChange(page + 1)}>
                                        {page + 1}
                                    </MDBPaginationLink>
                                </MDBPaginationItem>
                            ))}
                            <MDBPaginationItem disabled={currentPage === totalPages}>
                                <MDBPaginationLink href='#' style={{ fontSize: '15px' }} aria-label='Next' onClick={() => handlePageChange(currentPage + 1)} >
                                    <span aria-hidden='true'>»</span>
                                </MDBPaginationLink>
                            </MDBPaginationItem>
                        </MDBPagination>
                    </nav>
                </div>
            )}
            <>
                <Modal
                    visible={centredModal}
                    title="Thêm voucher"
                    footer={null}
                    width={1400}
                    closable={false}
                >
                    <NewVoucher closeModal={closeModal} />
                </Modal>
            </>
            <>
                <Modal
                    visible={centredModal1}
                    title="Chỉnh sửa voucher"
                    footer={null}
                    onCancel={closeModal1}
                    width={1400}
                    maskClosable={false}
                >
                    <EditVoucher closeModal={closeModal1} voucherId={voucherId} />
                </Modal>
            </>
            <>
                <Modal
                    title="Xác nhận xoá voucher"
                    visible={deleteConfirmationProductId !== null}
                    onOk={() => {
                        handleDeleteVoucher(deleteConfirmationProductId);
                        setDeleteConfirmationProductId(null);
                    }}
                    onCancel={() => setDeleteConfirmationProductId(null)}
                >
                    <p>Bạn có chắc chắn muốn xoá voucher này?</p>
                </Modal>
            </>
        </div>

    );
};

export default Voucher;
