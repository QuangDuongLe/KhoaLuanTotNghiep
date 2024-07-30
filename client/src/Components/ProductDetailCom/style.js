import { Col, Image, InputNumber, Row, Table } from "antd";
import styled from "styled-components";
import ButtonComponent from "../../Components/ButtonComponent/ButtonComponent";
import Slider from 'react-slick';


export const WrapperStyleImageBig = styled.div`
display: flex;
justify-contents: center;
    .slider-image {
        display: block;
        object-fit: contain;
        max-width: 100%;
        height: 400px;
    }
    .slider-image img{
        width: auto;
        height: 400px;
    }
`
export const WrapperStyleImageSmall = styled(Image)`
    height: 100px;
    width: 100px;
`

export const WrapperStyleColImage = styled(Col)`
    flex-basis: unset;
    display: flex;
`
export const WrapperStyleTextSell = styled.div`
    padding-top: 5px;
    width: 100%;
    p {
        font-size: 15px;
        margin: 0;
    }
`

export const WrapperPriceTextProduct = styled.span`
    font-size: 25px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: 500;
    color: #B63245
`

export const WrapperAddressProduct = styled.div`
    span.address{
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsisl;
    };
    span.change-address{
        color: rgb(11,116,229);
        font-size:  16px;
        line-height: 24px;
        font-weight: 500;
    }
`
export const WrapperQuantityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    border-radius: 4px;
    border: 1px solid #ccc;
    width: 120px;
    .ant-input-number-handler-wrap {
        display: none;
      }
`

export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 40px;
        border-top: none;
        border-bottom: none;
        border-radius: 0;
        &.ant-input-number-handler-wrap {
            display: none !important;
        }
    }
`

export const WrapperPropTable = styled(Table)`
    overflow-y: hidden;
`
export const WrapperSeeMore = styled.div`
    padding-top: 30px;
    color: #0492c2;
`
export const WrapperDesc = styled.div`
    .product-description {
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
    .product-description p{
        margin: 0;
    }
    .product-image {
        max-width: 100%;
        height: auto;
        width: auto;
      }
`

