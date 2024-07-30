import React, { useState } from "react";
import axios from "axios";
import { MDBBtn, MDBContainer, MDBRow, MDBInput } from 'mdb-react-ui-kit';
import ErrorMessage from "../error";

function Forget({ onClose }) {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({
    email: '',
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = event => {
    event.preventDefault();
    setUser({ ...user, [event.target.name]: event.target.value });
  }

  const forgetHandler = event => {
    event.preventDefault();
    setLoading(true);

    axios.put(`${process.env.REACT_APP_API_URL}/user/forgotpassword`, user)
      .then((res) => {
        setSuccess(true);
        setMessage(`Bạn đã yêu cầu gửi lại mật khẩu qua email thành công. Hãy tiến hành kiểm tra email.`);
        setTimeout(() => {
          setMessage('');
          onClose(); // Đóng modal sau khi hiển thị thông báo thành công
        }, 3000);  // Thông báo sẽ tự động đóng sau 3 giây
      }).catch((err) => {
        setSuccess(false);
        setMessage(`Email chưa được đăng ký tài khoản.`);
      }).finally(() => {
        setLoading(false);
      });
  }

  const handleClose = () => {
    setMessage('');
  };

  return (
    <div>
      <form className="form-add-new" onSubmit={(e) => forgetHandler(e)}>
        <MDBContainer fluid>
          <MDBRow className='d-flex justify-content-center align-items-center h-100'>
            <h2 className="fw-bold mb-2 text-center">Quên Mật Khẩu</h2>
            <p className="text-white-50 mb-3"></p>
            <MDBInput
              wrapperClass='mb-4 w-100'
              label='Email'
              name="email"
              value={user.email}
              type='email'
              size="lg"
              onChange={onChange}
            />
            <MDBBtn
              size='lg'
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#B63245' }}
            >
              {loading ? 'Đang gửi...' : 'Xác nhận'}
            </MDBBtn>
          </MDBRow>
        </MDBContainer>
      </form>

      <ErrorMessage message={message} success={success} onClose={handleClose} />
    </div>
  );
}

export default Forget;
