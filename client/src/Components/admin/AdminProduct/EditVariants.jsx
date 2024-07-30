import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { message, Upload, Collapse, Table, notification } from 'antd';
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Alert, InputNumber
} from 'antd';
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

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
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 21,
    },
  },
};

const EditVariant = ({ closeModal, variantId, category }) => {
  const user = useSelector((state) => state.user);
  const [reload, setReload] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    if (variantId) {
      axios.get(`${process.env.REACT_APP_API_URL}/product/getIdVariant/${variantId}`)
        .then((response) => {
          const variantData = response.data.data;
          form.setFieldsValue({
            memory: variantData.memory,
            imPrice: variantData.imPrice,
            oldPrice: variantData.oldPrice,
            newPrice: variantData.newPrice,
          });
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
        });
    }
  }, [variantId, form, reload]);
  const handleCloseModal = () => {
    closeModal();
    setReload(!reload)
  };
  const onFinish = (values) => {
    const headers = {
      token: `Bearer ${user.access_token}`,
    };
    try {
      axios.put(`${process.env.REACT_APP_API_URL}/product/editProductVariant/${variantId}`, values, { headers });
      closeModal();
      closeModal();
      notification.success({
          message: 'Thông báo',
          description: 'Sửa biến thể thành công'
        });

    } catch (error) {
      notification.error({
        message: 'Thông báo',
        description: 'Sửa biến thể thất bại'
      });

    }
  };
  const shouldHideMemoryField = ["Ốp lưng", "Cáp sạc", "Pin dự phòng", "Tai nghe"].includes(category);

  return (
    <Form
      {...formItemLayout}
      form={form}
      onFinish={onFinish}
      style={{
        width: "90%",
      }}
      scrollToFirstError
    >
      {!shouldHideMemoryField && (
        <Form.Item
          name="memory"
          label="Bộ nhớ"
        >
          <Input />
        </Form.Item>
      )}
      <Form.Item
        name="imPrice"
        label="Giá nhập"
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="oldPrice"
        label="Giá cũ"
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="newPrice"
        label="Giá bán"
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item >
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'end' }}>
          <Button type="primary" size="large" htmlType="submit">
            Sửa biến thế
          </Button>
          <Button type="primary" size="large" danger onClick={handleCloseModal}>
            Huỷ bỏ
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default EditVariant;