export const WrapperButton = styled(Col)`
      .btn {
        background: #fff;
        color: #B63245;
        border: 1px solid #B63245;
      }
      .btn:hover {
        background: #B63245;
        color: #fff;
      }
      
`
export const WrapperTextBox = styled(Col)`
      .textbox {
        border-radius: 5px;
        border: 1px solid #ccc;
        transition: .5s ease-in-out;
        padding: 10px;
    }
`
export const WrapperInfo = styled(Row)`
    .nameinput {
        border-radius: 5px;
        border: none;
        transition: .5s ease-in-out;
        margin-right: 20px;
        padding: 10px;
        box-shadow: 0 1px 2px 0 rgba(60,64,67,.1), 0 2px 6px 2px rgba(60,64,67,.15);
        width: auto;
        
    }
    .label {
        font-size: 14px;
    }
    .checkbox{
        margin-left: 7px;
        box-shadow: 0 1px 2px 0 rgba(60,64,67,.1), 0 2px 6px 2px rgba(60,64,67,.15);

    }
`
export const WrapperComment = styled(Row)`
    .singlecmt .name{
        margin-bottom:0px;
        color: #B63245;
        font-weight: '700'
    }
    .singlecmt .content{
        font-size: 15px;
        margin-bottom:2px;
        font-style: italic;
    }
    .singlecmt button{
        background: white;
        border: none;
        margin-left:10px;
        
    }
`
export const WrapperCommentNew = styled.div`
    width:65%;
    .comment-container {
        background-color: #f9fafb;
        border-radius: 10px;
        box-shadow: 0 1px 2px 0 rgba(60,64,67,.1), 0 2px 6px 2px rgba(60,64,67,.15);
        margin-top: 15px;
        padding: 10px;
        width: 100%;
        position: relative;
        overflow: hidden;
        transition: max-height 0.3s ease;

    }
    .comment-container.expanded {
        max-height: none; 
    }

    .show-more, .show-less {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        background: linear-gradient(to top, white, rgba(255, 255, 255, 0));
        cursor: pointer;
        padding: 10px 60px;
    }

    .error-msg {
        color: red;
        font-size: 14px;
        margin-top: 4px;
      }
    .comment-form{
        display: block;
    }
    .comment-container .comment-form-content {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .comment-container .textarea-comment {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        position: relative;
        width: 100%;
    }
    .comment-container .textarea-comment .icon-img {
        left: 10px;
        top: 10%;
        position: absolute;
        z-index: 1;
    }
    .comment-container .textarea-comment .icon-img img{
        height: auto;
        max-width: 100%;
    }
    .comment-container .textarea-comment .textarea {
        border: 0;
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgba(60,64,67,.1), 0 2px 6px 2px rgba(60,64,67,.15);
        min-width: 0!important;
        padding-left: 85px;
        width: calc(100%-80px);
    }
    .textarea:not([rows]) {
        max-height: 40em;
        min-height: 8em;
    }
    .textarea {
        display: block;
        max-width: 100%;
        padding: calc(.75em - 1px);
        resize: vertical;
        vertical-align: top;
        position: relative;
        line-height:1.5;
        font-size: 1rem;
        font-family: sans-serif!important;
    }
    .btn-send {
        background-color: #B63245;
        border: 0;
        color: #fff;
        gap: 5px;
        width: 100px;
        cursor: pointer;
        justify-content: center;
        padding: calc(.5em - 1px) 1em;
        text-align: center;
        white-space: nowrap;
        align-items: center;
        line-height: 1.5;
        display: inline-flex;
        font-size: 1rem;
        font-family: sans-serif!important;
        height: 40px;
        border-radius: 5px;
        margin-left: 20px;
    }
    
    .comment-container .block-comment-list {
        display: block;
    }
    .comment-container .list-comment{
        display: block;
    }
    .box-cmt {
        margin-bottom: 15px;
        display: block;
    }
    .cmt-inf {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        margin-top: 10px;
    }
    .box-inf{
        align-items: center;
        display: flex;  
    }
    .box-inf .box-inf-avt span{
        background-color: #4f5675;
        color: #fff;
        align-items: center;
        border-radius: 50%;
        display: flex;
        font-size: 16px;
        font-weight: 700;
        height: 25px;
        justify-content: center;
        margin: 0 5px 0 0;
        text-transform: capitalize;
        width: 25px;
    }

    .box-inf .box-inf-name {
        font-size: 14px;
        font-weight: 700;
        line-height: 2;
        margin: 0;
        text-transform: capitalize;
    }
    .cmt-quest {
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 1px 2px 0 rgba(60,64,67,.1), 0 2px 6px 2px rgba(60,64,67,.15);
        margin-left: auto;
        overflow: hidden;
        padding: 10px;
        width: calc(100% - 25px);
        display: block;
    }
    .cmt-quest .content{
        font-size: 13px;
        margin: 0;
        font-family: sans-serif!important;
    }
    .btn-rep {
        align-items: center;
        background-color: transparent;
        border: 0;
        color: #B63245;
        cursor: pointer;
        display: flex;
        font-size: 14px;
        line-height: 1;
        margin-left: auto;
        margin-top: 10px;
        -webkit-text-decoration: none;
        text-decoration: none;
    }
    .cmt-rep {
        margin-left: auto;
        margin-top: 15px;
        width: calc(100% - 25px);
    }
    @media screen and (max-width: 500px) {
        width: 100%;
    }
`
export const WrapperDetail = styled.div`
    .slider {
        height: 400px;
        align-items: center;
        justify-contents: center;
    }
    .product-name {
        width:100%
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;
        font-size: 16px;
        gap: 20px;
        background: #fff;
    }
    .product-pick {
        padding: 16px;
        background: #fff;
        border-radius: 4px;
    }
    .slider-col {
        width:58%;
        border: 1px solid #e5e5e5;
        padding: 8px;
    }
    .pick-col{
        width:42%;
        padding-left:10px;
    }
    .name-row{
        margin-bottom: 10px;
    }
    .rate-ave{
        display:flex;
        align-items: center;
        margin:0;
        gap:20px;
        margin-top: 10px;
    }
    .slick-prev, .slick-next {
        z-index: 10; /* Điều chỉnh giá trị của z-index tùy theo nhu cầu */
        position: absolute;
        background-color: black;
        opacity: 50%;  
        height: 50px;
        width: 40px;
        align-items: center;
        justify-content: center;
        display: flex;
    }
    .slick-prev::before,

.slick-prev::before {
    content: "<"; /* Ký tự muốn sử dụng cho mũi tên trước */
    font-size: 24px;
    font-weight: 900;
    color: white; /* Kích thước của ký tự */
}

.slick-next::before {
    content: ">"; /* Ký tự muốn sử dụng cho mũi tên sau */
    font-size: 24px; /* Kích thước của ký tự */
}

    .slick-prev {
        left: 0;
    }
    .slick-next {
        right: 0;
    }
    .btn-color{
        display: flex;
        flex-wrap: wrap;
        row-gap: 5px;
    }
    .policy-col{
        width:58%;
        border: 1px solid #e5e5e5;
        padding: 8px
    }
    .sale-col {
        width: 42%;
        padding-left: 10px;
    }
    .des-col{
        width: 66%;
        border: 1px solid #e5e5e5; 
        padding: 10px; 
        border-radius: 4px; 
    }
    .prop-col {
        width: 34%;
        border: 1px solid #e5e5e5; 
        padding-left: 10px; 
        border-radius: 4px; 

    }
    @media screen and (max-width: 500px) {
        .product-pick{
            display: flex;
            flex-direction: column;
        }
        .product-name {
            flex-direction: column;
        }
        .slider-col {
            width:100%;
        }
        .policy-col{
            width: 100%;
        }
        .slider-image {
            height: 200px;
        }
        .slider-image img{
            height: 200px;
        }
        .slider {
            height: 200px;
        }
        .pick-col{
            width: 100%;
            padding-left:0px;
        }
        .button-row{
            display: flex;
        }
        .sale-col {
            width: 100%;
            padding-left: 0px;
        }
        .des-col{
            width:100%;
        }
        .prop-col {
            width:100%;
            padding-left: 0;
            margin-top: 10px;
        }
      }
    
    
`
export const WrapperPolicy = styled(Row)` 
    .policy_intuitive {
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        margin-bottom: 25px;
    }

    .policy {
        margin: 20px 16px 0 16px;
        padding: 12px 0;
    }
    .policy__list{
        display: flex;
        flex-wrap: wrap;
        list-style: none;
    }
    .policy-item{
        padding-right: 20px;
        border-bottom: 1px solid #f1f1f1;
        position: relative;
        padding: 12px 0 12px 35px;
        width: 50%;
    }
    .policy__list p{
        line-height: 20px;
        padding-left: 5px;
    }
    @media screen and (max-width: 500px) {
        .policy {
            margin: 0;
            padding: 10px;
        }
        .policy-item {
            width:100%;
            padding-right: 0px;
        }
    }

`
export const WrapperRate = styled.div`
width: 100%;
    .boxReview{
        border-radius: 10px;
        box-shadow: 0 1px 2px 0 rgba(60,64,67,.1), 0 2px 6px 2px rgba(60,64,67,.15);
        margin-bottom: 15px;
        padding: 1rem;
        width: 100%;
        background: #fff;
    }
    .title.is-6 {    
        font-size: 1rem;
    }
    .boxReview .boxReview-review {
        border-bottom: 1px solid #e5e7eb;
        height: auto;
        margin-bottom: 20px;
        overflow: hidden;
        padding-bottom: 20px;
        display: flex!important;
        width: 100%;
    }

    .boxReview .boxReview-review .boxReview-score{
        border-right: 1px solid #e5e7eb;
        flex-direction: column;
        margin-right: 5%;
        width: 40%;
        display:flex;
        align-items: center!important;
        justify-content: center!important;
    }
    .title{
        font-size: 1.5rem;
    }
    .boxReview .boxReview-review .boxReview-score .boxReview-score__count{
        color: #0c53b7;
        text-decoration: underline;
    }
    .boxReview .boxReview-review .boxReview-star{
        flex-direction: column;
        width: 100%;
        display: flex;
        justify-content: space-evenly!important;
    }
    .star-icon{
        fill: #FFD700
    }
    .rating-level{
        display: flex!important;
        align-items: center!important;
        justify-content: space-evenly!important;
    }
    .boxReview-star progress{
        border-radius: 5px;
        height: 8px;
        width: 70%;
    }
      
      progress::-moz-progress-bar {
        background: #ccc;
      }
      
      progress::-webkit-progress-value {
        background: #B63245;
      }
      
      progress::-webkit-progress-bar {
        background: #ccc;
      }
      
    .boxReview .box-review-filter{
        margin-top: 10px;
    }
    .box-review-filter .title{
        font-size: 20px;
        margin-bottom: 10px;
        font-weight: 600;
    }
    
    .filter-container {
        gap: 10px;
        margin-bottom: 10px;
        overflow: auto;
        width: 100%;
        display: flex;!important;
    }
    .filter-item.active{
        background-color: #B63245;
        border: none;

    }
    .filter-item.active a{
        color: #fff;
        
    }
    .filter-item{
        align-items: center;
        background-color: #fff;
        border: 1px solid #B63245;
        border-radius: 15px;
        color: #B63245;
        cursor: pointer;
        display: flex;
        font-size: 14px;
        gap: 10px;
        padding: 3px 12px;
        white-space: nowrap;
    }
    .boxReview-comment {
        margin: 30px 0 15px;
        width: 100%;
    }
    .boxReview-comment-item {
        border-bottom: 1px solid rgba(145,158,171,.239);
        margin-bottom: 15px;
        padding-bottom: 15px;
    }
    .avt img{
        width: 60px;
        height: 60px;
    }
    .block-info__name{
        align-items: center;
        display: flex;
        gap: 15px;
    }
    .date-time{
        align-items: center;
        color: #707070;
        display: flex;
        font-size: 12px;
        gap: 5px;
        padding-top: 3px;
        text-align: right;
    }
    .boxReview-comment-item-review {
        margin-left: 40px;
        padding: 10px 15px 0 0;
        width: calc(100% - 40px);
    }
    .item-review-rating {
        align-items: center;
        flex-wrap: wrap;
        font-size: 12px;
        display: flex;
        gap: 10px;
        align-items: center;
    }
    .item-review-comment {
        font-size: 12px;
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
    }
    .comment-content {
        width: 100%;
    }
    .boxReview-comment-item-review {
        margin-left: 40px;
        padding: 10px 15px 0 0;
        width: calc(100% - 40px);
    }
    .boxReview-comment-item {
        border-bottom: 1px solid rgba(145,158,171,.239);
        margin-bottom: 15px;
        padding-bottom: 15px;
    }
    .img-rate{
        width: 100%;
        height: 100%;
      }
      .img-rate img{
        width: 100px;
        height: auto;
      }
    .rv-stars{
        font-size: 16px;
        align-items: center;
        display: flex;
        margin:0;
    }
    @media screen and (max-width: 500px) {
        .boxReview{
            width: 100%;
        }
        .boxReview-star progress{
            width: 50%;
        }
        .title{
            font-size: 1rem;
        }
        .stars {
            font-size: 10px;
        }
        .boxReview .boxReview-review .boxReview-score .boxReview-score__count{
            font-size: 11px;
        }
        .rv-stars{
            font-size: 12px;
        }
    
    }

`
export const TitleWrapper = styled.div`
    background: #fff;
    padding: 10px;
    border-radius:  8px 8px 0 0;
    p {
        font-size: 20px;
        font-weight: 500;
        margin: 0;
    }
`

