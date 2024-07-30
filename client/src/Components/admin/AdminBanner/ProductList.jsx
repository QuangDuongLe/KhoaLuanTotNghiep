import React from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

const ProductList = ({ products }) => {
    return (
        <div>
            <WrapperHeader>Danh sách sản phẩm của banner</WrapperHeader>
            <div style={{ marginTop: '15px', overflowY: 'auto', overflowX: 'auto' }}>
                <MDBTable bordered align='middle' className='floating-table'>
                    <MDBTableHead>
                        <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                            <th scope='col' style={{ verticalAlign: 'middle' }}>Tên sản phẩm</th>
                            <th scope='col' style={{ verticalAlign: 'middle' }}>Hình ảnh</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {products.length > 0 ? (
                            products.map(product => (
                                <tr key={product.productId._id} style={{ textAlign: 'center' }}>
                                    <td>
                                        
                                            <p className='fw-bold mb-1'>{product.productId.name}</p>
                                  
                                    </td>
                                    <td>
                                        {product.productId.thumnails && product.productId.thumnails.length > 0 && (
                                            <img
                                                src={product.productId.thumnails[0]} 
                                                alt={product.productId.name}
                                                style={{ width: '45px', height: '45px' }}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">Không có sản phẩm</td>
                            </tr>
                        )}
                    </MDBTableBody>
                </MDBTable>
            </div>
        </div>
    );
};

export default ProductList;
