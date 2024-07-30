import React, { useState, useEffect } from "react";
import {  Switch, Table, Image, Upload, Button, message, Modal, Alert, Form, Input, DatePicker} from 'antd';
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import { UploadOutlined,DeleteOutlined,EditOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};


const TableVoucher = () => {
  const user = useSelector((state)=> state.user)
  const headers = {
    token: `Bearers ${user.access_token}`,
};
    const [form] = Form.useForm();
    const [voucherData, setvoucherData] = useState([]); 
    const [isDeleteVoucher, setDeleteVoucher] = useState(false); 
    const [isUpdateVoucher, setUpdateVoucher] = useState(false); 
    const [currentVoucherId, setCurrentVoucherId] = useState(null);
    const columns = [
      {
        title: 'Tên voucher',
        dataIndex: 'name',
      },
      {
        title: 'Mã khuyến mãi',
        dataIndex: 'code',
      },
      {
        title: 'Ngày bắt đầu',
        dataIndex: 'startDate',
      },
      {
        title: 'Ngày kết thúc',
        dataIndex: 'endDate',
      },
      {
        title: 'Số lượng',
        dataIndex: 'quantity',
      },
      {
        title: '% khuyến mãi',
        dataIndex: 'discount',
        render: discount => `${(discount * 100)}%` 
      },
      {
        title: 'Thao tác',
        render: (record) => {
            return (
              <div>
             <a onClick={() => {setDeleteVoucher(true); setCurrentVoucherId(record._id)}}> <DeleteOutlined/></a> 
             <a onClick={() => {setUpdateVoucher(true); setCurrentVoucherId(record._id)}}> <EditOutlined/></a> 
             <Modal
          title="Xác nhận xoá voucher"
          visible={isDeleteVoucher}
          onOk={() => {
            handleDeleteVoucher(currentVoucherId);
            setDeleteVoucher(false); 
          }}
          onCancel={() => setDeleteVoucher(false)} 
        >
          <p>Bạn có chắc chắn muốn xoá voucher có mã {record.code} này?</p>
        </Modal>
        <Modal title="Sửa thông tin voucher"
            visible={isUpdateVoucher}
            onOk={() => {
              form
              .validateFields()
              .then((values) => {
                handleUpdateVoucher(currentVoucherId, values);
                setUpdateVoucher(false);
              })
              .catch((errorInfo) => {
                console.error('Validation failed:', errorInfo);
              });
            }}
            onCancel={() => {
              setUpdateVoucher(false);
            }}
          >  
            <Alert
            message="Lưu ý: Sửa thuộc tính nào chỉ cần điền vào thuộc tính đó không cần điền tất cả"
            type="warning"
            showIcon
            style={{ marginBottom: '16px',background:'#FFFF99' }}
          />
          <Form
                {...formItemLayout}
                form={form}
                style={{
                  maxWidth: 600,
                }}
                scrollToFirstError
              >
                  <Form.Item
        name="name"
        label="Tên voucher"
       
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name="code"
        label="Mã voucher"
       
      >
      <Input/>
      </Form.Item>
      <Form.Item
        name="quantity"
        label="Số lượng"
       
    
      >
      <Input type='number'/>
      </Form.Item>
      <Form.Item
        name="discount"
        label="Giảm giá/%"
       
      >
        <Input type='number'/>
      </Form.Item>
      <Form.Item
      name="startDate"
      label="Ngày bắt đầu"
      rules={[
        ({ getFieldValue }) => ({
          validator(_, value) {
            const endDate = getFieldValue('endDate');
            if (value && !endDate) {
              return Promise.reject('Vui lòng chọn Ngày kết thúc');
            }
            return Promise.resolve();
          },
        }),
      ]}
    >
      <DatePicker />
    </Form.Item>

      <Form.Item
        name="endDate"
        label="Ngày kết thúc"
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const startDate = getFieldValue('startDate');

              if (value && !startDate) {
                return Promise.reject('Vui lòng chọn Ngày bắt đầu');
              }

              return Promise.resolve();
            },
          }),
        ]}
      >
        <DatePicker />
      </Form.Item>

              </Form>
            </Modal>
              </div>
            );
          },
      },
    ];
  
    useEffect(() => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/voucher/getVoucher`,{headers})
        .then((response) => {
            setvoucherData(response.data.data); 
        })
        .catch((error) => {
          console.error('Lỗi khi gọi API: ', error);
        });
    }, []);
      const handleDeleteVoucher = (voucherId) => {
        axios
          .delete(`${process.env.REACT_APP_API_URL}/voucher/deleteVoucher/${voucherId}`,{headers})
          .then((response) => {
            if (response.data.success) {
              const updatedData = voucherData.filter((item) => item._id !== voucherId);
              setvoucherData(updatedData);
              notification.success({
                message: 'Thông báo',
                description: 'Xóa voucher thành công.'
              });
            } else {
              notification.error({
                message: 'Thông báo',
                description: 'Lỗi khi xóa voucher'
              });
    
            }
          })
          .catch((error) => {
            console.error('Lỗi khi gọi API xóa voucher: ', error);
            notification.error({
              message: 'Thông báo',
              description: 'Lỗi khi xóa voucher'
            });
        });
      };
      const handleUpdateVoucher = (voucherId, updatedData) => {
        axios
          .put(`${process.env.REACT_APP_API_URL}/voucher/updateVoucher/${voucherId}`, updatedData, { headers })
          .then((response) => {
            if (response.data.success) {
              notification.success({
                message: 'Thông báo',
                description: 'Cập nhật voucher thành công'
              });
            } else {
              notification.error({
                message: 'Thông báo',
                description: response.data.error
              });

            }
          })
          .catch((error) => {
            console.error('Lỗi khi gọi API cập nhật voucher: ', error);
            notification.error({
              message: 'Thông báo',
              description: 'Lỗi khi cập nhật voucher'
            });

          });
      };
      
    return (
      <div>
        <Table bordered columns={columns} dataSource={voucherData} /> 
      </div>
    );
  };
  
  export default TableVoucher;