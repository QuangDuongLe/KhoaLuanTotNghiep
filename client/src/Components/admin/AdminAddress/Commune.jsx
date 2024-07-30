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
import AddCommune from "./AddCommune";
import EditCommune from "./EditCommune";



const Commune = ({ idDistrict, nameDisTrict }) => {
    const user = useSelector((state) => state.user);
    const headers = {
        token: `Bearer ${user.access_token}`,
    };
    const [communeData, setCommuneDate] = useState([]);
    const [deleteConfirmationCommuneId, setDeleteConfirmationCommuneId] = useState(null);
    const [reloadCommuneData, setReloadCommuneData] = useState(false);
    const [communeId, setComuneId] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchProviceData();
    }, [reloadCommuneData, idDistrict, nameDisTrict]);
    const fetchProviceData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/province/getCommnune/${idDistrict}`);
            setLoading(false)
            setCommuneDate(response.data.data);
        } catch (error) {
            console.error('Lỗi khi gọi API: ', error);
        }
    };
    const handleDeleteCommune = async (idCommune) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/province/deleteCommue/${idCommune}`,
                {},
                { headers }
            );
            setLoading(true);
            setReloadCommuneData(!reloadCommuneData);
            notification.success({
                message: 'Thông báo',
                description: 'Xóa xã/phường thành công'
              });

        } catch (error) {
            notification.error({
                message: 'Thông báo',
                description: error.response?.data?.message || 'Lỗi khi xóa xã/phường'
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
        setReloadCommuneData(!reloadCommuneData);
    };
    const [centredModal3, setCentredModal3] = useState(false);
    const toggleOpen3 = (idCommune) => {
        setComuneId(idCommune)
        setCentredModal3(true);
    };
    const closeModal3 = () => {
        setLoading(true)
        setCentredModal3(false);
        setReloadCommuneData(!reloadCommuneData);
    };
    return (
        <div>
            <WrapperHeader>Danh sách xã/phường của {nameDisTrict}</WrapperHeader>
            <div style={{ display: 'flex' }}>
                <div style={{ justifyContent: 'end', width: '100%', display: 'flex', gap: "20px" }}>
                    <MDBBtn rounded style={{ backgroundColor: '#B63245' }} onClick={toggleOpen} >
                        Thêm xã/phường
                    </MDBBtn>
                </div>
            </div>
            <div style={{ marginTop: '15px', overflowX: 'auto', overflowY: 'auto' }}>
                <Loading isLoading={loading}>
                    <MDBTable bordered align='middle' className='floating-table'>
                        <MDBTableHead>
                            <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '250px' }}>Xã</th>
                                <th scope='col' style={{ verticalAlign: 'middle', minWidth: '20px' }}>Chỉnh sửa và xoá</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {communeData.map(commune => (
                                <tr key={commune.idCommune} style={{ textAlign: 'center' }}>
                                    <td>{commune.name}</td>
                                    <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                                            <Tooltip title="Chỉnh sửa">
                                                <MDBBtn color="warning" onClick={() => toggleOpen3(commune.idCommune)}>
                                                    <EditOutlined />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Tooltip title="Xóa" >
                                                <MDBBtn color='danger' onClick={() => setDeleteConfirmationCommuneId(commune.idCommune)}>
                                                    <MDBIcon fas icon='trash' />
                                                </MDBBtn>
                                            </Tooltip>
                                            <Modal
                                                title="Xác nhận xoá huyện"
                                                visible={deleteConfirmationCommuneId === commune.idCommune}
                                                onOk={() => {
                                                    handleDeleteCommune(commune.idCommune);
                                                    setDeleteConfirmationCommuneId(null);
                                                }}
                                                onCancel={() => setDeleteConfirmationCommuneId(null)}
                                            >
                                                <p>Bạn có chắc chắn muốn xoá <strong>{commune.name}</strong> này?</p>
                                            </Modal>
                                        </td>
                                </tr>
                            ))}
                        </MDBTableBody>
                    </MDBTable>
                </Loading>
                <>
                <Modal
                    visible={centredModal}
                    title="Thêm xã/phường"
                    footer={null}
                    width={'50%'}
                    closable={false}
                >
                    <AddCommune closeModal={closeModal} idDistrict={idDistrict}/>
                </Modal>
            </>
            <>
                <Modal
                    visible={centredModal3}
                    title="Chỉnh sửa xã/phường"
                    footer={null}
                    onCancel={closeModal3}
                    width={1400}
                    maskClosable={false}
                >
                    <EditCommune closeModal={closeModal3} idCommune={communeId} />
                </Modal>
            </>
            </div>
            
        </div>
    );
};

export default Commune;
