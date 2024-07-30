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
import NewBannerInLocation from "./NewBannerInLocation";
import NewBannerInProduct from "./NewBannerInProducts";
import ProductList from "./ProductList";
import EditBanner from "./EditBanner";
import Loading from "../../LoadingComponents/Loading";

const Banner = () => {
    const user = useSelector((state) => state.user);
    const headers = {
        token: `Bearer ${user.access_token}`,
    };
    const [bannerData, setBannerData] = useState([]);
    const [deleteConfirmationBannerId, setDeleteConfirmationBannerId] = useState(null);
    const [reloadBannerData, setReloadBannerData] = useState(false);
    const [banner, setBanner] = useState([])
    const [bannerId, setBannerId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [triggerSearch, setTriggerSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(true)
    const handleSearch = (query) => {
        setLoading(true)
        setSearchQuery(query);
        setCurrentPage(1);
        setTriggerSearch(!triggerSearch);
    };

    useEffect(() => {
        document.title = "Quản Lý Banner";
        if (searchQuery.trim() !== '') {
            axios.get(`${process.env.REACT_APP_API_URL}/banner/searchBanner`, {
                headers,
                params: {
                    title: searchQuery,
                    page: currentPage,
                    limit: 5,
                },
            })
                .then((response) => {
                    setLoading(false)
                    setSearchResults(response.data.data);
                    setTotalPages(response.data.pagination.totalPages);
                })
                .catch((error) => {
                    setLoading(false)
                    setSearchResults(null);
                    setBannerData([]);
                });
        } else {
            setSearchResults(null);
            fetchBannerData();
        }
    }, [searchQuery, triggerSearch, currentPage, reloadBannerData]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            fetchBannerData();
        }
    }, [reloadBannerData, currentPage, searchQuery]);

    const fetchBannerData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/banner/getBanner`, {
                headers,
                params: {
                    page: currentPage,
                    limit: 5,
                },
            });
            setLoading(false)
            setBannerData(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error('Lỗi khi gọi API: ', error);
        }
    };

    const handlePageChange = (page) => {
        setLoading(true)
        setCurrentPage(page);
    };
    const handleDeleteBanner = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/banner/deleteBanner/${id}`, { headers });
            if (searchResults) {
                setSearchResults(searchResults.filter(banner => banner._id !== id))
            }
            setLoading(true)
            setBannerData(bannerData.filter(banner => banner._id !== id));
            setReloadBannerData(!reloadBannerData);
            notification.success({
                message: 'Thông báo',
                description: 'Xóa banner thành công.'
              });
        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: 'Lỗi khi xóa banner.'
              });
        }
    };
    const [centredModal, setCentredModal] = useState(false);
    const toggleOpen = () => {
        setCentredModal(true);
    };
    const closeModal = () => {
        setCentredModal(false);
        setLoading(true)
        setReloadBannerData(!reloadBannerData);
    };
    const [centredModal1, setCentredModal1] = useState(false);
    const toggleOpen1 = () => {
        setCentredModal1(true);
    };
    const closeModal1 = () => {
        setLoading(true)
        setCentredModal1(false);
        setReloadBannerData(!reloadBannerData);
    };
    const [centredModal2, setCentredModal2] = useState(false);
    const toggleOpen2 = (banner) => {
        setBanner(banner.products)
        setCentredModal2(true);
    };
    const closeModal2 = () => {
        setCentredModal2(false);
    };
    const [centredModal3, setCentredModal3] = useState(false);
    const toggleOpen3 = (bannerId) => {
        setBannerId(bannerId)
        setCentredModal3(true);
    };
    const closeModal3 = () => {
        setLoading(true)
        setCentredModal3(false);
        setReloadBannerData(!reloadBannerData);
    };
    const handleAll = () => {
        setSearchQuery('');
    };
    return (
        <div>
            <WrapperHeader>Danh sách banner</WrapperHeader>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                    <Search style={{ width: '100%' }}
                        placeholder="Tìm kiếm banner"
                        enterButton
                        onSearch={handleSearch} 
                        size="large"/>
                </div>
                <div style={{ justifyContent: 'start', width: '10%', display: 'flex', paddingLeft: "20px" }}>
                <MDBBtn style={{ backgroundColor: '#B63245' }} onClick={handleAll}>
                Đặt lại
            </MDBBtn>
                </div>

                <div style={{ justifyContent: 'end', width: '40%', display: 'flex', gap: "20px" }}>
                    <MDBBtn rounded style={{ backgroundColor: '#B63245' }} onClick={toggleOpen}>
                        Thêm banner theo vị trí
                    </MDBBtn>
                    <MDBBtn rounded style={{ backgroundColor: '#B63245' }} onClick={toggleOpen1}>
                        Thêm banner theo sản phẩm
                    </MDBBtn>
                </div>
            </div>
            <div style={{ marginTop: '15px', overflowX: 'auto', overflowY: 'auto' }}>
                <Loading isLoading={loading}>
                    <MDBTable bordered align='middle' className='floating-table'>
                        <MDBTableHead>
                            <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '250px' }}>Tiêu đề</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '100px' }}>Trang</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '100px' }}>Vị trí</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '100px' }}>Bắt đầu</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '100px' }}>Kết thúc</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '100px' }}>Ẩn/Hiện</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '100px' }}>Sản phẩm</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '200px' }}>Thao tác</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '250px' }}>Hình ảnh</th>
                                <th scope='col' >Liên kết</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {searchResults ? (
                                searchResults.map(result => (
                                    <tr key={result._id} style={{ textAlign: 'center' }}>
                                        <td>{result.title}</td>
                                        <td>{result.page}</td>
                                        <td>{result.location}</td>
                                        <td>{result.startDate}</td>
                                        <td>{result.endDate}</td>
                                        <td>
                                            <MDBBtn color='link' rounded size='sm'>
                                                <Switch checked={result.isActive} />
                                            </MDBBtn>
                                        </td>
                                        <td>
                                            {result.products && result.products.length > 0 && (
                                                <Tooltip title="Danh sách sản phẩm">
                                                    <AppstoreFilled onClick={() => toggleOpen2(result)} />
                                                </Tooltip>
                                            )}
                                        </td>
                                        <td style={{ display: 'flex', gap: '20px' }}>
                                            <Tooltip title="Chỉnh sửa">
                                                <MDBBtn color="warning" onClick={() => toggleOpen3(result._id)}>
                                                    <EditOutlined />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <MDBBtn color='danger' onClick={() => setDeleteConfirmationBannerId(result._id)} >
                                                    <MDBIcon fas icon='trash' />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Modal
                                                title="Xác nhận xoá banner"
                                                visible={deleteConfirmationBannerId === result._id}
                                                onOk={() => {
                                                    handleDeleteBanner(result._id);
                                                    setDeleteConfirmationBannerId(null);
                                                }}
                                                onCancel={() => setDeleteConfirmationBannerId(null)}
                                            >
                                                <p>Bạn có chắc chắn muốn xoá banner <strong>{result.title}</strong> này?</p>
                                            </Modal>
                                        </td>
                                        <td>
                                            <img src={result.image} alt={result.title} width="auto" height="45px" />
                                        </td>
                                        <td><a href={result.link} target="_blank" rel="noopener noreferrer">{result.link}</a></td>

                                    </tr>
                                ))
                            ) : (
                                bannerData.map(banner => (
                                    <tr key={banner._id} style={{ textAlign: 'center' }}>
                                        <td>{banner.title}</td>
                                        <td>{banner.page}</td>
                                        <td>{banner.location}</td>
                                        <td>{banner.startDate}</td>
                                        <td>{banner.endDate}</td>
                                        <td>
                                            <MDBBtn color='link' rounded size='sm'>
                                                <Switch checked={banner.isActive} />
                                            </MDBBtn>
                                        </td>
                                        <td>
                                            {banner.products && banner.products.length > 0 && (
                                                <Tooltip title="Danh sách sản phẩm">
                                                    <AppstoreFilled onClick={() => toggleOpen2(banner)} />
                                                </Tooltip>
                                            )}
                                        </td>
                                        <td style={{ display: 'flex', gap: '20px' }}>
                                            <Tooltip title="Chỉnh sửa">
                                                <MDBBtn color="warning" onClick={() => toggleOpen3(banner._id)}>
                                                    <EditOutlined />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <MDBBtn color='danger' onClick={() => setDeleteConfirmationBannerId(banner._id)} >
                                                    <MDBIcon fas icon='trash' />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Modal
                                                title="Xác nhận xoá banner"
                                                visible={deleteConfirmationBannerId === banner._id}
                                                onOk={() => {
                                                    handleDeleteBanner(banner._id);
                                                    setDeleteConfirmationBannerId(null);
                                                }}
                                                onCancel={() => setDeleteConfirmationBannerId(null)}
                                            >
                                                <p>Bạn có chắc chắn muốn xoá banner <strong>{banner.title}</strong> này?</p>
                                            </Modal>
                                        </td>
                                        <td>
                                            <img src={banner.image} alt={banner.title} width="auto" height="45px" />
                                        </td>
                                        <td><a href={banner.link} target="_blank" rel="noopener noreferrer">{banner.link}</a></td>

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
                    title="Thêm banner theo vị trí"
                    footer={null}
                    width={'50%'}
                    closable={false}
                >
                    <NewBannerInLocation closeModal={closeModal} />
                </Modal>
            </>
            <>
                <Modal
                    visible={centredModal1}
                    title="Thêm banner theo sản phẩm"
                    footer={null}
                    width={'50%'}
                    closable={false}
                >
                    <NewBannerInProduct closeModal={closeModal1} />
                </Modal>
            </>
            <>
                <Modal
                    visible={centredModal2}
                    footer={null}
                    onCancel={closeModal2}
                    width={'70%'}
                    maskClosable={false}
                >
                    <ProductList closeModal={closeModal2} products={banner} />
                </Modal>
            </>
            <>
                <Modal
                    visible={centredModal3}
                    title="Chỉnh sửa banner"
                    footer={null}
                    onCancel={closeModal3}
                    width={1400}
                    maskClosable={false}
                >
                    <EditBanner closeModal={closeModal3} bannerId={bannerId} />
                </Modal>
            </>
        </div>
    );
};

export default Banner;
