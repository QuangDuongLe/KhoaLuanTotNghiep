import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { DatePicker, message, notification, Upload } from 'antd';
import {
  Button,
  Form,
  Input,
  Select
} from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
const { Option } = Select
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

const NewVoucher = ({ closeModal }) => {
  const user = useSelector((state) => state.user)
  const headers = {
    token: `Bearers ${user.access_token}`,
  };
  const [form] = Form.useForm();
  const handleCloseModal = () => {
    closeModal();
    form.resetFields();
  };
  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/voucher/addVoucher`, values, { headers });
      if (response.data.success) {
        closeModal();
        notification.success({
          message: 'Thông báo',
          description: 'Thêm voucher thành công.'
        });
        form.resetFields();
      } else {
        notification.error({
          message: 'Thông báo',
          description: response.data.message
        });

      }
    } catch (error) {
      notification.error({
        message: 'Thông báo',
        description: 'Đã xảy ra lỗi khi thêm'
      });

    }
  };
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`)
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);
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
      <Form.Item
        name="name"
        label="Tên voucher"
        rules={[
          {
            required: true,
            message: 'Điền tên của voucher',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="code"
        label="Mã voucher"
        rules={[
          {
            required: true,
            message: 'Điền mã voucher',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="quantity"
        label="Số lượng"
        rules={[
          {
            required: true,
            message: 'Điền số lượng',
          },
        ]}
      >
        <Input type='number' />
      </Form.Item>
      <Form.Item
        name="discount"
        label="Giảm giá/%"
        rules={[
          {
            required: true,
            message: 'Điền tên quốc gia',
          },
        ]}
      >
        <Input type='number' />
      </Form.Item>
      <Form.Item
        name="startDate"
        label="Ngày bắt đầu"
        rules={[
          {
            required: true,
            message: 'Chọn ngày bắt đầu',
          },
        ]}
      >
        <DatePicker format="DD/MM/YYYY"/>
      </Form.Item>
      <Form.Item
        name="endDate"
        label="Ngày kết thúc"
        rules={[
          {
            required: true,
            message: 'Chọn ngày kết thúc',
          },
        ]}
      >
        <DatePicker format="DD/MM/YYYY"/>
      </Form.Item>
      <Form.Item
        name="maxPrice"
        label="Giảm tối đa"
        rules={[
          {
            required: true,
            message: 'Điền số tiền tối đa',
          },
        ]}
      >
        <Input addonAfter="VND" />
      </Form.Item>
      <Form.Item
        name="applicablePaymentMethod"
        label="Áp dụng cho phương thức thanh toán"
        rules={[
          {
            required: true,
            message: 'Chọn phương thức thanh toán',
          },
        ]}
      >
        <Select placeholder="Chọn phương thức thanh toán" >
          <Option value="Tất cả">Tất cả</Option>
          <Option value="VNPAY">VNPAY</Option>
          <Option value="Thanh toán khi nhận hàng">Thanh toán khi nhận hàng</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="applicableProductTypes"
        label="Áp dụng cho loại sản phẩm"
        rules={[
          {
            required: true,
            message: 'Chọn ít nhất một loại sản phẩm',
          },
        ]}
      >
        <Select mode="multiple" placeholder="Chọn loại sản phẩm" allowClear>
          {categories.map((category) => (
            <Option key={category.id} value={category.name}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Button type="primary" size="large" htmlType="submit">
            Thêm voucher
          </Button>
          <Button type="primary" size="large" onClick={handleCloseModal}>
            Huỷ bỏ
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}
export default NewVoucher