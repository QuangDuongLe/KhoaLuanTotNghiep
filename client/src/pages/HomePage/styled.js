import { Row } from "antd";
import styled from "styled-components";
import ButtonComponent from "../../Components/ButtonComponent/ButtonComponent";

export const WrapperHomePage = styled.div`
  width: 100%;
  height:100%;
  overflow: hidden;
  overflow-x: hidden
  font-family: Palatino, sans-serif;
  background: #eee;
  .cate-bound{
    background: #B63245;
    padding: 10px;
    border-radius: 4px;

  }
  
`
export const WrapperHome = styled.div`
display: flex;
flex-direction: column;
align-items: center;
background: #eee;
width: 80%;

.first-containter{
  display: flex;
  justify-content: center; 
  background: #eee; 
  width: 100%; 
  gap: 10px; 
  margin-top: 1%;
  height: 10%;
}
.menu-tab{
  flex: 1;
  width: 20%;
  background: #fff;
  border-radius: 4px;
}
.banner-tab {
  width: 80%;
  border-radius: 4px;

}
@media screen and (max-width: 1200px) {
  width: 90%;

  .first-containter {
    flex-direction: column;
  }
  .menu-tab{
    width: 100%;
  }
  .banner-tab {
    width: 100%;
  }
`

export const WrapperNa = styled.div`
display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-start;
    color: #fff;
    font-size: 12px; 
    font-weight: bold; 
    height: 40px;
`

export const CardContainer = styled.div`
//   width: 100%; /* Chiều rộng tùy thuộc vào phần tử cha */
//   padding-top: 100%; /* Tỉ lệ 4:3 */
  position: relative;
  display: flex;

`;

export const CardContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

