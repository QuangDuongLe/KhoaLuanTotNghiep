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
import NewNews from "./NewNews";
import EditNews from "./EditNews";

const News = () => {
    const user = useSelector((state) => state.user);
    const [form] = Form.useForm();
    const headers = {
        token: `Bearer ${user.access_token}`,
    };
    const [newsData, setNewsData] = useState([]);
    const [reloadNewsData, setReloadNewsData] = useState(false);
    const [newsId, setNewsId] = useState(null);
    const [deleteConfirmationNewsId, setDeleteConfirmationNewsId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const toggleDeleteConfirmationModal = (newsId) => {
        setDeleteConfirmationNewsId(newsId);
    };

    const fetchNewsData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/news/getAllNews`, {
                headers,
                params: {
                    page: currentPage,
                    limit: 5,
                },
            });
            setNewsData(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi gọi API: ', error);
        }
    };
    const [triggerSearch, setTriggerSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
        setTriggerSearch(!triggerSearch);
    };

    useEffect(() => {
        document.title = "Quản Lý Tin Tức";
        if (searchQuery.trim() !== '') {
            axios.get(`${process.env.REACT_APP_API_URL}/news/searchNews`, {
                headers,
                params: {
                    title: searchQuery,
                    page: currentPage,
                    limit: 5,
                },
            })
                .then((response) => {
                    setSearchResults(response.data.data);
                    setTotalPages(response.data.pagination.totalPages);
                })
                .catch((error) => {
                    setSearchResults(null);
                    setNewsData([]);
                });
        } else {
            setSearchResults(null);
            fetchNewsData();
        }
    }, [searchQuery, triggerSearch, currentPage, reloadNewsData]);
    useEffect(() => {
        if (!searchQuery.trim()) {
            fetchNewsData();
        }
    }, [currentPage, reloadNewsData, searchQuery]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleToggleHide = (newsId, checked) => {
        axios.put(`${process.env.REACT_APP_API_URL}/news/editNews/${newsId}`, { isActive: checked }, { headers })

            .then((response) => {
                const updatedNews = {
                    ...newsData.find(news => news._id === newsId),
                    isActive: checked,
                };
                const updatedCategories = newsData.map(news =>
                    news._id === newsId ? updatedNews : news
                );
                setNewsData(updatedCategories);
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật tin tức: ', error);
            });
    };

    const [centredModal, setCentredModal] = useState(false);

    const toggleOpen = () => {
        setCentredModal(true);
    };
    const closeModal = () => {
        setCentredModal(false);
        setReloadNewsData(!reloadNewsData)
        form.resetFields();
    };
    const [centredModal1, setCentredModal1] = useState(false);

    const toggleOpen1 = (newsId) => {
        setCentredModal1(true);
        setNewsId(newsId);
    };
    const closeModal1 = () => {
        setCentredModal1(false);
        setReloadNewsData(!reloadNewsData)
    };

    const handleDeleteNews = (newsId) => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}/news/deleteNews/${newsId}`, { headers })
            .then((response) => {
                if (searchResults) {
                    setSearchResults(searchResults.filter(news => news._id !== newsId)) 
                }
                const updatedCategories = newsData.filter(news => news._id !== newsId);
                notification.success({
                    message: 'Thông báo',
                    description: 'Xoá danh mục thành công'
                  });
    
                setNewsData(updatedCategories);
            })
            .catch((error) => {
                console.error('Lỗi khi xóa danh mục: ', error);
            });
    };
    const handleAll = () => {
        setSearchQuery('');
    };
    return (
        <div>
            <WrapperHeader>Danh sách tin tức</WrapperHeader>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                    <Search style={{ width: '100%' }}
                        placeholder="Tìm kiếm tin tức"
                        enterButton onSearch={handleSearch}
                        size='large' />
                </div>
                <div style={{ justifyContent: 'start', width: '25%', display: 'flex', paddingLeft:'20px' }}>
                <MDBBtn   style={{ backgroundColor: '#B63245' }} onClick={handleAll}>
                    Đặt lại
                </MDBBtn>
                </div>

                <div style={{ justifyContent: 'end', width: '25%', display: 'flex' }}>
                    <MDBBtn rounded style={{ backgroundColor: '#B63245' }} onClick={toggleOpen}>
                        Thêm tin tức
                    </MDBBtn>
                </div>
            </div>
            <div style={{ marginTop: '15px', overflowY: 'auto', overflowX: 'auto' }}>
                <MDBTable bordered align='middle' className='floating-table'>
                    <MDBTableHead>
                        <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                            <th scope='col' style={{ verticalAlign: 'middle', minWidth: '350px', maxWidth: '350px' }}>Tiêu đề</th>
                            <th scope='col' style={{ verticalAlign: 'middle', minWidth: '250px' }}>Tác giả</th>
                            <th scope='col' style={{ verticalAlign: 'middle', minWidth: '200px' }}>Ngày phát hành</th>
                            <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Ẩn/Hiện</th>
                            <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Chỉnh sửa</th>
                            <th scope='col' style={{ verticalAlign: 'middle', minWidth: '150px' }}>Xóa</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {searchResults ? (
                            searchResults.map(result => (
                                <tr key={result._id}>
                                    <td>
                                        <div className='d-flex align-items-center'>
                                            <img src={result.image} alt={result.title} height="45px" />
                                            <div className='content-cell' style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', position: 'relative', maxHeight: 'calc(1.5em * 5)', textAlign: 'justify', marginLeft:'10px' }}>
                                                <p className='fw-bold mb-1'>{result.title}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p className='fw-bold mb-1' style={{ textAlign: 'center' }}>{result.author.fullName}</p>
                                    </td>
                                    <td>
                                        <p className='fw-bold mb-1' style={{ textAlign: 'center' }}>{result.publishedDate}</p>
                                    </td>
                                    <td>
                                        <MDBBtn color='link' rounded size='sm'>
                                            <Switch checked={result.isActive} onChange={(checked) => handleToggleHide(result._id, checked)} />
                                        </MDBBtn>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <Tooltip title="Chỉnh sửa">
                                            <MDBBtn color="warning" onClick={() => toggleOpen1(result._id)} >
                                                <EditOutlined />
                                            </MDBBtn>
                                        </Tooltip>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <Tooltip title="Xóa">
                                            <MDBBtn color='danger' onClick={() => toggleDeleteConfirmationModal(result._id)} >
                                                <MDBIcon fas icon='trash' />
                                            </MDBBtn>
                                        </Tooltip>
                                        <Modal
                                            title="Xác nhận xoá tin tức"
                                            visible={deleteConfirmationNewsId === result._id}
                                            onOk={() => {
                                                handleDeleteNews(result._id);
                                                setDeleteConfirmationNewsId(null);
                                            }}
                                            onCancel={() => setDeleteConfirmationNewsId(null)}
                                        >
                                            <p>Bạn có chắc chắn muốn xoá tin tức <strong>{result.title}</strong> này?</p>
                                        </Modal>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            newsData.map(news => (
                                <tr key={news._id}>
                                    <td>
                                        <div className='d-flex align-items-center'>
                                            <img src={news.image} alt={news.title} height="45px" />
                                            <div className='content-cell' style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', position: 'relative', maxHeight: 'calc(1.5em * 5)', textAlign: 'justify', marginLeft:'10px' }}>
                                                <p className='fw-bold mb-1'>{news.title}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p className='fw-bold mb-1' style={{ textAlign: 'center' }}>{news.author.fullName}</p>
                                    </td>
                                    <td>
                                        <p className='fw-bold mb-1' style={{ textAlign: 'center' }}>{news.publishedDate}</p>
                                    </td>
                                    <td>
                                        <MDBBtn color='link' rounded size='sm'>
                                            <Switch checked={news.isActive} onChange={(checked) => handleToggleHide(news._id, checked)} />
                                        </MDBBtn>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <Tooltip title="Chỉnh sửa">
                                            <MDBBtn color="warning" onClick={() => toggleOpen1(news._id)} >
                                                <EditOutlined />
                                            </MDBBtn>
                                        </Tooltip>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <Tooltip title="Xóa">
                                            <MDBBtn color='danger' onClick={() => toggleDeleteConfirmationModal(news._id)} >
                                                <MDBIcon fas icon='trash' />
                                            </MDBBtn>
                                        </Tooltip>
                                        <Modal
                                            title="Xác nhận xoá tin tức"
                                            visible={deleteConfirmationNewsId === news._id}
                                            onOk={() => {
                                                handleDeleteNews(news._id);
                                                setDeleteConfirmationNewsId(null);
                                            }}
                                            onCancel={() => setDeleteConfirmationNewsId(null)}
                                        >
                                            <p>Bạn có chắc chắn muốn xoá tin tức <strong>{news.title}</strong> này?</p>
                                        </Modal>
                                    </td>
                                </tr>
                            ))
                        )}
                    </MDBTableBody>
                </MDBTable>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <nav aria-label='Page navigation example'>
                        <MDBPagination className='mb-0' style={{ padding: '10px 20px' }}>
                            <MDBPaginationItem disabled={currentPage === 1}>
                                <MDBPaginationLink style={{ fontSize: '15px' }} href='#' aria-label='Previous' onClick={() => handlePageChange(currentPage - 1)} >
                                    <span aria-hidden='true'>«</span>
                                </MDBPaginationLink>
                            </MDBPaginationItem>
                            {totalPages > 0 && [...Array(totalPages).keys()].map((page) => (
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

            <>
                <Modal
                    visible={centredModal}
                    title="Thêm tin tức mới"
                    footer={null}
                    width={'100%'}
                    closable={false}
                >
                    <NewNews closeModal={closeModal} />
                </Modal>
            </>
            <>
                <Modal
                    visible={centredModal1}
                    title="Chỉnh sửa tin tức"
                    footer={null}
                    onCancel={closeModal1}
                    width={'100%'}
                >
                    <EditNews closeModal={closeModal1} newsId={newsId} />
                </Modal>
            </>
        </div>

    );
};

export default News;