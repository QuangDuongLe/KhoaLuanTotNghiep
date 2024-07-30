import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { WrapperInvoice } from "../../TableComponents/style";
import moment from 'moment';
import 'moment/locale/vi';
import { Button } from "antd";
import { jsPDF } from 'jspdf';
import html2canvas from "html2canvas";
const Invoice = ({ order }) => {
  const tableCellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  };
  const [isPrinting, setIsPrinting] = useState(false);
  const handlePrintPDF = async (order) => {
    try {
      setIsPrinting(true);
      const pdfDoc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        autoPaging: true,
      });
      const canvas = await html2canvas(document.getElementById('invoiceContent'), {
        scale: 3,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // Chiều rộng của trang A4
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdfDoc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight , '', 'FAST');

      pdfDoc.setFont('Roboto');
      pdfDoc.save(`order_invoice_${order.orderCode}.pdf`);
      setIsPrinting(false);
    } catch (error) {
      console.error('Error while generating PDF:', error);

    }
  };

  return (
    <>
      <WrapperInvoice id="invoiceContent">
        <div id="invoice-content">
          <div className="header-in">
            <div className="logo">
              <img className="logo-img" src="../../image/logo.png"></img>
            </div>
            <div className="inf">
              <span>DI ĐỘNG GEN Z</span>
              <span>Địa chỉ: Số 1 Võ Văn Ngân, Linh Chiểu, Thủ Đức</span>
              <span>Điện thoại: 0853204897</span>
              <span>Email: didonggenz@gmail.com</span>
            </div>
          </div>
          <p style={{ textAlign: 'center' }}>HÓA ĐƠN BÁN HÀNG</p>
          <div className="body-inf">
            <span>Mã Đơn Hàng: {order.orderCode}</span>
            <span>Khách Hàng: {order.userName}</span>
            <span>Ngày In Hóa Đơn: {moment().format('DD/MM/YYYY')}</span>
          </div>
          <div>
            <table style={{ fontSize: '15px', width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableCellStyle}>Tên sản phẩm</th>
                  <th style={tableCellStyle}>Màu</th>
                  <th style={tableCellStyle}>Số lượng</th>
                  <th style={tableCellStyle}>Bảo hành</th>
                  <th style={tableCellStyle}>Đơn giá</th>
                  <th style={tableCellStyle}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.product._id}>
                    <td style={tableCellStyle}>
                      {item.memory ? `${item.product.name} - ${item.memory}` : item.product.name}
                    </td>
                    <td style={tableCellStyle}>{item.color}</td>
                    <td style={tableCellStyle}>{item.quantity}</td>
                    <td style={tableCellStyle}>{item.product.warrantyPeriod} tháng</td>
                    <td style={tableCellStyle}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </td>
                    <td style={tableCellStyle}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.subtotal)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    Áp dụng giảm giá: {order?.voucher?.discount ? `${order.voucher.discount * 100} %` : '0'}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng tiền:</td>
                  <td style={tableCellStyle}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.totalPay)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
            <div className="sign" style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Khách hàng</span>
              <span> &#40;Ký, ghi rõ họ tên &#41;</span>
              <div style={{minHeight:'40mm'}}></div>
            </div>
            <div className="sign" style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Đại diện cửa hàng</span>
              <span> &#40;Ký, ghi rõ họ tên &#41;</span>
              <div style={{minHeight:'40mm'}}></div>
            </div>
          </div>
        </div>
        
      </WrapperInvoice>
      <Button
        onClick={() => handlePrintPDF(order)}
        type="primary"
        style={{ width: '100%', marginTop: '10px' }}
        loading={isPrinting}
      >
        {isPrinting ? 'Đang In...' : 'In hoá đơn'}
      </Button>

</>
  );
};

export default Invoice;
