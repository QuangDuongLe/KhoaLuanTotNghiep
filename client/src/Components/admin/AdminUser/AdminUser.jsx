import React from "react";
import { Button } from "antd";
import { WrapperHeader } from "../AdminUser/style";
import {PlusOutlined} from '@ant-design/icons'
import TableUser from "../../TableComponents/TableUser";

const AdminUser = () =>{
    return(
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>
            <TableUser/>      
        </div>
    )
}

export default AdminUser