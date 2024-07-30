import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, message, Upload, Slider, Modal, notification } from 'antd';
import moment from 'moment';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker.css'
import AvatarEditor from 'react-avatar-editor';

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

const EditNews = ({ closeModal, newsId }) => {
    const user = useSelector((state) => state.user);
    const [form] = Form.useForm();
    const [authors, setAuthors] = useState([]);
    const [publishedDate, setPublishedDate] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const [preview, setPreview] = useState(null);
    const [cropModalVisible, setCropModalVisible] = useState(false);
    const [file, setFile] = useState(null);
    const [scale, setScale] = useState(1);
    const [uploading, setUploading] = useState(false);
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const [reload, setReload] = useState(false);

    const headers = {
        token: `Bearer ${user.access_token}`,
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/user/getAdmin`, { headers })
            .then((response) => {
                const filteredUsers = response.data.data.filter(user => user.role_id === 1);
                setAuthors(filteredUsers);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    useEffect(() => {
        if (newsId) {
            axios.get(`${process.env.REACT_APP_API_URL}/news/getNews/${newsId}`)
                .then((response) => {
                    const newsData = response.data.data;
                    const newsDateParts = newsData.publishedDate.split('/');
                    const publishedDate = moment(`${newsDateParts[2]}-${newsDateParts[1]}-${newsDateParts[0]} ${newsData.publishedTime}`, 'YYYY-MM-DD').toDate();
                    setPublishedDate(publishedDate);
                    form.setFieldsValue({
                        title: newsData.title,
                        image: newsData.image,
                        content: newsData.content,
                        author: newsData.author.fullName,
                        publishedDate : publishedDate, 
                    });
                })
                .catch((error) => {
                    console.error('Error fetching news:', error);
                });
        }
    }, [newsId, form, reload]);

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

    // const handleCloseModal = () => {
    //     closeModal();
    //     form.resetFields();
    //     setUploadedFileName(null);
    // };
    const handleCloseModal = () => {
        closeModal();
        setReload(!reload)
    };

    const onFinish = (values) => {
        const editedValues = { ...values };
        axios
            .put(`${process.env.REACT_APP_API_URL}/news/editNews/${newsId}`, editedValues, { headers })
            .then((response) => {
                notification.success({
                    message: 'Thông báo',
                    description: 'Sửa tin tức thành công'
                  });
                closeModal();
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật tin tức: ', error);
            });
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
                        message: 'Hãy điền tiêu đề',
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
                name="content"
                label="Nội dung"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng điền nội dung',
                    },
                ]}
            >
                <ReactQuill
                    theme="snow"
                    placeholder="Nhập nội dung ở đây..."
                />
            </Form.Item>
            <Form.Item name="author" label="Tác giả"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng chọn tác giả',
                    },
                ]}
            >
                <Select placeholder="Chọn tác giả">
                    {authors.map((user) => (
                        <Option key={user.id} value={user.fullName}>
                            {user.fullName}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="publishedDate"
                label="Ngày phát hành"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng chọn ngày phát hành',
                    },
                ]}
            >
                <DatePicker
                    selected={publishedDate}
                    onChange={(date) => setPublishedDate(date)}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                />
            </Form.Item>

            <Form.Item >
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'end' }}>
                    <Button type="primary" size="large" htmlType="submit">
                        Sửa tin tức
                    </Button>
                    <Button type="primary" size="large" danger onClick={handleCloseModal}>
                        Huỷ bỏ
                    </Button>
                </div>
            </Form.Item>
            <Modal
                title="Sửa ảnh nền tin tức"
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
                                width={600}
                                height={337.5}
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

export default EditNews;
