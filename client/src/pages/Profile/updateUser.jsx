import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Select, message, notification } from "antd";
import { MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import { useSelector } from "react-redux";
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { WrapperUpdate } from "./order/style";
import EditAddRess from "./EditAddRess";

const { Option } = Select;

const UpdateUser = () => {
  const user = useSelector((state) => state.user);
  const headers = {
    token: `Bearer ${user.access_token}`,
  };
  const [user2, setUser2] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState("");
  const [user1, setUser1] = useState({
    fullName: "",
    phone_number: "",
    address: "",
    birthDay: null,
    province: undefined,
    district: undefined,
    commune: undefined,
  });
  const [centredModal1, setCentredModal1] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [address, setAddRess] = useState("");
  useEffect(() => {
    document.title = "Người Dùng";
  }, []);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/get-Detail/${user._id}`, { headers });
        const defaultAddress = response.data.data.addRess.find(address => address.isDefault)?.address || "";
        setAddRess(response.data.data.addRess);
        setDefaultAddress(defaultAddress);
        setUser2(response.data.data);
        setUser1({
          ...user1,
          fullName: response.data.data.fullName || "",
          phone_number: response.data.data.phone_number || "",
        });
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    fetchUserDetail();
  }, [user._id, isModalVisible, centredModal1]);

  const onChange = (name, value) => {
    setUser1({ ...user1, [name]: value });
  };

  const updateUser = async (event) => {
    event.preventDefault();
    try {
      const updatedData = {};
      if (user1.fullName) {
        updatedData.fullName = user1.fullName;
      }
      if (user1.phone_number) {
        updatedData.phone_number = user1.phone_number;
      }
      if (user1.birthDay) {
        updatedData.birthDay = user1.birthDay.format("DD-MM-YYYY");
      }

      await axios.post(
        `${process.env.REACT_APP_API_URL}/user/update/${user._id}`,
        updatedData,
        { headers }
      );

      window.location.reload();
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const specificAddress = `${user1.address}, ${communes && communes.find(commune => commune.idCommune === user1.commune)?.name || ''}, ${districts && districts.find(district => district.idDistrict === user1.district)?.name || ''}, ${provinces && provinces.find(province => province.idProvince === user1.province)?.name || ''}`;

      await axios.post(
        `${process.env.REACT_APP_API_URL}/user/addAddress/${user._id}`,
        { address: specificAddress, isDefault: false },
        { headers }
      );
      setDistricts([]);
      setCommunes([]);
      setUser1({ ...user1, address: "", district: undefined, commune: undefined });
      notification.success({
        message: 'Thông báo',
        description: 'Thêm địa chỉ mới thành công'
    });

      setIsModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi thêm địa chỉ mới:', error);
    }
  };

  const handleSetDefaultAddress = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/user/setDefault/${user._id}`,
        { address: defaultAddress },
        { headers }
      );
      notification.success({
        message: 'Thông báo',
        description: 'Đã chọn làm địa chỉ mặc định thành công!'
    });

      window.location.reload();
    } catch (error) {
      console.error('Lỗi khi chọn làm địa chỉ mặc định:', error);
      notification.error({
        message: 'Thông báo',
        description: 'Lỗi khi chọn làm địa chỉ mặc định'
    });

    }
  };

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/province/getProvince`)
      .then(response => {
        setProvinces(response.data.data);
        console.log(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching provinces:', error);
      });
  }, []);

  const onChangeProvince = (value) => {
    setUser1({ ...user1, province: value, district: undefined, commune: undefined });
    setDistricts([]);
    setCommunes([]);
    axios.get(`${process.env.REACT_APP_API_URL}/province/getDistrict/${value}`)
      .then(response => {
        setDistricts(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching districts:', error);
      });
  };

  const onChangeDistrict = (value) => {
    setUser1({ ...user1, district: value, commune: undefined });
    setCommunes([]);
    axios.get(`${process.env.REACT_APP_API_URL}/province/getCommnune/${value}`)
      .then(response => {
        setCommunes(response.data.data);
        console.log(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching communes:', error);
      });
  };

  const onChangeCommune = (value) => {
    setUser1({ ...user1, commune: value });
  };

  const toggleOpen1 = () => {
    setCentredModal1(true);
  };

  const closeModal1 = () => {
    setCentredModal1(false);
  };

  return (
    <div onSubmit={updateUser} style={{ paddingLeft: '30px', display: 'flex', width: '100%' }}>
      <div style={{ width: '50%' }}>
        <h3 className="fw-bold mb-5">Thông tin người dùng</h3>
        <WrapperUpdate>
          <MDBInput wrapperClass='mb-4' label='Họ và tên' name="fullName" value={user1.fullName} onChange={(e) => onChange("fullName", e.target.value)} type='text' tabIndex="1" />
          <MDBInput wrapperClass='mb-4' label='Số điện thoại' name="phone_number" value={user1.phone_number} onChange={(e) => onChange("phone_number", e.target.value)} type='text' tabIndex="3" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Select
              style={{ flex: '1' }}
              value={defaultAddress}
              onChange={(value) => setDefaultAddress(value)}
            >
              {user2?.addRess.map((address, index) => (
                <Option key={index} value={address.address}>
                  {address.address}
                </Option>
              ))}
            </Select>
            <Button style={{ backgroundColor: '#B63245' }} onClick={handleSetDefaultAddress} type="primary">Chọn làm địa chỉ mặc định</Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
            <MDBBtn type="dashed" onClick={() => setIsModalVisible(true)} style={{ marginBottom: '20px', background: '#B63245' }}>
              <PlusOutlined /> Thêm địa chỉ mới
            </MDBBtn>
            <MDBBtn type="dashed" onClick={() => toggleOpen1()} style={{ marginBottom: '20px', background: '#B63245' }}>
              Danh sách địa chỉ
            </MDBBtn>
          </div>
          <MDBInput wrapperClass='mb-4' label='Email' name="email" value={user.email} disabled></MDBInput>
        </WrapperUpdate>
        <MDBBtn className='w-100 mb-4' size='md' style={{ background: '#B63245' }} type="primary" onClick={updateUser}>Lưu</MDBBtn>
      </div>
      <Modal
        title="Thêm địa chỉ mới"
        visible={isModalVisible}
        width={'50%'}
        onOk={() => {
          if (!user1.address) {
            notification.error({
              message: 'Thông báo',
              description: 'Vui lòng nhập đủ địa chỉ trước khi tiếp tục!'
          });

          } else {
            handleAddAddress();
          }
        }}
        onCancel={() => {
          console.log("Value of user1.address on Cancel:", user1.address);
          setIsModalVisible(false);
          setDistricts([]);
          setCommunes([]);
          setUser1({ ...user1, address: "", district: undefined, commune: undefined });
        }}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{ style: { backgroundColor: '#4CAF50', borderColor: '#4CAF50', color: '#fff' } }}
        cancelButtonProps={{ style: { backgroundColor: '#f44336', borderColor: '#f44336', color: '#fff' } }}
        footer={[
          <Button key="cancel" onClick={() => {
            console.log("Value of user1.address on Cancel:", user1.address);
            setIsModalVisible(false);
            setDistricts([]);
            setCommunes([]);
            setUser1({ ...user1, address: "", district: undefined, commune: undefined });
          }} style={{ backgroundColor: '#f44336', borderColor: '#f44336', color: '#fff' }}>
            Hủy
          </Button>,
          <Button key="ok" type="primary" onClick={() => {
            if (!user1.address) {
              notification.error({
                message: 'Thông báo',
                description: 'Vui lòng nhập đủ địa chỉ trước khi tiếp tục!'
            });
  
            } else {
              handleAddAddress();
            }
          }} style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50', color: '#fff' }}>
            Xác nhận
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', gap: '5%' }}>
          {provinces.length > 0 && (
            <Select
              showSearch
              style={{ width: '30%', marginBottom: '25px' }}
              placeholder="Tỉnh"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              value={user1.province}
              options={provinces.map(province => ({ value: province.idProvince, label: province.name }))}
              onChange={onChangeProvince}
            />
          )}
          {districts.length > 0 && (
            <Select
              showSearch
              style={{ width: '30%', marginBottom: '25px' }}
              placeholder="Huyện"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              value={user1.district}
              options={districts.map(district => ({ value: district.idDistrict, label: district.name }))}
              onChange={onChangeDistrict}
            />
          )}
          {communes.length > 0 && (
            <Select
              showSearch
              style={{ width: '30%', marginBottom: '25px' }}
              placeholder="Xã"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              value={user1.commune}
              options={communes.map(commune => ({ value: commune.idCommune, label: commune.name }))}
              onChange={onChangeCommune}
            />
          )}
        </div>
        <MDBInput wrapperClass='mb-4' label='Tên đường, số nhà' name="address" value={user1.address} onChange={(e) => onChange("address", e.target.value)} type='text' />
      </Modal>
      <Modal
        visible={centredModal1}
        title="Danh sách địa chỉ"
        footer={null}
        onCancel={closeModal1}
        width={'50%'}
      >
        <EditAddRess closeModal={closeModal1} address={address} />
      </Modal>
    </div>
  );
};

export default UpdateUser;
