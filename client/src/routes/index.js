import AdminHomePage from "../pages/Admin/AdminPage";
import HomePage from "../pages/HomePage/homepages";
import Profilepage from "../pages/Profile/profilepage";
import NotFoundPage from "../pages/notfoundpage";
import ProductDetail from "../pages/ProductDetail/productdetail";
import CartPage from "../pages/CartPage/CartPage";
import PaymentInfo from "../pages/PaymentPage/paymentinfo";
import PaymentSuccess from "../pages/paymentVNPAYsuccess";
import OrderDetail from "../pages/Profile/orderdetail";
import WarrantySearch from "../Components/TableComponents/Warranty";
import OrderSuccess from "../pages/OrderSuccess/ordersuccess";
import LandingPage from "../Components/LandingPage/LandingPage";
import Register from "../Components/Header/register";
import Login from "../Components/Header/login";
import About from "../Components/LandingPage/About";
import ProductPage from "../pages/ProductTypePage/ProductPage";
import NewsCard from "../Components/NewsPageCom/NewsCard";
import NewsPage from "../pages/NewsPage/NewsPage";
import SingleNews from "../pages/NewsPage/SingleNews";
import CancelOrderSuccess from "../pages/OrderSuccess/CancelOrderSuccess";
import CancelOrderSuccess2 from "../pages/OrderSuccess/CancelOrderSuccess2";
export const routes = [
    {
        path:'/',
        page: HomePage,
        isShowFooter : true,
    },
    {
        path:'*',
        page: NotFoundPage,
        isShowFooter: false
    },
    {
        path:'/admin/*',
        page: AdminHomePage,
        isShowFooter: false,
    },
    {
        path:'/profile/*',
        page: Profilepage,
        isShowFooter: true
    },

    {
        path:'/product/:productName/:memory',
        page: ProductDetail,
        isShowHeader: true,
        isShowFooter:true
    },
    {
        path:'/cart',
        page: CartPage,
        isShowHeader: true,
        isShowFooter:true

    },
    {
        path:'/payment-infor',
        page: PaymentInfo,
        isShowHeader: true,
        isShowFooter:true
    },
    {
        path:'/order-success',
        page: OrderSuccess,
        isShowHeader: true,
        isShowFooter:true
    },
    {
        path:'/cancel-order-success2',
        page: CancelOrderSuccess2,
        isShowHeader: true,
        isShowFooter:true
    },
    {
        path:'/cancel-order-success',
        page: CancelOrderSuccess,
        isShowHeader: true,
        isShowFooter:true
    },

    {
        path:'/vnpay_return',
        page: PaymentSuccess,
        isShowHeader: true,
        isShowFooter:true

    },
    {
        path:'/order-detail/:orderCode',
        page: OrderDetail,
        isShowHeader: true,
        isShowFooter:true

    },
    {
        path:'/warranty',
        page: WarrantySearch,
        isShowHeader: true,
        isShowFooter:true
    },
    {
        path:'/login',
        page: Login,
        isShowHeader: true,
        isShowFooter:true
    },
    {
        path:'/register',
        page: Register,
        isShowHeader: true,
        isShowFooter:true
    },
    {
        path: '/about',
        page: About
    },
    {
        path: '/products/:nameCategory/:nameBrand',
        page: ProductPage,
        isShowHeader: true,
        isShowFooter:true
    },
    {
        path: '/products/:nameCategory',
        page: ProductPage,
        isShowHeader: true,
        isShowFooter:true
    },
    {
        path: '/products',
        page: ProductPage,
        isShowHeader: true,
        isShowFooter:true
    },
    {
        path:'/news',
        page: NewsPage,
        isShowHeader: true,
        isShowFooter:true
    },
    {
        path:'/news/:id',
        page: SingleNews,
        isShowHeader:true,
        isShowFooter:true
    },
]
