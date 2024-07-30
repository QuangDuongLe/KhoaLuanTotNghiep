import styled from "styled-components";

export const WrapperContainer = styled.div`

    height: 88vh; 
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items:center;
    
    .notice {
        font-size: 2.5rem; 
        color: #ff3300;
        text-align: center;
    }
    .content {
        width: 60%;
        font-size: 1.5rem;
        text-align: center;
    }
    
    @media screen and (max-width: 500px) { 
        .notice {
            font-size: 1.5rem; 
        }
        .button{
            flex-direction: column; 
            justify-content: center; 
        }
        .content {
            width: 100%;
            padding: 5px;
            font-size: 1rem;;
        }
    
    }

`