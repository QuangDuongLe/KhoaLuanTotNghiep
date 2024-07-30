import React, { useState, useEffect } from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import "./admin.css"
import { Modal, Switch, Tooltip, message, notification } from 'antd';
import axios from "axios";
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import AddVariant from "./addVariants";
import EditVariant from "./EditVariants";
import AddAttributes from "./AddAtributes";
import EditAttributes from "./EditAttributes";


const AttributesVariant = ({ variantId,memory }) => {
    const user = useSelector((state) => state.user)
    const headers = {
        token: `Bearers ${user.access_token}`,
    };
    const [attributesData, setAtributesData] = useState([])
    const [reloadProductData, setReloadProductData] = useState(false);
    const [deleteConfirmationProductId, setDeleteConfirmationProductId] = useState(null);
    const [attributesId,setAttributesId] = useState(null)
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/product/getAttributes/${variantId}/attributes`)
            .then((response) => {
                setAtributesData(response.data.data);
            })
            .catch((error) => {
                console.error('Error searching products:', error);
            });
    }, [variantId, reloadProductData]);
    const handleDeleteAttribute = (attributeId) => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}/product/deleteAttributes/${attributeId}`, { headers })
            .then((response) => {
                notification.success({
                    message: 'Thông báo',
                    description: 'Xoá biến thể thành công'
                  });
          
                setReloadProductData(!reloadProductData);
            })
            .catch((error) => {
                console.error('Lỗi khi xóa sản phẩm: ', error);
            });
    };
    const toggleDeleteConfirmationModal = (attributeId) => {
        setDeleteConfirmationProductId(attributeId);
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

    const toggleOpen1 = (attributesId) => {
        setCentredModal1(true);
        setAttributesId(attributesId);
    };
    const closeModal1 = () => {
        setCentredModal1(false);
        setReloadProductData(!reloadProductData);
    };

    return (
        <div>
            <WrapperHeader>Danh sách thuộc tính của biến thể {memory}</WrapperHeader>
            <div style={{ justifyContent: 'end', width: '100%', display: 'flex' }}>
                <MDBBtn rounded style={{ backgroundColor: '#B63245' }} onClick={toggleOpen} >
                    Thêm thuộc tính của biển thể
                </MDBBtn>
            </div>
            <div style={{ marginTop: '15px', overflowX: 'auto', overflowY: 'auto' }}>
                <MDBTable bordered align='middle' className='floating-table'>
                    <MDBTableHead>
                        <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                            <th scope='col' >Mã sản phẩm</th>
                            <th scope='col'>Màu sắc</th>
                            <th scope='col'>Số lượng</th>
                            <th scope='col'>Đã bán</th>
                            <th scope='col'>Hình ảnh</th>
                            <th scope='col'>Thao tác</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>

                        {attributesData.map(attributes => (
                            <tr key={attributes._id} style={{ textAlign: 'center' }}>
                                <td>
                                    <p className='fw-bold mb-1'>{attributes.sku}</p>
                                </td>
                                <td>
                                    <p className='fw-bold mb-1'>{attributes.color}</p>
                                </td>
                                <td>
                                    <p className='fw-bold mb-1'>{attributes.quantity}</p>
                                </td>
                                <td>
                                    <p className='fw-bold mb-1'>{attributes.sold}</p>
                                </td>
                                <td style={{ width: '150px', height: '150px' }}>
                                    <img src={attributes.pictures} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </td>
                                <td>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Tooltip title="Chỉnh sửa">
                                            <div style={{ marginRight: '10px' }}>
                                            <EditOutlined onClick={() => toggleOpen1(attributes._id)} />
                                            </div>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <div>
                                                <DeleteOutlined onClick={() => toggleDeleteConfirmationModal(attributes._id)} />
                                                <Modal
                                                 title="Xác nhận xoá thuộc tính sản phẩm"
                                                visible={deleteConfirmationProductId === attributes._id}
                                                onOk={() => {
                                                    handleDeleteAttribute(attributes._id);
                                                    setDeleteConfirmationProductId(null);
                                                }}
                                                onCancel={() => setDeleteConfirmationProductId(null)}   
                                                >
                                                    <p>Bạn có chắc chắn muốn xoá thuộc tính có mã <strong>{attributes.sku}</strong> này?</p>
                                                </Modal>

                                            </div>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
                <>
                <Modal
                    visible={centredModal}
                    title="Thêm thuộc tính mới"
                    footer={null}
                    width={1400}
                    closable={false}
                >
                    <AddAttributes variantId={variantId} closeModal={closeModal} />
                </Modal>
            </>
            <>
                <Modal
                    visible={centredModal1}
                    title="Chỉnh sửa thuộc tính"
                    footer={null}
                    width={1400}
                    closable={false}
                >
                    <EditAttributes attributesId={attributesId} closeModal={closeModal1} />
                </Modal>
            </>
            </div>
        </div>

    );
};

export default AttributesVariant;