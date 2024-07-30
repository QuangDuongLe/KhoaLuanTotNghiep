import React, { useState, useEffect } from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBIcon } from 'mdb-react-ui-kit';
import { Modal, Switch, Tooltip, message, notification } from 'antd';
import axios from "axios";
import Search from "antd/es/input/Search";
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, AppstoreOutlined, AppstoreFilled } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Form } from 'antd';
import Loading from "../../LoadingComponents/Loading";
import EditProvince from "./EditProvince";
import AddProvince from "./AddProvince";
import District from "./District";

const Province = () => {
    const user = useSelector((state) => state.user);
    const headers = {
        token: `Bearer ${user.access_token}`,
    };
    const [provinceData, setProvinceData] = useState([]);
    const [deleteConfirmationProvinceId, setDeleteConfirmationProvinceId] = useState(null);
    const [reloadProvincerData, setReloadProvinceData] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [triggerSearch, setTriggerSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [provinceName, setProvinceName] = useState(null);
    const [provinceId, setProvinceId] = useState(null);
    const [loading, setLoading] = useState(true)
    const handleSearch = (query) => {
        setLoading(true)
        setSearchQuery(query);
        setCurrentPage(1);
        setTriggerSearch(!triggerSearch);
    };

    useEffect(() => {
        document.title = "Quản Lý Tỉnh Thành";
        if (searchQuery.trim() !== '') {
            axios.get(`${process.env.REACT_APP_API_URL}/province/searchProvince`, {
                headers,
                params: {
                    name: searchQuery,
                    page: currentPage,
                    limit: 10,
                },
            })
                .then((response) => {
                    setLoading(false)
                    setSearchResults(response.data.data);
                    setTotalPages(response.data.totalPages);
                })
                .catch((error) => {
                    setLoading(false)
                    setSearchResults(null);
                    setProvinceData([]);
                });
        } else {
            setSearchResults(null);
            fetchProviceData();
        }
    }, [searchQuery, triggerSearch, currentPage, reloadProvincerData]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            fetchProviceData();
        }
    }, [reloadProvincerData, currentPage, searchQuery]);
    const fetchProviceData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/province/getAllProvince`, {
                headers,
                params: {
                    page: currentPage,
                    limit: 10,
                },
            });
            setLoading(false)
            setProvinceData(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi gọi API: ', error);
        }
    };
    const handleDeleteProvince = async (idProvince) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/province/deleteProvince/${idProvince}`,
                {},
                { headers }
            );
            setLoading(true);
            setReloadProvinceData(!reloadProvincerData);
            notification.success({
                message: 'Thông báo',
                description:response.data.message || 'Xóa tỉnh thành công'
              });
        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description:error.response?.data?.message || 'Lỗi khi xóa tỉnh'
              });
        }
    };

    const handlePageChange = (page) => {
        setLoading(true)
        setCurrentPage(page);
    };
    const [centredModal, setCentredModal] = useState(false);
    const toggleOpen = () => {
        setCentredModal(true);
    };
    const closeModal = () => {
        setCentredModal(false);
        setLoading(true)
        setReloadProvinceData(!reloadProvincerData);
    };
    const [centredModal2, setCentredModal2] = useState(false);
    const toggleOpen2 = (province) => {
        setProvinceId(province.idProvince)
        setProvinceName(province.name)
        setCentredModal2(true);
    };
    const closeModal2 = () => {
        setCentredModal2(false);
    };
    const [centredModal3, setCentredModal3] = useState(false);
    const toggleOpen3 = (idProvince) => {
        setProvinceId(idProvince)
        setCentredModal3(true);
    };
    const closeModal3 = () => {
        setLoading(true)
        setCentredModal3(false);
        setReloadProvinceData(!reloadProvincerData);
    };
    const handleAll = () => {
        setSearchQuery('');
    };
    return (
        <div>
            <WrapperHeader>Danh sách tỉnh thành</WrapperHeader>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                    <Search style={{ width: '100%' }}
                        placeholder="Tìm kiếm tỉnh"
                        enterButton
                        onSearch={handleSearch}
                        size="large" />
                </div>
                <div style={{ justifyContent: 'start', width: '25%', display: 'flex', paddingLeft: "20px" }}>
                    <MDBBtn style={{ backgroundColor: '#B63245' }} onClick={handleAll}>
                        Đặt lại
                    </MDBBtn>
                </div>

                <div style={{ justifyContent: 'end', width: '25%', display: 'flex', gap: "20px" }}>
                    <MDBBtn rounded style={{ backgroundColor: '#B63245' }} onClick={toggleOpen}>
                        Thêm tỉnh
                    </MDBBtn>
                </div>
            </div>
            <div style={{ marginTop: '15px', overflowX: 'auto', overflowY: 'auto' }}>
                <Loading isLoading={loading}>
                    <MDBTable bordered align='middle' className='floating-table'>
                        <MDBTableHead>
                            <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '250px' }}>Tỉnh thành</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '100px' }}>Phí ship</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '100px' }}>Huyện</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '20px' }}>Chỉnh sửa và xoá</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {searchResults ? (
                                searchResults.map(result => (
                                    <tr key={result.idProvince} style={{ textAlign: 'center' }}>
                                        <td>{result.name}</td>
                                        <td>{result.shippingFee?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                        <td>  <Tooltip title="Danh sách huyện">
                                            <AppstoreFilled onClick={() => toggleOpen2(result)} />
                                        </Tooltip></td>
                                        <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                                            <Tooltip title="Chỉnh sửa">
                                                <MDBBtn color="warning" onClick={() => toggleOpen3(result.idProvince)}>
                                                    <EditOutlined />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Tooltip title="Xóa" >
                                                <MDBBtn color='danger' onClick={() => setDeleteConfirmationProvinceId(result.idProvince)}>
                                                    <MDBIcon fas icon='trash' />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Modal
                                                title="Xác nhận xoá tỉnh"
                                                visible={deleteConfirmationProvinceId === result.idProvince}
                                                onOk={() => {
                                                    handleDeleteProvince(result.idProvince);
                                                    setDeleteConfirmationProvinceId(null);
                                                }}
                                                onCancel={() => setDeleteConfirmationProvinceId(null)}
                                            >
                                                <p>Bạn có chắc chắn muốn xoá tỉnh <strong>{result.name}</strong> này?</p>
                                            </Modal>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                provinceData.map(province => (
                                    <tr key={province.idProvince} style={{ textAlign: 'center' }}>
                                        <td>{province.name}</td>
                                        <td>{province.shippingFee?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                        <td>  <Tooltip title="Danh sách huyện">
                                            <AppstoreFilled onClick={() => toggleOpen2(province)} />
                                        </Tooltip></td>
                                        <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                                            <Tooltip title="Chỉnh sửa">
                                                <MDBBtn color="warning" onClick={() => toggleOpen3(province.idProvince)}>
                                                    <EditOutlined />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Tooltip title="Xóa" >
                                                <MDBBtn color='danger' onClick={() => setDeleteConfirmationProvinceId(province.idProvince)}>
                                                    <MDBIcon fas icon='trash' />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Modal
                                                title="Xác nhận xoá tỉnh"
                                                visible={deleteConfirmationProvinceId === province.idProvince}
                                                onOk={() => {
                                                    handleDeleteProvince(province.idProvince);
                                                    setDeleteConfirmationProvinceId(null);
                                                }}
                                                onCancel={() => setDeleteConfirmationProvinceId(null)}
                                            >
                                                <p>Bạn có chắc chắn muốn xoá tỉnh <strong>{province.name}</strong> này?</p>
                                            </Modal>
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
            <>
                <Modal
                    visible={centredModal}
                    title="Thêm tỉnh"
                    footer={null}
                    width={'50%'}
                    closable={false}
                >
                    <AddProvince closeModal={closeModal} />
                </Modal>
            </>
            <>
                <Modal
                    visible={centredModal3}
                    title="Chỉnh sửa tỉnh"
                    footer={null}
                    onCancel={closeModal3}
                    width={1400}
                    maskClosable={false}
                >
                    <EditProvince closeModal={closeModal3} idProvince={provinceId} />
                </Modal>
            </>
            <>
                <Modal
                    visible={centredModal2}
                    footer={null}
                    onCancel={closeModal2}
                    width={1400}
                    maskClosable={false}
                >
                    <District closeModal={closeModal2} idProvince={provinceId} nameProvince={provinceName} />
                </Modal>
            </>
        </div>
    );
};

export default Province;
