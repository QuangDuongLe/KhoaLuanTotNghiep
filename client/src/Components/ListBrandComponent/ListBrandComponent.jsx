import React, { useEffect, useState } from "react";
import { WrapperBrandList } from "./style";
import axios from "axios";
import { NavLink, useLocation, useParams } from "react-router-dom";
import Loading from "../LoadingComponents/Loading";

const ListBrand = ({nameCategory , nameBrand}) => {
    const location = useLocation();
    const searchKeyword = new URLSearchParams(location.search).get('keyword');
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCategoryByName = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
                if (response.data.data) {
                    setCategories(response.data.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh mục theo tên:', error);
                setLoading(false);
            }
        };
        fetchCategoryByName();
    }, [nameCategory]);

    useEffect(() => {
        if (categories) {
            const category = categories.find((cat) => cat.name === nameCategory);
            if (category) {
                const categoryId = category._id;
                fetchBrandsByCategory(categoryId);
                
            }
        }
    }, [categories, nameCategory]);

    const fetchBrandsByCategory = async (categoryId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/brand/getBrand/${categoryId}`);
            setBrands(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thương hiệu theo danh mục:', error);
            setLoading(false);
        }
    };



    return (
        <Loading isLoading={loading}>
        <WrapperBrandList>
                    {brands.filter((brand) => brand.isHide === false).map((brand) => (
                        <NavLink 
                            key={brand.name}
                            className={`list-brand-item ${nameBrand === brand.name ? 'bordered' : ''}`}
                            to={`/products/${nameCategory}/${brand.name}${searchKeyword ? `?keyword=${searchKeyword}` : ''}`}>
                            <img className="brand-img" src={brand.picture} alt={brand.name} />
                        </NavLink>
                    ))}
        </WrapperBrandList>
        </Loading>
    )
}

export default ListBrand;
