import React, { useState, useEffect } from "react";
import { WrapperHeader } from "../AdminUser/style";
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBIcon } from 'mdb-react-ui-kit';
import { Modal, Switch, Tooltip, message, notification } from 'antd';
import axios from "axios";
import Search from "antd/es/input/Search";
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, AppstoreOutlined, AppstoreFilled } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Form } from 'antd';
import Loading from "../../LoadingComponents/Loading";
import AddDistrict from "./AddDistrict";
import EditDistrict from "./EditDistrict";
import Commune from "./Commune";


const District = ({idProvince,nameProvince}) => {
    const user = useSelector((state) => state.user);
    const headers = {
        token: `Bearer ${user.access_token}`,
    };
    const [districtData, setDistrictDate] = useState([]);
    const [deleteConfirmationDistrictId, setDeleteConfirmationDistrictId] = useState(null);
    const [reloadDistrictData, setReloadDistrictData] = useState(false);
    const [districtId, setDistrictId] = useState(null);
    const [districtName, setDistrictName] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchProviceData();
    }, [reloadDistrictData,idProvince]);
    const fetchProviceData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/province/getDistrict/${idProvince}`);
            setLoading(false)
            setDistrictDate(response.data.data);
        } catch (error) {
            console.error('Lỗi khi gọi API: ', error);
        }
    };
    const handleDeleteDistrict = async (idDistrict) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/province/deleteDistrict/${idDistrict}`,
                {},
                { headers }
            );
            setLoading(true);
            setReloadDistrictData(!reloadDistrictData);
            notification.success({
                message: 'Thông báo',
                description: 'Xóa quận/huyện thành công'
              });

        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: error.response?.data?.message || 'Lỗi khi xóa quận/huyện'
              });
        }
    };
    const [centredModal, setCentredModal] = useState(false);
    const toggleOpen = () => {
        setCentredModal(true);
    };
    const closeModal = () => {
        setCentredModal(false);
        setLoading(true)
        setReloadDistrictData(!reloadDistrictData);
    };
    const [centredModal2, setCentredModal2] = useState(false);
    const toggleOpen2 = (district) => {
        setDistrictId(district.idDistrict)
        setDistrictName(district.name)
        setCentredModal2(true);
    };
    const closeModal2 = () => {
        setCentredModal2(false);
    };
    const [centredModal3, setCentredModal3] = useState(false);
    const toggleOpen3 = (idDistrict) => {
        setDistrictId(idDistrict)
        setCentredModal3(true);
    };
    const closeModal3 = () => {
        setLoading(true)
        setCentredModal3(false);
        setReloadDistrictData(!reloadDistrictData);
    };
    return (
        <div>
            <WrapperHeader>Danh sách quận/huyện của {nameProvince}</WrapperHeader>
            <div style={{ display: 'flex' }}>
                <div style={{ justifyContent: 'end', width: '100%', display: 'flex', gap: "20px" }}>
                    <MDBBtn rounded style={{ backgroundColor: '#B63245' }} onClick={toggleOpen}>
                        Thêm quận/huyện
                    </MDBBtn>
                </div>
            </div>
            <div style={{ marginTop: '15px', overflowX: 'auto', overflowY: 'auto' }}>
                <Loading isLoading={loading}>
                    <MDBTable bordered align='middle' className='floating-table'>
                        <MDBTableHead>
                            <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '250px' }}>Quận/Huyện</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '100px' }}>Xã</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '20px' }}>Chỉnh sửa và xoá</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                                {districtData.map(district => (
                                    <tr key={district.idDistrict} style={{ textAlign: 'center' }}>
                                        <td>{district.name}</td>
                                        <td>  <Tooltip title="Danh sách huyện">
                                            <AppstoreFilled onClick={() => toggleOpen2(district)}/>
                                        </Tooltip></td>
                                        <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                                            <Tooltip title="Chỉnh sửa">
                                                <MDBBtn color="warning" onClick={() => toggleOpen3(district.idDistrict)}>
                                                    <EditOutlined />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Tooltip title="Xóa" >
                                                <MDBBtn color='danger' onClick={() => setDeleteConfirmationDistrictId(district.idDistrict)}>
                                                    <MDBIcon fas icon='trash' />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Modal
                                                title="Xác nhận xoá huyện"
                                                visible={deleteConfirmationDistrictId === district.idDistrict}
                                                onOk={() => {
                                                    handleDeleteDistrict(district.idDistrict);
                                                    setDeleteConfirmationDistrictId(null);
                                                }}
                                                onCancel={() => setDeleteConfirmationDistrictId(null)}
                                            >
                                                <p>Bạn có chắc chắn muốn xoá <strong>{district.name}</strong> này?</p>
                                            </Modal>
                                        </td>

                                    </tr>
                                ))
                            }
                        </MDBTableBody>
                    </MDBTable>
                </Loading>
                <>
                <Modal
                    visible={centredModal3}
                    title="Chỉnh sửa quận/huyện"
                    footer={null}
                    onCancel={closeModal3}
                    width={1400}
                    maskClosable={false}
                >
                    <EditDistrict closeModal={closeModal3} idDistrict={districtId} />
                </Modal>
            </>
                <>
                <Modal
                    visible={centredModal}
                    title="Thêm quận/huyện"
                    footer={null}
                    width={'50%'}
                    closable={false}
                >
                    <AddDistrict closeModal={closeModal} idProvince={idProvince}/>
                </Modal>
            </>
            <>
                <Modal
                    visible={centredModal2}
                    footer={null}
                    onCancel={closeModal2}
                    width={1400}
                    maskClosable={false}
                >
                    <Commune closeModal={closeModal2} idDistrict={districtId} nameDisTrict={districtName}/>
                </Modal>
            </>
            </div>
        </div>
    );
};

export default District;
