import styled from "styled-components";

export const WrapperSuperHeader = styled.div`
positon: sticky;
width: 100%;
  .header-container {
    width: 100%;
    padding: 20px 10px 20px 10px;
    height: auto;
    display: flex;
    background: #B63245;
    align-item:center;
  }
  .first-com{
    width: 20%;
    display: flex;
    align-items:center;
    justify-content: center;

  }
  .second-com{
    width: 60%;
    display: flex;
    align-items:center;
    justify-content: center;
  }
  .third-com{
    width: 20%;
    display: flex;
    align-items:center;
    justify-content: center;
    gap: 20px;
  }
  .second-com .search-and-suggest-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .ant-image {
    width: 100%;
    display: flex;
    align-items:center;
    justify-content: center;
  }
  .logo{
    width: 50%;
    height: auto;
  }
  .logo img{
    width: 100px;
    height: auto;
  }
  .custom-button {
    background-image: linear-gradient(to bottom, #ff914d,  #ffde59);
    color: #000; 
    padding: 10px 20px; 
    border: none; 
    border-radius: 5px; 
    cursor: pointer; 
    font-size: 16px; 
  }
  .custom-button:hover {
    background-image: linear-gradient(to bottom,  #ffde59, #ffde59);
  }
  .popup {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }
  .search-box{
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items:center;
    justify-content: center;
  }
  .list-com{
    display: flex;
    gap: 10px;
    color: black;
    align-items: center;
    align-content: center;
  }
  .list-com a{
    color: black;
    cursor: pointer;
  }

  .link-sp{
    display: flex;
    gap: 10px;
  }
  @media screen and (max-width: 500px) {
    .header-container{
      flex-direction: column;
      gap: 8px;
      padding: 15px 10px;
    }
    .first-com{
      width: 100%;
    }
    .second-com{
      width: 100%;
      padding: 0px 10px;
    }
    .third-com{
      width: 100%;
      padding: 0px 10px;
    }
    .header-acc{
      justify-content: space-between;
    }
    .search-box{
      width: 100%;
    }
  
    .logo{
      width: 40%;
      height: auto;
    }
    .btn-cart{
      justify-content: left;
    }
    .header-acc{
      justify-content: right;
    }
    .link-sp{
      justify-content: space-between;
      gap: 0;
    }
  }

`
export const WrapperHeaderProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-start;
    color: #fff;
    font-size: 12px; /* Đặt kích thước chữ là 14px */
    font-weight: bold; /* Đặt độ đậm cho chữ */
    height: 30px;
    // display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
`;



export const WrapperForget = styled.div`
/* CSS cho container chung */
.forget-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
}

/* CSS cho form */
.forget-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 100%;
}

.forget-form label {
  margin: 10px 0;
  font-weight: bold;
}

.forget-form input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.forget-form button {
  margin-top: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}

/* CSS cho thông báo */
.confirmation-message {
  margin: 20px 0;
  font-weight: bold;
}

/* CSS cho nút "Quay lại" */
.back-button {
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}
`