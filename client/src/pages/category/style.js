import styled from "styled-components";


export const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  grid-auto-rows: minmax(min-content,max-content);
  grid-template-columns: repeat(auto-fit,minmax(0,1fr));
  overflow: hidden;
  height: auto;
  .card{
      width:100%;
      text-align: center;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      border-radius: 0px;
  }
  .img-fluid {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 50%;
    max-height: 50%
  }
  .img{
    max-width: 100%;
    max-height: 100%
  }
  .cate-name{
    height: 30%;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;    
    color: #000;
    text-transform: uppercase;
    font-weight: 500;
  } 
  .card:hover {
    transform: scale(1.1);
    z-index:1;
    background: #efefef;
  }

  @media screen and (max-width: 500px) {
      grid-template-columns: repeat(3,minmax(0,1fr));
      .card{
        max-height: 100px;
    }
      .cate-name{
        font-size: 12px;
      } 
  }
`