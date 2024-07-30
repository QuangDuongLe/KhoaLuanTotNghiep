import React from "react";
import { WrapperHeader} from "../AdminUser/style";
import TableBrand from "../../TableComponents/TableBrand";



const AdminBrand = () => {
 

  return (
    <div>
      <WrapperHeader>Danh sách thương hiệu</WrapperHeader>
      <div style={{ marginTop: '15px' }}>
        <TableBrand  />
      </div>
    </div>
  );
};

export default AdminBrand;