import React, { useEffect } from 'react';
import Tab from './tab';
import { ArrowLeftOutlined } from '@ant-design/icons';


const Orders = () => {
    useEffect(() => {
        document.title = "Đơn Hàng Của Bạn";
      }, []);
    
    return (
        <div style={{ width: '100%', padding: '0 10px 0 10px' }}>
            <Tab />
        </div>
    )
}

export default Orders