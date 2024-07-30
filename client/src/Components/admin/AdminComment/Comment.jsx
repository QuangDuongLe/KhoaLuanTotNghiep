import React, { useState, useEffect } from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBIcon } from 'mdb-react-ui-kit';
import { Input, Modal, Switch, Tooltip, message, notification } from 'antd';
import axios from "axios";
import Search from "antd/es/input/Search";
import { EditOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Form } from 'antd';
import { NavLink } from "react-router-dom";
import Loading from "../../LoadingComponents/Loading";


const Comment = () => {
    const user = useSelector((state) => state.user)
    const [form] = Form.useForm();
    const headers = {
        token: `Bearers ${user.access_token}`,
    };
    const [commentData, setCommentData] = useState([]);
    const [reloadCommentData, setReloadCommentData] = useState(false);
    const [deleteConfirmationCommentId, setDeleteConfirmationCommentId] = useState(null);
    const [currentCommentId, setCurrentCommentId] = useState(null);
    const [currentProductName, setCurrentProductName] = useState(null);
    const [loading, setLoading] = useState(true)
    const [reply, setReply] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
    });
    const toggleDeleteConfirmationModal = (commentId) => {
        setDeleteConfirmationCommentId(commentId);
    };
    const [viewContent, setViewContent] = useState('');
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);

    const handleViewContent = (content) => {
        setViewContent(content);
        setIsViewModalVisible(true);
    };
   

    useEffect(() => {
        fetchData(pagination.currentPage, pagination.pageSize);
    }, [pagination.currentPage, pagination.pageSize, reloadCommentData]);

    const fetchData = (page, limit) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/comment/getAll?page=${page}&limit=${limit}`)
            .then((response) => {
                const { data, currentPage, totalPages, pageSize } = response.data;
                setCommentData(data);
                setPagination({
                    currentPage,
                    totalPages,
                    pageSize,
                });
                setLoading(false)
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API: ', error);
            });
    };
    const handlePageChange = (page) => {
        setPagination({ ...pagination, currentPage: page });
    };
    const handleCheckcomment = (commentId) => {
        axios
            .put(`${process.env.REACT_APP_API_URL}/comment/check/${commentId}`, null, { headers })
            .then((response) => {
                if (response.data.success) {
                    axios.get(`${process.env.REACT_APP_API_URL}/comment/getAll`)
                        .then((response) => {
                            setLoading(true)
                            const filteredComments = response.data.data.filter(comment => comment.check === false);
                            setCommentData(filteredComments);
                            setReloadCommentData(!reloadCommentData)
                        })
                    notification.success({
                        message: 'Thông báo',
                        description: 'Duyệt thành công'
                      });
    
                } else {
                    notification.error({
                        message: 'Thông báo',
                        description: 'Lỗi khi duyệt'
                      });
                    }
            })
            .catch((error) => {
                notification.error({
                    message: 'Thông báo',
                    description: 'Lỗi khi duyệt'
                  });

            });
    };

    const Reply = (commentId, productName, values) => {
        const updatedValues = { ...values, author: user.fullName };
        axios
            .post(`${process.env.REACT_APP_API_URL}/comment/addReplytoReply/${commentId}/${productName}?userId=${user._id || ''}`, updatedValues)
            .then((response) => {
                if (response.data.success) {
                    setLoading(true)
                    setReloadCommentData(!reloadCommentData)
                    notification.success({
                        message: 'Thông báo',
                        description: 'Trả lời thành công'
                      });

                } else {
                    notification.error({
                        message: 'Thông báo',
                        description: 'Trả lời lỗi'
                      });
                    }
            })
            .catch((error) => {
                notification.error({
                    message: 'Thông báo',
                    description: 'Trả lời lỗi'
                  });
            });
    };

    const handleDeleteComment = (commentId) => {
        const headers = {
            token: `Bearers ${user.access_token}`,
        };
        axios
            .delete(`${process.env.REACT_APP_API_URL}/comment/deleteCheck/${commentId}`, { headers })
            .then((response) => {
                if (response.data.success) {
                    setLoading(true)
                    const updatedData = commentData.filter((item) => item._id !== commentId);
                    setCommentData(updatedData);
                    setReloadCommentData(!reloadCommentData)
                    notification.success({
                        message: 'Thông báo',
                        description: 'Xóa bình luận thành công.'
                      });
                } else {
                    notification.error({
                        message: 'Thông báo',
                        description: 'Lỗi khi xóa bình luận'
                      });
                    }
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API xóa bình luận: ', error);
                notification.error({
                    message: 'Thông báo',
                    description: 'Lỗi khi xóa bình luận'
                  });
    
            });
    };
    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 8,
            },
        },
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 16,
            },
        },
    };

    return (
        <div>
            <WrapperHeader>Danh sách bình luận</WrapperHeader>
            <div style={{ marginTop: '15px', overflowY: 'auto', overflowX: 'auto' }}>
                <Loading isLoading={loading}>
                    <MDBTable bordered align='middle' className='floating-table'>
                        <MDBTableHead>
                            <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Người bình luận</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px', maxWidth: '200px' }}>Nội dung</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '200px' }}>Sản phẩm</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '200px' }}>Ngày giờ</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '50px' }}>Xóa</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '50px' }}>Duyệt</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '50px' }}>Trả lời</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {commentData.map(comment => (
                                <tr key={comment._id} style={{ textAlign: 'center' }}>
                                    <td>
                                        <p className='fw-bold mb-1'>{comment.author} {comment?.user && comment.user?.role_id === 1 ? ' (QTV)' : ''}</p>
                                    </td>
                                    <td>
                                        <div className='content-cell' style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', position: 'relative', maxHeight: 'calc(2em * 5)', textAlign: 'justify' }}>
                                            <p className='fw-bold mb-1'>{comment.content}</p>
                                        </div>
                                        <span className='view-more' onClick={() => handleViewContent(comment.content)} style={{ color: '#007bff', cursor: 'pointer', display: 'block' }}>Xem thêm</span>
                                    </td>
                                    <td>
                                        <NavLink to={`/product/${comment.product?.name}/undefined`}>
                                            {comment.product?.name}
                                        </NavLink>
                                    </td>
                                    <td>
                                        {comment.createDate}
                                    </td>
                                    <td>
                                        <Tooltip title="Xóa">
                                            <MDBBtn color='danger' onClick={() => toggleDeleteConfirmationModal(comment._id)} >
                                                <MDBIcon fas icon='trash' />
                                            </MDBBtn>
                                        </Tooltip>
                                        <Modal
                                            title="Xác nhận xoá bình luận"
                                            visible={deleteConfirmationCommentId === comment._id}
                                            onOk={() => {
                                                handleDeleteComment(comment._id);
                                                setDeleteConfirmationCommentId(null);
                                            }}
                                            onCancel={() => setDeleteConfirmationCommentId(null)}
                                        >
                                            <p>Bạn có chắc chắn muốn xoá bình luận <strong>{comment.content}</strong> này?</p>
                                        </Modal>
                                    </td>
                                    <td>
                                        <Tooltip title="Duyệt">
                                            <MDBBtn color="success" onClick={() => handleCheckcomment(comment._id)} >
                                                <MDBIcon fas icon='fa-solid fa-check-double' />
                                            </MDBBtn>
                                        </Tooltip>
                                    </td>
                                    <td>
                                        <Tooltip title="Trả lời">
                                            <MDBBtn color="info" onClick={() => {
                                                setCurrentCommentId(comment._id)
                                                setCurrentProductName(comment.product.name)
                                                setReply(true);
                                            }} >
                                                <MDBIcon fas icon='fa-solid fa-comment' />
                                            </MDBBtn>
                                        </Tooltip>
                                        <Modal
                                            title="Trả lời theo nội dung"
                                            visible={reply}
                                            onOk={() => {
                                                form
                                                    .validateFields()
                                                    .then((values) => {
                                                        Reply(currentCommentId, currentProductName, values)
                                                        setReply(false);
                                                    })
                                                    .catch((errorInfo) => {
                                                        console.error('Validation failed:', errorInfo);
                                                    });
                                            }}
                                            onCancel={() => setReply(false)}
                                        >
                                            <Form
                                                {...formItemLayout}
                                                form={form}
                                                style={{
                                                    maxWidth: 600,
                                                }}
                                                scrollToFirstError
                                            >
                                                <Form.Item
                                                    name="content"
                                                    label="Nội dung"
                                                >
                                                    <Input />
                                                </Form.Item>
                                            </Form>
                                        </Modal>
                                    </td>
                                </tr>
                            ))}
                        </MDBTableBody>
                        <Modal
                            width={'60%'}
                            title="Nội dung bình luận"
                            visible={isViewModalVisible}
                            footer={null}
                            onOk={() => setIsViewModalVisible(false)}
                            onCancel={() => setIsViewModalVisible(false)}
                        >
                            <p>{viewContent}</p>
                        </Modal>
                    </MDBTable>
                </Loading>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <nav aria-label='Page navigation example'>
                        <MDBPagination className='mb-0' style={{ padding: '10px 20px' }}>
                            <MDBPaginationItem disabled={pagination.currentPage === 1}>
                                <MDBPaginationLink style={{ fontSize: '15px' }} href='#' aria-label='Previous' onClick={() => handlePageChange(pagination.currentPage - 1)} >
                                    <span aria-hidden='true'>«</span>
                                </MDBPaginationLink>
                            </MDBPaginationItem>
                            {[...Array(pagination.totalPages).keys()].map((page) => (
                                <MDBPaginationItem key={page} className={pagination.currentPage === page + 1 ? 'active' : ''}>
                                    <MDBPaginationLink style={{ fontSize: '15px' }} href='#' onClick={() => handlePageChange(page + 1)}>
                                        {page + 1}
                                    </MDBPaginationLink>
                                </MDBPaginationItem>
                            ))}
                            <MDBPaginationItem disabled={pagination.currentPage === pagination.totalPages}>
                                <MDBPaginationLink href='#' style={{ fontSize: '15px' }} aria-label='Next' onClick={() => handlePageChange(pagination.currentPage + 1)} >
                                    <span aria-hidden='true'>»</span>
                                </MDBPaginationLink>
                            </MDBPaginationItem>
                        </MDBPagination>
                    </nav>
                </div>

            </div>
        </div>

    );
};

export default Comment;