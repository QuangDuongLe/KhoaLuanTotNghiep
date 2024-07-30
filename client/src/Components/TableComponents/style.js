import styled from "styled-components";

export const WrapperInvoice = styled.div`
    padding: 10px;
    max-width: 210mm; 
    margin: 0;
    padding: 10px; 
    font-family: Times;
    .header-in{
        display: flex;
    }
    .sign{
        display: flex;
        flex-direction: column;
        text-align: center;
    }
    .logo{
        width: 20%;
        display: flex;
        align-items: center;
    }
    .logo-img{
        width: 100%;
    }
    .inf{
        font-size: 15px;
        width: 100%;
        display: flex;
        flex-direction: column;
        text-align: left;
        margin-left: 20px;
    }
    .body-inf{
        width: 100%;
        display: flex;
        flex-direction: column;
        text-align: left;
    }
    
`
export const WrapperWarranty = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    //background: #FDE2B2;
    .title{
        padding-top: 20px;
        text-align: center;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 30px;
        margin:0;
    }
    .radio-box{
        font-size: 15px;
        width: 60%;
        display: flex;
        padding: 20px;
        justify-content: center;
    }
    .input-box{
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .table{
        padding: 20px;
    }
    .btn-back{
        align-items: flex-end;
        display: flex;
        height: 2.875rem;
        color: #C13346;
        cursor: pointer;
        font-size: 1.25rem;
        text-transform: capitalize;
        margin-bottom: 0.12rem;
    
    }
`