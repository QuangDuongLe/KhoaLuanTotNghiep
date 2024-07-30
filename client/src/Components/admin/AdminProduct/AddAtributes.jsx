import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { message, Upload, Collapse, Table, Modal, notification } from 'antd';
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

const AddAttributes = ({ closeModal, variantId }) => {
  const user = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const props = (fieldKey) => ({
    name: 'image',
    action: `${process.env.REACT_APP_API_URL}/upload`,
    headers: {
      authorization: 'authorization-text',
    },
    accept: '.jpg, .jpeg, .png',
    listType: 'picture-card',
    showUploadList: { showPreviewIcon: false },
    maxCount:1,
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
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        notification.success({
          message: 'Thông báo',
          description: `${info.file.name} tải lên thành công`
        });

        const uploadedFilePath = info.file.response.imageUrl;
        if (typeof uploadedFilePath === 'string') {
          const updatedAttributes = form.getFieldValue('attributes');
          updatedAttributes[fieldKey].pictures = uploadedFilePath;
          form.setFieldsValue({ attributes: updatedAttributes });
        } else {
          console.error('uploadedFilePath is not a string:', uploadedFilePath);
        }
      } else if (info.file.status === 'error') {
      }
    }
  });

  const handleCloseModal = () => {
    closeModal();
    form.resetFields();
  };
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const showConfirmModal = () => {
    setConfirmModalVisible(true);
  };

  const handleConfirm = () => {
    setConfirmModalVisible(false);
    handleCloseModal();
  };

  const handleCancel = () => {
    setConfirmModalVisible(false);
  };
  const onFinish = async (values) => {
    const headers = {
      token: `Bearer ${user.access_token}`,
    };

    try {

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/product/addAttributes/${variantId}`,
        values,
        { headers }
      );
      if (response.status === 200) {
        notification.success({
          message: 'Thông báo',
          description: 'Thêm thuộc tính thành công'
        });

        closeModal();
        form.resetFields();
      } else {
        notification.error({
          message: 'Thông báo',
          description: 'Thêm thuộc tính thất bại'
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        notification.error({
          message: 'Thông báo',
          description: `Thêm thuộc tính thất bại: ${error.response.data.error}`
        });

      } else {
        notification.error({
          message: 'Thông báo',
          description: 'Thêm thuộc tính thất bại: Đã xảy ra lỗi không mong muốn'
        });
      }
    }
  };

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
      <Form.List name="attributes">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Collapse key={key}>
                <Collapse.Panel header={`Thuộc tính ${name + 1}`} key={key}>
                  <Form.Item
                    {...restField}
                    name={[name, 'color']}
                    fieldKey={[name, 'color']}
                    label="Màu sắc"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng điền màu sắc!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'quantity']}
                    fieldKey={[name, 'quantity']}
                    label="Số lượng"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng điền số lượng!',
                      },
                    ]}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'pictures']}
                    fieldKey={[name, 'pictures']}
                    label="Hình ảnh"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn ảnh',
                      },
                    ]}
                  >
                    <Upload {...props(name)}>
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Tải lên</div>
                      </div>
                    </Upload>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'sku']}
                    fieldKey={[name, 'sku']}
                    label="SKU"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng điền SKU!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => { remove(name) }} />
                </Collapse.Panel>
              </Collapse>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => { add(); }}
                icon={<PlusOutlined />}
              >
                Thêm thuộc tính
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'end' }}>
          <Button type="primary" size="large" htmlType="submit">
            Thêm thuộc tính
          </Button>
          <Button type="primary" size="large" danger onClick={showConfirmModal}>
            Huỷ bỏ
          </Button>
        </div>
      </Form.Item>
      <>
        <Modal
          title="Xác nhận huỷ"
          visible={confirmModalVisible}
          onOk={handleConfirm}
          onCancel={handleCancel}
          okText="Xác nhận"
          cancelText="Huỷ bỏ"
        >
          <p>Bạn có chắc chắn muốn huỷ không?</p>
        </Modal>
      </>
    </Form>
  );
};

export default AddAttributes;
