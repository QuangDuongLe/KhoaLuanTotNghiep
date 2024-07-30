import React, { useState, useEffect } from 'react'
import { CardWrapper, Wrapper } from './style';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import Loading from '../../Components/LoadingComponents/Loading';
import { Card } from 'antd';
const gridStyle = {
  width: '100%',
  textAlign: 'center',
};


const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
        setCategories(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách danh mục:', error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  return (
    <Loading isLoading={loading}>
      <CardWrapper >
        {categories.filter((category) => category.isHide === false).map((category) => (
          <NavLink key={category._id} className='card' to={`/products/${category.name}`}>
            <div className='img-fluid'>
              <img src={category.picture} className='img' loading="lazy" />
            </div>
            <div className='cate-name'>
              <p >{category.name}</p>
            </div>
          </NavLink>
        ))}
      </CardWrapper>
    </Loading>
  )
}

export default Category

{/*  */ }