import React, { useState, useEffect } from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBIcon } from 'mdb-react-ui-kit';
import "../AdminProduct/admin.css"
import { Modal, Switch, Tooltip, message, notification } from 'antd';
import axios from "axios";
import Search from "antd/es/input/Search";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Form } from 'antd';
import NewBrand from "./NewBrand";
import EditBrand from "./EditBrand";

const Brand = () => {
    const user = useSelector((state) => state.user)
    const [form] = Form.useForm();
    const headers = {
        token: `Bearers ${user.access_token}`,
    };
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [brandData, setBrandData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBrand, setTotalBrand] = useState(null);
    const [reloadBrandData, setReloadBrandData] = useState(false);
    const [brandId, setBrandId] = useState(null)
    const [deleteConfirmationBrandId, setDeleteConfirmationBrandId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    const toggleDeleteConfirmationModal = (brandId) => {
        setDeleteConfirmationBrandId(brandId);
    };

    const handleDeleteBrand = (brandId) => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}/brand/delete/${brandId}`, { headers })
            .then((response) => {
                if (response.data.success) {
                    const updatedBrands = brandData.filter((brand) => brand._id !== brandId);
                    setBrandData(updatedBrands);
                    notification.success({
                        message: 'Thông báo',
                        description: 'Xóa thương hiệu thành công.'
                      });
                } else {
                    notification.error({
                        message: 'Thông báo',
                        description: 'Lỗi khi xóa thương hiệu.'
                      });
                }
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API xóa thương hiệu: ', error);
                notification.error({
                    message: 'Thông báo',
                    description: 'Lỗi khi xóa thương hiệu.'
                  });
        });
    };
    const fetchData = async () => {
        try {
            axios
                .get(`${process.env.REACT_APP_API_URL}/category/getAll`)
                .then((response) => {
                    setCategory(response.data.data);
                    if (response.data.data.length > 0) {
                        handleCategoryClick(response.data.data[0]._id);
                    }
                })
        } catch (error) {
            console.error('Lỗi khi gọi API: ', error);
        }
    };

    useEffect(() => {
        document.title = "Quản Lý Thương Hiệu";    

        fetchData();
    }, [reloadBrandData]);

    const handlePageChange = (page) => {
        handleCategoryClick(selectedCategory, page);
    };
    const handleCategoryClick = (categoryId, page = 1) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/brand/getBrand/${categoryId}?page=${page}`)
            .then((response) => {
                setSearchResults([]);
                setSearchQuery('');
                setSelectedCategory(categoryId);
                setBrandData(response.data.data);
                setCurrentPage(response.data.pageInfo.currentPage);
                setTotalPages(response.data.pageInfo.totalPages);
                setTotalBrand(response.data.pageInfo.totalBrand)
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API: ', error);
            });
    };
    const handleToggleHide = (brandId, checked) => {
        axios.put(`${process.env.REACT_APP_API_URL}/brand/updateBrand/${brandId}`, {
            isHide: checked,
        }, { headers })
            .then((response) => {
                const updatedBrand = {
                    ...brandData.find(brand => brand._id === brandId),
                    isHide: checked,
                };
                const updatedBrands = brandData.map(brand =>
                    brand._id === brandId ? updatedBrand : brand
                );
                setBrandData(updatedBrands);
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật thương hiệu: ', error);
            });
    };
    const [centredModal, setCentredModal] = useState(false);

    const toggleOpen = () => {
        setCentredModal(true);
    };
    const closeModal = () => {
        setCentredModal(false);
        setReloadBrandData(!reloadBrandData);
        form.resetFields();
        fetchData();
    };
    const [centredModal1, setCentredModal1] = useState(false);

    const toggleOpen1 = (brandId) => {
        setCentredModal1(true);
        setBrandId(brandId);
    };
    const closeModal1 = () => {
        setCentredModal1(false);
        setReloadBrandData(!reloadBrandData);
        fetchData();
    };
    const [centredModal2, setCentredModal2] = useState(false);

    const toggleOpen2 = (brandId) => {
        setCentredModal2(true);
        setBrandId(brandId);
    };
    const closeModal2 = () => {
        setCentredModal2(false);
    };
    return (
        <div>
            <WrapperHeader>Danh sách thương hiệu</WrapperHeader>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <MDBBtn rounded style={{ backgroundColor: '#B63245' }} onClick={toggleOpen}>
                        Thêm thương hiệu
                    </MDBBtn>
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
                <MDBTable bordered align='middle' className='floating-table'>

                    <MDBTableHead>
                        <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                            <th scope='col'>Thương hiệu</th>
                            <th scope='col'>Ẩn/Hiện</th>
                            <th scope='col'>Chỉnh sửa</th>
                            <th scope='col'>Xóa</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {brandData.map(brand => (
                            <tr key={brand._id} style={{ textAlign: 'center' }}>
                                <td>
                                    <div className='d-flex align-items-center'>
                                        <img
                                            src={brand.picture}
                                            alt={brand.name}
                                            style={{ width: '90px', maxHeight: '45px' }}
                                        />
                                        <div className='ms-3'>
                                            <p className='fw-bold mb-1'>{brand.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <MDBBtn color='link' rounded size='sm'>
                                        <Switch checked={!brand.isHide} onChange={(checked) => handleToggleHide(brand._id, !checked)} />
                                    </MDBBtn>
                                </td>

                                <td>
                                    <Tooltip title="Chỉnh sửa">
                                        <MDBBtn color="warning" onClick={() => toggleOpen1(brand._id)} >
                                            <EditOutlined />
                                        </MDBBtn>
                                    </Tooltip>
                                </td>
                                <td>
                                    <Tooltip title="Xóa">
                                        <MDBBtn color='danger' onClick={() => toggleDeleteConfirmationModal(brand._id)} >
                                            <MDBIcon fas icon='trash' />
                                        </MDBBtn>
                                        <Modal
                                            title="Xác nhận xoá sản phẩm"
                                            visible={deleteConfirmationBrandId === brand._id}
                                            onOk={() => {
                                                handleDeleteBrand(brand._id);
                                                setDeleteConfirmationBrandId(null);
                                            }}
                                            onCancel={() => setDeleteConfirmationBrandId(null)}
                                        >
                                            <p>Bạn có chắc chắn muốn xoá thương hiệu {brand.name} này?</p>
                                        </Modal>
                                    </Tooltip>
                                </td>
                            </tr>
                        ))
                        }
                    </MDBTableBody>

                </MDBTable>
            </div>
            <>
                <Modal
                    visible={centredModal}
                    title="Thêm thương hiệu mới"
                    footer={null}
                    width={'50%'}
                    closable={false}
                >
                    <NewBrand closeModal={closeModal} />
                </Modal>
            </>
            <>
                <Modal
                    visible={centredModal1}
                    title="Chỉnh sửa thương hiệu"
                    footer={null}
                    onCancel={closeModal1}
                    width={'50%'}
                    maskClosable={false}
                >
                    <EditBrand closeModal={closeModal1} brandId={brandId} />
                </Modal>
            </>
        </div >

    );
};

export default Brand;