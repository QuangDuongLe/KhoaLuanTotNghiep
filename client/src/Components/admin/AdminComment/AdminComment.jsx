import React from "react";
import { WrapperHeader} from "../AdminUser/style";
import TableComment from "../../TableComponents/TableComment";
import { Alert } from "antd";



const AdminComment = () => {
  return (
    <div>
        <Alert
        message="Bình luận có tên người bình luận phía sau có (QTV) là Admin, nếu khách hàng hỏi tiếp mà không nhớ bình luận trước đó thì truy cập vào phần sản phẩm để trả lời, còn nhớ thì cứ trả lời tiếp tục trong phần quản lý"
        type="info"
        showIcon
        style={{ marginBottom: '16px', background: '#FFFF99' }}
      />
      <WrapperHeader>Danh sách bình luận chờ duyệt</WrapperHeader>
      <div style={{ marginTop: '15px' }}>
        <TableComment  />
      </div>
    </div>
  );
};

export default AdminComment;