import React, { useState } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';

const ErrorMessage = ({ message, success, onClose }) => {
    return (
        message && (
            <div style={styles.overlay}>
              <div style={styles.container}>
                <div style={styles.header(success)}>
                  {success ? (
                    <i className="fas fa-check" style={styles.icon}></i>
                  ) : (
                    <CloseCircleOutlined style={styles.icon}></CloseCircleOutlined>
                  )}
                </div>
                <div style={styles.body}>
                  <h2 style={styles.title}>{success ? 'Success!' : 'Error!'}</h2>
                  <p style={styles.message}>{message}</p>
                </div>
                <button onClick={onClose} style={styles.button(success)}>{success ? 'OK' : 'Thử lại'}</button>
              </div>
            </div>
          )
          );
};

const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    },
    container:{
      width: '500px',
      borderRadius: '10px',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    header: (success) => ({
      backgroundColor: success ? '#28a745' : '#B63245',
      padding: '20px 0',
    }),
    icon: {
      color: '#ffffff',
      fontSize: '50px',
    },
    body: {
      padding: '20px',
    },
    title: {
      fontSize: '24px',
      margin: '0 0 10px 0',
    },
    message: {
      color: '#666666',
      margin: '0 0 20px 0',
      fontSize: '20px',
    },
    button: (success) => ({
      width: '60%',
      padding: '15px 0',
      borderRadius:'10px',
      backgroundColor: success ? '#28a745' : '#B63245',
      color: '#ffffff',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      margin: '0 0 30px 0',
    }),
  };
  

export default ErrorMessage;
