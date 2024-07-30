import React from "react";
import { FacebookOutlined } from '@ant-design/icons';
import { WrapperA } from "./style";


const Footer = () => {
    return (
        <WrapperA>
            <div className="footer-wrapper">
                <div className="footer-section-one">
                    <div className="footer-logo-container">
                        <img src="../../image/didong3.png" alt="" />
                    </div>
                    <div className="footer-icons">
                        <FacebookOutlined />
                    </div>
                </div>
                <div className="footer-section-two">
                    <div className="footer-section-columns">
                        <span>Qualtiy</span>
                        <span>Help</span>
                        <span>Share</span>
                        <span>Carrers</span>
                        <span>Testimonials</span>
                        <span>Work</span>
                    </div>
                    <div className="footer-section-columns">
                        <span>244-5333-7783</span>
                        <span>hello@food.com</span>
                        <span>press@food.com</span>
                        <span>contact@food.com</span>
                    </div>
                    <div className="footer-section-columns">
                        <span>Terms & Conditions</span>
                        <span>Privacy Policy</span>
                    </div>
                </div>
            </div>
        </WrapperA>
    );
};

export default Footer;