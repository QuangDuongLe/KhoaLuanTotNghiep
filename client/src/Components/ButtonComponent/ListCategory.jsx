import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Flex, Menu, Skeleton } from 'antd';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const { SubMenu } = Menu;

const ListCate = () => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState({});
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

    const handleMenuClick = (e) => {
        console.log('Clicked:', e.key);
    };

    const menu = (
        <Menu onClick={handleMouseEnter}>
            {categories.map(category => (
                <SubMenu key={category._id} title={category.name} onMouseEnter={() => fetchBrands(category._id)}>
                    {loading && <Menu.Item key={`${category._id}-loading`}><Skeleton active/></Menu.Item>}
                    {brands[category._id] && brands[category._id].map(brand => (
                        <Menu.Item key={`${category._id}-${brand._id}`}>
                            {brand.name}
                        </Menu.Item>
                    ))}
                </SubMenu>
            ))}
        </Menu>
    );

    return (
        <Menu onClick={handleMenuClick} style={{ width: 200 }}>
            {categories.map(category => (
                <SubMenu key={category._id} title={<NavLink style={{ color: 'black' }} to={`/lowtoHigh/${category.name}`}>{category.name}</NavLink>} onTitleClick={() => fetchBrands(category._id)}>
                    {loading && <Menu.Item key={`${category._id}-loading`}><Skeleton active/></Menu.Item>}
                    {brands[category._id] && brands[category._id].map(brand => (
                        <Menu.Item key={`${category._id}-${brand._id}`}>
                            <NavLink to={`/lowtoHigh/${category.name}/${brand.name}`}>
                                {brand.name}
                            </NavLink>
                        </Menu.Item>
                    ))}
                </SubMenu>
            ))}
        </Menu>
    );
};

export default ListCate;
