import React, { useState, useEffect } from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import "./admin.css"
import { Modal, Switch, Tooltip, message, notification } from 'antd';
import axios from "axios";
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, AppstoreOutlined } from '@ant-design/icons';
import AddVariant from "./addVariants";
import EditVariant from "./EditVariants";
import { useSelector } from "react-redux";
import AttributesVariant from "./AttributesVariants";


const Variant = ({ productId, category }) => {
    const user = useSelector((state) => state.user)
    const headers = {
        token: `Bearers ${user.access_token}`,
    };
    const [variantData, setVariantData] = useState([])
    const [reloadProductData, setReloadProductData] = useState(false);
    const [variantId, setVariantId] = useState(null)
    const [deleteConfirmationProductId, setDeleteConfirmationProductId] = useState(null);
    const [memory, setMemoryName] = useState(null)
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/product/getVariant/${productId}`)
            .then((response) => {
                setVariantData(response.data.data);
            })
            .catch((error) => {
                console.error('Error searching products:', error);
            });
    }, [productId, reloadProductData]);
    const toggleDeleteConfirmationModal = (variantId) => {
        setDeleteConfirmationProductId(variantId);
    };
    const handleDeleteVariant = (variantId) => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}/product/deleteVariant/${variantId}`, { headers })
            .then((response) => {
                const updatedVariants = variantData.filter(variant => variant._id !== variantId);
                notification.success({
                    message: 'Thông báo',
                    description: 'Xoá biến thể thành công.'
                  });

                setVariantData(updatedVariants);
            })
            .catch((error) => {
                console.error('Lỗi khi xóa sản phẩm: ', error);
            });
    };
    const [centredModal, setCentredModal] = useState(false);

    const toggleOpen = () => {
        setCentredModal(true);
    };
    const closeModal = () => {
        setCentredModal(false);
        setReloadProductData(!reloadProductData);
    };
    const [centredModal1, setCentredModal1] = useState(false);

    const toggleOpen1 = (variantId) => {
        setCentredModal1(true);
        setVariantId(variantId);
    };
    const closeModal1 = () => {
        setCentredModal1(false);
        setReloadProductData(!reloadProductData);
    };
    const [centredModal2, setCentredModal2] = useState(false);

    const toggleOpen2 = (variantId, memory) => {
        setCentredModal2(true);
        setVariantId(variantId);
        setMemoryName(memory)
    };
    const closeModal2 = () => {
        setCentredModal2(false);
        setReloadProductData(!reloadProductData);
    };
    const shouldHideMemoryColumn = ["Ốp lưng", "Cáp sạc", "Pin dự phòng", "Tai nghe"].includes(category);

    return (
        <div>
            <WrapperHeader>Danh sách biến thể của sản phẩm {variantData.length > 0 && variantData[0].productName.name}</WrapperHeader>
            <div style={{ justifyContent: 'end', width: '100%', display: 'flex' }}>
                <MDBBtn rounded style={{ backgroundColor: '#B63245' }} onClick={toggleOpen} >
                    Thêm biến thể
                </MDBBtn>
            </div>
            <div style={{ marginTop: '15px', overflowX: 'auto', overflowY: 'auto' }}>
                <MDBTable bordered align='middle' className='floating-table'>
                    <MDBTableHead>
                        <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                            {!shouldHideMemoryColumn && <th scope='col'>Bộ nhớ</th>}
                            <th scope='col'>Giá nhập</th>
                            <th scope='col'>Giá cũ</th>
                            <th scope='col'>Giá bán</th>
                            <th scope='col'>Thao tác</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {variantData.map(variant => (
                            <tr key={variant._id} style={{ textAlign: 'center' }}>
                                {!shouldHideMemoryColumn &&
                                    <td>
                                        <p className='fw-bold mb-1'>{variant.memory}</p>
                                    </td>
                                }

                                <td>
                                    <MDBBadge color='success' pill style={{ fontSize: '14px', wordWrap: 'break-word' }}>
                                        {variant && variant.imPrice ? variant.imPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : ''}
                                    </MDBBadge>
                                </td>
                                <td>
                                    {variant && variant.oldPrice ? (
                                        <MDBBadge color='warning' pill style={{ fontSize: '14px', wordWrap: 'break-word' }}>
                                            {variant.oldPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </MDBBadge>
                                    ) : null}
                                </td>
                                <td>
                                    <MDBBadge color='primary' pill style={{ fontSize: '14px', wordWrap: 'break-word' }}>
                                        {variant && variant.newPrice ? variant.newPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : ''}
                                    </MDBBadge>
                                </td>


                                <td>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Tooltip title="Danh sách thuộc tính">
                                            <div style={{ marginRight: '10px' }}>
                                                <AppstoreOutlined onClick={() => toggleOpen2(variant._id, variant.memory)} />
                                            </div>
                                        </Tooltip>
                                        <Tooltip title="Chỉnh sửa">
                                            <div style={{ marginRight: '10px' }}>
                                                <EditOutlined onClick={() => toggleOpen1(variant._id)} />
                                            </div>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <div>
                                                <DeleteOutlined onClick={() => toggleDeleteConfirmationModal(variant._id)} />
                                                <Modal
                                                    title="Xác nhận xoá biến thể"
                                                    visible={deleteConfirmationProductId === variant._id}
                                                    onOk={() => {
                                                        handleDeleteVariant(variant._id);
                                                        setDeleteConfirmationProductId(null);
                                                    }}
                                                    onCancel={() => setDeleteConfirmationProductId(null)}
                                                >
                                                    <p>Bạn có chắc chắn muốn xoá biến thể <strong>{variant.memory}</strong> này?</p>
                                                </Modal>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </div>
            <>
                <Modal
                    visible={centredModal}
                    title="Thêm biến thể mới"
                    footer={null}
                    width={1400}
                    closable={false}
                >
                    <AddVariant productId={productId} category={category} closeModal={closeModal} />
                </Modal>
            </>
            <>
                <Modal
                    visible={centredModal1}
                    title="Chỉnh sửa biến thể"
                    footer={null}
                    width={1400}
                    closable={false}
                >
                    <EditVariant variantId={variantId} category={category} closeModal={closeModal1} />
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
                    <AttributesVariant closeModal={closeModal2} variantId={variantId} memory={memory} />
                </Modal>
            </>
        </div>

    );
};

export default Variant;