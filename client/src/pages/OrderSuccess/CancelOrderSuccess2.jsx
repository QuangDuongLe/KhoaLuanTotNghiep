import React, { useEffect } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Row } from 'antd';
import { WrapperContainer } from './style';
import { useLocation } from 'react-router-dom';


const CancelOrderSuccess2 = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const orderCode = searchParams.get('orderCode');
    useEffect(() => {
        document.title = "Gửi Yêu Cầu Hủy Đơn Thành Công";
    }, []);

    return (
        <WrapperContainer >
            <Row style={{ alignItems: 'center' }}>
                <CheckCircleOutlined style={{ color: 'green', fontSize: '4rem' }} />
            </Row>
            <p className='notice' >Đã gửi yêu cầu huỷ đơn hàng thành công!</p>
            <p className='content' >Đơn hàng của bạn đã được gửi để xác nhận. Chúc bạn có trải nghiệm mua sắm vui vẻ cùng Di Động Gen Z</p>
            <Row className='button' style={{display: 'flex', gap: '20px'}}>
                <Button href='/' style={{background: "#C13346", color: '#fff'}} size='large'> Tiếp tục mua hàng
                </Button>
            </Row>
        </WrapperContainer>
    );
}

export default CancelOrderSuccess2;
