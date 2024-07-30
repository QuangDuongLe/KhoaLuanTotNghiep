import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h5`
    color: #000;
    fontsize: 14px;
      
`

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.an-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 6px
    }  
    & .ant-upload-list-item-ìnfo {
        display: none
    }
`