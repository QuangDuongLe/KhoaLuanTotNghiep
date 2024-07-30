import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { AppstoreFilled, UserOutlined, ProfileFilled, QqOutlined, PrinterFilled, StarFilled, MessageFilled, SignalFilled, FileImageOutlined, CarOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Components/Header/header';
import NotFoundPage from '../notfoundpage';

import NewCategory from '../../Components/admin/AdminCategory/NewCategory';
import NewBrand from '../../Components/admin/AdminBrand/NewBrand';
import AdminComment from '../../Components/admin/AdminComment/AdminComment';
import NewVoucher from '../../Components/admin/AdminVoucher/NewVoucher';
import Product from '../../Components/admin/AdminProduct/Product';
import OrderPending from '../../Components/admin/AdminOrder/OrderPending';
import OrderReady from '../../Components/admin/AdminOrder/OrderReady';
import OrderComplete from '../../Components/admin/AdminOrder/OrderComplete';
import OrderDelivery from '../../Components/admin/AdminOrder/OrderDelivery';
import OrderReadyCancel from '../../Components/admin/AdminOrder/OrderReadyCancel';
import OrderCanCel from '../../Components/admin/AdminOrder/OrderCancel';
import Category from '../../Components/admin/AdminCategory/Category';
import Brand from '../../Components/admin/AdminBrand/Brand';
import User from '../../Components/admin/AdminUser/User';
import Voucher from '../../Components/admin/AdminVoucher/Voucher';
import OrderDelivered from '../../Components/admin/AdminOrder/OrderDelivered';
import News from '../../Components/admin/AdminNews/News';
import Banner from '../../Components/admin/AdminBanner/Banner';
import Comment from '../../Components/admin/AdminComment/Comment';
import Dashboard from '../../Components/admin/AdminDashboard/Dashboard';
import CommentChecked from '../../Components/admin/AdminComment/CommentChecked';
import Province from '../../Components/admin/AdminAddress/Province';
import ChangeProductProcesscing from '../../Components/admin/AdminChangeProduct/ChangeProductProcesscing';
import ChangeProductProcessced from '../../Components/admin/AdminChangeProduct/ChangeProductProcessced';

const { SubMenu } = Menu;

const AdminHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    document.title = "Thống Kê";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const [openKeys, setOpenKeys] = useState([]); // State để lưu trữ các SubMenu đang mở

  const items = [
    { key: '/admin/dashboard', label: 'Thống kê', icon: <SignalFilled /> },
    { key: '/admin/users', label: 'Người dùng', icon: <UserOutlined /> },
    { key: '/admin/products', label: 'Sản phẩm', icon: <AppstoreFilled /> },
    { key: '/admin/categories', label: 'Danh mục', icon: <ProfileFilled /> },
    { key: '/admin/brands', label: 'Thương hiệu', icon: <QqOutlined /> },
    { key: '/admin/comments', label: 'Bình luận', icon: <MessageFilled /> },
    {
      key: 'order',
      label: 'Đơn hàng',
      icon: <PrinterFilled />,
      children: [
        { key: '/admin/order/pending', label: 'Chờ xác nhận' },
        { key: '/admin/order/ready', label: 'Đang chuẩn bị hàng' },
        { key: '/admin/order/delivery', label: 'Đang giao hàng' },
        { key: '/admin/order/delivered', label: 'Đã giao hàng' },
        { key: '/admin/order/complete', label: 'Đã hoàn thành' },
        { key: '/admin/order/readycancel', label: 'Đang chờ huỷ' },
        { key: '/admin/order/cancel', label: 'Đã huỷ' },
      ],
    },
    {
      key: 'orderChange',
      label: 'Đơn hàng đổi trả',
      icon: <PrinterFilled />,
      children: [
        { key: '/admin/orderChange/processing', label: 'Đang xử lý' },
        { key: '/admin/orderChange/processed', label: 'Đã xử lý' },
      ],
    },
    { key: '/admin/voucher', label: 'Voucher', icon: <StarFilled /> },
    { key: '/admin/news', label: 'Tin tức', icon: <MessageFilled /> },
    { key: '/admin/banners', label: 'Banner', icon: <FileImageOutlined /> },
    { key: '/admin/provinces', label: 'Tỉnh thành', icon: <CarOutlined /> },
  ];

  const handleClick = ({ key, keyPath }) => {
    navigate(key);
    setOpenKeys(keyPath.slice(1)); // Lưu trữ các key của các SubMenu đã mở
  };

  if (!user || user.role_id !== 1) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Header isHiddenSearch isHiddenCart />
      <div style={{ display: 'flex' }}>
        <Menu
          mode="inline"
          style={{ width: '15%', minHeight: '100vh',maxHeight:'120vh', boxShadow: '1px 2px 1px #ccc' }}
          onClick={handleClick}
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={keys => setOpenKeys(keys)}
        >
          {items.map(item =>
            item.children ? (
              <SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map(child => (
                  <Menu.Item key={child.key}>{child.label}</Menu.Item>
                ))}
              </SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            )
          )}
        </Menu>
        <div className='content-component' style={{ minHeight: '100vh', maxHeight: '100vh', width: '100%', overflow: 'auto', padding: '30px 30px 0 30px', scrollbarWidth: 'none' }}>
          {location.pathname === '/admin' && <Dashboard />}
          {location.pathname === '/admin/dashboard' && <Dashboard />}
          {location.pathname === '/admin/users' && <User />}
          {location.pathname === '/admin/products' && <Product />}
          {location.pathname === '/admin/categories' && <Category />}
          {location.pathname === '/admin/brands' && <Brand />}
          {location.pathname === '/admin/comments' && <CommentChecked />}
          {location.pathname === '/admin/order/pending' && <OrderPending />}
          {location.pathname === '/admin/order/ready' && <OrderReady />}
          {location.pathname === '/admin/order/delivery' && <OrderDelivery />}
          {location.pathname === '/admin/order/delivered' && <OrderDelivered />}
          {location.pathname === '/admin/order/complete' && <OrderComplete />}
          {location.pathname === '/admin/order/readycancel' && <OrderReadyCancel />}
          {location.pathname === '/admin/order/cancel' && <OrderCanCel />}
          {location.pathname === '/admin/voucher' && <Voucher />}
          {location.pathname === '/admin/news' && <News />}
          {location.pathname === '/admin/banners' && <Banner />}
          {location.pathname === '/admin/provinces' && <Province />}
          {location.pathname === '/admin/orderChange/processing' && <ChangeProductProcesscing />}
          {location.pathname === '/admin/orderChange/processed' && <ChangeProductProcessced />}
        </div>
      </div>
    </>
  );
};

export default AdminHomePage;
