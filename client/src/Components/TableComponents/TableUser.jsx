import React, { useState, useEffect } from "react";
import { Modal, Table } from 'antd';
import { Space } from 'antd';
import { Switch } from 'antd';
import {  DeleteOutlined} from '@ant-design/icons';
import axios from "axios";
import Search from "antd/es/input/Search";
import { useSelector } from "react-redux";


const TableUser = () => {
    const user = useSelector((state)=> state.user)
    const [users, setUsers] = useState([])
    useEffect(() => {
        const headers = {
            token: `Bearers ${user.access_token}`,
        };
    
        axios.get(`${process.env.REACT_APP_API_URL}/user/getAll`, { headers })
            .then((response) => {
                const filteredUsers = response.data.data.filter(user => user.role_id !== 1);
                setUsers(filteredUsers);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);
    const columns = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'fullName',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'addRess',
        },
        {
            title: "Hình ảnh hiển thị",
            dataIndex: "avatar",
            render: theImageURL => <img alt={theImageURL} src={theImageURL} style={{ maxWidth: "100px", maxHeight: "100px" }} />
        },
        {
            title: "Vai trò",
            dataIndex: "role_id",
            render: (role_id) => {
              return role_id === 1 ? "admin" : role_id === 2 ? "Người dùng" : role_id === 3 ? "Shipper" : " " ;
            },
          },
        {
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => {setDeleteUserVisible(true); setCurrentUserId(record._id)}}> <DeleteOutlined /></a>
                    <Modal
                        title="Xác nhận xoá khách hàng"
                        visible={isDeleteUserVisible}
                        onOk={() => {
                            handleDeleteUser(currentUserId);
                            setDeleteUserVisible(false);
                        }}
                        onCancel={() => setDeleteUserVisible(false)}
                    >
                        <p>Bạn có chắc chắn muốn xoá khách hàng này?</p>
                    </Modal>
                </Space>
            ),
        },
        {
            title: 'Khóa/Mở Khóa',
            dataIndex: 'isBlocked',
            render: (isBlocked, record) => (
                <Switch
                    checked={!isBlocked}
                    onChange={(checked) => {
                        handleToggleBlocked(record._id, !checked);
                    }}
                />
            ),
        }

    ];
    const [isDeleteUserVisible, setDeleteUserVisible] = useState(false);
    const handleDeleteUser = (userId) => {
        const headers = {
            token: `Bearers ${user.access_token}`,
        };
        axios
            .delete(`${process.env.REACT_APP_API_URL}/user/delete/${userId}`, {headers})
            .then((response) => {
                axios.get(`${process.env.REACT_APP_API_URL}/user/getAll`, { headers })
                .then((response) => {
                    const filteredUsers = response.data.data.filter(user => user.role_id !== 1);
                    setUsers(filteredUsers);
                })
                .catch((error) => {
                    console.error('Error fetching users:', error);
                });
            })
            .catch((error) => {
                console.error('Lỗi khi xóa tài khoản: ', error);
            });
    };
    const handleToggleBlocked = (userId, checked) => {
        const headers = {
            token: `Bearers ${user.access_token}`,
        };
        axios.post(`${process.env.REACT_APP_API_URL}/user/update/${userId}`, {
            isBlocked: checked     
        }, {headers })
            .then((response) => {
                const updatedUser = {
                    ...users.find(user => user._id === userId),
                    isBlocked: checked,
                };
                const updatedUsers = users.map(user =>
                    user._id === userId ? updatedUser : user
                );
                setUsers(updatedUsers);
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật tài khoản: ', error);
            });
    };


    const [currentUserId, setCurrentUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const handleSearch = (query) => {
        setSearchQuery(query);
    };
    useEffect(() => {
        const headers = {
            token: `Bearers ${user.access_token}`,
        };
        if (searchQuery.trim() !== '') {
            axios.get(`${process.env.REACT_APP_API_URL}/user/searchUser?keyword=${searchQuery}`, { headers })
                .then((response) => {
                    const filteredUsers = response.data.data.filter(user => user.role_id !== 1);
                    setSearchResults(filteredUsers);
                })
                .catch((error) => {
                    console.error('Error searching users:', error);
                });
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);
    return (
        <div>
            <div>
                <Search
                    style={{ width: '50%' }}
                    placeholder="Tìm kiếm tài khoản"
                    onSearch={handleSearch}
                    enterButton
                />
            </div>
            <div
                style={{
                    marginBottom: 16,
                }}
            >
                <span
                    style={{
                        marginLeft: 8,
                    }}
                >
                </span>
            </div>
            <Table bordered columns={columns} dataSource={searchQuery.trim() === '' ? users.map((user, index) => ({
        ...user,
        key: index,
      })) : searchResults.map((user, index) => ({
        ...user,
        key: index,
      }))} />
        </div>
    );
};

export default TableUser;
