import React from "react";
import { WrapperHeader} from "../AdminUser/style";
import TableCategory from "../../TableComponents/TableCategory";



const AdminCategory = () => {
 

  return (
    <div>
      <WrapperHeader>Danh sách danh mục</WrapperHeader>
      <div style={{ marginTop: '15px' }}>
        <TableCategory  />
      </div>
    </div>
  );
};

export default AdminCategory;