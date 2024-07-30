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
import SkeletonButton from 'antd/es/skeleton/Button';

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

const EditAttributes = ({ closeModal, attributesId }) => {
    const user = useSelector((state) => state.user);
    const [form] = Form.useForm();
    const [reload, setReload] = useState(false);

    const props = ({
        name: 'image',
        action: `${process.env.REACT_APP_API_URL}/upload`,
        headers: {
            authorization: 'authorization-text',
        },
        accept: '.jpg, .jpeg, .png',
        listType: 'picture-card',
        showUploadList: { showPreviewIcon: false },
        maxCount: 1,
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
                    description: `${info.file.name} file uploaded successfully`
                });
                const uploadedFilePath = info.file.response.imageUrl;
                if (typeof uploadedFilePath === 'string') {
                    form.setFieldsValue({ pictures: uploadedFilePath });
                } else {
                    console.error('uploadedFilePath is not a string:', uploadedFilePath);
                }
            } else if (info.file.status === 'error') {
                notification.error({
                    message: 'Thông báo',
                    description: `${info.file.name} file upload failed.`
                });
            }
        }
    });

    useEffect(() => {
        if (attributesId) {
            axios.get(`${process.env.REACT_APP_API_URL}/product/getDetailsAttributes/${attributesId}`)
                .then((response) => {
                    const attributesData = response.data.data;
                    form.setFieldsValue({
                        sku: attributesData.sku,
                        color: attributesData.color,
                        quantity: attributesData.quantity
                    });
                })
                .catch((error) => {
                    console.error('Error fetching product:', error);
                });
        }
    }, [attributesId, form, reload]);
    const onFinish = (values) => {
        const headers = {
            token: `Bearer ${user.access_token}`,
        };
        try {
            axios.put(`${process.env.REACT_APP_API_URL}/product/editAttributes/${attributesId}`, values, { headers });
            closeModal();
            notification.success({
                message: 'Thông báo',
                description: 'Sửa thuộc tính thành công'
            });

        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: 'Sửa thuộc tính thất bại'
            });

        }
    };
    const handleCloseModal = () => {
        closeModal();
        setReload(!reload)
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
            <Form.Item
                name="sku"
                label="Mã sản phẩm"
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="color"
                label="Màu sắc"
            >
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                name="quantity"
                label="Số lượng"
            >
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                name="pictures"
                label="Hình ảnh"
            >
                <Upload {...props}>
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Tải lên</div>
                    </div>
                </Upload>
            </Form.Item>
            <Form.Item >
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'end' }}>
                    <Button type="primary" size="large" htmlType="submit">
                        Sửa thuộc tính
                    </Button>
                    <Button type="primary" size="large" danger onClick={handleCloseModal}>
                        Huỷ bỏ
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default EditAttributes;
