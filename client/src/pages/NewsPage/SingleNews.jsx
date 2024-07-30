import React, { useEffect, useState } from 'react';
import { Breadcrumb, Skeleton } from 'antd';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import { WrapperDesc } from '../../Components/ProductDetailCom/style';
import NewsCardHor from '../../Components/NewsPageCom/NewsCardHor';
import { FieldTimeOutlined } from '@ant-design/icons'
import SaleProduct from '../../Components/Slider/saleProduct';
import SingleProduct from '../../Components/CardComponent/SingleProduct';
function SingleNews() {
    const { id } = useParams();
    const [newsData, setNewsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   
    useEffect(() => {
        if (id) {
            axios.get(`${process.env.REACT_APP_API_URL}/news/getNews/${id}`)
                .then((response) => {
                    setNewsData(response.data.data);
                    document.title = `${response.data.data.title}`;    
                    setLoading(false);

                })
                .catch((error) => {
                    console.error('Error fetching news:', error);
                    setError('Failed to fetch news');
                    setLoading(false);
                });

        }
    }, [id]);
    if (loading) {
        return <div style={{ width: '90%', padding: '30px' }}>
            <Skeleton></Skeleton>
        </div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <Breadcrumb style={{ margin: '16px 4%' }}>
                <Breadcrumb.Item>
                    <NavLink to="/">Home</NavLink>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <NavLink to="/news">Tin tức</NavLink>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <NavLink to={`/news/${id}`}>{newsData.title}</NavLink>
                </Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ display: 'flex', marginBottom: '20px', flexDirection: 'row', background: "#fff", gap: '30px', justifyContent: 'center', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', background: "#fff", width: '60%' }}>
                    <img src={newsData.image} style={{ borderRadius: '7px' }}></img>
                    <div style={{ width: '95%', display: 'flex', flexDirection: 'column', background: "#fff", boxShadow: '0 0 6px rgba(68, 68, 68, .3)', marginTop: '-20%', marginLeft: '2.5%', borderRadius: '7px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <div className="content" style={{ width: '90%', textAlign: 'justify' }}>
                                <div className="content" style={{ textAlign: 'justify' }}>
                                    <h2 style={{ textAlign: 'justify' }}>{newsData.title}</h2>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <p>Người đăng: {newsData.author.fullName}</p>
                                        <p><FieldTimeOutlined />{newsData.publishedDate}</p>

                                    </div>
                                </div>
                                <WrapperDesc>
                                    <div className="product-description" dangerouslySetInnerHTML={{ __html: newsData.content.replace(/<img/g, '<img class="product-image"') }} />
                                </WrapperDesc>
                            </div>
                        </div>
                        <hr></hr>
                        <h4 style={{textAlign:'center'}}>Sản phẩm hot</h4>
                        <div style={{ width: '95%', display: 'flex', flexDirection: 'column', background: "#fff", boxShadow: '0 0 6px rgba(68, 68, 68, .3)', marginLeft: '2.5%', borderRadius: '7px', marginBottom:'4%' }}>
                            <SingleProduct></SingleProduct>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px', width: '30%', gap: '10px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Các tin khác</span>
                    <NewsCardHor excludeId={id} />
                </div>
            </div>
        </>
    );
}

export default SingleNews;
