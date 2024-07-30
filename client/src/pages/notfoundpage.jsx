import React, { useEffect } from 'react';
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link, NavLink } from 'react-router-dom';

const NotFoundPage = () => {
  const buttonStyle = {
    position: 'absolute',
    top: '70%',
    right: '65%',
    transform: 'translate(50%, -50%)',
    width: '15%',
    height: '6%',
    background:'#B63245'
    };
  const buttonHoverStyle = {
    backgroundColor: '#5170ff', // Màu nền khi hover
    color: 'white', // Màu chữ khi hover
  };

  useEffect(() => {
    document.title = "Không Tìm Thấy";
}, []);

  return (
    <div className="not-found-container" style={{ position: 'relative' }}>
      <img src='../../image/404.jpg' alt='404' style={{ width: '100%' }} />
      <NavLink to="/" >
      <MDBBtn style={buttonStyle} hoverStyle={buttonHoverStyle}>
        <p style={{color: '#fff', fontSize: '16px', fontWeight: 'bold'}}>Trở về trang chủ</p>
      </MDBBtn>
      </NavLink>
    </div>
  );
}

export default NotFoundPage;
