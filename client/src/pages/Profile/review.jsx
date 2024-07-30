import axios from 'axios';
import React, { useState } from "react";
import { Upload, message, Rate, Button, notification } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const ReviewModal = ({ onClose, productId, orderCode }) => {
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [thumbnails, setThumbnails] = useState([]);
    const user = useSelector((state) => state.user)
    console.log('User:', user);

    const props = {
        name: 'images',
        action: `${process.env.REACT_APP_API_URL}/uploads`,
        headers: {
            authorization: 'authorization-text',
        },
        accept: '.jpg, .jpeg, .png',
        multiple: true,
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
                const uploadedFilePaths = info.fileList
                    .filter((file) => file.status === 'done')
                    .map((file) => file.response.imageUrls);
                const allImageUrls = [].concat(...uploadedFilePaths);
                setThumbnails(allImageUrls);
            } else if (info.file.status === 'error') {
                notification.error({
                    message: 'Thông báo',
                    description: `${info.file.name} file upload failed.`
                });
            }
        }
    };

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const submitReview = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/order/rating?productId=${productId._id}&userId=${user._id}&orderCode=${orderCode}`, {
                rating: rating,
                comment: content,
                pictures: thumbnails,
            });
            if (response.data.success) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Đã gửi đánh giá thành công!'
                });

                setRating(0)
                setContent('')
                setThumbnails([])
                onClose();
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Lỗi khi gửi đánh giá!'
                });

            }
        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: 'Lỗi khi gửi đánh giá!'
            });
        }
    };

    return (
        <div className="modal-content" style={{ padding: '10px', boxShadow: 'none' }}>
            <h4 style={{ textAlign: 'center' }}>Đánh giá sản phẩm</h4>
            <label>Đánh giá:</label>
            <Rate value={rating} onChange={handleRatingChange} />
            <br />

            <label>Nội dung đánh giá:</label>
            <textarea
                style={{ padding: '10px' }}
                className='textarea'
                placeholder='Đánh giá của bạn'
                value={content}
                onChange={handleContentChange}
                name='content'
            ></textarea>
            <br />

            <label>Hình ảnh:</label>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Ảnh</Button>
            </Upload>
            <br />
            <Button style={{ background: '#C13346', color: '#fff' }} onClick={submitReview} disabled={rating === 0}>Gửi đánh giá</Button>
        </div>
    );
};

export default ReviewModal;
