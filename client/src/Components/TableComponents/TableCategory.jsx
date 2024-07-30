import React, { useState, useEffect } from "react";
import { Switch, Table, Image, Upload, Button, message, Modal, Alert, notification } from 'antd';
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import Search from "antd/es/input/Search";
import { useSelector } from "react-redux";



const TableCategory = () => {
  const user = useSelector((state) => state.user)
  const headers = {
    token: `Bearers ${user.access_token}`,
  };
  const [categoryData, setcategoryData] = useState([]);
  const [isDeleteCategory, setDeleteCategory] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'picture',
      render: (picture) => (
        <Image src={picture} width={100} height={100} />
      ),
    },
    {
      title: 'Thay đổi ảnh',
      render: (record) => {
        const props = {
          name: 'image',
          action: `${process.env.REACT_APP_API_URL}/uploadCategory/${record._id}`,
          headers: {
            authorization: 'authorization-text',
          },
          accept: '.jpg, .jpeg, .png',
          beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
              notification.error({
                message: 'Thông báo',
                description: 'Chỉ cho phép tải lên tệp JPG hoặc PNG!'
              });
            }
            return isJpgOrPng;
          },
          onChange(info) {
            if (info.file.status === 'done') {
              notification.success({
                message: 'Thông báo',
                description: `${info.file.name} file uploaded successfully`
              });
              updateCategoryData(record._id, info.file.response.imageUrl);
            } else if (info.file.status === 'error') {
              notification.error({
                message: 'Thông báo',
                description: `${info.file.name} file upload failed.`
              });
            }
          }
        };
        const updateCategoryData = (categoryId, newImageUrl) => {
          const updatedData = categoryData.map((item) =>
            item._id === categoryId ? { ...item, picture: newImageUrl } : item
          );
          setcategoryData(updatedData);
        };
        return (
          <Upload {...props} >
            <Button icon={<UploadOutlined />}>Ảnh</Button>
          </Upload>
        )
      }
    },
    {
      title: 'Ẩn/Hiện',
      dataIndex: 'isHide',
      render: (isHide, record) => {
        return (
          <div>
            <Switch
              checked={!isHide}
              onChange={(checked) => handleSwitchChange(checked, record._id)}
            />
          </div>
        );
      },
    },
    {
      title: 'Xoá',
      render: (record) => {
        return (
          <div>
            <a onClick={() => { setDeleteCategory(true); setCurrentCategoryId(record._id) }}> <DeleteOutlined /></a>
            <Modal
              title="Xác nhận xoá danh mục"
              visible={isDeleteCategory}
              onOk={() => {
                handleDeleteCategory(currentCategoryId);
                setDeleteCategory(false);
              }}
              onCancel={() => setDeleteCategory(false)}
            >
              <p>Bạn có chắc chắn muốn xoá danh mục này?</p>
            </Modal>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/category/getAll`)
      .then((response) => {
        setcategoryData(response.data.data);
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API: ', error);
      });
  }, []);
  const handleSwitchChange = (checked, categoryId) => {
    const newIsHide = !checked;
    axios
      .put(`${process.env.REACT_APP_API_URL}/category/updateCategory/${categoryId}`, { isHide: newIsHide }, { headers })
      .then((response) => {
        const updatedData = categoryData.map((item) =>
          item._id === categoryId ? { ...item, isHide: newIsHide } : item
        );
        setcategoryData(updatedData);
      })
      .catch((error) => {
        console.error('Lỗi khi cập nhật trạng thái: ', error);
      });
  };
  const handleDeleteCategory = (categoryId) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/category/delete/${categoryId}`, { headers })
      .then((response) => {
        if (response.data.success) {
          const updatedData = categoryData.filter((item) => item._id !== categoryId);
          setcategoryData(updatedData);
          notification.success({
            message: 'Thông báo',
            description: 'Xóa danh mục thành công.'
          });
        } else {
          notification.error({
            message: 'Thông báo',
            description: 'Lỗi khi xóa danh mục.'
          });

        }
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API xóa danh mục: ', error);
        notification.error({
          message: 'Thông báo',
          description: 'Lỗi khi xóa danh mục.'
        });
    });
  };
  return (
    <div>
      <Alert
        message="Lưu ý: Không được xoá những danh mục đang hiện vì nó đang chứa các sản phẩm, nếu xoá sẽ bị lỗi, chỉ xoá những danh mục lỗi nếu quá trình thêm bị sai"
        type="warning"
        showIcon
        style={{ marginBottom: '16px', background: '#FFFF99' }}
      />
      <Table bordered columns={columns} dataSource={categoryData} />
    </div>
  );
};

export default TableCategory;