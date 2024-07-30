import React, { useRef } from "react";
import { WrapperA } from "./style";

const Contact = () => {
    const contactRef = useRef(null);

    return (
        <WrapperA id="contact" ref={contactRef}>
            <div className="contact-page-wrapper">
                <h1 className="primary-heading">Bạn có thắc mắc?</h1>
                <h1 className="primary-heading">Hãy để chúng tôi giải đáp</h1>
                <div className="contact-form-container">
                    <input type="text" placeholder="yourmail@gmail.com" />
                    <button className="secondary-button">Gửi</button>
                </div>
            </div>
        </WrapperA>
    );
};

export default Contact;