import React, { useEffect } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Row } from 'antd';
import { WrapperContainer } from './style';
import { useLocation } from 'react-router-dom';


const OrderSuccess = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const orderCode = searchParams.get('orderCode');
    useEffect(() => {
        document.title = "Đặt Hàng Thành Công";
    }, []);
    
    return (
        <WrapperContainer >
            <Row style={{ alignItems: 'center' }}>
                <CheckCircleOutlined style={{ color: 'green', fontSize: '4rem' }} />
            </Row>
            <p className='notice' >Đặt hàng thành công!</p>
            <p className='content' >Chúng tôi sẽ liên hệ Quý khách để xác nhận đơn hàng trong thời gian sớm nhất! Có thể xem chi tiết đơn hàng ở email hoặc nhấp vào nút dưới</p>
            <Row className='button' style={{display: 'flex', gap: '20px'}}>
                <Button href={`/order-detail/${orderCode}`} style={{background: "#C13346", color: '#fff'}} size='large'>Xem chi tiết đơn hàng</Button>
                <Button href='/' style={{background: "#C13346", color: '#fff'}} size='large'> Tiếp tục mua hàng
                </Button>
            </Row>
        </WrapperContainer>
    );
}

export default OrderSuccess;
