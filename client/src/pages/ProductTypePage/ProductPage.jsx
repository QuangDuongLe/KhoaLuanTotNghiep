import React, { useEffect, useState } from "react";
import { Button, Col, Dropdown, Menu, Row } from 'antd'
import ListBrand from "../../Components/ListBrandComponent/ListBrandComponent";
import Header from "../../Components/Header/header";

import Slide from "../../Components/Slider/Slide"
import { WrapperContent, WrapperTextValue, WrapperType, WrapperFilterList } from "./style";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { DownOutlined, FallOutlined, RiseOutlined } from '@ant-design/icons';
import axios from "axios";
import { Breadcrumb } from 'antd';
import ListProductNew from "../../Components/CardComponent/ListProductNew";
import { MDBBtn } from "mdb-react-ui-kit";

const ProductPage = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" })
    }, [])
    const location = useLocation();
    const searchKeyword = new URLSearchParams(location.search).get('keyword');
    const { nameCategory, nameBrand } = useParams();
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [sort, setSort] = useState('')
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [includeOldPrice, setIncludeOldPrice] = useState(false);
    const [selectedMemory, setSelectedMemory] = useState(null);
    const handlePriceSelection = (min, max) => {
        setMinPrice(min);
        setMaxPrice(max);
        if (max >= 99999999999999999999999) {
            setSelectedPriceRange(`Trên ${min.toLocaleString()}đ`);
        } else {
            setSelectedPriceRange(`Từ ${min.toLocaleString()}đ - ${max.toLocaleString()}đ`);
        }
    };

    const handlememory = (memory) => {
        setSelectedMemory(memory);
    };
    const handleOldPrice = (value) => {
        if (value === true) {
            setIncludeOldPrice(true);
        } else {
            setIncludeOldPrice(false);
        }
    };
    const handle = () => {
        setMinPrice('');
        setMaxPrice('');
        setSelectedMemory('');
        setIncludeOldPrice('');
        setNameProduct('');
        clearPriceSelection();
        setSort('')
    };
    const clearPriceSelection = () => {
        setMinPrice(null);
        setMaxPrice(null);
        setSelectedPriceRange(null);
    };
    const clearMemorySelection = () => {
        setSelectedMemory(null);
    };
    const hasNameBrand = nameBrand ? `/${nameBrand}` : '';
    const renderContent = (type, categories) => {
        switch (type) {
            case 'categories':
                return categories.map((category) => (
                    <NavLink  to={`/products/${category.name}${searchKeyword ? `?keyword=${searchKeyword}` : ''}`}>
                        <WrapperTextValue active={nameCategory === category.name}>
                            <div onClick={handle}>{category.name}</div>
                        </WrapperTextValue>
                    </NavLink>
                ));
            default:
                return {};
        }
    };
    const handleSort = (newSort) => {
        setSort(newSort);
    }
    const menu1 = (
        <Menu>
            {selectedPriceRange && (
                <Menu.Item key="7" onClick={clearPriceSelection}>
                    Tất cả giá
                </Menu.Item>
            )}
            <Menu.Item key="1" onClick={() => handlePriceSelection(0, 2000000)}>
                Dưới 2 triệu
            </Menu.Item>
            <Menu.Item key="2" onClick={() => handlePriceSelection(2000000, 4000000)}>
                Từ 2 đến 4 triệu
            </Menu.Item>
            <Menu.Item key="3" onClick={() => handlePriceSelection(4000000, 7000000)}>
                Từ 4 đến 7 triệu
            </Menu.Item>
            <Menu.Item key="4" onClick={() => handlePriceSelection(7000000, 13000000)}>
                Từ 7 đến 13 triệu
            </Menu.Item>
            <Menu.Item key="5" onClick={() => handlePriceSelection(13000000, 20000000)}>
                Từ 13 đến 20 triệu
            </Menu.Item>
            <Menu.Item key="6" onClick={() => handlePriceSelection(20000000, 99999999999999999999999)}>
                Trên 20 triệu
            </Menu.Item>

        </Menu>
    );
    const menu2 = (
        <Menu>
            {selectedMemory && (
                <Menu.Item key="11" onClick={clearMemorySelection}>
                    Tất cả bộ nhớ
                </Menu.Item>
            )}
            <Menu.Item key="5" onClick={() => handlememory('32GB')}>
                32GB
            </Menu.Item>
            <Menu.Item key="6" onClick={() => handlememory('64GB')}>
                64GB
            </Menu.Item>
            <Menu.Item key="7" onClick={() => handlememory('128GB')}>
                128GB
            </Menu.Item>
            <Menu.Item key="8" onClick={() => handlememory('256GB')} >
                256GB
            </Menu.Item>
            <Menu.Item key="9" onClick={() => handlememory('512GB')}>
                512GB
            </Menu.Item>
            <Menu.Item key="10" onClick={() => handlememory('1TB')}>
                1TB
            </Menu.Item>
        </Menu>
    );
    const menu3 = (
        <Menu>
            {selectedPriceRange && (
                <Menu.Item key="6" onClick={clearPriceSelection}>
                    Tất cả giá
                </Menu.Item>
            )}
            <Menu.Item key="1" onClick={() => handlePriceSelection(0, 50000)}>
                Dưới 50.000đ
            </Menu.Item>
            <Menu.Item key="2" onClick={() => handlePriceSelection(50000, 100000)}>
                Từ 50.000 - 100.000đ
            </Menu.Item>
            <Menu.Item key="3" onClick={() => handlePriceSelection(100000, 200000)}>
                Từ 100.000 - 200.000đ
            </Menu.Item>
            <Menu.Item key="4" onClick={() => handlePriceSelection(200000, 500000)}>
                Từ 200.000 - 500.000đ
            </Menu.Item>
            <Menu.Item key="5" onClick={() => handlePriceSelection(500000, 99999999999999999999999)}>
                Trên 500.000đ
            </Menu.Item>


        </Menu>
    );
    const menu4 = (
        <Menu>
            {selectedPriceRange && (
                <Menu.Item key="5" onClick={clearPriceSelection}>
                    Tất cả giá
                </Menu.Item>
            )}
            <Menu.Item key="1" onClick={() => handlePriceSelection(0, 300000)}>
                Dưới 300.000đ
            </Menu.Item>
            <Menu.Item key="2" onClick={() => handlePriceSelection(300000, 500000)}>
                Từ 30.000 - 500.000đ
            </Menu.Item>
            <Menu.Item key="3" onClick={() => handlePriceSelection(500000, 700000)}>
                Từ 500.000 - 700.000đ
            </Menu.Item>
            <Menu.Item key="4" onClick={() => handlePriceSelection(700000, 99999999999999999999999)}>
                Trên 700.000đ
            </Menu.Item>


        </Menu>
    );
    const menu5 = (
        <Menu>
            {selectedPriceRange && (
                <Menu.Item key="7" onClick={clearPriceSelection}>
                    Tất cả giá
                </Menu.Item>
            )}
            <Menu.Item key="1" onClick={() => handlePriceSelection(0, 200000)}>
                Dưới 200.000đ
            </Menu.Item>
            <Menu.Item key="2" onClick={() => handlePriceSelection(200000, 500000)}>
                Từ 200.000 - 500.000đ
            </Menu.Item>
            <Menu.Item key="3" onClick={() => handlePriceSelection(500000, 1000000)}>
                Từ 500.000 - 1 triệu
            </Menu.Item>
            <Menu.Item key="4" onClick={() => handlePriceSelection(1000000, 2000000)}>
                Từ 1 - 2 triệu
            </Menu.Item>
            <Menu.Item key="5" onClick={() => handlePriceSelection(2000000, 4000000)}>
                Từ 2 - 4 triệu
            </Menu.Item>
            <Menu.Item key="6" onClick={() => handlePriceSelection(4000000, 99999999999999999999999)}>
                Trên 4 triệu
            </Menu.Item>


        </Menu>
    );
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
                const allCategories = response.data.data;
                const filteredCategories = allCategories.filter(category => !category.isHide);
                setCategories(filteredCategories);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách danh mục:', error);
            }
        };

        fetchCategories();
    }, []);

    const [nameProduct, setNameProduct] = useState('');

    const handleNameProduct = (productName) => {
        if (nameProduct === productName) {
            setNameProduct('');
        } else {
            setNameProduct(productName);
        }
    };
    useEffect(() => {
        let title = 'Tìm kiếm';
        
        if (searchKeyword) {
          if (nameCategory && nameBrand) {
            title = `Kết quả cho "${searchKeyword}" trong ${nameBrand}, ${nameCategory}`;
          } else if (nameCategory) {
            title = `Kết quả cho "${searchKeyword}" trong ${nameCategory}`;
          } else if (nameBrand) {
            title = `Kết quả cho "${searchKeyword}" trong ${nameBrand}`;
          } else {
            title = `Kết quả cho "${searchKeyword}"`;
          }
        } else {
          if (nameCategory && nameBrand) {
            title = `Tìm kiếm trong ${nameBrand}, ${nameCategory}`;
          } else if (nameCategory) {
            title = `Tìm kiếm trong ${nameCategory}`;
          } else if (nameBrand) {
            title = `Tìm kiếm trong ${nameBrand}`;
          }
        }
    
        document.title = title;
      }, [nameCategory, nameBrand, searchKeyword]);
        
    return (
        <WrapperType>
            <div className="container" style={{ width: '80%', paddingLeft: '10px', paddingRight: '10px', marginTop: '15px' }}>
                <div className="navi" style={{ width: '100%' }}>
                    <Breadcrumb style={{ marginTop: '10px' }}>
                        <Breadcrumb.Item>
                            <NavLink to="/">Home</NavLink>
                        </Breadcrumb.Item>
                        {nameCategory && (
                            <Breadcrumb.Item>
                                <NavLink to={`/products/${nameCategory}`}>{nameCategory}</NavLink>
                            </Breadcrumb.Item>
                        )}
                        {nameBrand && (
                            <Breadcrumb.Item>
                                <NavLink to={`/products/${nameCategory}/${nameBrand}`}>{nameBrand}</NavLink>
                            </Breadcrumb.Item>
                        )}
                    </Breadcrumb>
                    <WrapperContent>
                        {renderContent('categories', categories)}
                    </WrapperContent>
                    <ListBrand nameCategory={nameCategory} nameBrand={nameBrand}/>
                    <WrapperContent>
                        {nameCategory === `Cáp sạc` && (
                            <WrapperTextValue
                                active={nameProduct === 'Adapter'}
                                onClick={() => handleNameProduct('Adapter')}
                                style={{ cursor: `pointer` }}
                            >
                                <div>Adapter Sạc</div>
                            </WrapperTextValue>
                        )}
                        {nameCategory === `Cáp sạc` && (
                            <WrapperTextValue
                                active={nameProduct === 'Cáp'}
                                onClick={() => handleNameProduct('Cáp')}
                                style={{ cursor: `pointer` }}>
                                <div>Dây sạc</div>
                            </WrapperTextValue>
                        )}
                    </WrapperContent>

                    <WrapperFilterList>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <Button style={{ display: 'inline-flex', alignItems: 'center' }} className={sort === '' ? 'memory-button selected' : 'memory-button'} onClick={() => handleSort('')}>
                                Tất cả sản phẩm
                            </Button>
                            <Button style={{ display: 'inline-flex', alignItems: 'center' }} className={sort === 'asc' ? 'memory-button selected' : 'memory-button'} onClick={() => handleSort('asc')}>
                                <RiseOutlined style={{ verticalAlign: 'middle', marginRight: '5px' }} />Giá Thấp - Cao
                            </Button>
                            <Button style={{ display: 'inline-flex', alignItems: 'center' }} className={sort === 'desc' ? 'memory-button selected' : 'memory-button'} onClick={() => handleSort('desc')}>
                                <FallOutlined style={{ verticalAlign: 'middle', marginRight: '5px' }} />Giá Cao - Thấp
                            </Button>
                            <a href={'/products'}>
                            <Button style={{ marginLeft: '10px' }} onClick={handle}>Đặt lại</Button>
                            </a>
                        </div>
                        {nameCategory === `Tai nghe` && (
                            <Dropdown overlay={menu5} placement="bottomLeft">
                                <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                    {selectedPriceRange ? selectedPriceRange : 'Giá'} <DownOutlined />
                                </a>
                            </Dropdown>
                        )}
                        {nameCategory === `Cáp sạc` && (
                            <Dropdown overlay={menu3} placement="bottomLeft">
                                <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                    {selectedPriceRange ? selectedPriceRange : 'Giá'} <DownOutlined />
                                </a>
                            </Dropdown>
                        )}
                        {nameCategory === `Ốp lưng` && (
                            <Dropdown overlay={menu3} placement="bottomLeft">
                                <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                    {selectedPriceRange ? selectedPriceRange : 'Giá'} <DownOutlined />
                                </a>
                            </Dropdown>
                        )}
                        {nameCategory === `Pin dự phòng` && (
                            <Dropdown overlay={menu4} placement="bottomLeft">
                                <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                    {selectedPriceRange ? selectedPriceRange : 'Giá'} <DownOutlined />
                                </a>
                            </Dropdown>
                        )}
                        {nameCategory === `Điện thoại` && (
                            <Dropdown overlay={menu1} placement="bottomLeft">
                                <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                    {selectedPriceRange ? selectedPriceRange : 'Giá'} <DownOutlined />
                                </a>
                            </Dropdown>
                        )}
                        {nameCategory === `Điện thoại` && (
                            <Dropdown overlay={menu2} placement="bottomLeft">
                                <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                    {selectedMemory ? selectedMemory : 'Bộ nhớ'} <DownOutlined />
                                </a>
                            </Dropdown>
                        )}
                    </WrapperFilterList>
                </div>
                <div style={{ width: '100%', background: '#fff', borderRadius: '6px' }}>
                    <ListProductNew
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        includeOldPrice={includeOldPrice}
                        selectedMemory={selectedMemory}
                        nameProduct={nameProduct}
                        sort={sort}
                    />
                </div>
            </div>
        </WrapperType>
    )
}

export default ProductPage;