import React, { useState, useEffect } from "react";
import { Switch, Table, Image, Upload, Button, message, Modal, Alert, notification } from 'antd';
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";



const TableBrand = () => {
  const user = useSelector((state) => state.user)
  const headers = {
    token: `Bearers ${user.access_token}`,
  };
  const [category, setCategory] = useState([]);
  const [isDeleteBrand, setDeleteBrand] = useState(false);
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const columns = [
    {
      title: 'Tên thương hiệu',
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
          action: `${process.env.REACT_APP_API_URL}/uploadBrand/${record._id}`,
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
              updateBrandData(record._id, info.file.response.imageUrl);
            } else if (info.file.status === 'error') {
              notification.error({
                message: 'Thông báo',
                description: `${info.file.name} file upload failed.`
              });
            }
          }
        };
        const updateBrandData = (brandId, newImageUrl) => {
          const updatedData = selectedCategoryBrands.map((item) =>
            item._id === brandId ? { ...item, picture: newImageUrl } : item
          );
          setSelectedCategoryBrands(updatedData);
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
            <a onClick={() => { setDeleteBrand(true); setCurrentBrandId(record._id) }}> <DeleteOutlined /></a>
            <Modal
              title="Xác nhận xoá thương hiệu"
              visible={isDeleteBrand}
              onOk={() => {
                handleDeleteBrand(currentBrandId);
                setDeleteBrand(false);
              }}
              onCancel={() => setDeleteBrand(false)}
            >
              <p>Bạn có chắc chắn muốn xoá thương hiệu này?</p>
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
        setCategory(response.data.data);
        if (isFirstLoad && response.data.data.length > 0) {
          handleCategoryClick(response.data.data[0]._id);
          setIsFirstLoad(false);
        }
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API: ', error);
      });
  }, []);
  const handleSwitchChange = (checked, brandId) => {
    const newIsHide = !checked;
    axios
      .put(`${process.env.REACT_APP_API_URL}/brand/updateBrand/${brandId}`, { isHide: newIsHide }, { headers })
      .then((response) => {
        const updatedData = selectedCategoryBrands.map((item) =>
          item._id === brandId ? { ...item, isHide: newIsHide } : item
        );
        setSelectedCategoryBrands(updatedData);
      })
      .catch((error) => {
        console.error('Lỗi khi cập nhật trạng thái: ', error);
      });
  };
  const handleDeleteBrand = (brandId) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/brand/delete/${brandId}`, { headers })
      .then((response) => {
        if (response.data.success) {
          const updatedData = selectedCategoryBrands.filter((item) => item._id !== brandId);
          setSelectedCategoryBrands(updatedData);
          notification.success({
            message: 'Thông báo',
            description: 'Xóa thương hiệu thành công.'
          });
        } else {
          notification.error({
            message: 'Thông báo',
            description: 'Lỗi khi xóa thương hiệu'
        });

        }
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API xóa thương hiệu: ', error);
        notification.error({
          message: 'Thông báo',
          description: 'Lỗi khi xóa thương hiệu'
      });
    });
  };
  const [selectedCategoryBrands, setSelectedCategoryBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const handleCategoryClick = (categoryId) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/brand/getBrand/${categoryId}`)
      .then((response) => {
        setSelectedCategory(categoryId);
        setSelectedCategoryBrands(response.data.data);
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API: ', error);
      });
  };
  return (
    <div>
      <Alert
        message="Lưu ý: Không được xoá những thương hiệu đang hiện vì nó đang chứa các sản phẩm, nếu xoá sẽ bị lỗi, chỉ xoá những thương hiệu lỗi nếu quá trình thêm bị sai"
        type="warning"
        showIcon
        style={{ marginBottom: '16px', background: '#FFFF99' }}
      />
      <div>
        {category.map((category) => (
          <Button
            key={category._id}
            style={{ marginRight: '10px' }}
            onClick={() => handleCategoryClick(category._id)}
            className={`memory-button ${selectedCategory === category._id ? 'selected' : ''}`}
          >
            {category.name}
          </Button>
        ))}
      </div>
      <Table bordered columns={columns} dataSource={selectedCategoryBrands} />
    </div>
  );
};

export default TableBrand;