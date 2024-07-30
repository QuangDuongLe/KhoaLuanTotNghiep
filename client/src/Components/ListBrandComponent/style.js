import styled from "styled-components"
export const WrapperBrandList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    
    .list-brand-item{
        align-item: center;
        border: 1px solid #ccc;
        border-radius: 4px;
        display: flex;
        height: 34px;
        align-items: center;
        justify-content: center;
        padding:  0 10px 0 10px;
        margin-top: 10px;
        min-width: 120px;
    }
    .list-brand-item a{
        color: #B63245;
        cursor: pointer;
    }
    .list-brand-item .brand-img {
        height: 50%;
    }
   .list-brand-item .brand-img img{
        height: auto;
        max-width: 100%;
    }
    .list-brand-item.bordered {
        border: 1px solid #B63245;
      }
    @media screen and (max-width: 500px) {
        .list-brand-item{
            height: 30px;
            margin: 5px;
        }
    }


`