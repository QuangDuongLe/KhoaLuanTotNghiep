import styled from "styled-components";

export const WrapperDashboard = styled.div`
    .sum-box{
        display: grid;
        gap: 30px;
        grid-auto-rows: minmax(min-content,max-content);
        grid-template-columns: repeat(3,minmax(0,1fr));
    }
    .sum-box-item{
        border: 2px solid #5f2b89;
        padding: 10px;
        display: flex;
        border-radius: 20px;
        text-align: center;
        align-items: center;
        gap: 20px;
    }
    .sum-title{
        font-size: 15px;
    }
    .sum-quantity{
        font-size: 20px;
        color: #5f2b89;
    }
    .sum-box-left{
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }
    .sum-box-table{
        border: 2px solid #5f2b89;
        padding: 10px;
        border-radius: 20px;
    }
    p{
        font-weight:500;
    }
`