import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { NavLink, useParams } from 'react-router-dom';


import { Button, Card, Rate, Skeleton, Tooltip } from 'antd';
import { CardProdNew, WrapperCardProd } from '../../pages/HomePage/styled';
import { useSelector } from 'react-redux';
import NewsCard from '../NewsPageCom/NewsCard';

function SaleProduct({ userId }) {
    const [loading, setLoading] = useState(true);

    const [newsData, setNewsData] = useState([]);
    const fetchNewsData = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/news/getAllNews`)
            .then((response) => {
                setNewsData(response.data.data);
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API: ', error);
            });
    };

    useEffect(() => {
        fetchNewsData();
        setLoading(false);
    }, []);
    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        responsive: [
            {
                breakpoint: 1224,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };
    const PrevArrow = ({ onClick }) => {
        return <div className="slick-arrow slick-prev" onClick={onClick}></div>;
    };

    const NextArrow = ({ onClick }) => {
        return <div className="slick-arrow slick-next" onClick={onClick} ></div>;
    };


    return (
        <CardProdNew>
            {loading ? (
                <Skeleton style={{ padding: 10, minHeight: '395px' }} active={true} />
            ) : (
                <Slider {...settings} prevArrow={<PrevArrow />} nextArrow={<NextArrow />}>
                    {newsData.map((news) => (
                        <div className='card' style={{ display: 'flex' }} >
                            <NavLink key={news._id} to={`/news/${news._id}`} >
                                <div className='image' >
                                    <img alt={news.title} src={news.image} loading='lazy' />
                                </div>
                                <div className='desc'>
                                        <h1 style={{
                                            color: '#000',
                                            fontSize: "14px",
                                            height: "auto",
                                            maxHeight: "3.3em",  
                                            textAlign: 'left',
                                            padding: '10px',
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,  
                                            WebkitBoxOrient: 'vertical',
                                            whiteSpace: 'normal',
                                            lineHeight: '1.3em' 
                                        }}>
                                            {news.title}
                                        </h1>
                                    <p style={{ color: '#000', height: '15px', fontSize: '15px', textAlign: 'left', padding: '10px' }}>
                                        Tác giả: {news.author.fullName}
                                    </p>
                                    <p style={{ color: '#000', height: '15px', fontSize: '15px', textAlign: 'left', padding: '10px' }}>
                                        Ngày đăng: {news.publishedDate}
                                    </p>

                                </div>
                            </NavLink>
                        </div>
                    ))}

                </Slider>
            )}
        </CardProdNew>
    );
}

export default SaleProduct;
