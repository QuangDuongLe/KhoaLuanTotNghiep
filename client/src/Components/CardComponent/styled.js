import styled from "styled-components";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

export const WrapperFilterCard = styled.div`
*{
  margin: 0;
  padding: 0;
}
.title {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  font-size: 24px;
  color: #ff3300;
  padding: 10px;
  
}

.mainContainer {
  width:100%;
  background: #fff;
  display:grid;
  grid-auto-rows: minmax(min-content,max-content);
  grid-template-columns: repeat(5,minmax(0,1fr));
  overflow: hidden;
  border-radius: 0 0 8px 8px;
}
.item-label{
  height: 22px;
  text-align: left;
  margin-bottom: 20px;
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
  margin-right: 4px;
  padding: 4px 8px;
  text-align: left;
}

.box {
  background: #fff;
  text-align: left;
  justify-content: start;
  transition: .3s ease-in-out;
  border: 1px solid #efefef;
  height: 100%;
  border-radius: 4px;
  border-bottom: 1px solid #f3f3f3 !important;
  border-right: 1px solid #f3f3f3 !important;
  align-content: start;
}
.box:hover{
  transform: scale(1);
  z-index:1;
}

.mainContainer .box:hover {
  box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
}

.mainContainer .card {
  padding: 10px 15px 20px;
  overflow: hidden;
  width: 100%;
  height: 100%;

}
.card{
  align-content: start;
}
.image {
  width:100%;
  margin: 20px auto;
  position: relative;
  margin-bottom: 10px;
  display: block;
  margin-top: 10px;  
  height: 250px;
  max-height: 250px;
}
.card .image:hover img{
  transform: scale(1.1);
  z-index:1;
}
.card .image img{
  width:100%;
  margin-top: 8px;
  transition: all .3s ease-in-out;
  max-width: 100%;
}
.memory-button.selected {
  border: 1px solid #00BFFF	; 
}
.card .desc {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  align-items: start;
  display: flex;
  flex-direction: column;
  align-content: start;
}

.card .desc h1 {
  text-transform: uppercase;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 14px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
  text-align: left;
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

  .box .card .price-box p {
  color: #ff3300;
  font-size: 15px;
}
.box .card .props p{
  font-size: 15px;
  color: #000;

}
@media screen and (max-width: 1100px) {
  .mainContainer {
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
}
@media screen and (max-width: 900px) {
  .mainContainer {
    display: grid;
    grid-auto-rows: minmax(min-content,max-content);
    grid-template-columns: repeat(3,minmax(0,1fr));
    gap: 2px;
  }
}
@media screen and (max-width: 500px) {
  .mainContainer {
    grid-template-columns: repeat(2,minmax(0,1fr));
    gap: 2px;
  }
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
`
export const WrapperCard = styled.div`
  *{
    margin: 0;
    padding: 0;
  }
  .title {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    font-size: 24px;
    color: #ff3300;
    padding: 10px;
    
  }
  .mainContainer {
    width:100%;
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    overflow: hidden;
    padding: 20px;
    gap: 2px;
  }

  .box {
    background: #fff;
    text-align: center;
    transition: .3s ease-in-out;
    width: 200px;
  }

  .box:hover {
    box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
  }

  .card {
    // padding: 15px 15px 0;
    width: 100%;
  }

  .card .image {
    width:100%;
    backgroud: #f9f9f9;
    margin: 20px auto;
    position: relative;
  }

  // .card .image::before {
  //   content: "";
  //   position: absolute;
  //   width: 10px;
  //   height: 10px;
  //   botton: 8px;
  //   left: 10px;
  //   border-radius: 50%;
  //   background-color: red;
  // }

  .card .image:hover img {
    transform: scale(1.1);
  }

  .card .image img {
    width:180px;
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
    height: auto;
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

  @media screen and (max-width: 998px) {
    .mainContainer{
      padding: 0 3rem;
      justify-content: center;
    }

    .card .image {
      width: 50%
    }
  }

  @media screen and (max-width: 1000px) {
    .mainContainer {
      grid-template-columns: repeat(auto-fit, minmax(100px, 200px));
      padding: 5rem 3rem;
      column-gap: 6px;
    }
    .card .image img {
      width:90px;
      transition: .3s ease-in-out;
      cursor: pointer;
    }
    .mainContainer .box:hover {
      box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
      transform: scale(1);
    }
    .card .image:hover img {
      transform: scale(1.3);
    }
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
`
export const WrapperSuggestCard = styled.div`
.view-list{
  max-height: 400px;
  background-color: #fff;
  width: 100%;
  position: absolute; 
  overflow-y: auto; 
  scrollbar-width: none; 
  z-index: 1; 

}
.view-list__wrapper{
  background-color: #fff;
  display: flex;
  width: 100%;
  border: 1px solid #ccc;
  padding: 5px 15px 0;
  border: 1px solid rgba(145,158,171,.239);
}
.view-list__wrapper:hover{
  transform: scale(1,1);
}
.item{
  border-bottom: 0 solid rgba(145,158,171,.24);
  display: flex;
  gap: 15px;
  overflow: hidden;
  transition: .2s ease-in-out;
  width: 100%;
  padding: 10px;
}
.item__img{
  width: 20%;
  height: auto;
  flex-shrink: 0;
}
img {
  height: auto;
  width: 100%;
  vertical-align: middle;
}
.item-info {
  display: flex;
  flex-direction: column;
}
.item-name {
  color: #111;
  font-size: 14px;
}
.item-price {
  align-items: flex-end;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.box-info__box-price {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
}
.product__price--show {
  color: #d70018;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
}
.product__price--through {
  color: #707070;
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  position: relative;
  -webkit-text-decoration: line-through;
  text-decoration: line-through;
  top: 2px;
}
.stars{
  font-size: 13px;
}
@media screen and (max-width: 500px) {
  .item__img{
    width: 30%;
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