export const WrapperSlider = styled(Slider)`
    width: 100%;
    background: #fff;
    display: grid;
    grid-auto-rows: minmax(min-content,max-content);
    grid-template-columns: repeat(auto-fit, minmax(0,1fr));
    align-items: center;
    justify-content: space-between; 
    overflow: hidden;
    border-radius: 0 0 8px 8px;
    padding: 10px;
    .box {
        background: #fff;
        text-align: center;
        transition: .3s ease-in-out;
        border: 1px solid #efefef;
        height: 100%;
        border-radius: 4px;
        border-bottom: 1px solid #f3f3f3 !important;
        border-right: 1px solid #f3f3f3 !important;    
    }
    .box:hover{
        transform: scale(1);
        z-index:1;
        box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
      }
   .card {
        padding: 10px 15px 20px;
        overflow: hidden;
        width: 100%;
        height: 100%;
    }
  .card .image {
    padding: 5%;
    width:100%;
    position: relative;
  }

  .card .image:hover img {
    transform: scale(1.1);
    z-index:1;
  }

  .card .image img {
    width: 100%;
    transition: .3s ease-in-out;
    cursor: pointer;
  }

  .card .desc {
    width: 100%;
    margin: auto;
    line-height: 3;
    height: 15em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal
  }

  .card .desc h1 {
    font-size: 15px;
    text-transform: uppercase;
  }

  .card .desc p {
    font-size: 12px;
  }

  .card span {
    font-size: 15px;
  }
  .box .btn,
  .box .card .image::before {
    background: #B63245;
  }

    .box .card p {
    color: #B63245;
    font-size: 15px;
  }


  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(auto-fit, minmax(0,1fr));
}

`


