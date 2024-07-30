import { Button } from 'antd';
import React, { useState } from 'react';
import { WrapperBtn, WrapperTab } from './style';
import OrderList from './orderlist';

const Tab = () => {
  const [activeTab, setActiveTab] = useState('Chờ xác nhận');
  const changeTab = (tabName) => {
    setActiveTab(tabName);
  };
  return (
    <WrapperTab>
      <div className="tab-buttons">
        <WrapperBtn size='large' style={{ height: 'auto' }}
          className={activeTab === 'Chờ xác nhận' ? 'active' : ''}
          onClick={() => changeTab('Chờ xác nhận')}
        >
          <i class="fas fa-check-to-slot"></i>Chờ xác nhận
        </WrapperBtn>
        <WrapperBtn size='large' style={{ height: 'auto' }}
          className={activeTab === 'Đang chuẩn bị đơn hàng' ? 'active' : ''}
          onClick={() => changeTab('Đang chuẩn bị đơn hàng')}
        >
          <i class="fas fa-box"></i>Chờ chuẩn bị hàng
        </WrapperBtn>
        <WrapperBtn size='large' style={{ height: 'auto' }}
          className={activeTab === 'Đang giao hàng' ? 'active' : ''}
          onClick={() => changeTab('Đang giao hàng')}
        >
          <i class="fas fa-truck"></i>Đang giao hàng
        </WrapperBtn>
        <WrapperBtn size='large' style={{ height: 'auto' }}
          className={activeTab === 'Đã giao hàng' ? 'active' : ''}
          onClick={() => changeTab('Đã giao hàng')}
        >
          <i class="fas fa-truck"></i>Đã giao hàng
        </WrapperBtn>
        <WrapperBtn size='large' style={{ height: 'auto' }}
          className={activeTab === 'Đã hoàn thành' ? 'active' : ''}
          onClick={() => changeTab('Đã hoàn thành')}
        >
          <i class="fas fa-clipboard-check"></i>Đã hoàn thành
        </WrapperBtn>
        <WrapperBtn size='large' style={{ height: 'auto' }}
          className={activeTab === 'Đã huỷ' ? 'active' : ''}
          onClick={() => changeTab('Đã huỷ')}
        >
          <i class="fas fa-rectangle-xmark"></i>Đã huỷ
        </WrapperBtn>
      </div>
      <div className="tab-content">
      <OrderList status={activeTab} />
      </div>
    </WrapperTab>
  );
};

export default Tab;
