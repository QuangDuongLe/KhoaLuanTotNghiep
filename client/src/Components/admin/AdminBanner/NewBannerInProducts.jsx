import React, { useEffect, useState,useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import { message, Upload, Modal, Select, Slider, notification } from 'antd';
import { Button, Form, Input, DatePicker, Switch } from 'antd';
import { useSelector } from 'react-redux';
import { Option } from 'antd/es/mentions';
import AvatarEditor from 'react-avatar-editor';

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

const NewBannerInProduct = ({ closeModal }) => {
    const user = useSelector((state) => state.user);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const [preview, setPreview] = useState(null);
    const [cropModalVisible, setCropModalVisible] = useState(false);
    const [file, setFile] = useState(null);
    const [scale, setScale] = useState(1);
    const [uploading, setUploading] = useState(false);
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);

    const headers = {
        token: `Bearer ${user.access_token}`,
    };
    const handleProductChange = (value) => {
        setSelectedProduct(value);
    };
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAll`);
                setProducts(response.data.data);
            } catch (error) {
                notification.error({
                    message: 'Thông báo',
                    description: 'Đã xảy ra lỗi khi lấy sản phẩm'
                  });
            }
        };

        fetchProducts();
    }, []);
    const props = {
        name: 'image',
        action: `${process.env.REACT_APP_API_URL}/upload`,
        headers: {
            authorization: headers.token,
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
            if (info.file.status !== 'uploading') {
                console.log(info.file);
            }
            if (info.file.status === 'done') {
                notification.success({
                    message: 'Thông báo',
                    description: `${info.file.name} đã tải lên thành công`
                  });
                const uploadedFilePaths = info.file.response.imageUrl;
                form.setFieldsValue({ image: uploadedFilePaths });
                setImageUrl(uploadedFilePaths)
            } else if (info.file.status === 'error') {
                notification.error({
                    message: 'Thông báo',
                    description: `${info.file.name} tải lên thất bại.`
                  });
            }
        }
    };

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
                description:'Bạn chỉ có thể tải lên tệp tin JPG/PNG!'
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
                    form.setFieldsValue({ image: response.data.imageUrl });
                    setCropModalVisible(false);
                } else {
                    notification.error({
                        message: 'Thông báo',
                        description:'Tải ảnh lên thất bại.'
                      });
                }
            } catch (error) {
                notification.error({
                    message: 'Thông báo',
                    description:'Tải ảnh lên thất bại.'
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

    const handleCloseModal = () => {
        closeModal();
        form.resetFields();
        setUploadedFileName(null);
    };

    const onFinish = async (values) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/banner/addBanner`, values, { headers });
            if (response.data.success) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Thêm banner thành công!'
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
            notification.error({
                message: 'Thông báo',
                description: error.response.data.error
              });

        }
    };

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
                name="title"
                label="Tiêu đề"
                rules={[
                    {
                        required: true,
                        message: 'Điền tiêu đề của banner',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="image"
                label="Hình ảnh"
                rules={[{ required: true, message: 'Vui lòng chọn ảnh' }]}
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
                name="link"
                label="Liên kết"
                rules={[
                    {
                        required: true,
                        message: 'Điền liên kết của banner',
                    },
                ]}
            >
                <Input />
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
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY"/>
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
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY"/>
            </Form.Item>
            <Form.Item
                name="products"
                label="Sản phẩm"
                rules={[
                    {
                        required: true,
                        message: 'Chọn sản phẩm',
                    },
                ]}
            >
                <Select
                    placeholder="Chọn sản phẩm"
                    mode="multiple"
                    allowClear
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {products.map(product => (
                        <Option key={product._id} value={product.name}>{product.name}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'end' }}>
                    <Button type="primary" size="large" htmlType="submit">
                        Thêm banner
                    </Button>
                    <Button type="primary" size="large" danger onClick={handleCloseModal}>
                        Hủy bỏ
                    </Button>
                </div>
            </Form.Item>
            <Modal
                title="Thêm banner theo sản phẩm"
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
                                width={643.5}
                                height={165.5}
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

export default NewBannerInProduct;
