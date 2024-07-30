import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    MDBBtn,
    MDBCardBody,
    MDBInput,
}
    from 'mdb-react-ui-kit';
import axios from "axios";
import { message, notification } from "antd";
const ChangePassword = () => {
    const user1 = useSelector((state) => state.user);
    const headers = {
        token: `Bearers ${user1.access_token}`,
    };
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [user, setUser] = useState({
        passWord: '',
        newPass: '',
        confirmPassword: ''
    });
    const onChange = event => {
        event.preventDefault();
        setUser({ ...user, [event.target.name]: event.target.value });
        if (user.newPass !== user.confirmPassword) {
            setPasswordsMatch(false);
            return;
        }
    }
    const changeHandler = async event => {
        event.preventDefault();
        if (!passwordsMatch) {
            notification.error({
                message: 'Thông báo',
                description: 'Nhập lại password không đúng'
              });

            return;
        }
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/changepassword/${user1._id}`, {
                currentPassword: user.passWord,
                newPassword: user.newPass,
            }, { headers });
            setUser({
                passWord: '',
                newPass: '',
                confirmPassword: ''
            })
      
            notification.success({
                message: 'Thông báo',
                description: 'Đổi mật khẩu thành công!'
              });
        } catch (error) {
            console.error('Lỗi khi thay đổi mật khẩu:', error);
            notification.error({
                message: 'Thông báo',
                description: error.response.data.msg
              });

        }
    }
    useEffect(() => {
        document.title = "Đổi Mật Khẩu";
      }, []);
    
    return (
        <form onSubmit={changeHandler} style={{paddingLeft: '30px', display: 'flex', width: '100%'}}>
            <div  style={{width:'40%'}}>
            <h3 className="fw-bold mb-5">Đổi mật khẩu</h3>
            <MDBInput wrapperClass='mb-4' label='Password cũ' name="passWord" value={user.passWord} onChange={onChange} type='password' tabIndex="1" />
            <MDBInput wrapperClass='mb-4' label='Password mới' name="newPass" value={user.newPass} onChange={onChange} type='password' tabIndex="2" onBlur={() => { setPasswordsMatch(user.newPass === user.confirmPassword); }} />
            <MDBInput wrapperClass='mb-4' label='Nhập lại password' name="confirmPassword" value={user.confirmPassword} onChange={onChange} type='password' tabIndex="3" onBlur={() => { setPasswordsMatch(user.newPass === user.confirmPassword); }} />
            <MDBBtn type="submit" className='w-100 mb-4' size='md' style={{ background: '#B63245' }}>Đồng ý</MDBBtn>
            </div>
        </form>
    );

}

export default ChangePassword