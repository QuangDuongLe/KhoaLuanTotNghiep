import React, { useEffect, useState } from 'react';
import { Rate, Image } from 'antd';
import { WrapperRate } from './style';
import axios from 'axios';
const Rating = ({ productName }) => {
    const [ratingData, setRatingData] = useState([]);
    const [ratingDatas, setRatingDatas] = useState([]);
    const [starsFilter, setStarsFilter] = useState('');
    const [hasPicturesFilter, setHasPicturesFilter] = useState(false);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/product/getRating/${productName}?star=${starsFilter}&hasPictures=${hasPicturesFilter}`)
            .then((response) => {
                setRatingData(response.data.data);
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API', error);
            });
    }, [productName, starsFilter, hasPicturesFilter]);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/product/getRating/${productName}?star=''&hasPictures=false`)
            .then((response) => {
                setRatingDatas(response.data.data);
            })
            .catch((error) => {
                console.error('Lỗi khi gọi API', error);
            });
    }, [productName, starsFilter, hasPicturesFilter]);
    let totalRating = 0;
    let averageRating = 0;
    if (ratingDatas?.length > 0) {
        totalRating = ratingDatas.reduce((total, review) => total + review.rating, 0);
        averageRating = totalRating / ratingDatas.length;
    }
    const ratingCounts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    };

    ratingDatas.forEach((review) => {
        const rating = review.rating;
        ratingCounts[rating]++;
    });


    return (
        <WrapperRate>
            {ratingData &&
                <div className='boxReview'>
                    <h2 className='title is-6'>Đánh giá và nhận xét</h2>
                    <div className='boxReview-review is-flex'>
                        <div className='boxReview-score is-flex is-justify-content-center is-align-items-center has-product'>
                            <p className='title is-4 m-0 p-0'>{averageRating.toFixed(1)}/5.0</p>
                            <div className='item-star'>
                                <Rate className='stars' disabled allowHalf value={averageRating} />
                            </div>
                            <p className='boxReview-score__count'>
                                <strong>{ratingDatas.length}</strong> đánh giá
                            </p>
                        </div>
                        <div className='boxReview-star is-flex is-justify-content-space-evenly has-product'>
                            {Array.from({ length: 5 }, (_, index) => {
                                const rating = 5 - index;
                                const totalRating = ratingCounts[5] + ratingCounts[4] + ratingCounts[3] + ratingCounts[2] + ratingCounts[1];
                                return (
                                    <div className='rating-level is-flex is-align-items-center is-justify-content-space-evenly' key={rating}>
                                        <div className='star-count is-flex is-align-items-center'>
                                            <span className='has-text-weight-bold'>{rating}</span>
                                            <svg className="star-icon" xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 10 100 100">
                                                <polygon points="50,10 61.8,35.9 88.5,39.1 69.1,60.9 75,86 50,72 25,86 30.9,60.9 11.5,39.1 38.2,35.9" />
                                            </svg>
                                        </div>
                                        <progress max={totalRating} className='progress is-small m-0' value={ratingCounts[rating] || 0}></progress>
                                        <span className='is-size-7'>{ratingCounts[rating] || 0} đánh giá</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className='box-review-filter'>
                        <div className='title is-6'>Lọc theo</div>
                        <div className='filter-container is-flex'>
                            <div className={`filter-item ${starsFilter === '' ? 'active' : ''}`}>
                                <a onClick={() => setStarsFilter('')}>Tất cả</a>
                            </div>
                            <div className={`filter-item ${starsFilter === '5' ? 'active' : ''}`}>
                                <a onClick={() => setStarsFilter('5')}>5 sao</a>
                            </div>
                            <div className={`filter-item ${starsFilter === '4' ? 'active' : ''}`}>
                                <a onClick={() => setStarsFilter('4')}>4 sao</a>
                            </div>
                            <div className={`filter-item ${starsFilter === '3' ? 'active' : ''}`}>
                                <a onClick={() => setStarsFilter('3')}>3 sao</a>
                            </div>
                            <div className={`filter-item ${starsFilter === '2' ? 'active' : ''}`}>
                                <a onClick={() => setStarsFilter('2')}>2 sao</a>
                            </div>
                            <div className={`filter-item ${starsFilter === '1' ? 'active' : ''}`}>
                                <a onClick={() => setStarsFilter('1')}>1 sao</a>
                            </div>
                        </div>
                        <div className='filter-container is-flex'>
                            <div className={`filter-item ${hasPicturesFilter ? 'active' : ''}`}>
                                <a onClick={() => setHasPicturesFilter(!hasPicturesFilter)}>Có hình ảnh</a>
                            </div>
                        </div>
                    </div>
                    {ratingData.length > 0 ? (
                        ratingData.map((rating, index) => (
                            <div className='boxReview-comment' key={index}>
                                <div className='boxReview-comment-item'>
                                    <div className='boxReview-comment-item-title' style={{ display: 'flex', width:'100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' , width:'100%'}}>
                                            <div>
                                                <img className='avt' width={30} height={30} src={rating.user?.avatar} alt="Avatar" />&nbsp;
                                            </div>
                                            <div className='block-info' style={{ display: 'flex', justifyContent:'space-between'}}>
                                                <div className='block-info__name'>
                                                    <span className='name' style={{ fontSize: '15px', fontWeight: 600 }}>{rating.user.fullName}&nbsp;</span>
                                                </div>
                                                <div className='date-time'>
                                                    {rating?.createDate}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='boxReview-comment-item-review'>
                                        <div className='item-review-rating'>
                                            <div className='item-review-rating__star'>
                                                <Rate className='rv-stars' disabled allowHalf value={rating.rating} />
                                            </div>
                                        </div>
                                        <div className='item-review-comment'>
                                            <div className='comment-content'>
                                                <p style={{ maxWidth: '100%', fontSize: '15px' }}>
                                                    {rating.comment}
                                                </p>
                                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} className='img-rate'>
                                                    {rating.pictures.map((picture, index) => (
                                                        <Image src={picture} alt={`Hình ảnh ${index + 1}`} key={index} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='boxReview'>
                            <p>Chưa có đánh giá nào.</p>
                        </div>
                    )}
                </div>
            }
        </WrapperRate>
    );
}
export default Rating;