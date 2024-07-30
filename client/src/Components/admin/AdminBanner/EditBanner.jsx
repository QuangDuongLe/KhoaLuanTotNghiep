import React, { useEffect, useState, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import { message, Upload, Select, notification } from 'antd';
import { Button, Form, Input, Modal, Slider } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../AdminNews/datepicker.css';
import AvatarEditor from 'react-avatar-editor';

const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: { span: 3 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 30 },
        sm: { span: 29 },
    },
};

const EditBanner = ({ closeModal, bannerId }) => {
    const user = useSelector((state) => state.user);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const headers = {
        token: `Bearer ${user.access_token}`,
    };
    const [products, setProducts] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [page, setPage] = useState('');
    const [locationOptions, setLocationOptions] = useState([]);
    const [pageData, setPageData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [product, setProduct] = useState([]);

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
    const [reload, setReload] = useState(false);

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


    useEffect(() => {
        if (bannerId) {
            axios.get(`${process.env.REACT_APP_API_URL}/banner/getBannerId/${bannerId}`)
                .then((response) => {
                    const bannerData = response.data.data;
                    const startDateData = bannerData.startDate.split('/');
                    const startDateFormat = moment(`${startDateData[2]}-${startDateData[1]}-${startDateData[0]}`, 'YYYY-MM-DD').toDate();
                    const endDateData = bannerData.endDate.split('/');
                    const endDateFormat = moment(`${endDateData[2]}-${endDateData[1]}-${endDateData[0]}`, 'YYYY-MM-DD').toDate();
                    const productIds = bannerData.products.map(product => product.productId.name);
                    setPage(bannerData.page);
                    setSelectedLocation(bannerData.location);
                    form.setFieldsValue({
                        title: bannerData.title,
                        page: bannerData.page,
                        location: bannerData.location,
                        startDate: startDateFormat,
                        endDate: endDateFormat,
                        link: bannerData.link,
                        products: productIds,
                    });
                    setImageUrl(bannerData.image);
                    setLocationData(bannerData.location);
                    setStartDate(startDateFormat);
                    setEndDate(endDateFormat);
                    setPageData(bannerData.page);
                    setProduct(productIds);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching banner:', error);
                });
        }
    }, [bannerId, form, reload]);

    useEffect(() => {
        if (pageData) {
            setPage(pageData);
        }
    }, [pageData]);

    useEffect(() => {
        if (page) {
            if (page === 'homepage') {
                setLocationOptions([
                    { value: 'mainBanner', label: 'Banner chính' },
                    { value: 'productSuggestionBanner', label: 'Banner gợi ý sản phẩm' },
                    { value: 'adbanner', label: 'Quảng cáo' },
                ]);
            } else if (page === 'productpage') {
                setLocationOptions([
                    { value: 'largeBanner', label: 'Banner lớn' },
                    { value: 'smallLeftBanner', label: 'Banner nhỏ bên trái' },
                    { value: 'smallRightBanner', label: 'Banner nhỏ bên phải' },
                ]);
            } else if (page === 'header') {
                setLocationOptions([
                    { value: 'logo', label: 'logo' },
                ]);
            } else {
                setLocationOptions([]);
            }
            setSelectedLocation(undefined)
            form.setFieldsValue({ location: undefined });
        }
    }, [page, form]);
    useEffect(() => {
        if (product.length !== 0) {
            setAvatarWidth(643.5);
            setAvatarHeight(165.5);
        }
    }, [products]);
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

        }
        else if (selectedLocation === 'adbanner') {
            setModalWidth(400)
            setAvatarWidth(317.4);
            setAvatarHeight(449);

        }
        else {
            setModalWidth(700);
            setAvatarWidth(643.5);
            setAvatarHeight(165.5);
        }
    }, [selectedLocation]);

    useEffect(() => {
        if (locationData && locationOptions.length > 0) {
            const locationOption = locationOptions.find(option => option.value === locationData);
            if (locationOption) {
                form.setFieldsValue({ location: locationOption.value });
            }
        }
    }, [locationData, locationOptions, form]);
    const onFinish = async (values) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/banner/editBanner/${bannerId}`, values, { headers });
            if (response.data.success) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Sửa banner thành công.'
                });
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
                description: error.response.data.error
            });
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
        setUploadedFileName(null);
        setReload(!reload)
    };

    return (
        <Form
            {...formItemLayout}
            form={form}
            onFinish={onFinish}
            style={{ width: "100%" }}
            scrollToFirstError
        >
            <Form.Item name="title" label="Tiêu đề">
                <Input />
            </Form.Item>
            <Form.Item
                name="page"
                label="Trang hiển thị"
                style={{ display: pageData ? 'block' : 'none' }}
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
                style={{ display: locationData ? 'block' : 'none' }}
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
            <Form.Item name="image" label="Hình ảnh">
                <Upload
                    beforeUpload={handleBeforeUpload}
                    showUploadList={{ showPreviewIcon: false }}
                    listType="picture-card"
                    maxCount={1}
                    disabled={!(page && form.getFieldValue('location') || product.length !== 0)}
                >
                    <div disabled={!(page && form.getFieldValue('location') || product.length !== 0)}>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Tải lên</div>
                    </div>
                </Upload>

            </Form.Item>
            <Form.Item name="link" label="Liên kết">
                <Input />
            </Form.Item>
            <Form.Item name="startDate" label="Ngày bắt đầu">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                />
            </Form.Item>
            <Form.Item name="endDate" label="Ngày kết thúc">
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                />
            </Form.Item>
            <Form.Item
                name="products"
                label="Sản phẩm"
                style={{ display: product.length !== 0 ? 'block' : 'none' }}
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
                        Sửa banner
                    </Button>
                    <Button type="primary" size="large" danger onClick={handleCloseModal}>
                        Hủy bỏ
                    </Button>
                </div>
            </Form.Item>
            <Modal
                title="Sửa banner"
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

export default EditBanner;
