import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
const { Meta } = Card;

function NewsCard() {
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
            {newsData.map((news) => (
                <NavLink key={news._id} to={`/news/${news._id}`} >
                    <Card key={news._id} hoverable style={{ maxWidth: '20vw', minWidth: '20vw' }} cover={<img alt={news.title} src={news.image} />}>
                        <div>
                            <div style={{ wordWrap: 'break-word' }}>
                                <h5>{news.title}</h5>
                            </div>
                            <span>Tác giả: {news.author.fullName}</span>
                        </div>
                    </Card>
                </NavLink>
            ))}
        </>

    );
}

export default NewsCard;
