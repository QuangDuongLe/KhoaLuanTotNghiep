import React, { useEffect, useState, useRef } from 'react';
import { MDBBtn } from 'mdb-react-ui-kit';
import { AppstoreOutlined, CameraOutlined, LockOutlined, LogoutOutlined, RadarChartOutlined } from '@ant-design/icons';
import { Breadcrumb, message, Upload, Menu, Modal, Slider, Button, notification } from 'antd';
import UpdateUser from './updateUser';
import ChangePassword from './changepass';
import { useSelector, useDispatch } from "react-redux";
import Header from '../../Components/Header/header';
import Orders from './order/orders';
import axios from "axios";
import { resetUser } from "../../redux/Slide/userSlice";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import AvatarEditor from 'react-avatar-editor';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const Profilepage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.user);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [preview, setPreview] = useState(null);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [scale, setScale] = useState(1);
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleLogoutCancel = () => {
    setLogoutModalVisible(false);
  };

  function checkFile(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      notification.error({
        message: 'Thông báo',
        description: 'Bạn chỉ có thể tải lên tệp tin JPG/PNG!'
    });
    }
    return isJpgOrPng;
  }

  const handleBeforeUpload = (file) => {
    if (checkFile(file)) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setPreview(reader.result));
      reader.readAsDataURL(file);
      setFile(file);
      setCropModalVisible(true);
    }
    return false; // Ngăn chặn việc upload ngay lập tức
  };

  const handleCrop = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
      const blob = await (await fetch(canvas)).blob();
      const formData = new FormData();
      formData.append('image', blob, file.name);

      setUploading(true);

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/uploadUser/${user._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          notification.success({
            message: 'Thông báo',
            description: 'Tải ảnh lên thành công!'
        });
  
          window.location.reload();
        } else {
          notification.error({
            message: 'Thông báo',
            description: 'Tải ảnh lên thất bại!'
        });
          }
      } catch (error) {
        notification.error({
          message: 'Thông báo',
          description: 'Tải ảnh lên thất bại!'
      });
  
      } finally {
        setUploading(false);
        setCropModalVisible(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/user/Logout`, {}, { withCredentials: true });
      dispatch(resetUser());
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng xuất:', error);
    }
  };

  const items = [
    getItem('Thông tin cá nhân', '/profile/infor', <AppstoreOutlined />),
    getItem('Đổi mật khẩu', '/profile/changepass', <LockOutlined />),
    getItem('Đơn hàng của bạn', '/profile/orders', <AppstoreOutlined />),
  ];

  if (user.role_id === 1) {
    items.push(getItem('Quản lý', '/admin/dashboard', <RadarChartOutlined />));
  }

  items.push(getItem('Đăng xuất', 'logout', <LogoutOutlined />));

  const onClick = ({ key }) => {
    if (key === 'logout') {
      setLogoutModalVisible(true);
    } else {
      navigate(key);
    }
  };

  const handleChangeImage = () => {
    setCropModalVisible(false);
    setTimeout(() => {
      fileInputRef.current.click();
    }, 100);
  };

  useEffect(() => {
    document.title = "Người Dùng";
  }, []);

  return (
    <section style={{ backgroundColor: '#fff' }}>
      <Header></Header>
      <div style={{ height: '100px', background: 'linear-gradient(to bottom, #B63245, #fff', display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <img src={user.avatar} alt="avatar" className="rounded-circle"
            style={{ height: '100%', width: 'auto', margin: '20px 20px 0px 20px' }} />
          <span style={{ color: '#fff' }}>{user.fullname}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: '50%', paddingRight: '30px' }}>
          <Upload beforeUpload={handleBeforeUpload} showUploadList={false}>
            <MDBBtn style={{ backgroundColor: '#fff', color: "black" }}  > <CameraOutlined /> Ảnh đại diện</MDBBtn>
          </Upload>
        </div>
      </div>

      <Breadcrumb style={{ margin: '30px 20px 10px' }}>
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to={`/profile/infor`}>Profile</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ display: 'flex' }}>
        <Menu
          style={{ width: '15%', minWidth: '15%', background: "#fff" }}
          onClick={onClick}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
        />
        <div className='content-component' style={{ minHeight: '100vh', maxHeight: '100vh', width: '100%', overflow: 'auto' }}>
          {location.pathname === '/profile/infor' && <UpdateUser />}
          {location.pathname === '/profile/changepass' && <ChangePassword />}
          {location.pathname === '/profile/orders' && <Orders />}
        </div>

        <Modal
          title="Xác nhận đăng xuất"
          visible={logoutModalVisible}
          onCancel={handleLogoutCancel}
          onOk={handleLogout}
          okText="Đăng xuất"
          cancelText="Hủy"
          okButtonProps={{ style: { backgroundColor: '#C13346', borderColor: '#C13346', color: '#fff' } }}
        >
          <p>Bạn có chắc chắn muốn đăng xuất?</p>
        </Modal>

        <Modal
          title="Chỉnh sửa ảnh đại diện"
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
                  width={300}
                  height={300}
                  border={10}
                  borderRadius={175}
                  scale={scale}
                  rotate={0}
                />
              </div>
              <Slider
                min={1}
                max={3}
                step={0.1}
                value={scale}
                onChange={(value) => setScale(value)}
                style={{ marginTop: 16 }}
              />
            </div>
          )}
        </Modal>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => handleBeforeUpload(e.target.files[0])}
        />
      </div>
    </section>
  );
}

export default Profilepage;
