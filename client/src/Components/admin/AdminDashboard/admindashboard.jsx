import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { WrapperDashboard } from './style';

import PieChartComponent from '../../ChartComponent/piechart';
import { Table } from 'antd';
import { useSelector } from 'react-redux';


function Dashboard() {
    const user = useSelector((state) => state.user)
    const headers = {
        token: `Bearer ${user.access_token}`,
    };
    const [productCount, setProductCount] = useState(0);
    const [completedShippingOrders, setCompletedShippingOrders] = useState(0);
    const [completedAtStoreOrders, setCompletedAtStoreOrders] = useState(0);
    const [allOrders, setAllOrders] = useState(0);
    const [allCate, setAllCate] = useState(0);
    let [soldPD, setSoldPD] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAll`);
                setProductCount(res.data.data.length);

                const order1 = await axios.get(`${process.env.REACT_APP_API_URL}/order/completedShipping`);
                setCompletedShippingOrders(order1.data.data.length);

                const order2 = await axios.get(`${process.env.REACT_APP_API_URL}/order/completedAtStore`);
                setCompletedAtStoreOrders(order2.data.data.length);

                const order3 = await axios.get(`${process.env.REACT_APP_API_URL}/order/getAllOrdersDashBoard` ,{headers});
                setAllOrders(order3.data.data.length);

                const cate = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
                setAllCate(cate.data.data.length);
                const sold = await axios.get(`${process.env.REACT_APP_API_URL}/product/all-with-sold`);
                const productD = sold.data.data;
                console.log('Dữ liệu đã bán:', productD);
                setSoldPD(productD);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };
        fetchData();
    }, []);

    const sumOrder = completedShippingOrders + completedAtStoreOrders;
    soldPD.sort((a, b) => b.totalSold - a.totalSold);
    soldPD = soldPD.map((item, index) => ({ ...item, top: `Top ${index + 1}` }));

    const pieChartData = [
        { name: 'Tại cửa hàng', value: completedAtStoreOrders },
        { name: 'Giao hàng', value: completedShippingOrders },
    ];
    const pieChartOrder = [
        { name: 'Đã hoàn thành', value: sumOrder },
        { name: 'Chưa hoàn thành', value: allOrders - sumOrder },

    ];

    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            sortDirections: ['descend'],
        },
        {
            title: 'Đã bán',
            dataIndex: 'totalSold',
            defaultSortOrder: 'descend',
        },
        {
            title: 'Top',
            dataIndex: 'top',
        },
    ];

    return (
        <WrapperDashboard>
            <div className='sum-box'>
                <div className='sum-box-item'>
                    <div className='sum-box-left' >
                        <span className='sum-title'>Số lượng sản phẩm</span>
                        <span className='sum-quantity'>{productCount}</span>
                    </div>
                </div>
                <div className='sum-box-item'>
                    <div className='sum-box-left'>
                        <span className='sum-title'>Số đơn hoàn thành</span>
                        <span className='sum-quantity'>{completedShippingOrders + completedAtStoreOrders}</span>
                    </div>
                    <div>
                        <PieChartComponent data={pieChartData} />
                    </div>
                </div>
                <div className='sum-box-item'>
                    <div className='sum-box-left'>
                        <span className='sum-title'>Tổng số đơn hàng</span>
                        <span className='sum-quantity'>{allOrders}</span>
                    </div>
                    <div>
                        <PieChartComponent data={pieChartOrder} />
                    </div>
                </div>
                <div className='sum-box-item'>
                    <div className='sum-box-left' >
                        <span className='sum-title'>Tổng số danh mục</span>
                        <span className='sum-quantity'>{allCate}</span>
                    </div>
                </div>
            </div>
            <br></br>
            <div className='sum-box-table'>
                <p>Sản phẩm bán chạy</p>
                <Table columns={columns} dataSource={soldPD.slice(0, 6)} pagination={false} />
            </div>

        </WrapperDashboard>
    );
}

export default Dashboard;