`;

export const WrapperCard = styled.div`
  *{
    margin: 0;
    padding: 0;
  }
  .imgtt {
    border-radius: 8px 8px 0 0;
  }
  .title {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    font-size: 24px;
    color: #fff;
    padding: 10px;
    text-transform: uppercase;
    font-family:Helvetica, Arial,  sans-serif;
    text-align: center;
    border-radius: 4px;
  }
  .name{
    padding: 5px; 
    text-overflow: ellipsis;
    max-width: 100%; 
    overflow: hidden;
    white-space: nowrap;
    }
  .mainContainer {
    width:100%;
    background-image: linear-gradient(to left, #FE9100,  #F29600);
    display: grid;
    grid-auto-rows: minmax(min-content,max-content);
    grid-template-columns: repeat(6,minmax(0,1fr));
    overflow: hidden;
    padding: 20px;
    border-radius: 0 0 8px 8px;
    gap: 2px;
  }
  .mainContainerAcc {
    width:100%;
    background-image: linear-gradient(to left, #5f2b89,  #5f2b89);
    display: grid;
    grid-auto-rows: minmax(min-content,max-content);
    grid-template-columns: repeat(6,minmax(0,1fr));
    overflow: hidden;
    padding: 20px;
    border-radius: 0 0 8px 8px;
    gap: 2px;
  }

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
  }
  .mainContainer .box:hover {
    box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
  }
  .mainContainerAcc .box:hover {
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
  .memory-button.selected {
    border: 1px solid #00BFFF	;
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

  .btn {
    width: 100%;
    padding: 12px 33px;
    margin-top: 15px;
    border: none;
    color: #fff;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
  }

  .box .btn,
  .box .card .image::before {
    background: #ff3300;
  }

    .box .card p {
    color: #ff3300;
    font-size: 15px;
  }

  button#show-more {
    background: #fff;
    color: #ff3300;
    padding: 10px 20px;
    cursor: pointer;
    margin: 0 auto;
    display: block;
    transition: .3s ease-in-out;
    border-radius: 5%;
    font-size:15px;
    border: 1px #000;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
  
  button#show-more:hover {
    background: #ff3300;
    color: #fff;
    border:none
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
  @media screen and (max-width: 1100px) {
    .mainContainer {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(6,minmax(0,1fr));
      gap: 2px;
    }
    .mainContainerAcc {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(6,minmax(0,1fr));
      gap: 2px;
    }
    .box {
      background: #fff;
      text-align: center;
      transition: .3s ease-in-out;
      border: 1px solid #efefef;
      height: 100%;
      width:100%;
    }
    .card .image img {
      width: 100%;
      transition: .3s ease-in-out;
    }
    .card .image {
      height: auto;
      position: relative;
    }
    .card .desc h1 {
      font-size: 11px;
    }
    .memory-button span{
      font-size: 11px;
    }
    .name{
    }
  }
  @media screen and (max-width: 900px) {
    .mainContainer {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(3,minmax(0,1fr));
      gap: 2px;
    }
    .mainContainerAcc {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(3,minmax(0,1fr));
      gap: 2px;
    }
  }
  @media screen and (max-width: 500px) {
    .mainContainer {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 2px;
    }
    .mainContainerAcc {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 2px;
    }
  }
`
export const WrapperCardProd = styled.div`
  .contain{
    display: flex;
    flex-wrap: wrap; 
    gap: 10px; 
    justify-content: center;
    align-items: center;
  
  }
  .name{
    padding: 5px; 
    text-overflow: ellipsis;
    max-width: 100%; 
    overflow: hidden;
    white-space: nowrap;
    }
    .card-wrapper {
      margin-right: 16px; /* Điều chỉnh khoảng cách này tùy theo nhu cầu của bạn */
    }
    .slick-slide {
      padding: 15px; /* Bạn có thể điều chỉnh giá trị padding để tăng khoảng cách giữa các slide */
      background: #B63245;
    }
  .card {
    background: #fff;
    text-align: center;
    transition: .3s ease-in-out;
    border: 1px solid #efefef;
    height: 350px;
    width: 200px;
    border-radius: 4px;
    border-bottom: 1px solid #f3f3f3 !important;
    border-right: 1px solid #f3f3f3 !important;
  }
  .div-img{
    margin-top: 20px;
  }
  .card:hover{
    transform: scale(1);
    z-index:1;
  }

  .card {
    padding: 10px 15px 20px;
    overflow: hidden;
    width: 200px;
    height: auto;
    border-radius: 0;
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
  .memory-button.selected {
    border: 1px solid #00BFFF	;
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

  .btn {
    width: 100%;
    padding: 12px 33px;
    margin-top: 15px;
    border: none;
    color: #fff;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
  }

  .card .btn,
  .card .image::before {
    background: #ff3300;
  }

  .card p {
    color: #ff3300;
    font-size: 15px;
  }

  button#show-more {
    background: #fff;
    color: #ff3300;
    padding: 10px 20px;
    cursor: pointer;
    margin: 0 auto;
    display: block;
    transition: .3s ease-in-out;
    border-radius: 5%;
    font-size:15px;
    border: 1px #000;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
  
  button#show-more:hover {
    background: #ff3300;
    color: #fff;
    border:none
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
  @media screen and (max-width: 1100px) {
    .mainContainer {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(6,minmax(0,1fr));
      gap: 2px;
    }
    .mainContainerAcc {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(6,minmax(0,1fr));
      gap: 2px;
    }
    .box {
      background: #fff;
      text-align: center;
      transition: .3s ease-in-out;
      border: 1px solid #efefef;
      height: auto;
    }
    .card .image img {
      width: 100%;
      transition: .3s ease-in-out;
    }
    .card .image {
      height: auto;
      position: relative;
    }
    .card .desc h1 {
      font-size: 11px;
    }
    .memory-button span{
      font-size: 11px;
    }
  }
  @media screen and (max-width: 900px) {
    .mainContainer {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(3,minmax(0,1fr));
      gap: 2px;
    }
    .mainContainerAcc {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(3,minmax(0,1fr));
      gap: 2px;
    }
  }
  @media screen and (max-width: 500px) {
    .mainContainer {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 2px;
    }
    .mainContainerAcc {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 2px;
    }
  }
`

export const WrapperButtonMore = styled(ButtonComponent)`
  &:hover {
    color:#fff;
    background: #ff3300
    span {
      color: #fff;
    }
  }
  width: 100%;
  text-align: center;
`

export const CardProd = styled.div`
  .contain{
    display: flex;
    flex-wrap: wrap; 
    gap: 10px; 
    justify-content: center;
    align-items: center;
  
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
.item-label{
  height: 22px;
  text-align: left;
  margin: 10px 0 10px 10px;
}
.lb-dis {
  background-color: #980300;
  color: #fff;
  font-weight: 400;
}
.lb-dis span{
    font-size: 5px;
}
.item-label span {
  border-radius: 8px;
  display: inline-block;
  padding: 4px 8px;
  text-align: left;
}

  .name{
    margin-top:10px;
    padding: 0 10px; 
    text-overflow: ellipsis;
    max-width: 100%; 
    overflow: hidden;
    white-space: nowrap;
    color: #000;
    }
    .card-wrapper {
      margin-right: 16px; /* Điều chỉnh khoảng cách này tùy theo nhu cầu của bạn */
    }
    .slick-slide {
      padding: 5px; /* Bạn có thể điều chỉnh giá trị padding để tăng khoảng cách giữa các slide */
      background: #B63245;
  
    }
  .card {
    background: #fff;
    text-align: center;
    transition: .3s ease-in-out;
    border: 1px solid #efefef;
    height: auto;
    min-height: 350px;
    width: 100%;
    border-bottom: 1px solid #f3f3f3 !important;
    border-right: 1px solid #f3f3f3 !important;
  }
  .div-img{
    margin-top: 20px;
  }
  .card:hover{
    transform: scale(1);
    z-index:1;
  }

  .card {
    overflow: hidden;
    height: auto;
    border-radius: 0;
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
  .memory-button.selected {
    border: 1px solid #00BFFF	;
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

  .btn {
    width: 100%;
    padding: 12px 33px;
    margin-top: 15px;
    border: none;
    color: #fff;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
  }

  .card .btn,
  .card .image::before {
    background: #ff3300;
  }

  .card p {
    color: #ff3300;
    font-size: 15px;
  }

  button#show-more {
    background: #fff;
    color: #ff3300;
    padding: 10px 20px;
    cursor: pointer;
    margin: 0 auto;
    display: block;
    transition: .3s ease-in-out;
    border-radius: 5%;
    font-size:15px;
    border: 1px #000;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
  
  button#show-more:hover {
    background: #ff3300;
    color: #fff;
    border:none
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
  @media screen and (max-width: 1100px) {
    .mainContainer {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(6,minmax(0,1fr));
      gap: 2px;
    }
    .mainContainerAcc {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(6,minmax(0,1fr));
      gap: 2px;
    }
    .box {
      background: #fff;
      text-align: center;
      transition: .3s ease-in-out;
      border: 1px solid #efefef;
      height: auto;
    }
    .card .image img {
      width: 100%;
      transition: .3s ease-in-out;
    }
    .card .image {
      height: auto;
      position: relative;
    }
    .card .desc h1 {
      font-size: 11px;
    }
    .memory-button span{
      font-size: 11px;
    }
  }
  @media screen and (max-width: 900px) {
    .mainContainer {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(3,minmax(0,1fr));
      gap: 2px;
    }
    .mainContainerAcc {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(3,minmax(0,1fr));
      gap: 2px;
    }
  }
  @media screen and (max-width: 500px) {
    .mainContainer {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 2px;
    }
    .mainContainerAcc {
      display: grid;
      grid-auto-rows: minmax(min-content,max-content);
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 2px;
    }
  }
`
export const CardProdNew = styled.div`
.contain{
  display: flex;
  flex-wrap: wrap; 
  gap: 10px; 
  justify-content: center;
  align-items: center;

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
.item-label{
height: 22px;
text-align: left;
margin: 10px 0 10px 10px;
}
.lb-dis {
background-color: #980300;
color: #fff;
font-weight: 400;
}
.lb-dis span{
  font-size: 5px;
}
.item-label span {
border-radius: 8px;
display: inline-block;
padding: 4px 8px;
text-align: left;
}

.name{
  margin-top:10px;
  padding: 0 10px; 
  text-overflow: ellipsis;
  max-width: 100%; 
  overflow: hidden;
  white-space: nowrap;
  color: #000;

  }
  .card-wrapper {
    margin-right: 16px; /* Điều chỉnh khoảng cách này tùy theo nhu cầu của bạn */
  }
  .slick-slide {
    padding: 5px; /* Bạn có thể điều chỉnh giá trị padding để tăng khoảng cách giữa các slide */
    background: #B63245;

  }
.card {
  background: #fff;
  text-align: center;
  transition: .3s ease-in-out;
  border: 1px solid #efefef;
  border-radius:4px;
  min-height: 310px;
  width: 100%;
  border-bottom: 1px solid #f3f3f3 !important;
  border-right: 1px solid #f3f3f3 !important;
  overflow: hidden;
  border-radius: 0;
}
.div-img{
  margin-top: 20px;
}
.card:hover{
  transform: scale(1);
  z-index:1;
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
.memory-button.selected {
  border: 1px solid #00BFFF	;
}
.card .desc {
  width: 100%;
  margin: auto;
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
.desc .title{
  max-height:20%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btn {
  width: 100%;
  padding: 12px 33px;
  margin-top: 15px;
  border: none;
  color: #fff;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
}

.card .btn,
.card .image::before {
  background: #ff3300;
}

.card p {
  color: #ff3300;
  font-size: 15px;
}

button#show-more {
  background: #fff;
  color: #ff3300;
  padding: 10px 20px;
  cursor: pointer;
  margin: 0 auto;
  display: block;
  transition: .3s ease-in-out;
  border-radius: 5%;
  font-size:15px;
  border: 1px #000;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

button#show-more:hover {
  background: #ff3300;
  color: #fff;
  border:none
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
@media screen and (max-width: 1100px) {
  .mainContainer {
    display: grid;
    grid-auto-rows: minmax(min-content,max-content);
    grid-template-columns: repeat(6,minmax(0,1fr));
    gap: 2px;
  }
  .mainContainerAcc {
    display: grid;
    grid-auto-rows: minmax(min-content,max-content);
    grid-template-columns: repeat(6,minmax(0,1fr));
    gap: 2px;
  }
  .box {
    background: #fff;
    text-align: center;
    transition: .3s ease-in-out;
    border: 1px solid #efefef;
    height: auto;
  }
  .card .image img {
    width: 100%;
    transition: .3s ease-in-out;
  }
  .card .image {
    height: auto;
    position: relative;
  }
  .card .desc h1 {
    font-size: 11px;
  }
  .memory-button span{
    font-size: 11px;
  }
}
@media screen and (max-width: 900px) {
  .mainContainer {
    display: grid;
    grid-auto-rows: minmax(min-content,max-content);
    grid-template-columns: repeat(3,minmax(0,1fr));
    gap: 2px;
  }
  .mainContainerAcc {
    display: grid;
    grid-auto-rows: minmax(min-content,max-content);
    grid-template-columns: repeat(3,minmax(0,1fr));
    gap: 2px;
  }
}
@media screen and (max-width: 500px) {
  .mainContainer {
    display: grid;
    grid-auto-rows: minmax(min-content,max-content);
    grid-template-columns: repeat(2,minmax(0,1fr));
    gap: 2px;
  }
  .mainContainerAcc {
    display: grid;
    grid-auto-rows: minmax(min-content,max-content);
    grid-template-columns: repeat(2,minmax(0,1fr));
    gap: 2px;
  }
}`