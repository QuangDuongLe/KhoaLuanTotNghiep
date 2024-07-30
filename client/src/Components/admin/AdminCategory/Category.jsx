import React, { useState, useEffect } from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBIcon } from 'mdb-react-ui-kit';
import { Modal, Switch, Tooltip, message, notification } from 'antd';
import axios from "axios";
import Search from "antd/es/input/Search";
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Form } from 'antd';
import NewCategory from "./NewCategory";
import EditCategory from "./EditCategory";

const Category = () => {
    const user = useSelector((state) => state.user)
    const [form] = Form.useForm();
    const headers = {
        token: `Bearers ${user.access_token}`,
    };
    const [categoryData, setCategoryData] = useState([]);
    const [reloadCategoryData, setReloadCategoryData] = useState(false);
    const [categoryId, setCategoryId] = useState(null)
    const [deleteConfirmationCategoryId, setDeleteConfirmationCategoryId] = useState(null);

    const toggleDeleteConfirmationModal = (categoryId) => {
        setDeleteConfirmationCategoryId(categoryId);
    };
    const fetchData = async () => {
        try {
            axios
            .get(`${process.env.REACT_APP_API_URL}/category/getAll`)
            .then((response) => {
                setCategoryData(response.data.data);
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API: ', error);
            });
        } catch (error) {
            console.error('Lỗi khi gọi API: ', error);
        }
    };

    useEffect(() => {
        document.title = "Quản Lý Danh Mục";    

        fetchData();
        }, []);

    const handleToggleHide = (categoryId, checked) => {
        axios.put(`${process.env.REACT_APP_API_URL}/category/updateCategory/${categoryId}`, { isHide: checked }, { headers })
            .then((response) => {
                const updatedCategory = {
                    ...categoryData.find(category => category._id === categoryId),
                    isHide: checked,
                };
                const updatedCategories = categoryData.map(category =>
                    category._id === categoryId ? updatedCategory : category
                );
                setCategoryData(updatedCategories);
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật danh mục: ', error);
            });
    };
    const [centredModal, setCentredModal] = useState(false);

    const toggleOpen = () => {
        setCentredModal(true);
    };
    const closeModal = () => {
        setCentredModal(false);
        setReloadCategoryData(!reloadCategoryData);
        form.resetFields();
        fetchData();
    };
    const [centredModal1, setCentredModal1] = useState(false);

    const toggleOpen1 = (categoryId) => {
        setCentredModal1(true);
        setCategoryId(categoryId);
    };
    const closeModal1 = () => {
        setCentredModal1(false);
        fetchData();
    };

    const handleDeleteCategory = (categoryId) => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}/category/delete/${categoryId}`, { headers })
            .then((response) => {
                const updatedCategories = categoryData.filter(category => category._id !== categoryId);
                notification.success({
                    message: 'Thông báo',
                    description: 'Xoá danh mục thành công.'
                  });
                setCategoryData(updatedCategories);
            })
            .catch((error) => {
                console.error('Lỗi khi xóa danh mục: ', error);
            });
    };

    return (
        <div>
            <WrapperHeader>Danh sách danh mục</WrapperHeader>
            <div style={{ display: 'flex', justifyContent:'end' }}>
                        
                    <MDBBtn rounded style={{ backgroundColor: '#B63245' }} onClick={toggleOpen}>
                        Thêm danh mục
                    </MDBBtn>
           
            </div>

            <div style={{ marginTop: '15px', overflowY: 'auto', overflowX: 'auto'  }}>
                <MDBTable bordered align='middle' className='floating-table'>

                    <MDBTableHead>
                        <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                            <th scope='col'>Danh mục</th>
                            <th scope='col'>Ẩn/Hiện</th>
                            <th scope='col'>Chỉnh sửa</th>
                            <th scope='col'>Xóa</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {categoryData.map(category => (
                            <tr key={category._id} style={{ textAlign: 'center' }}>
                                <td>
                                    <div className='d-flex align-items-center'>
                                        <img src={category.picture} alt={category.name} width="45px" height="45px" />
                                        <div className='ms-3'>
                                            <p className='fw-bold mb-1'>{category.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <MDBBtn color='link' rounded size='sm'>
                                        <Switch checked={!category.isHide} onChange={(checked) => handleToggleHide(category._id, !checked)} />
                                    </MDBBtn>
                                </td>
                                <td>
                                    <Tooltip title="Chỉnh sửa">
                                        <MDBBtn color="warning" onClick={() => toggleOpen1(category._id)} >
                                            <EditOutlined />
                                        </MDBBtn>
                                    </Tooltip>
                                </td>
                                <td>
                                    <Tooltip title="Xóa">
                                        <MDBBtn color='danger' onClick={() => toggleDeleteConfirmationModal(category._id)} >
                                            <MDBIcon fas icon='trash' />
                                        </MDBBtn>
                                    </Tooltip>
                                    <Modal
                                        title="Xác nhận xoá danh mục"
                                        visible={deleteConfirmationCategoryId === category._id}
                                        onOk={() => {
                                            handleDeleteCategory(category._id);
                                            setDeleteConfirmationCategoryId(null);
                                        }}
                                        onCancel={() => setDeleteConfirmationCategoryId(null)}
                                    >
                                        <p>Bạn có chắc chắn muốn xoá danh mục <strong>{category.name}</strong> này?</p>
                                    </Modal>

                                </td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
                {/* {categoryData.length === 0 && (
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
                )} */}
            </div>
            <>
                <Modal
                    visible={centredModal}
                    title="Thêm danh mục mới"
                    footer={null}
                    width={'50%'}
                    closable={false}
                >
                    <NewCategory closeModal={closeModal} />
                </Modal>
            </>
            <>
                <Modal
                    visible={centredModal1}
                    title="Chỉnh sửa danh mục"
                    footer={null}
                    onCancel={closeModal1}
                    width={'50%'}
                >
                    <EditCategory closeModal={closeModal1} categoryId={categoryId} />
                </Modal>
            </>
        </div>

    );
};

export default Category;