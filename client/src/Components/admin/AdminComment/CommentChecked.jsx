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
import AdminComment from "./AdminComment";
import Comment from "./Comment";
import Loading from "../../LoadingComponents/Loading";


const CommentChecked = () => {
    const user = useSelector((state) => state.user)
    const [commentData, setCommentData] = useState([]);
    const [reloadCommentData, setReloadCommentData] = useState(false)
    const [deleteConfirmationCommentId, setDeleteConfirmationCommentId] = useState(null);
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        pageSize: 10,
    });
    const [viewContent, setViewContent] = useState('');
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);

    const handleViewContent = (content) => {
        setViewContent(content);
        setIsViewModalVisible(true);
    };

    const toggleDeleteConfirmationModal = (commentId) => {
        setDeleteConfirmationCommentId(commentId);
    };
    const [searchQuery, setSearchQuery] = useState('');
    const [triggerSearch, setTriggerSearch] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const handleSearch = (query) => {
        setLoading(true)
        setSearchQuery(query);
        setTriggerSearch(!triggerSearch);
    };
    useEffect(() => {
        document.title = "Quản Lý Bình Luận";    

        if (searchQuery.trim() !== '') {
            axios.get(`${process.env.REACT_APP_API_URL}/comment/searchComment`, {
                params: {
                    keyword: searchQuery,
                    page: pagination.currentPage,
                    limit: pagination.pageSize,
                },
            })
                .then((response) => {
                    const { data, currentPage, totalPages, pageSize } = response.data;
                    setSearchResults(data);
                    setPagination({
                        currentPage,
                        totalPages,
                        pageSize,
                    });
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Lỗi khi gọi API: ', error);
                    setLoading(false);
                    setCommentData([]);
                });
        } else {
            fetchData(pagination.currentPage, pagination.pageSize);
        }
    }, [searchQuery, pagination.currentPage, pagination.pageSize, triggerSearch, reloadCommentData]);;
    useEffect(() => {
        setLoading(true)
        if (searchQuery.trim() === '') {
            fetchData(pagination.currentPage, pagination.pageSize);
        }
    }, [pagination.currentPage, pagination.pageSize, reloadCommentData, searchQuery]);
    const [centredModal, setCentredModal] = useState(false);
    const toggleOpen = () => {
        setCentredModal(true);
    };
    const closeModal = () => {
        setCentredModal(false);
        setReloadCommentData(!reloadCommentData);
    };
    const fetchData = (page, limit) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/comment/getAllComment?page=${page}&limit=${limit}`)
            .then((response) => {
                const { data, currentPage, totalPages, pageSize } = response.data;
                setCommentData(data);
                setSearchResults(null);
                setPagination({
                    currentPage,
                    totalPages,
                    pageSize,
                });
                setLoading(false)
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API: ', error);
                setLoading(false)
            });
    };
    const handlePageChange = (page) => {
        setPagination({ ...pagination, currentPage: page });
    };
    const handleDeleteComment = (commentId) => {
        const headers = {
            token: `Bearers ${user.access_token}`,
        };
        axios
            .put(`${process.env.REACT_APP_API_URL}/comment/delete/${commentId}`, {}, { headers })
            .then((response) => {
                if (response.data.success) {
                    setLoading(true)
                    setReloadCommentData(!reloadCommentData);
                    notification.success({
                        message: 'Thông báo',
                        description: 'Xóa bình luận thành công.'
                      });
                } else {
                    notification.error({
                        message: 'Thông báo',
                        description: 'Lỗi khi xóa bình luận.'
                      });

                }
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API xóa bình luận: ', error);
                notification.error({
                    message: 'Thông báo',
                    description: 'Lỗi khi xóa bình luận.'
                  });

            });
    };
    const handleAll = () => {
        setSearchQuery('');
    };
    return (
        <div>
            <WrapperHeader>Danh sách bình luận đã duyệt</WrapperHeader>
            <div style={{ marginTop: '15px', overflowY: 'auto', overflowX: 'auto' }}>
                <div style={{ display: 'flex' }}>
                    <div style={{ width: '50%' }}>
                        <Search style={{ width: '100%' }}
                            placeholder="Tìm kiếm bình luận"
                            enterButton
                            onSearch={handleSearch} 
                            size="large"/>
                    </div>
                    <div style={{ justifyContent: 'start', width: '25%', display: 'flex', paddingLeft: "20px" }}>
                        <MDBBtn style={{ backgroundColor: '#B63245' }} onClick={handleAll}>
                            Đặt lại
                        </MDBBtn>
                    </div>

                    <div style={{ justifyContent: 'end', width: '25%', display: 'flex', gap: "20px" }}>
                        <MDBBtn rounded style={{ backgroundColor: '#B63245' }} onClick={toggleOpen}>
                            Danh sách bình luận chờ duyệt
                        </MDBBtn>
                    </div>
                </div>
                <Loading isLoading={loading}>
                    <MDBTable bordered align='middle' className='floating-table' style={{marginTop: '15px'}}>
                        <MDBTableHead>
                            <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Người bình luận</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '200px', maxWidth: '200px' }}>Nội dung</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '200px' }}>Sản phẩm</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '200px' }}>Ngày giờ bình luận</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '50px' }}>Xóa</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {searchResults ? (
                                searchResults.map(result => (
                                    <tr key={result._id} style={{ textAlign: 'center' }}>
                                        <td>
                                            <p className='fw-bold mb-1'>{result.author} {result?.user && result.user?.role_id === 1 ? ' (QTV)' : ''}</p>
                                        </td>
                                        <td>
                                            <div className='content-cell' style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', position: 'relative', maxHeight: 'calc(1.5em * 5)', textAlign: 'justify' }}>
                                                <p className='fw-bold mb-1'>{result.content}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignContent: 'center' }}>
                                                <span className='view-more' onClick={() => handleViewContent(result.content)} style={{ color: '#007bff', cursor: 'pointer', display: 'block' }}>Xem thêm</span>
                                            </div>
                                        </td>
                                        <td>
                                            <NavLink to={`/product/${result.product?.name}/undefined`}>
                                                {result.product?.name}
                                            </NavLink>
                                        </td>
                                        <td>
                                            {result.createDate}
                                        </td>
                                        <td>
                                            <Tooltip title="Xóa">
                                                <MDBBtn color='danger' onClick={() => toggleDeleteConfirmationModal(result._id)} >
                                                    <MDBIcon fas icon='trash' />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Modal
                                                title="Xác nhận xoá bình luận"
                                                visible={deleteConfirmationCommentId === result._id}
                                                onOk={() => {
                                                    handleDeleteComment(result._id);
                                                    setDeleteConfirmationCommentId(null);
                                                }}
                                                onCancel={() => setDeleteConfirmationCommentId(null)}
                                            >
                                                <p>Bạn có chắc chắn muốn xoá bình luận <strong>{result.content}</strong> này?</p>
                                            </Modal>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                commentData.map(comment => (
                                    <tr key={comment._id} style={{ textAlign: 'center' }}>
                                        <td>
                                            <p className='fw-bold mb-1'>{comment.author} {comment?.user && comment.user?.role_id === 1 ? ' (QTV)' : ''}</p>
                                        </td>
                                        <td>
                                            <div className='content-cell' style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', position: 'relative', maxHeight: 'calc(2em * 5)', textAlign: 'justify' }}>
                                                <p className='fw-bold mb-1'>{comment.content}</p>
                                            </div>
                                            <span className='view-more' onClick={() => handleViewContent(comment.content)} style={{ color: '#007bff', cursor: 'pointer', marginTop: '20px' }}>Xem thêm</span>
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
                                    </tr>
                                ))
                            )}
                        </MDBTableBody>
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
                <>
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

                    <Modal
                        visible={centredModal}
                        footer={null}
                        width={'90%'}
                        onCancel={closeModal}
                    >
                        <Comment closeModal={closeModal} />
                    </Modal>
                </>
            </div>
        </div>

    );
};

export default CommentChecked;