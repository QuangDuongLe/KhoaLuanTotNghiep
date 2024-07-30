import React, { useState, useEffect } from "react";
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBIcon } from 'mdb-react-ui-kit';
import { Modal, Switch, Tooltip, message, notification } from 'antd';
import axios from "axios";
import Search from "antd/es/input/Search";
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";



const EditAddRess = ({ closeModal,address }) => {
    const user = useSelector((state) => state.user)
    const headers = {
        token: `Bearer ${user.access_token}`,
    };

    const [addressList, setAddressList] = useState([]);
    const [deleteConfirmationAddressId, setDeleteConfirmationAddressId] = useState(null);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/getAddresses/${user._id}`, { headers });
                setAddressList(response.data.addresses);
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };
        fetchAddresses();
    }, [user._id,address]);

    const handleDeleteAddress = async (addressId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/user/deleteAddress/${user._id}/${addressId}`, { headers });
            setAddressList(prevAddresses => prevAddresses.filter(address => address._id !== addressId));
            notification.success({
                message: 'Thông báo',
                description: 'Xoá địa chỉ thành công.'
              });
        } catch (error) {
            console.error('Lỗi khi xoá địa chỉ:', error);
            notification.error({
                message: 'Thông báo',
                description: 'Đã xảy ra lỗi khi xoá địa chỉ'
              });

        }
    };

    const toggleDeleteConfirmationModal = (addressId) => {
        setDeleteConfirmationAddressId(addressId);
    };

    return (
        <div>
            <div style={{ marginTop: '15px', overflowY: 'auto', overflowX: 'auto' }}>
                <MDBTable bordered align='middle' className='floating-table'>
                    <MDBTableHead>
                        <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                            <th scope='col' style={{ verticalAlign: 'middle', minWidth: '350px' }}>Địa chỉ</th>
                            <th scope='col' style={{ verticalAlign: 'middle', minWidth: '200px' }}>Xoá</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {addressList.map((addressItem) => (
                            <tr key={addressItem._id}>
                                <td>
                                    <p className='fw-bold mb-1' style={{ textAlign: 'center' }}>{addressItem.address}</p>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <Tooltip title="Xóa">
                                        <MDBBtn color='danger' onClick={() => toggleDeleteConfirmationModal(addressItem._id)} >
                                            <MDBIcon fas icon='trash' />
                                        </MDBBtn>
                                    </Tooltip>
                                    <Modal
                                        title="Xác nhận xoá địa chỉ"
                                        visible={deleteConfirmationAddressId === addressItem._id}
                                        onOk={() => {
                                            handleDeleteAddress(addressItem._id);
                                            setDeleteConfirmationAddressId(null);
                                        }}
                                        onCancel={() => setDeleteConfirmationAddressId(null)}
                                    >
                                        <p>Bạn có chắc chắn muốn xoá địa chỉ này?</p>
                                    </Modal>
                                </td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </div>
        </div>
    );
};

export default EditAddRess;