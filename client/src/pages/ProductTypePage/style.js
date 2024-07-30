import styled from "styled-components"; 

export const WrapperType = styled.div`
background: #fff;
.align-checkbox {
    vertical-align: middle; /* Align the checkbox vertically with the text */
    margin-left: 10px; /* Adjust the spacing as needed */
  }
  .navi{
    margin: 10px 0px;
    padding: 0px 10px;
    border: 1px solid #efefef;
    border-radius: 4px;
    background: #fff;
    }
`


export const WrapperFilterList = styled.nav` 
display: flex;
flex-wrap: wrap;
margin: 6px 0px;
.ant-dropdown-menu-item {
    padding: 8px 16px;
  }
  
  /* Style the anchor links inside dropdowns */
  .ant-dropdown-link {
    padding: 10px 20px;
    cursor: pointer;
    user-select: none;
    display: inline-block;
    color: #000;
  }
  
  /* Adjust the position of dropdowns */
  .ant-dropdown-placement-bottomLeft .ant-dropdown-menu {
    top: 100%;
  }
  
  .ant-dropdown-placement-bottomRight .ant-dropdown-menu {
    top: 100%;
    right: 0;
  }
  .memory-button.selected {
    border: 1px solid #FE3300;
  }
`
export const WrapperTextValue =styled.div`
  margin-top: 10px;
  border-radius: 4px;
  text-align: center;
  color: #B63245;
  border: 1px solid  #B63245; 
  padding: 10px;
  min-width: 120px;
  &:hover {
    color:#fff;
    border: 1px solid #B63245; 
    background: #B63245;
  }
  a {
    font-size:16px;
    font-weight: 500px;
    text-align: center;
    &:hover{
      color: #fff;
    }
  }
  ${(props) =>
    props.active &&
    `
    border: 1px solid #fff;
    background: #B63245;
    div {
      color: #fff;
    }
  `}
`
export const WrapperContent = styled.div`
    display: flex;
    font-size: 14px;

    //align-items: center;
    gap: 12px;
`