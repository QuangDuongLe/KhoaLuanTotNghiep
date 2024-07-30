import styled from "styled-components";

export const WrapperPaymentInfo = styled.div`
    .nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        gap: 10px;
        left: 0;
        margin-bottom: 10px;
        padding: 5px 15px 10px;
        top: 0;
        width: 100%;
        z-index: 10;
        flex-wrap: wrap;
        list-style: none;
    }
    .cus-inf{
        display: flex;
        gap: 5px;
    }
    .cascader{
        width: 100%;
    }
    .cus-infor{
        width: 50%;
    }
    .custom-dropdown{
        max-width: 100%
    }
    @media screen and (max-width: 500px) {
        .cus-inf{
            flex-direction: column;
            gap: 0px;
        }
        .cus-infor{
            width: 100%;
        }

    
    }

    .btn-back {
        border: none;
        background: transparent;
    }
    .nav__item2{
        border-bottom: 3px solid #d70018;
        color: #d70018;
        flex: 1;
        font-weight: 600;
        padding: 5px 0;
        text-transform: uppercase;
        display: flex;
        justify-content: center;
    }
    .view-list{
        background-color: #fff;
        border: 1px solid rgba(145,158,171,.239);
        border-radius: 10px;
        padding: 5px 15px 0;
        width: 100%;
    }
    .view-list__wrapper{
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .item{
        border-bottom: 0 solid rgba(145,158,171,.24);
        display: flex;
        gap: 15px;
        overflow: hidden;
        padding: 12px 0;
        transition: .2s ease-in-out;
        width: 100%;
    }
    .item__img{
        height: 100px;
        width: 100px;
        flex-shrink: 0;
    }
    img {
        display: block;
        height: auto;
        max-width: 100%;
        vertical-align: middle;
    }
    .item-info {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 5px;
    }
    .item-name {
        color: #111;
        font-size: 15px;
        font-weight: 500;
        display: flex;
        flex-direction: column;
    }
    .item-price {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    @media screen and (max-width: 500px) {
        .item-price {
            align-items: flex-start;
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            justify-content: space-between;
            font-size: 13px;
        }
        .product__price--show{
            font-size: 14px;
        }
        .product__price--through {
            font-size: 11px;
        }
    
    }
    .box-info__box-price {
        align-items: flex-end;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    .product__price--show {
        color: #d70018;
        display: inline-block;
        font-size: 17px;
        font-weight: 500;
        line-height: 1;
    }
    .product__price--through {
        color: #707070;
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
        position: relative;
        -webkit-text-decoration: line-through;
        text-decoration: line-through;
        top: 2px;
    }
    .block-customer{
        background-color: #fff;
        border: 1px solid rgba(145,158,171,.239);
        border-radius: 10px;
        padding: 15px;
    }
    .block-customer p{
        text-transform: uppercase;
    }
    .picking-address{
        background-color: #fff;
    }
    .bottom-bar{
        background-color: #fff;
        border: 1px solid rgba(145,158,171,.239);
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        box-shadow: 0 -4px 20px -1px rgba(40,124,234,.15);
        width: 100%;
        padding: 10px 10px 20px;
        margin-top: auto;
        margin-left: auto;
        margin-right: auto;
    }
    .total-box{
        align-items: flex-start!important;
        justify-content: space-between!important;
        display: flex!important;
    }
    .price{
        align-items: flex-end!important;
        column!important;
        display: flex!important;
    }
    .total {
        color: #d70018;
    font-weight: 700;
    }
    .btn-submit {
        margin-top: 0.5rem!important;
    }
    .btn-next {
        background-color: #d70018;
        font-weight: 500;
        cursor: pointer;
        width: 100%!important;
        align-items: center!important;
        justify-content: center!important;
        flex-direction: column!important;
        display: flex!important;
        border-color: #dc3545;
        color: #fff;
        border: 1px solid transparent;
        text-transform: uppercase;
    }
    .info-payment{
        background-color: #fff;
        border: 1px solid rgba(145,158,171,.239);
        border-radius: 10px;
        padding: 15px;
    }
    .block-promotion{
        display: flex;
        justify-content: space-between;
    }
    .button-vou{
        width: 30%;
        display: flex;
        justify-content: center;
    }

    .button__voucher{
        width: 90%;
    }
    .info-quote{
        margin-top: 5px;
        width: 100%;
    }
    .info-quote__block{
        border-bottom: 1px solid #e8e8e8;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 15px 0;
    }
    .quote-block__item{
        align-items: flex-start;
        display: flex;
        gap: 20px;
        justify-content: space-between;
    }
    .quote-block__title{
        color: #7c8691;
        flex-shrink: 0;
        font-size: 15px;
        font-weight: 400;
    }
    .quote-block__value {
        color: #212b36;
        font-size: 16px;
    }
    .info-quote__bottom{
        align-items: flex-start;
        display: flex;
        gap: 20px;
        justify-content: space-between;
        padding: 20px 0 0;
        width: 100%;
    }
    .quote-bottom__title {
        color: #111;
        font-weight: 600;
    }
    .info-quote__bottom .quote-bottom__value{
        color: #111;
        font-size: 16px;
        font-weight: 600;
    }
    .payment-quote{
        background-color: #fff;
        border: 1px solid rgba(145,158,171,.239);
        border-radius: 10px;
        padding: 15px;
    }
`
export const PageWrapper = styled.div`
    background: #efefef;
    display: flex;
    justify-content: center;
    .container{
        width: 60%;
    }
    @media screen and (max-width: 500px) {
        .container{
            width:100%;
        }
    }

`