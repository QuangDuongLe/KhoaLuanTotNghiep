import React, { useEffect, useState, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import { message, Upload, Select, InputNumber, notification } from 'antd';
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

const EditCommune = ({ closeModal,idCommune }) => {
    const user = useSelector((state) => state.user);
    const [form] = Form.useForm();
    const [reload, setReload] = useState('');
    const headers = {
        token: `Bearer ${user.access_token}`,
    };

    
    useEffect(() => {
        if (idCommune) {
            axios.get(`${process.env.REACT_APP_API_URL}/province/getCommuneById/${idCommune}`)
                .then((response) => {
                    const communeData = response.data.data;
                    form.setFieldsValue({
                        name: communeData.name
                    });
                })
                .catch((error) => {
                    console.error('Error fetching banner:', error);
                });
        }
    }, [idCommune, form, reload]);

    const onFinish = async (values) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/province/updateCommue/${idCommune}`, values, { headers });
            if (response.data.success) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Sửa xã/phường thành công'
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
    const showCancelConfirm = () => {
        Modal.confirm({
            title: 'Xác nhận hủy bỏ',
            content: 'Bạn có chắc chắn muốn hủy bỏ các thay đổi?',
            okText: 'Có',
            cancelText: 'Không',
            onOk() {
                handleCloseModal();
            },
        });
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
            style={{ width: "100%" }}
            scrollToFirstError
        >
            <Form.Item name="name" label="Tên"
                rules={[
                    {
                        required: true,
                        message: 'Điền tên xã/phường',
                    },
                ]}>
                <Input />
            </Form.Item>
            <Form.Item>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'end' }}>
                    <Button type="primary" size="large" htmlType="submit">
                        Sửa xã/phường
                    </Button>
                    <Button type="primary" size="large" danger onClick={showCancelConfirm}>
                        Hủy bỏ
                    </Button>
                </div>
            </Form.Item>

        </Form>
    );
};

export default EditCommune;
