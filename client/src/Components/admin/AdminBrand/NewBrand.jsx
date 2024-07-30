import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import AvatarEditor from 'react-avatar-editor';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useRef } from 'react';
import { message, Upload, Button, Form, Input, Select, Modal, Slider, notification } from 'antd';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 3,
    },
    sm: {
      span: 5,
    },
  },
  wrapperCol: {
    xs: {
      span: 30,
    },
    sm: {
      span: 29,
    },
  },
};

const NewBrand = ({ closeModal }) => {
  const user = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [formProperties, setFormProperties] = useState([]);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [cropModalVisible, setCropModalVisible] = useState(false);

  const handleBeforeUpload = (file) => {
    if (checkFile(file)) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setPreview(reader.result));
      reader.readAsDataURL(file);
      setFile(file);
      setCropModalVisible(true);
    }
    return false; // Prevent immediate upload
  };

  const checkFile = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      notification.error({
        message: 'Thông báo',
        description: 'Bạn chỉ có thể tải lên tệp tin JPG/PNG!'
      });

    }
    return isJpgOrPng;
  };
  const handleCrop = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
      const blob = await (await fetch(canvas)).blob();
      const formData = new FormData();
      formData.append('image', blob, file.name);
      setUploading(true);
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          notification.success({
            message: 'Thông báo',
            description: 'Tải ảnh lên thành công!'
          });
          setUploadedFileName(file.name); // Set the uploaded file name
          form.setFieldsValue({ picture: response.data.imageUrl });
          setCropModalVisible(false);
        } else {
          notification.error({
            message: 'Thông báo',
            description: 'Tải ảnh lên thất bại.'
          });
        }
      } catch (error) {
        notification.error({
          message: 'Thông báo',
          description: 'Tải ảnh lên thất bại.'
        });
      } finally {
        setUploading(false);
      }
    }
  };
  const handleChangeImage = () => {
    setCropModalVisible(false);
    setTimeout(() => {
      fileInputRef.current.click();
    }, 100);
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`)
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleCloseModal = () => {
    closeModal();
    form.resetFields();
    setFormProperties([]);
  };
  const onFinish = async (values) => {
    const headers = {
      token: `Bearers ${user.access_token}`,
    };
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/brand/addBrand`, values, { headers });
      if (response.data.success) {
        notification.success({
          message: 'Thông báo',
          description: 'Thêm thương hiệu thành công!'
        });

        form.resetFields();
        closeModal();
      } else {
        notification.error({
          message: 'Thông báo',
          description: response.data.error
        });

      }
    } catch (error) {
      console.error('Lỗi khi thêm thương hiệu:', error);
      notification.error({
        message: 'Thông báo',
        description: 'Đã xảy ra lỗi khi thêm thương hiệu'
      });
    }
  };

  const data = Object.keys(formProperties).map((label, index) => ({
    key: index,
    label: label,
    value: formProperties[label],
  }));

  return (
    <Form
      {...formItemLayout}
      form={form}
      onFinish={onFinish}
      style={{
        width: "100%",
      }}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="Tên thương hiệu"
        rules={[
          {
            required: true,
            message: 'Điền tên thương hiệu',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="categoryName"
        label="Danh mục"
        rules={[
          {
            required: true,
            message: 'Chọn danh mục',
          },
        ]}
      >
        <Select placeholder="Chọn danh mục" >
          {categories.map((category) => (
            <Option key={category.id} value={category.name}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="picture"
        label="Hình ảnh"
        rules={[
          {
            required: true,
            message: 'Vui lòng chọn ảnh',
          },
        ]}
      >
        <Upload
          beforeUpload={handleBeforeUpload}
          showUploadList={{ showPreviewIcon: false }}
          listType="picture-card"
          maxCount={1}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải lên</div>
          </div>
        </Upload>
      </Form.Item>
      <Form.Item
        name="country"
        label="Quốc gia"
        rules={[
          {
            required: true,
            message: 'Điền tên quốc gia',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item >
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'end' }}>
          <Button type="primary" size="large" htmlType="submit">
            Thêm thương hiệu
          </Button>
          <Button type="primary" size="large" danger onClick={handleCloseModal}>
            Huỷ bỏ
          </Button>
        </div>
      </Form.Item>
      <Modal
        title="Thêm ảnh nền thương hiệu"
        width={700}
        maskClosable={false}
        visible={cropModalVisible}
        onCancel={() => setCropModalVisible(false)}
        footer={[
          <Button key="change" onClick={handleChangeImage}>
            Đổi ảnh khác
          </Button>,
          <Button key="cancel" onClick={() => setCropModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleCrop} style={{ backgroundColor: '#C13346', borderColor: '#C13346', color: '#fff' }} disabled={uploading}>
            {uploading ? 'Đang tải lên...' : 'Tải lên'}
          </Button>,
        ]}
      >
        {preview && (
          <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <AvatarEditor
                ref={editorRef}
                image={preview}
                width={635.5}
                height={217.75}
                border={10}
                scale={scale}
                rotate={0}
              />
            </div>
            <Slider
              min={1}
              max={10}
              step={0.1}
              value={scale}
              onChange={(value) => setScale(value)}
            />
          </div>
        )}
      </Modal>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleBeforeUpload(e.target.files[0])} style={{ display: 'none' }} />
    </Form>

  );
};
export default NewBrand;
