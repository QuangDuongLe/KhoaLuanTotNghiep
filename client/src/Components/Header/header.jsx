import React, { useState, useEffect } from "react";
import { Badge, Button, Menu, Dropdown, FloatButton, Tooltip } from 'antd';
import axios from "axios";
import { CustomerServiceOutlined, PhoneOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { WrapperSuperHeader } from "./style";
import Search from "antd/es/input/Search";
import { ShoppingCartOutlined, SearchOutlined, UserOutlined, FacebookOutlined, InstagramOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux'
import { resetUser } from "../../redux/Slide/userSlice";
import { NavLink } from "react-router-dom";
import SuggestCard from "../CardComponent/suggestcard";


const Header = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const dispatch = useDispatch();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState({});
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
        setCategories(response.data.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách danh mục:', error);
      }
    };
    fetchCategories();
  }, []);

  const fetchBrands = async (categoryId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/brand/getBrand/${categoryId}`);
      setBrands(prevState => ({
        ...prevState,
        [categoryId]: response.data.data
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setLoading(false);
    }
  };

  const handleMouseEnter = async (categoryId) => {
    if (!brands[categoryId]) {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/brand/getBrand/${categoryId}`);
        setBrands(prevState => ({
          ...prevState,
          [categoryId]: response.data.data
        }));
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách thương hiệu theo danh mục:', error);
        setLoading(false);
      }
    }
  };





  const handleSearch = () => {
    if (searchKeyword) {
      axios.get(`${process.env.REACT_APP_API_URL}/product/searchProduct?keyword=${searchKeyword}`)
        .then((response) => {
          window.location.href = `/products?keyword=${searchKeyword}`;
        })
        .catch((error) => {
          console.error('Lỗi khi gọi API tìm kiếm: ', error);
        });
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/user/Logout`, {}, { withCredentials: true });
      dispatch(resetUser)
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng xuất:', error);
    }
  };



  const user = useSelector((state) => state.user)


  const usermenu = (
    <Menu>
      <Menu.Item key="1">
        <NavLink to="/login">Đăng nhập</NavLink>
      </Menu.Item>
      <Menu.Item key="2">
        <NavLink to="/register">Đăng ký</NavLink>
      </Menu.Item>
    </Menu>
  );
  const brandmenu = (categoryId, categoryName) => (
    <Menu>
      {brands[categoryId]?.map((brand) => (
        <Menu.Item key={brand._id}>
          <NavLink to={`/lowtoHigh/${categoryName}/${brand.name}`}>{brand.name}</NavLink>
        </Menu.Item>
      ))}
    </Menu>
  );


  useEffect(() => {
    if (user && user._id) {
      axios.get(`${process.env.REACT_APP_API_URL}/cart/getToCart/${user._id}`)
        .then((response) => {
          const cartData = response.data.data;
          setData(cartData);
        })
        .catch((error) => {
          console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
        });
    }
  }, [user]);
  const [data, setData] = useState(null);
  const [logo, setLogo] = useState({ image: '', link: '' });
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/banner/getBannerByLocation/header/logo`);
        if (response.data.success) {
          const bannerData = response.data.data[0]; 
          setLogo({
            image: bannerData.image,
            link: bannerData.link,
          });
        } else {
          console.error('No logo found');
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);
  return (
      <WrapperSuperHeader >
        <div className="header-container" >
          <div className="first-com">
            <NavLink  to={logo.link} className="ant-image" >
              <img className="logo" src={logo.image} alt="logo" />
            </NavLink>
          </div>
          <div className="second-com">
            <div className="search-box" >
              {!isHiddenSearch && (
                <div className="search-and-suggest-container">
                  <Search
                    placeholder="Bạn muốn tìm sản phẩm nào?"
                    onSearch={(value) => {
                      if (value) {
                        handleSearch();
                      }
                    }}
                    enterButton={
                      <Button style={{ background: '#fff', display: 'flex', alignItems: 'center' }}>
                        <SearchOutlined style={{ width: '10px', height: '20px', color: '#B63245' }} />
                      </Button>
                    }
                    size="large"
                    value={searchKeyword}
                    onChange={(e) => {
                      const newSearchKeyword = e.target.value;
                      setSearchKeyword(newSearchKeyword);
                    }}
                    allowClear ></Search>
                  <div>
                    <SuggestCard searchKeyword={searchKeyword} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="third-com">

            <Tooltip title="Tra cứu bảo hành" mouseEnterDelay={1}>
              <NavLink to={"/warranty"} className="list-com">
                <PhoneOutlined style={{ fontSize: '20px', color: '#fff' }} />
              </NavLink>
            </Tooltip>

            {!isHiddenCart && (
              <div className="list-com">
                <Badge count={data ? data.length : 0} size="small" >
                  <Tooltip title="Giỏ hàng" mouseEnterDelay={1}>
                    <NavLink to={"/cart"}>
                      <ShoppingCartOutlined style={{ color: '#fff', fontSize: '20px' }} />
                    </NavLink>
                  </Tooltip>
                </Badge>
              </div>
            )}

            <div className="list-com">
              {user?.fullName ? (
                <Tooltip title="Tài khoản" mouseEnterDelay={1}>
                  <NavLink to={'/profile/infor'}><UserSwitchOutlined style={{ fontSize: '20px', color: '#fff' }} /></NavLink>
                </Tooltip>
              ) : (
                <div className="list-com">
                  <Dropdown overlay={usermenu} trigger={['click']}>
                    <Tooltip title="Tài khoản" mouseEnterDelay={1}>
                      <div style={{ cursor: 'pointer' }}>
                        <UserOutlined style={{ fontSize: '20px', color: '#fff' }} />
                      </div>
                    </Tooltip>
                  </Dropdown>
                </div>
              )}
            </div>
          </div>

          <FloatButton.Group
            trigger="click"
            type="primary"
            style={{
              right: 24,
              bottom: 97,
            }}
            icon={<CustomerServiceOutlined />}
            tooltip={<div>Chăm sóc khách hàng</div>}>
            <FloatButton icon={<FacebookOutlined />} href="https://www.facebook.com/didonggenz" tooltip={<div>Facebook</div>} />
            <FloatButton icon={<InstagramOutlined />} tooltip={<div>Instagram</div>} />
          </FloatButton.Group>
          <FloatButton.BackTop
            style={{
              right: 24,
            }} />
        </div>
      </WrapperSuperHeader>

  )
}
export default Header