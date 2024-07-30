import { Breadcrumb, Button, Input, Radio, Space, message, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { WrapperWarranty } from './style';
import Loading from '../LoadingComponents/Loading';
import axios from 'axios';
import moment from 'moment';
import { ArrowLeftOutlined } from "@ant-design/icons";
import { MDBBtn, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalHeader } from 'mdb-react-ui-kit';
import OTPInput from "otp-input-react";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from './FirebaseController';
import { NavLink } from 'react-router-dom';
import ReactDOM from "react-dom";
const WarrantySearch = () => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(1);
    const [data, setData] = useState(null);
    const [sdt, setSdt] = useState(null);
    const [OTP, setOTP] = useState("");
    const [info, setInfo] = useState("");
    const [checked, setChecked] = useState(false);
    const handleInputDisable = () => {
        return checked; 
    };
    async function onSignup() {
        setLoading(true);
        setChecked(true);
            const appVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible",
                    callback: (response) => {
                        onSignup();
                    },
                    "expired-callback": () => { },
                }
            );
            try {
                const formatPh = "+84" + sdt;
                const confirmationResult = await signInWithPhoneNumber(auth, formatPh, appVerifier);
                window.confirmationResult = confirmationResult;
                setLoading(false);
                setCentredModal1(true);
                notification.success({
                    message: 'Thông báo',
                    description: 'Đã gửi OTP thành công!'
                  });
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
    }


    function onOTPVerify() {
        setLoading(true);
        window.confirmationResult
            .confirm(OTP)
            .then(async (res) => {
                setCentredModal1(false);
                setOTP(null);
                await handleSearch();
                setLoading(false);
            })
            .catch((err) => {
                setInfo("OTP không hợp lệ, hãy thử lại");
                setLoading(false);
            });
    }


    const onChange = (e) => {
        setValue(e.target.value);
    };

    const tableCellStyle = {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
    };

    const [centredModal1, setCentredModal1] = useState(false);

    const toggleShow1 = () => setCentredModal1(!centredModal1);

    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/order/checkBH`, { phone: sdt }, {
                timeout: 30000 
            });
            setData(response.data.products);
        } catch (error) {
            console.error('Error calling API:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        document.title = "Tra Cứu Bảo Hành";
    }, []);

    return (
        <WrapperWarranty>
            <div style={{ width: '70%' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>
                        <NavLink to="/">Home</NavLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <NavLink to="/warranty">Tra cứu thông tin bảo hành</NavLink>
                    </Breadcrumb.Item>
                </Breadcrumb>

                <div className='title'>
                    <p>Tra cứu thông tin bảo hành</p>
                </div>
                <div className='radio-box'>
                    <Radio.Group onChange={onChange} value={value}>
                        <Radio value={1}>Tra cứu theo số điện thoại</Radio>
                    </Radio.Group>
                </div>
                <div className='input-box'>
                    <Space.Compact style={{ width: '60%' }}>
                        <Input
                            placeholder="Vui lòng nhập số điện thoại để tra cứu"
                            value={sdt}
                            onChange={(e) => setSdt(e.target.value)}
                            disabled={handleInputDisable()}
                        />
                        <Button style={{ backgroundColor: '#B63245', color: 'white' }} onClick={onSignup} disabled={loading || checked}>
                            KIỂM TRA
                        </Button>
                    </Space.Compact>
                </div>
                <div id="recaptcha-container"></div>
                <div className='table'>
                    <Loading isLoading={loading}>
                        <table style={{ fontSize: '15px', width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={tableCellStyle}>Tên sản phẩm</th>
                                    <th style={tableCellStyle}>Bộ nhớ</th>
                                    <th style={tableCellStyle}>Màu</th>
                                    <th style={tableCellStyle}>Số lượng</th>
                                    <th style={tableCellStyle}>Hạn bảo hành</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.map((item, index) => (
                                    <tr key={index}>
                                        <td style={tableCellStyle}>{item.product.name}</td>
                                        <td style={tableCellStyle}>{item.memory}</td>
                                        <td style={tableCellStyle}>{item.color}</td>
                                        <td style={tableCellStyle}>{item.quantity}</td>
                                        <td style={tableCellStyle}> {item.change.dateChange ? (
                                            moment(item.change.dateChange, 'DD/MM/YYYY HH:mm:ss')
                                                .add(item.product.warrantyPeriod, 'months')
                                                .format('DD-MM-YYYY')
                                        ) : (
                                            moment(item.completeDate, 'DD/MM/YYYY HH:mm:ss')
                                                .add(item.product.warrantyPeriod, 'months')
                                                .format('DD-MM-YYYY')
                                        )}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Loading>
                </div>
                <MDBModal show={centredModal1} tabIndex='-1' setShow={setCentredModal1} >
                    <MDBModalDialog centered>
                        <MDBModalContent className="custom-emerald">
                            <MDBModalHeader>
                                <MDBBtn className='btn-close' color='none' onClick={toggleShow1}></MDBBtn>
                            </MDBModalHeader>
                            <MDBModalBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div className="logo-container mx-auto">
                                    <BsFillShieldLockFill size={30} />
                                </div>

                                <label className="font-bold text-xl text-black text-center">Hãy nhập OTP của bạn</label>
                                <br></br>
                                <OTPInput
                                    value={OTP}
                                    onChange={setOTP}
                                    OTPLength={6}
                                    otpType="number"
                                    disabled={false}
                                    autoFocus
                                    className="otp-container">
                                </OTPInput>
                                <br></br>
                                {info && <label className="font-bold text-xl text-black text-center">{info}</label>}
                                <br></br>
                                <Loading isLoading={loading}>
                                    <button onClick={onOTPVerify} className="custom-button">
                                        <span style={{ fontSize: '1rem' }}>Xác nhận OTP</span>
                                    </button>
                                </Loading>
                            </MDBModalBody>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            </div>
        </WrapperWarranty>
    );
};

export default WarrantySearch;
