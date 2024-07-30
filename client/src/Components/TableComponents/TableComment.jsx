import React, { useState, useEffect } from "react";
import { Switch, Table, Image, Upload, Button, message, Modal, Alert, Space, Form, Input, notification } from 'antd';
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";



const TableComment = () => {
  const user = useSelector((state) => state.user)
  const headers = {
    token: `Bearers ${user.access_token}`,
  };
  const [form] = Form.useForm();
  const [commentData, setcommentData] = useState([]);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [currentProductName, setCurrentProductName] = useState(null);
  const [reply, setReply] = useState(false);
  const columns = [
    {
      title: 'Tên người bình luận',
      dataIndex: 'author',
      render: (text, record) => {
        if (record?.user?.role_id === 1) {
          return text + ' (QTV)';
        } else {
          return text;
        }
      },
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      render: product => (
        <a href={`/product/${product?.name}/undefined`}>
          {product?.name}
        </a>
      )
    },
    {
      title: 'Đây là Reply',
      dataIndex: 'isReply',
      render: isReply => (
        <span style={{ color: isReply ? 'green' : 'red' }}>
          {isReply ? '✔️ ' : '❌ '}
        </span>
      )
    },
    {
      render: record => (
        <Space size="middle">
          <Button style={{ backgroundColor: "#FF6A6A" }} onClick={() => handleDeleteComment(record._id)}>Xoá</Button>
          <Button style={{ backgroundColor: "#97FFFF" }} onClick={() => handleCheckcomment(record._id)}>Duyệt</Button>
          <Button style={{ backgroundColor: "#00FFFF" }} onClick={() => {
            setCurrentCommentId(record._id)
            setCurrentProductName(record.product.name)
            setReply(true);
          }}>Trả lời</Button>
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
        </Space>)
    },
  ];
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
  const handleDeleteComment = (commentId) => {
    const headers = {
      token: `Bearers ${user.access_token}`,
    };
    axios
      .delete(`${process.env.REACT_APP_API_URL}/comment/delete/${commentId}`, { headers })
      .then((response) => {
        if (response.data.success) {
          const updatedData = commentData.filter((item) => item._id !== commentId);
          setcommentData(updatedData);
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
  const Reply = (commentId, productName, values) => {
    const updatedValues = { ...values, author: user.fullName };
    axios
      .post(`${process.env.REACT_APP_API_URL}/comment/addReplytoReply/${commentId}/${productName}?userId=${user._id || ''}`, updatedValues)
      .then((response) => {
        if (response.data.success) {
          notification.success({
            message: 'Thông báo',
            description: 'Trả lời thành công.'
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
  const handleCheckcomment = (commentId) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/comment/check/${commentId}`, null, { headers })
      .then((response) => {
        if (response.data.success) {
          axios.get(`${process.env.REACT_APP_API_URL}/comment/getAll`)
            .then((response) => {
              const filteredComments = response.data.data.filter(comment => comment.check === false);
              setcommentData(filteredComments);
            })
          notification.success({
            message: 'Thông báo',
            description: 'Duyệt thành công.'
          });
        } else {
          notification.error({
            message: 'Thông báo',
            description: 'Lỗi khi duyệt.'
          });

        }
      })
      .catch((error) => {
        notification.error({
          message: 'Thông báo',
          description: 'Lỗi khi duyệt.'
        });
      });
  };
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/comment/getAll`)
      .then((response) => {
        const filteredComments = response.data.data.filter(comment => comment.check === false);
        setcommentData(filteredComments);
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API: ', error);
      });
  }, []);
  return (
    <div>
      <Table bordered columns={columns} dataSource={commentData} />
    </div>
  );
};

export default TableComment;