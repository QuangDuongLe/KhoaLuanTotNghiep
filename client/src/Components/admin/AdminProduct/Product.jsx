import React, { useState, useEffect } from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import "./admin.css"
import { Modal, Switch, Tooltip, message, notification } from 'antd';
import axios from "axios";
import Search from "antd/es/input/Search";
import NewProduct from "./NewProduct";
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import EditProduct from "./EditProduct";
import { Form } from 'antd';
import Variant from "./Variant";
import Loading from "../../LoadingComponents/Loading";

const Product = () => {
    const user = useSelector((state) => state.user)
    const [form] = Form.useForm();
    const headers = {
        token: `Bearers ${user.access_token}`,
    };
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [productData, setProductData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProduct, setTotalProduct] = useState(null);
    const [reloadProductData, setReloadProductData] = useState(false);
    const [productId, setProductId] = useState(null)
    const [deleteConfirmationProductId, setDeleteConfirmationProductId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true)
    
    const [triggerSearch, setTriggerSearch] = useState(false);
    const handleSearch = (query) => {
        setLoading(true)
        setSearchQuery(query);
        setTriggerSearch(!triggerSearch);
    };
    useEffect(() => {
        document.title = "Quản Lý Sản Phẩm";    

        if (searchQuery.trim() !== '') {
            axios.get(`${process.env.REACT_APP_API_URL}/product/searchProductAdmin?keyword=${searchQuery}`)
                .then((response) => {
                    setSearchResults(response.data.data);
                    setProductData([])
                    setSelectedCategory(null)
                    setLoading(false)
                })
                .catch((error) => {
                    console.error('Error searching products:', error);
                    setLoading(false)
                });
        } else {
            setSearchResults([]);
            setLoading(false)
        }
    }, [searchQuery, triggerSearch,reloadProductData]);
    const toggleDeleteConfirmationModal = (productId) => {
        setDeleteConfirmationProductId(productId);
    };
    const handleDeleteProduct = (productId) => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}/product/delete/${productId}`, { headers })
            .then((response) => {
                if (searchResults) {
                    const updatedProducts = searchResults.filter(product => product._id !== productId);
                    setSearchResults(updatedProducts)
                }
                const updatedProducts = productData.filter(product => product._id !== productId);
                notification.success({
                    message: 'Thông báo',
                    description: 'Xoá sản phẩm thành công.'
                  });
                setProductData(updatedProducts);

            })
            .catch((error) => {
                console.error('Lỗi khi xóa sản phẩm: ', error);
            });
    };
    useEffect(() => {
        if (searchQuery.trim() === '') {
        axios
            .get(`${process.env.REACT_APP_API_URL}/category/getAll`)
            .then((response) => {
                setCategory(response.data.data);
                if (response.data.data.length > 0) {
                    handleCategoryClick(response.data.data[0]._id);
                }
                setLoading(false)
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API: ', error);
            });
        }
    }, [reloadProductData]);
    const handlePageChange = (page) => {
        setLoading(true)
        handleCategoryClick(selectedCategory, page);
    };
    const handleCategoryClick = (categoryId, page = 1) => {
        setLoading(true)
        axios
            .get(`${process.env.REACT_APP_API_URL}/product/getIdByCategory/${categoryId}?page=${page}`)
            .then((response) => {
                setSearchResults([]);
                setSearchQuery('');
                setSelectedCategory(categoryId);
                setProductData(response.data.data);
                setCurrentPage(response.data.pageInfo.currentPage);
                setTotalPages(response.data.pageInfo.totalPages);
                setTotalProduct(response.data.pageInfo.totalProducts)
                setLoading(false)
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API: ', error);
                setLoading(false)
            });
    };
    const handleToggleHide = (productId, checked) => {
        axios.put(`${process.env.REACT_APP_API_URL}/product/editProduct/${productId}`, {
            isHide: checked,
        }, { headers })
            .then((response) => {
                if (searchResults) {
                    const updatedProduct = {
                        ...searchResults.find(product => product._id === productId),
                        isHide: checked,
                    };
                    const updatedProducts = searchResults.map(product =>
                        product._id === productId ? updatedProduct : product
                    );
                    setSearchResults(updatedProducts)
                }
                const updatedProduct = {
                    ...productData.find(product => product._id === productId),
                    isHide: checked,
                };
                const updatedProducts = productData.map(product =>
                    product._id === productId ? updatedProduct : product
                );
                setProductData(updatedProducts);
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật sản phẩm: ', error);
            });
    };
    const [centredModal, setCentredModal] = useState(false);

    const toggleOpen = () => {
        setCentredModal(true);
    };
    const closeModal = () => {
        setLoading(true)
        setCentredModal(false);
        setReloadProductData(!reloadProductData);
        form.resetFields();
    };
    const [centredModal1, setCentredModal1] = useState(false);

    const toggleOpen1 = (productId) => {
        setCentredModal1(true);
        setProductId(productId);
    };
    const closeModal1 = () => {
        setLoading(true)
        setCentredModal1(false);
        setReloadProductData(!reloadProductData);
    };
    const [centredModal2, setCentredModal2] = useState(false);
    const [categoryName, setCategoryName] = useState(null);

    const toggleOpen2 = (product) => {
        setCentredModal2(true);
        setProductId(product._id);
        setCategoryName(product.category.name);
    };
    
    const closeModal2 = () => {
        setCentredModal2(false);
    };
    return (
        <div>
            <WrapperHeader>Danh sách sản phẩm</WrapperHeader>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                    <Search style={{ width: '100%' }}
                        placeholder="Tìm kiếm sản phẩm"
                        onSearch={handleSearch}
                        enterButton
                        size="large" />
                </div>
                <div style={{ justifyContent: 'end', width: '50%', display: 'flex' }}>
                    <MDBBtn rounded style={{ backgroundColor: '#B63245' }} onClick={toggleOpen}>
                        Thêm sản phẩm
                    </MDBBtn>
                </div>
            </div>
            <div style={{ marginTop: '10px', display:'flex', gap:'10px', flexWrap:'nowrap', overflow:'auto'}}>
                {category.map((category) => (
                    <MDBBtn
                        outline color='secondary'
                        key={category._id}
                        style={{ minWidth:'150px' }}
                        onClick={() => handleCategoryClick(category._id)}
                        className={`memory-button ${selectedCategory === category._id ? 'selected' : ''}`}
                    >
                        {category.name}
                    </MDBBtn>
                ))}
            </div>
            <div style={{ marginTop: '15px', overflowY: 'auto', overflowX: 'auto' }}>
                <Loading isLoading={loading}>
                    <MDBTable bordered align='middle' className='floating-table'>
                        <MDBTableHead>
                            <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                                <th scope='col' style={{ verticalAlign: 'middle', maxWidth: '400px' }}>Sản phẩm</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '100px' }}>Thương hiệu</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '100px' }}>Ngày ra mắt</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '100px' }}>Bảo hành/tháng</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Ẩn/Hiện</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Thao tác</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {(searchResults && searchResults.length === 0 && productData.length === 0) ? (
                                <tr style={{ textAlign: 'center' }}>
                                    <td colSpan="10">Không có sản phẩm tìm kiếm</td>
                                </tr>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(product => (
                                    <tr key={product._id} style={{ textAlign: 'center' }}>
                                        <td>
                                            <div className='d-flex align-items-center'>
                                                <img
                                                    src={product.thumnails[0]}
                                                    alt={product.name}
                                                    style={{ width: '45px', height: '45px' }}
                                                />
                                                <div>
                                                    <p className='fw-bold mb-1' style={{textAlign:'left'}}>{product.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <MDBBadge color='success' pill>
                                                {product.brand.name}
                                            </MDBBadge>
                                        </td>
                                        <td>
                                            <p className='fw-normal mb-1'>{product.releaseTime}</p>
                                        </td>
                                        <td>{product.warrantyPeriod}</td>
                                        <td>
                                            <MDBBtn color='link' rounded size='sm'>
                                                <Switch checked={!product.isHide} onChange={(checked) => handleToggleHide(product._id, !checked)} />
                                            </MDBBtn>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <Tooltip title="Danh sách biến thể">
                                                    <div style={{ marginRight: '10px' }}>
                                                        <AppstoreOutlined onClick={() => toggleOpen2(product)} />
                                                    </div>
                                                </Tooltip>
                                                <Tooltip title="Chỉnh sửa">
                                                    <div style={{ marginRight: '10px' }}>
                                                        <EditOutlined onClick={() => toggleOpen1(product._id)} />
                                                    </div>
                                                </Tooltip>
                                                <Tooltip title="Xóa">
                                                    <div>
                                                        <DeleteOutlined onClick={() => toggleDeleteConfirmationModal(product._id)} />
                                                        <Modal
                                                            title="Xác nhận xoá sản phẩm"
                                                            visible={deleteConfirmationProductId === product._id}
                                                            onOk={() => {
                                                                handleDeleteProduct(product._id);
                                                                setDeleteConfirmationProductId(null);
                                                            }}
                                                            onCancel={() => setDeleteConfirmationProductId(null)}
                                                        >
                                                            <p>Bạn có chắc chắn muốn xoá sản phẩm {product.name} này?</p>
                                                        </Modal>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                productData.map(product => (
                                    <tr key={product._id} style={{ textAlign: 'center' }}>
                                        <td>
                                            <div className='d-flex align-items-center'>
                                                <img
                                                    src={product.thumnails[0]}
                                                    alt={product.name}
                                                    style={{ width: '45px', height: '45px' }}
                                                />
                                                <div className='ms-3'>
                                                    <p className='fw-bold mb-1' style={{textAlign:'left'}}>{product.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <MDBBadge color='success' pill>
                                                {product.brand.name}
                                            </MDBBadge>
                                        </td>
                                        <td>
                                            <p className='fw-normal mb-1'>{product.releaseTime}</p>
                                        </td>
                                        <td>{product.warrantyPeriod}</td>
                                        <td>
                                            <MDBBtn color='link' rounded size='sm'>
                                                <Switch checked={!product.isHide} onChange={(checked) => handleToggleHide(product._id, !checked)} />
                                            </MDBBtn>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <Tooltip title="Danh sách biến thể">
                                                    <div style={{ marginRight: '10px' }}>
                                                        <AppstoreOutlined onClick={() => toggleOpen2(product)} />
                                                    </div>
                                                </Tooltip>
                                                <Tooltip title="Chỉnh sửa">
                                                    <div style={{ marginRight: '10px' }}>
                                                        <EditOutlined onClick={() => toggleOpen1(product._id)} />
                                                    </div>
                                                </Tooltip>
                                                <Tooltip title="Xóa">
                                                    <div>
                                                        <DeleteOutlined onClick={() => toggleDeleteConfirmationModal(product._id)} />
                                                        <Modal
                                                            title="Xác nhận xoá sản phẩm"
                                                            visible={deleteConfirmationProductId === product._id}
                                                            onOk={() => {
                                                                handleDeleteProduct(product._id);
                                                                setDeleteConfirmationProductId(null);
                                                            }}
                                                            onCancel={() => setDeleteConfirmationProductId(null)}
                                                        >
                                                            <p>Bạn có chắc chắn muốn xoá sản phẩm <strong>{product.name}</strong> này?</p>
                                                        </Modal>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </MDBTableBody>

                    </MDBTable>
                </Loading>
                {searchResults.length === 0 && (
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
            </div>
            <>
                <Modal
                    visible={centredModal}
                    title="Thêm sản phẩm mới"
                    footer={null}
                    width={1400}
                    closable={false}
                >
                    <NewProduct closeModal={closeModal} />
                </Modal>
            </>
            <>
                <Modal
                    visible={centredModal1}
                    title="Chỉnh sửa sản phẩm"
                    footer={null}
                    onCancel={closeModal1}
                    width={1400}
                    maskClosable={false}
                >
                    <EditProduct closeModal={closeModal1} productId={productId} />
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
                    <Variant closeModal={closeModal2} productId={productId} category={categoryName} />
                </Modal>
            </>
        </div>

    );
};

export default Product;