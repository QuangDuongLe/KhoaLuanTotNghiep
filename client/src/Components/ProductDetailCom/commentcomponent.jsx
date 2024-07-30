import { Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { WrapperCommentNew, WrapperInfo, WrapperTextBox } from './style';
import { MessageFilled, SendOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import { useSelector } from 'react-redux';
import ErrorMessage from '../error';

const Comment = () => {
  const user = useSelector((state) => state.user);
  const [commentData, setCommentData] = useState([]);
  const [showReplyForms, setShowReplyForms] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { productName } = useParams();
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const [comment, setComment] = useState({
    author: user.fullName || '',
    content: '',
  });
  const [reply, setReply] = useState({
    author: user.fullName || '',
    content: '',
    commentId: null,
  });

  useEffect(() => {
    setComment((prevComment) => ({
      ...prevComment,
      author: user.fullName || '',
    }));
  }, [user.fullName]);

  useEffect(() => {
    setReply((prevComment) => ({
      ...prevComment,
      author: user.fullName || '',
    }));
  }, [user.fullName]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleReplyForm = (commentIndex) => {
    const newShowReplyForms = [...showReplyForms];
    newShowReplyForms[commentIndex] = !newShowReplyForms[commentIndex];
    setShowReplyForms(newShowReplyForms);
  };

  const onChange = (event) => {
    event.preventDefault();
    setComment({ ...comment, [event.target.name]: event.target.value });
  };

  const onChange1 = (event) => {
    event.preventDefault();
    setReply({ ...reply, [event.target.name]: event.target.value });
  };

  const addComment = (event) => {
    event.preventDefault();
    if (comment.author.trim() === '' || comment.content.trim() === '') {
      setSuccess(false);
      setMessage('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (comment.author.trim() !== '' && comment.content.trim() !== '') {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/comment/addComment/${productName}?userId=${user._id || ''}`,
          comment
        )
        .then((res) => {
          setSuccess(true);
          setMessage('Bình luận của bạn đã được gửi thành công!');
          toggleModal();
          setComment({
            author: user.fullName || '',
            content: '',
          });
          // Reload comments after adding a new one
          fetchComments();
        })
        .catch((err) => {
          setSuccess(false);
          setMessage('Có lỗi xảy ra, vui lòng thử lại sau.');
          console.error(err);
        });
    }
  };

  const addReply = (event, commentId) => {
    event.preventDefault();
    if (reply.author.trim() === '' || reply.content.trim() === '') {
      setSuccess(false);
      setMessage('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (reply.author.trim() !== '' && reply.content.trim() !== '') {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/comment/addReply/${commentId}/${productName}?userId=${user._id || ''}`,
          reply
        )
        .then((res) => {
          setSuccess(true);
          setMessage('Phản hồi của bạn đã được gửi thành công!');
          toggleModal();
          setReply({
            author: user.fullName || '',
            content: '',
          });
          // Reload comments after adding a reply
          fetchComments();
        })
        .catch((err) => {
          setSuccess(false);
          setMessage('Có lỗi xảy ra, vui lòng thử lại sau.');
          console.error(err);
        });
    }
  };

  const fetchComments = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/comment/getCommentsByProduct/${productName}`)
      .then((response) => {
        setCommentData(response.data.data);
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API: ', error);
      });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleClose = () => {
    setMessage('');
  };

  return (
    <WrapperCommentNew>
      <div className={`comment-container ${expanded ? 'expanded' : ''}`}>
        <div className='comment-form'>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#B63245' }}>Hỏi và đáp</p>
          <form onSubmit={addComment}>
            <WrapperInfo style={{ display: 'flex', alignContent: 'space-between' }}>
              <input
                className='nameinput'
                name='author'
                value={comment.author}
                type='text'
                placeholder='Tên của bạn'
                onChange={onChange}
              />
              <div className='error-msg' id='name-error-msg'></div>
            </WrapperInfo>
            <div className='comment-form-content'>
              <div className='textarea-comment'>
                <img
                  src='https://res.cloudinary.com/doq4spvys/image/upload/v1714700566/nefgcpuzc4mlmiiemqca.png'
                  width={55}
                  alt='icon'
                  className='icon-img'
                />
                <textarea
                  className='textarea'
                  id='textarea'
                  placeholder='Hãy để lại câu hỏi, chúng tôi sẽ giải đáp thắc mắc cho bạn!'
                  cols='120'
                  name='content'
                  value={comment.content}
                  onChange={onChange}
                ></textarea>
                <button className='btn-send' id='btn-send'>
                  <SendOutlined />
                  Gửi
                </button>
              </div>
            </div>
          </form>
          <ErrorMessage message={message} success={success} onClose={handleClose} />
          <div className='error-msg' id='textarea-error-msg'></div>
          <br />
        </div>
        {commentData.length > 0 ? (
          (expanded ? commentData : commentData.slice(0, 3)).map((comments, index) => (
            <div className='block-comment-list' key={index}>
              <br />
              <div id className='list-comment'>
                <hr />
                <div className='item-comment'>
                  <div className='box-cmt'>
                    <div className='cmt-inf'>
                      <div className='box-inf'>
                        <div className='box-inf-avt'>
                          {comments?.user?.avatar ? (
                            <img src={comments.user.avatar} style={{ width: '30px' }} />
                          ) : (
                            <img src='../../image/logo.png' style={{ width: '30px' }} />
                          )}
                          &nbsp;
                        </div>
                        <div className='box-inf-name'>
                          {comments.author} {comments?.user && comments.user?.role_id === 1 ? ' (QTV)' : ''}
                        </div>
                      </div>
                    </div>
                    <div className='cmt-quest'>
                      <div className='content'>
                        <div className='content'>
                          <div
                            className={comments.deleted ? 'deleted-comment' : ''}
                            style={{
                              backgroundColor: comments.deleted ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
                              borderRadius: '5px',
                              padding: '10px',
                              opacity: comments.deleted ? '0.7' : '1',
                            }}
                          >
                            {comments.deleted ? (
                              <p>Bình luận này đã bị xoá hoặc ẩn đi bởi quản trị viên</p>
                            ) : (
                              <p>{comments.content}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      {!comments.deleted && (
                        <button className='btn-rep' onClick={() => toggleReplyForm(index)}>
                          <MessageFilled />
                        </button>
                      )}
                      {showReplyForms[index] && (
                        <form onSubmit={(e) => addReply(e, comments._id)}>
                          <div className='reply-form'>
                            <Input
                              type='text'
                              className='name-input'
                              name='author'
                              value={reply.author}
                              onChange={onChange1}
                              placeholder='Nhập tên'
                              style={{ width: '200px', height: '50px' }}
                            />
                            <div className='comment-form-content'>
                              <div className='textarea-comment'>
                                <img
                                  src='https://res.cloudinary.com/doq4spvys/image/upload/v1714700566/nefgcpuzc4mlmiiemqca.png'
                                  width={55}
                                  alt='icon'
                                  className='icon-img'
                                />
                                <textarea
                                  className='textarea'
                                  placeholder='Trả lời!'
                                  cols='120'
                                  name='content'
                                  onChange={onChange1}
                                  value={reply.content}
                                ></textarea>
                                <button className='btn-send'>
                                  <SendOutlined /> Gửi
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                    <div className='cmt-rep'>
                      <div className='list-cmt-rep'>
                        {comments.replies.map((reply, replyIndex) => (
                          <div className='item-cmt-rep' style={{ marginTop: 8 }} key={replyIndex}>
                            <div className='box-inf'>
                              <div className='box-inf-avt'>
                                {reply?.user?.avatar ? (
                                  <img src={reply?.user?.avatar} style={{ width: '30px' }} />
                                ) : (
                                  <img src='../../image/logo.png' style={{ width: '30px' }} />
                                )}
                                &nbsp;
                              </div>
                              <div className='box-inf-name'>
                                {reply.author} {reply?.user && reply?.user?.role_id === 1 ? ' (QTV)' : ''}
                              </div>
                            </div>
                            <div className='cmt-quest' style={{ marginTop: 8 }}>
                              <div className='content'>
                                <div
                                  className={reply.deleted ? 'deleted-comment' : ''}
                                  style={{
                                    backgroundColor: reply.deleted ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    opacity: reply.deleted ? '0.7' : '1',
                                  }}
                                >
                                  {reply.deleted ? (
                                    <p>Bình luận này đã bị xoá hoặc ẩn đi bởi quản trị viên</p>
                                  ) : (
                                    <p>{reply.content}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Không có bình luận nào.</p>
        )}
        {/* Hiển thị nút Xem thêm nếu có nhiều hơn 3 bình luận */}
        {commentData.length > 3 && !expanded && (
          <>
            <br />
            <br />
            <div className='show-more'>
              <MDBBtn className='w-20' style={{ background: '#B63245' }} size='lg' onClick={toggleExpanded}>
                Xem thêm
              </MDBBtn>
            </div>
          </>
        )}
        {/* Hiển thị nút Thu gọn khi đã mở rộng */}
        {expanded && (
          <>
            <br />
            <br />

            <div className='show-less'>
            <MDBBtn className='w-20' style={{ background: '#B63245' }} size='lg' onClick={toggleExpanded}>
                Thu gọn
              </MDBBtn>
            </div>
          </>
        )}
      </div>
    </WrapperCommentNew>
  );
};

export default Comment;

