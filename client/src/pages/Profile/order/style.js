import styled from "styled-components";
import { Button, Row } from "antd";


export const WrapperBtn = styled(Button)`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
    white-space: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

export const WrapperDetailOrder = styled.div`
    display: flex;
    justify-content: center;
    .mainContainer{
        width: 80%; 
        padding: 10px;
    justify-content: center;
    }
    .container{
        display: flex; 
        flex-direction: column; 
        padding: 10px; 
        gap: 10px; 
        border: 1px solid #efefef; 
        borderRadius: 4px;
    }
    .pre-order{
        display: flex;
        padding: 10px; 
        width: 100%;
        border: 1px solid #efefef; 
        height: auto;
        flex-direction:row;
    }
    .img-con{
        width: 12.5%; 
        display: flex; 
        justify-content: center; 
        align-items: center;
    }
    .img-product{
        height: 100px; 
        width: 100px;
    }
    .inf-con{
        width: 87%; 
        padding: 5px;
    }
    @media screen and (max-width: 500px) {
        .mainContainer{
            width: 100%; 
        }
        .img-con{
            width: 25%; 
            align-items: start;
        }
        .inf-con{
            width: 75%; 
        }
    }
    .nav {
        display: flex;
        align-items: center;
        background-color: #fff;
        justify-content: space-between;
        top: 0;
        width: 100%;
        z-index: 10;
        flex-wrap: wrap;
        list-style: none;
    }
    .btn-back {
        border: none;
        background: transparent;
    }
    .img-product img{
        width: 100px;
        height: 100px;
    }
    .pagetitle{
        font-weight: bold;
        text-transform: uppercase; 
        display: flex; 
        align-items: center
    }
    .statusord {
        background: #14d9c5;
        font-weight: 600;
        color: #fff;
        border: 1px solid #efefef;
        border-radius: 4px;
        display: flex;
        padding: 12px 10px 0 10px;
    }
`
export const WrapperList = styled.div`
    .has-container{
        display: flex; 
        flex-direction: column; 
        padding: 10px; 
        gap: 10px;
    }
    .pre-order{
        padding: 10px 10px 0 10px; 
        border: 1px solid #ccc; 
        display: flex; 
        flex-direction: column;
    }
    .state{
        background: #C13346; 
        color: #fff; 
        padding: 10px; 
        text-align: right; 
        font-weight: 600; 
        border-radius: 4px 4px 0 0;
    }
    .pd-info{
        display: flex; 
        height: auto; 
        padding: 10px 10px 10px 0; 
        border: 1px solid #ccc; 
        border-radius: 0 0 4px 4px;
    }
    .order-img {
        width: 10%; 
        display: flex; 
        align-items: center; 
        justify-content: center;
    }
    .img-item {
        width: 100%; 
        height: auto;
    }
    .order-info{
        width: 90%;
    }
    .props{
        display: flex; 
        justify-content: space-between;
        width: 100%
    }
    .price{
        display: flex;
        gap:10px;
    }
    .total{
        padding: 10px; 
        display: flex; 
        justify-content: right; 
        align-items: center; 
        gap: 10px;
    }
    .tt-a{
        display: flex;
        gap: 10px; 
    }
    .btn-order{
        display: flex; 
        justify-content: right; 
        gap: 2px;
    }
    @media screen and (max-width: 500px) {
        .order-img {
            width: 25%;
        }
        .order-info{
            width: 75%;
        }
    
        .img-item {
            width: 100%; 
            height: auto;
        }
        .img-item img{
            width: 100px; 
            height: auto;
        }
        .price{
            flex-direction: column;
            gap:0px;
        }
        .total{
            text-align: right;
            display: grid;
        }
    }
`
export const WrapperTab = styled.div`    
    .tab-buttons {
        display: flex;
        width: 100%;
    }
    .active{
        background: #B63245;
        color: #fff;
    }
    @media screen and (max-width: 500px) {
        .tab-buttons {
            grid-template-columns: repeat(2,minmax(0,1fr));
        }
    }
`

export const WrapperUpdate = styled.div`
    display: flex;
    flex-direction: column;
`