import React, { useEffect, useState, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import { message, Upload, Select, notification } from 'antd';
import { Button, Form, Input, DatePicker, Switch, Modal, Slider } from 'antd';
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

const NewBannerInLocation = ({ closeModal }) => {
    const user = useSelector((state) => state.user);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const [preview, setPreview] = useState(null);
    const [cropModalVisible, setCropModalVisible] = useState(false);
    const [file, setFile] = useState(null);
    const [scale, setScale] = useState(1);
    const [uploading, setUploading] = useState(false);
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const [avatarWidth, setAvatarWidth] = useState(600);
    const [modalWidth, setModalWidth] = useState(600);
    const [avatarHeight, setAvatarHeight] = useState(337.5);
    const [selectedLocation, setSelectedLocation] = useState(undefined);

    const headers = {
        token: `Bearer ${user.access_token}`,
    };

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
                    form.setFieldsValue({ image: response.data.imageUrl });
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

    const handleCloseModal = () => {
        closeModal();
        setImageUrl('')
        form.resetFields();
        setUploadedFileName(null);
    };

    const onFinish = async (values) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/banner/addBanner`, values, { headers });
            if (response.data.success) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Thêm banner thành công'
                  });
                form.resetFields();
                setImageUrl('');
                closeModal();
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: response.data.message
                });

            }
        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: 'Đã xảy ra lỗi khi thêm banner'
            });
        }
    };
    const [page, setPage] = useState('');
    const [locationOptions, setLocationOptions] = useState([]);
    useEffect(() => {
        if (page === 'homepage') {
            setLocationOptions([
                { value: 'mainBanner', label: 'Banner chính' },
                { value: 'productSuggestionBanner', label: 'Banner gợi ý sản phẩm' },
                { value: 'adbanner', label: 'Quảng cáo' },
            ]);
        } else if (page === 'productpage') {
            setLocationOptions([
                { value: 'largeBanner', label: 'Banner lớn' },
                { value: 'smallLeftBanner', label: 'Banner nhỏ trái' },
                { value: 'smallRightBanner', label: 'Banner nhỏ phải' },
            ]);
        } else if (page === 'header') {
            setLocationOptions([
                { value: 'logo', label: 'Logo' },
            ]);
        }
        else {
            setLocationOptions([]);
        }
        setSelectedLocation(undefined);
        form.setFieldsValue({ location: undefined });
    }, [page]);
    useEffect(() => {
        if (selectedLocation === 'mainBanner') {
            setModalWidth(700);
            setAvatarWidth(600);
            setAvatarHeight(176.5);
        } else if (selectedLocation === 'productSuggestionBanner') {
            setModalWidth(900);
            setAvatarWidth(800);
            setAvatarHeight(67);
        } else if (selectedLocation === 'logo') {
            setModalWidth(600)
            setAvatarWidth(500);
            setAvatarHeight(140);
        } else if (selectedLocation === 'adbanner') {
            setModalWidth(400)
            setAvatarWidth(317.4);
            setAvatarHeight(449);
        }
        else {
            setAvatarWidth(600);
            setAvatarHeight(337.5);
        }
    }, [selectedLocation]);

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
                name="page"
                label="Trang hiển thị"
                rules={[
                    {
                        required: true,
                        message: 'Điền trang hiển thị banner',
                    },
                ]}
            >
                <Select
                    placeholder="Chọn trang hiển thị"
                    onChange={(value) => setPage(value)}
                >
                    <Option value="homepage">Trang chủ</Option>
                    <Option value="productpage">Trang sản phẩm</Option>
                    <Option value="header">Header</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="location"
                label="Vị trí"
                rules={[
                    {
                        required: true,
                        message: 'Điền vị trí của banner',
                    },
                ]}
            >
                <Select placeholder="Chọn vị trí banner"
                    onChange={(value) => setSelectedLocation(value)}
                    value={selectedLocation}
                >
                    {locationOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}

                        </Option>
                    ))}
                </Select>
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
                    disabled={!page || !selectedLocation}

                >
                    <div disabled={!page || !selectedLocation}>
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
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
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
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
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
                title="Thêm banner theo vị trí"
                width={modalWidth}
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
                                width={avatarWidth}
                                height={avatarHeight}
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

export default NewBannerInLocation;
