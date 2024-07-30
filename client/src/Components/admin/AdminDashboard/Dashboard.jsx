import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Skeleton, Statistic, Select, Tabs, Button, message, notification } from 'antd';
import CountUp from 'react-countup';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { CChart } from '@coreui/react-chartjs'
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const { Option } = Select;
const { TabPane } = Tabs;

function Dashboard() {
    const user = useSelector((state) => state.user)
    const [userCount, setUserCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);
    const [cateCount, setCateCount] = useState(0);
    let [soldP, setSoldP] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUsersCount, setNewUsersCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
    const [readyOrdersCount, setReadyOrdersCount] = useState(0);
    const [deliveryOrdersCount, setDeliveryOrdersCount] = useState(0);
    const [deliveredOrdersCount, setDeliveredOrdersCount] = useState(0);
    const [completeOrdersCount, setCompleteOrdersCount] = useState(0);
    const [readyCancelOrdersCount, setReadyCancelOrdersCount] = useState(0);
    const [canceledOrdersCount, setCanceledOrdersCount] = useState(0);
    const [totalPay, setTotalPay] = useState(0);
    const [totalPendingPay, setTotalPendingPay] = useState(0);
    const [weeklySales, setWeeklySales] = useState([]);
    const [monthlySales, setMonthlySales] = useState([]);
    const [yearlySales, setYearlySales] = useState([]);
    const [categorySalesData, setCategorySalesData] = useState([]);
    const [weeklyPay, setWeeklyPay] = useState([]);
    const [monthlyPay, setMonthlyPay] = useState([]);
    const [yearlyPay, setYearlyPay] = useState([]);
    const [selectedOption, setSelectedOption] = useState('7');
    const [pay7Days, setPay7Days] = useState([]);
    const [pay28Days, setPay28Days] = useState([]);
    const [pay90Days, setPay90Days] = useState([]);
    const [pay365Days, setPay365Days] = useState([]);
    const [payAllDays, setPayAllDays] = useState([]);
    const [selectedOptionSale, setSelectedOptionSale] = useState('tuần');
    const [selectedOptionPay, setSelectedOptionPay] = useState('tuần');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [totalPayData, setTotalPayData] = useState([]);

    const headers = {
        token: `Bearers ${user.access_token}`,
    };

    const handleSelectChange = (value) => {
        setSelectedOption(value);
    };
    const handleSelectChangeSale = (value) => {
        setSelectedOptionSale(value);
    };
    const handleSelectChangePay = (value) => {
        setSelectedOptionPay(value);
    };

    const fetchOrderCount = (url, setState) => {
        axios.get(url, { headers })
            .then(response => {
                if (response.data && response.data.data) {
                    setState(response.data.data.length);
                } else {
                    console.error(`No data received for ${url}`);
                }
            })
            .catch(error => console.error(`Error fetching order count for ${url}:`, error));
    };

    useEffect(() => {
        document.title = "Thống Kê";    

        axios.get(`${process.env.REACT_APP_API_URL}/order/getAllOrdersDashBoard`, { headers })
            .then(response => {
                const orders = response.data.data;
                setOrderCount(orders.length);

                const sevenDaysAgo = moment().subtract(7, 'days');
                const newOrders = orders.filter(order => {
                    const orderCreateDate = moment(order.createDate, 'DD/MM/YYYY HH:mm:ss');
                    return orderCreateDate.isAfter(sevenDaysAgo);
                });
                setNewOrdersCount(newOrders.length);

                const paidOrders = orders.filter(order =>
                    order.isPay === "Đã thanh toán" || order.isPay === "Đã thanh toán thông qua VNPAY"
                );
                const totalPaySum = paidOrders.reduce((total, order) => total + order.totalPay, 0);
                setTotalPay(totalPaySum);
                const pendingPayOrders = orders.filter(order =>
                    order.isPay === "Đang chờ thanh toán"
                );
                const totalPendingPaySum = pendingPayOrders.reduce((total, order) => total + order.totalPay, 0);
                setTotalPendingPay(totalPendingPaySum);

            })
            .catch(error => console.error('Error fetching order count:', error));

        axios.get(`${process.env.REACT_APP_API_URL}/user/getAll`, { headers })
            .then(response => {
                const filteredUsers = response.data.data.filter(user => user.role_id !== 1);
                setUserCount(filteredUsers.length);

                const sevenDaysAgo = moment().subtract(7, 'days');
                const newUsers = filteredUsers.filter(user => {
                    const userCreatedAt = moment(user.createdAt);
                    return userCreatedAt.isAfter(sevenDaysAgo);
                });
                setNewUsersCount(newUsers.length);
            })
            .catch(error => console.error('Error fetching user count:', error));

        axios.get(`${process.env.REACT_APP_API_URL}/product/getAll`, { headers })
            .then(response => {
                const product = response.data.data;
                setProductsCount(product.length);

            })
            .catch(error => console.error('Error fetching user count:', error));

        axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`, { headers })
            .then(response => {
                const cate = response.data.data;
                setCateCount(cate.length);

            })
            .catch(error => console.error('Error fetching category count:', error));
        axios.get(`${process.env.REACT_APP_API_URL}/product/all-with-sold`, { headers })
            .then(response => {
                const sold = response.data.data;
                setSoldP(sold);
            })
            .catch(error => console.error('Error fetching product:', error));

        axios.get(`${process.env.REACT_APP_API_URL}/order/getSoldProductsByDate`, { headers })
            .then(response => {
                const data = response.data.data;
                setWeeklySales(data.weeklySales);
                setMonthlySales(data.monthlySales);
                setYearlySales(data.yearlySales);
            })
            .catch(error => console.error('Error fetching sold products data:', error));

        axios.get(`${process.env.REACT_APP_API_URL}/order/soldProductsByCategory`, { headers })
            .then(response => {
                const data = response.data.data;
                setCategorySalesData(data);
            })
            .catch(error => console.error('Error fetching sold products by category:', error));

        axios.get(`${process.env.REACT_APP_API_URL}/order/get7DaysTotalPay`)
            .then(response => {
                const data = response.data.data;
                setPay7Days(data);
            })
            .catch(error => console.error('Error fetching:', error));
        axios.get(`${process.env.REACT_APP_API_URL}/order/get28DaysTotalPay`)
            .then(response => {
                const data = response.data.data;
                setPay28Days(data);
            })
            .catch(error => console.error('Error fetching:', error));
        axios.get(`${process.env.REACT_APP_API_URL}/order/get90DaysTotalPay`)
            .then(response => {
                const data = response.data.data;
                setPay90Days(data);
            })
            .catch(error => console.error('Error fetching:', error));
        axios.get(`${process.env.REACT_APP_API_URL}/order/get365DaysTotalPay`)
            .then(response => {
                const data = response.data.data;
                setPay365Days(data);
            })
            .catch(error => console.error('Error fetching:', error));
        axios.get(`${process.env.REACT_APP_API_URL}/order/getAllDaysTotalPay`)
            .then(response => {
                const data = response.data.data;
                setPayAllDays(data);
            })
            .catch(error => console.error('Error fetching:', error));

        axios.get(`${process.env.REACT_APP_API_URL}/order/getTotalPayByDate`, { headers })
            .then(response => {
                const data = response.data.data;
                setWeeklyPay(data.weeklyPay);
                setMonthlyPay(data.monthlyPay);
                setYearlyPay(data.yearlyPay);
            })
            .catch(error => console.error('Error fetching pay data:', error));

        fetchOrderCount(`${process.env.REACT_APP_API_URL}/order/getAllOrdersPending`, setPendingOrdersCount);
        fetchOrderCount(`${process.env.REACT_APP_API_URL}/order/getAllOrdersReady`, setReadyOrdersCount);
        fetchOrderCount(`${process.env.REACT_APP_API_URL}/order/getAllOrdersDelivery`, setDeliveryOrdersCount);
        fetchOrderCount(`${process.env.REACT_APP_API_URL}/order/getAllOrdersDelivered`, setDeliveredOrdersCount);
        fetchOrderCount(`${process.env.REACT_APP_API_URL}/order/getAllOrdersComplete`, setCompleteOrdersCount);
        fetchOrderCount(`${process.env.REACT_APP_API_URL}/order/getAllOrdersReadyCancel`, setReadyCancelOrdersCount);
        fetchOrderCount(`${process.env.REACT_APP_API_URL}/order/getAllOrdersCancel`, setCanceledOrdersCount);
        setLoading(false);

    }, []);

    const fetchTotalPay = async () => {
        const utcStartDate = moment(startDate).utc().format(); 
        const utcEndDate = moment(endDate).utc().format();
        console.log("UTC start date:", startDate);
        console.log("UTC end date:", endDate);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/order/calculateTotalPayByDateRange`, { startDate: utcStartDate, endDate: utcEndDate });
            setTotalPayData(response.data.data);
        } catch (error) {
            console.error("Error fetching total pay data: ", error);
        }
    };
    const handleFetchData = () => {
        if (selectedOption === 'custom' && (!startDate || !endDate)) {
            notification.error({
                message: 'Thông báo',
                description: 'Vui lòng chọn khoảng ngày hợp lệ.'
              });
            return;
        }
        
        fetchTotalPay();
    };

    const newUserCountDisplay = newUsersCount > 0 ? `+${newUsersCount} trong 7 ngày qua` : 'Không có người dùng mới trong 7 ngày qua';
    const newOrdersCountDisplay = newOrdersCount > 0 ? `+${newOrdersCount} trong 7 ngày qua` : 'Không có đơn hàng mới trong 7 ngày qua';
    const topSoldProducts = soldP.sort((a, b) => b.totalSold - a.totalSold).slice(0, 5);
    const tableData = topSoldProducts.map((item, index) => ({ ...item, top: `${index + 1}` }));

    const formatCategorySalesData = () => {
        const labels = categorySalesData.map(item => item._id);
        const salesData = categorySalesData.map(item => item.totalSold);
        return { labels, salesData };
    };
    const formatPayData = (period) => {
        let data = [];
        let labels = [];
        switch (period) {
            case 'tuần':
                labels = weeklyPay.map(item => `Tuần ${item._id.week} - ${item._id.year}`);
                data = weeklyPay.map(item => item.totalPay);
                break;
            case 'tháng':
                labels = monthlyPay.map(item => `Tháng ${item._id.month}/${item._id.year}`);
                data = monthlyPay.map(item => item.totalPay);
                break;
            case 'năm':
                labels = yearlyPay.map(item => `Năm ${item._id.year}`);
                data = yearlyPay.map(item => item.totalPay);
                break;
            default:
                labels = weeklyPay.map(item => `Tuần ${item._id.week} - ${item._id.year}`);
                data = weeklyPay.map(item => item.totalPay);

                break;
        }
        return { labels, data };
    };

    const formatSalesData = (period) => {
        let data = [];
        let labels = [];
        switch (period) {
            case 'tuần':
                labels = weeklySales.map(item => `Tuần ${item._id.week} - ${item._id.year}`);
                data = weeklySales.map(item => item.totalSold);
                break;
            case 'tháng':
                labels = monthlySales.map(item => `Tháng ${item._id.month}/${item._id.year}`);
                data = monthlySales.map(item => item.totalSold);
                break;
            case 'năm':
                labels = yearlySales.map(item => `Năm ${item._id.year}`);
                data = yearlySales.map(item => item.totalSold);
                break;
            default:
                labels = weeklySales.map(item => `Tuần ${item._id.week} - ${item._id.year}`);
                data = weeklySales.map(item => item.totalSold);
                break;
        }
        return { labels, data };
    };

    const formatTotalPay = (days) => {
        let data = [];
        let labels = [];
        switch (days) {
            case '7':
                labels = pay7Days.map(item => item._id);
                data = pay7Days.map(item => item.totalPay);
                break;
            case '28':
                labels = pay28Days.map(item => item._id);
                data = pay28Days.map(item => item.totalPay);
                break;
            case '90':
                labels = pay90Days.map(item => item._id);
                data = pay90Days.map(item => item.totalPay);
                break;
            case '365':
                labels = pay365Days.map(item => item._id);
                data = pay365Days.map(item => item.totalPay);
                break;
            case 'toàn bộ':
                labels = payAllDays.map(item => item._id);
                data = payAllDays.map(item => item.totalPay);
                break;
            case 'custom':
                labels = totalPayData.map(item => item._id);
                data = totalPayData.map(item => item.totalPay);
                break;
            default:
                labels = pay7Days.map(item => item._id);
                data = pay7Days.map(item => item.totalPay);
                break;
        }
        return { labels, data };
    };
    const chartData = formatTotalPay(selectedOption);
    const chartDataSale = formatSalesData(selectedOptionSale);
    const chartDataPay = formatPayData(selectedOptionPay);
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', overflowY: 'auto', padding: '20px' }}>
                <Card hoverable style={{ minWidth: '270px' }}>
                    {loading ? <Skeleton active /> : (
                        <>
                            <Statistic title="Người dùng hoạt động" value={userCount} />
                            <Statistic title="Người dùng mới" value={newUserCountDisplay} />
                        </>
                    )}
                </Card>
                <Card hoverable style={{ minWidth: '270px' }}>
                    {loading ? <Skeleton active /> : (
                        <>
                            <Statistic title="Số lượng đơn hàng" value={orderCount} />
                            <Statistic title="Đơn hàng mới" value={newOrdersCountDisplay} />
                        </>
                    )}
                </Card>
                <Card hoverable style={{ minWidth: '270px' }}>
                    {loading ? <Skeleton active /> : (
                        <Statistic title="Khoản đã thanh toán" value={totalPay.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        />
                    )}
                </Card>
                <Card hoverable style={{ minWidth: '270px' }}>
                    {loading ? <Skeleton active /> : (
                        <Statistic title="Khoản chờ thanh toán" value={totalPendingPay.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        />
                    )}
                </Card>

                <Card hoverable style={{ minWidth: '270px' }}>
                    {loading ? <Skeleton active /> : (
                        <Statistic title="Số lượng sản phẩm" value={productsCount} />
                    )}
                </Card>
                <Card hoverable style={{ minWidth: '270px' }}>
                    {loading ? <Skeleton active /> : (
                        <Statistic title="Số lượng danh mục" value={cateCount} />
                    )}
                </Card>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ padding: '20px', minWidth: '50%' }}>
                    <Card hoverable style={{ width: '100%' }}>
                        <h4>Tổng số đơn hàng</h4>
                        {loading ? <Skeleton active /> : (
                            <CChart
                                type="doughnut"
                                data={{
                                    labels: ['Chờ xác nhận', 'Chuẩn bị', 'Đang giao hàng', 'Đã giao hàng', 'Đã hoàn thành', 'Đang chờ hủy', 'Đã hủy'],
                                    datasets: [
                                        {
                                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#9C27B0', '#FF9800', '#795548'],
                                            data: [pendingOrdersCount, readyOrdersCount, deliveryOrdersCount, deliveredOrdersCount, completeOrdersCount, readyCancelOrdersCount, canceledOrdersCount],
                                        },
                                    ],
                                }}
                            />
                        )}
                    </Card>
                </div>
                <div style={{ flexDirection: 'column', display: 'flex', maxWidth: '50%', padding: '20px' }}>
                    <h3>Sản phẩm bán chạy</h3>
                    <div style={{ padding: '20px', overflowY: 'auto', overflowX: 'auto', maxWidth: '100%', maxHeight: '60vh' }}>
                        <MDBTable bordered align='middle' className='floating-table'>
                            <MDBTableHead>
                                <tr style={{ textAlign: 'center', color: '#fff', backgroundColor: '#B63245' }}>
                                    <th scope='col' style={{ verticalAlign: 'middle', minWidth: '50px' }}>STT</th>
                                    <th scope='col' style={{ verticalAlign: 'middle', maxWidth: '250px', minWidth: '250px' }}>Sản phẩm</th>
                                    <th scope='col' style={{ verticalAlign: 'middle', minWidth: '50px' }}>Đã bán</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="3">
                                            <Skeleton active />
                                        </td>
                                    </tr>
                                ) : (
                                    tableData.map(sold => (
                                        <tr key={sold._id} style={{ textAlign: 'center' }}>
                                            <td>
                                                <p className='fw-bold mb-1'>{sold.top}</p>
                                            </td>
                                            <td>
                                                <p className='fw-bold mb-1'>{sold.productName}</p>
                                            </td>
                                            <td>
                                                <p className='fw-bold mb-1'>{sold.totalSold}</p>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </MDBTableBody>
                        </MDBTable>
                    </div>
                </div>
            </div>
            <hr></hr>
            <h4>Số liệu phân tích</h4>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Số lượng sản phẩm đã bán theo thời gian" key="1">
                    <div style={{ padding: '20px', width: '100%' }}>
                        <Select value={selectedOptionSale} onChange={handleSelectChangeSale} style={{ marginBottom: '20px' }}>
                            <Option value="tuần">Theo tuần</Option>
                            <Option value="tháng">Theo tháng</Option>
                            <Option value="năm">Theo năm</Option>
                        </Select>
                        <Card hoverable style={{ width: '100%' }}>
                            <h4>Số lượng sản phẩm đã bán ({selectedOptionSale})</h4>
                            <CChart
                                type="bar"
                                data={{
                                    labels: chartDataSale.labels,
                                    datasets: [
                                        {
                                            label: 'Số lượng sản phẩm đã bán',
                                            backgroundColor: '#B63245',
                                            data: chartDataSale.data,
                                        },
                                    ],
                                }}
                                options={{
                                    tooltips: {
                                        enabled: true,
                                    },
                                }}
                            />
                        </Card>
                    </div>
                </TabPane>
                <TabPane tab="Doanh số theo thời gian" key="2">
                    <div style={{ padding: '20px', width: '100%' }}>
                        <Select value={selectedOptionPay} onChange={handleSelectChangePay} style={{ marginBottom: '20px' }}>
                            <Option value="tuần">Theo tuần</Option>
                            <Option value="tháng">Theo tháng</Option>
                            <Option value="năm">Theo năm</Option>
                        </Select>
                        <Card hoverable style={{ width: '100%' }}>
                            <h4>Doanh số ({selectedOptionPay})</h4>
                            <CChart
                                type="line"
                                data={{
                                    labels: chartDataPay.labels,
                                    datasets: [
                                        {
                                            label: 'Doanh số',
                                            backgroundColor: '#B63245',
                                            data: chartDataPay.data,
                                        },
                                    ],
                                }}
                                options={{
                                    tooltips: {
                                        enabled: true,
                                    },
                                }}
                            />
                        </Card>
                    </div>
                </TabPane>
                <TabPane tab="Doanh số các ngày qua" key="3">
                    <div style={{ padding: '20px', width: '100%' }}>
                        <Select value={selectedOption} onChange={handleSelectChange} style={{ marginBottom: '20px', width: '150px' }}>
                            <Option value="7">7 ngày qua</Option>
                            <Option value="28">28 ngày qua</Option>
                            <Option value="90">90 ngày qua</Option>
                            <Option value="365">365 ngày qua</Option>
                            <Option value="toàn bộ">Toàn bộ</Option>
                            <Option value="custom">Tùy chỉnh</Option>

                        </Select>
                        <Card hoverable style={{ width: '100%' }}>
                            {selectedOption === 'custom' && (
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <h7>Chọn ngày bắt đầu</h7>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={date => setStartDate(date)}
                                            selectsStart
                                            isClearable
                                            startDate={startDate}
                                            endDate={endDate}
                                            maxDate={moment().subtract(1, 'day').toDate()}
                                            placeholderText="Ngày bắt đầu"
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                                        <h7>Chọn ngày kết thúc</h7>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={date => setEndDate(date)}
                                            selectsEnd
                                            isClearable
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                            maxDate={moment().subtract(1, 'day').toDate()}
                                            placeholderText="Ngày kết thúc"
                                        />
                                    </div>
                                    <div style={{ alignItems: 'end', display: 'flex' }}>
                                        <Button onClick={handleFetchData} style={{ background: '#B63245', color: '#fff', width: '150px' }}>Áp dụng</Button>

                                    </div>
                                </div>
                            )}
                            <h4>Doanh số {selectedOption === 'custom' ? 'tùy chỉnh' : `${selectedOption} ngày qua`}</h4>
                            <CChart
                                type="line"
                                data={{
                                    labels: chartData.labels,
                                    datasets: [
                                        {
                                            label: 'Doanh số ngày',
                                            backgroundColor: '#B63245',
                                            data: chartData.data,
                                        },
                                    ],
                                }}
                                options={{
                                    tooltips: {
                                        enabled: true,
                                    },
                                }}
                            />
                        </Card>
                    </div>
                </TabPane>
                <TabPane tab="Số lượng sản phẩm đã bán theo danh mục" key="4">
                    <div style={{ padding: '20px', width: '100%' }}>
                        <Card hoverable style={{ width: '100%' }}>
                            <h4>Số lượng sản phẩm đã bán theo danh mục</h4>
                            <CChart
                                type="bar"
                                data={{
                                    labels: formatCategorySalesData().labels,
                                    datasets: [
                                        {
                                            label: 'Số lượng sản phẩm đã bán',
                                            backgroundColor: '#42A5F5',
                                            data: formatCategorySalesData().salesData,
                                        },
                                    ],
                                }}
                            />
                        </Card>
                    </div>
                </TabPane>
            </Tabs>
        </div >

    );
}
export default Dashboard;