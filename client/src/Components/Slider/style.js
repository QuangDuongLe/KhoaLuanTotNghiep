import { Carousel } from "antd";
import styled from "styled-components";

export const WrapperBanner = styled.div`
.custom-carousel .slick-prev {
    left: 10px; /* Điều chỉnh vị trí mũi tên prev */
    z-index: 1; /* Đặt z-index để mũi tên prev nằm phía trước */
}

.custom-carousel .slick-next {
    right: 10px; /* Điều chỉnh vị trí mũi tên next */
    z-index: 1; /* Đặt z-index để mũi tên next nằm phía trước */
}

`

export const CarouselW = styled(Carousel)`
height: 100%;
.slick-prev {
    left: 10px; /* Điều chỉnh vị trí mũi tên prev */
    z-index: 1; /* Đặt z-index để mũi tên prev nằm phía trước */
}

 .slick-next {
    right: 10px; /* Điều chỉnh vị trí mũi tên next */
    z-index: 1; /* Đặt z-index để mũi tên next nằm phía trước */
}

`