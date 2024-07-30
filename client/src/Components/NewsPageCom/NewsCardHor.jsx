import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const { Meta } = Card;

function NewsCardHor({ excludeId }) {
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
    }, []);

    return (
        <>
            {newsData.filter(news => news._id !== excludeId).map((news) => (
                <NavLink key={news._id} to={`/news/${news._id}`}>
                    <Card hoverable style={{ padding: '10px', borderRadius: '0px' }}>
                        <div style={{ display: "flex", gap: '10px' }}>
                            <img alt={news.title} src={news.image} style={{ maxWidth: '40%' }} />
                            <div className='desc'>
                                <div style={{ wordWrap: 'break-word' }}>
                                    <h5>{news.title}</h5>
                                </div>
                                <span>Tác giả: {news.author.fullName}</span>
                            </div>
                        </div>
                    </Card>
                </NavLink>
            ))}
        </>
    );
}

export default NewsCardHor;
