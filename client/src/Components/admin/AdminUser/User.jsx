import React, { useState, useEffect } from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBIcon } from 'mdb-react-ui-kit';
import { Modal, Switch, Tooltip, message, notification } from 'antd';
import axios from "axios";
import Search from "antd/es/input/Search";
import { useSelector } from "react-redux";
import { Form } from 'antd';
import NewAdmin from "./NewAdmin";


const User = () => {
    const user = useSelector((state) => state.user)
    const [form] = Form.useForm();
    const headers = {
        token: `Bearers ${user.access_token}`,
    };
    const [userData, setUserData] = useState([]);
    const [userId, setUserId] = useState(null)
    const [reloadUserData, setReloadUserData] = useState(false);
    const [deleteConfirmationUserId, setDeleteConfirmationUserId] = useState(null);
    const [triggerSearch, setTriggerSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const handleSearch = (value) => {
        setSearchQuery(value);
        setTriggerSearch(!triggerSearch);
    };


    useEffect(() => {
        if (searchQuery.trim() !== '') {
            axios.get(`${process.env.REACT_APP_API_URL}/user/searchUser?q=${searchQuery}`, { headers })
                .then((response) => {
                    setSearchResults(response.data.data);
                })
                .catch((error) => {
                    setSearchResults(null);
                    console.error('Error searching products:', error);
                });
        } else {
            setSearchResults(null);
        }
    }, [searchQuery, triggerSearch, reloadUserData]);
    const toggleDeleteConfirmationModal = (userId) => {
        setDeleteConfirmationUserId(userId);
    };

    useEffect(() => {
        document.title = "Quản Lý Người Dùng";    

        axios.get(`${process.env.REACT_APP_API_URL}/user/getAll`, { headers })
            .then((response) => {
                setUserData(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, [reloadUserData]);

    const handleToggleHide = (userId, checked) => {
        axios.put(`${process.env.REACT_APP_API_URL}/user/update/${userId}`, { isBlocked: checked }, { headers })
            .then((response) => {
                const updatedUser = {
                    ...userData.find(user => user._id === userId),
                    isBlocked: checked,
                };
                const updatedUsers = userData.map(user =>
                    user._id === userId ? updatedUser : user
                );
                setUserData(updatedUsers);
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật người dùng: ', error);
            });
    };
    const handleToggleBlocked = (userId, checked) => {
        const headers = {
            token: `Bearers ${user.access_token}`,
        };
        axios.post(`${process.env.REACT_APP_API_URL}/user/update/${userId}`, {
            isBlocked: checked
        }, { headers })
            .then((response) => {
                const updateUsers = (users) => {
                    const updatedUser = {
                        ...users.find(user => user._id === userId),
                        isBlocked: checked,
                    };
                    return users.map(user =>
                        user._id === userId ? updatedUser : user
                    );
                };

                if (searchQuery.trim() !== '' && searchResults) {
                    setSearchResults(updateUsers(searchResults));
                } else {
                    setUserData(updateUsers(userData));
                }
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật tài khoản: ', error);
            });
    };


    const handleDeleteUser = (userId) => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}/user/delete/${userId}`, { headers })
            .then((response) => {
                const updateUsers = (users) => {
                    return users.filter(user => user._id !== userId);
                };

                if (searchQuery.trim() !== '' && searchResults) {
                    setSearchResults(updateUsers(searchResults));
                } else {
                    setUserData(updateUsers(userData));
                }
                notification.success({
                    message: 'Thông báo',
                    description: 'Xoá người dùng thành công.'
                  });

            })
            .catch((error) => {
                console.error('Lỗi khi xóa người dùng: ', error);
            });
    };
    const [centredModal, setCentredModal] = useState(false);

    const toggleOpen = () => {
        setCentredModal(true);
    };
    const closeModal = () => {
        setCentredModal(false);
        setReloadUserData(!reloadUserData)
    };
    const handleAll = () => {
        setSearchQuery('');
    };
    return (
        <div>
            <WrapperHeader>Danh sách người dùng</WrapperHeader>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                    <Search style={{ width: '100%' }}
                        placeholder="Tìm kiếm người dùng"
                        enterButton
                        onSearch={handleSearch}
                        size="large" />
                </div>
                <div style={{ justifyContent: 'start', width: '25%', display: 'flex', paddingLeft: '20px' }}>
                    <MDBBtn style={{ backgroundColor: '#B63245' }} onClick={handleAll}>
                        Đặt lại
                    </MDBBtn>
                </div>

                <div style={{ justifyContent: 'end', width: '25%', display: 'flex' }}>
                    <MDBBtn rounded style={{ backgroundColor: '#B63245' }} onClick={toggleOpen}>
                        Thêm admin
                    </MDBBtn>
                </div>
            </div>
            <div style={{ marginTop: '15px', overflowY: 'auto', overflowX: 'auto' }}>
                <MDBTable bordered align='middle' className='floating-table' style={{ overflow: 'auto' }}>

                    <MDBTableHead>
                        <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                            <th scope='col' style={{ verticalAlign: 'middle', minWidth: '200px' }}>Tên người dùng</th>
                            <th scope='col' style={{ verticalAlign: 'middle' }}>Số điện thoại</th>
                            <th scope='col' style={{ verticalAlign: 'middle' }}>Email</th>
                            <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Khóa/Mở khóa</th>
                            <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Admin</th>
                            <th scope='col' style={{ verticalAlign: 'middle' }}>Xóa</th>
                        </tr>
                    </MDBTableHead>

                    <MDBTableBody>
                        {(searchResults && searchResults.length === 0) ? (
                            <tr style={{ textAlign: 'center' }}>
                                <td colSpan="10">Không có thông tin user</td>
                            </tr>
                        ) : (
                            searchQuery.trim() !== '' && searchResults ? (
                                searchResults.map(user => (
                                    <tr key={user._id} style={{ textAlign: 'center' }}>
                                        <td>
                                            <div className='ms-3'>
                                                <p className='fw-bold mb-1'>{user.fullName}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='ms-3'>
                                                <p className='mb-1'>{user.phone_number}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='ms-3'>
                                                <p className='mb-1'>{user.email}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <MDBBtn color='link' rounded size='sm'>
                                                <Switch checked={!user.isBlocked} onChange={(checked) => handleToggleBlocked(user._id, !checked)} />
                                            </MDBBtn>
                                        </td>
                                        <td>
                                            <div className='ms-3'>
                                                {user.role_id === 1 ? (
                                                    <i className="fas fa-check text-success"></i>
                                                ) : (
                                                    <i className="fas fa-times text-danger"></i>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <Tooltip title="Xóa">
                                                <MDBBtn color='danger' onClick={() => toggleDeleteConfirmationModal(user._id)} >
                                                    <MDBIcon fas icon='trash' />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Modal
                                                title="Xác nhận xoá người dùng"
                                                visible={deleteConfirmationUserId === user._id}
                                                onOk={() => {
                                                    handleDeleteUser(user._id);
                                                    setDeleteConfirmationUserId(null);
                                                }}
                                                onCancel={() => setDeleteConfirmationUserId(null)}
                                            >
                                                <p>Bạn có chắc chắn muốn xoá người dùng <strong>{user.fullName}</strong> này?</p>
                                            </Modal>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                userData.map(user => (
                                    <tr key={user._id} style={{ textAlign: 'center' }}>
                                        <td>
                                            <div className='ms-3'>
                                                <p className='fw-bold mb-1'>{user.fullName}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='ms-3'>
                                                <p className='mb-1'>{user.phone_number}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='ms-3'>
                                                <p className='mb-1'>{user.email}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <MDBBtn color='link' rounded size='sm'>
                                                <Switch checked={!user.isBlocked} onChange={(checked) => handleToggleBlocked(user._id, !checked)} />
                                            </MDBBtn>
                                        </td>
                                        <td>
                                            <div className='ms-3'>
                                                {user.role_id === 1 ? (
                                                    <i className="fas fa-check text-success"></i>
                                                ) : (
                                                    <i className="fas fa-times text-danger"></i>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <Tooltip title="Xóa">
                                                <MDBBtn color='danger' onClick={() => toggleDeleteConfirmationModal(user._id)} >
                                                    <MDBIcon fas icon='trash' />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Modal
                                                title="Xác nhận xoá người dùng"
                                                visible={deleteConfirmationUserId === user._id}
                                                onOk={() => {
                                                    handleDeleteUser(user._id);
                                                    setDeleteConfirmationUserId(null);
                                                }}
                                                onCancel={() => setDeleteConfirmationUserId(null)}
                                            >
                                                <p>Bạn có chắc chắn muốn xoá người dùng <strong>{user.fullName}</strong> này?</p>
                                            </Modal>
                                        </td>
                                    </tr>
                                ))
                            )
                        )}
                    </MDBTableBody>

                </MDBTable>
            </div>
            <>
                <Modal
                    visible={centredModal}
                    title="THÊM ADMIN MỚI"
                    footer={null}
                    width={'60%'}
                    closable={false}
                >
                    <NewAdmin closeModal={closeModal} />
                </Modal>
            </>
        </div>
    );
};

export default User;