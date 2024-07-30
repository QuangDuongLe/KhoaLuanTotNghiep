import React, { useEffect, useState } from 'react';
import { Button, Modal, Pagination, message, notification } from 'antd';
import { MDBModalContent, MDBModalDialog } from 'mdb-react-ui-kit';
import OrderDetail from '../orderdetail';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { WrapperList } from './style';
import Loading from '../../../Components/LoadingComponents/Loading';

const OrderList = ({ status }) => {
  const user = useSelector((state) => state.user)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startItem = (currentPage - 1) * itemsPerPage;
  const endItem = currentPage * itemsPerPage;

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [completeOrder, setCompleteOrder] = useState(false);
  const [currentComplete, setCurrentComplete] = useState(null);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/order/user/${user._id}?status=${status}`)
      .then((response) => {

        setOrders(response.data.data);
        setLoading(false);

      })
      .catch((error) => {
        console.error('Lỗi khi gọi API: ', error);
        setLoading(false);
      });
  }, [user._id, status]);
  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/order/completeOrderUser/${orderId}?userId=${user._id}`);
      if (response.data.success) {
        axios
          .get(`${process.env.REACT_APP_API_URL}/order/user/${user._id}?status=${status}`)
          .then((response) => {
            setOrders(response.data.data);
          })
          .catch((error) => {
            console.error('Lỗi khi gọi API: ', error);
          });
        notification.success({
          message: 'Thông báo',
          description: 'Đơn hàng đã hoàn thành.'
        });
      }
    } catch (error) {
      console.error('Lỗi khi xác nhận đơn hàng:', error);
      notification.error({
        message: 'Thông báo',
        description: 'Đã xảy ra lỗi khi xác nhận đơn hàng'
    });

    }
  };
  const handlePayment = (order) => {
    const paymentData = {
      orderCode: order.orderCode,
      amount: order.totalPay,
      language: '',
      bankCode: '',
      orderinfo: `${order.userName} thanh toán, mã hoá đơn là: `
    };

    axios.post(`${process.env.REACT_APP_API_URL}/VNPAY/create_payment_url`, paymentData)
      .then(response => {
        window.location.href = response.data.data;
      })
      .catch(error => {
        console.error(error);
      });
  };
  
  return (
    <WrapperList>
      <Loading isLoading={loading}>
        {!orders || orders.length === 0  ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
            <i style={{ fontSize: '100px', color: '#C13346' }} class="fas fa-box-open"></i>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Bạn không có đơn hàng nào.</p>
            <Button size='large' style={{ background: '#C13346', color: '#fff' }}>
              <NavLink to={`/cart`}>Đến giỏ hàng</NavLink>
            </Button>
          </div>) : (
          orders.map((order) => (
            <div className='has-container' >
              <div className='pre-order'>
                <div className='state'>
                  <div>Mã đơn hàng:&nbsp;<span>{order.orderCode}</span></div>
                  <div>Trạng thái đơn hàng:&nbsp;<span>{order.status}</span></div>
                  <div>Hình thức giao hàng:&nbsp;<span>{order.shippingMethod}</span></div>
                </div>
                {order.items.length > 0 && (
                  <div className='pd-info'>
                    <div className='order-img'>
                      <img className='img-item' src={order.items[0].pictures} loading='lazy'></img>
                    </div>
                    <div className='order-info'>
                      <span style={{ fontWeight: 500, fontSize: '18px' }}>{order.items[0].product.name} {order.items[0].memory}</span>
                      <div className='props'>
                        <div className='type' style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: '16px' }}>Phân loại:&nbsp;<span>{order.items[0].color}</span></p>
                          <p style={{ margin: 0, fontSize: '16px' }}>x{order.items[0].quantity}</p>
                        </div>
                        <div className='price' >
                          <span style={{ color: '#ff3300', fontWeight: 500, fontSize: '15px' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.items[0]?.price)}
                          </span>
                          <span style={{ textDecoration: 'line-through' }}>
                            {order.items[0].productVariant.oldPrice
                              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.items[0].productVariant.oldPrice)
                              : null
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className='total'>
                  <div>
                    <span>Số lượng hàng:&nbsp;
                      <span style={{ color: '#ff3300', fontWeight: 500, fontSize: '15px' }}>{order.items.length}</span>
                    </span>
                  </div>
                  <div>
                    <span>Thành tiền:&nbsp;
                      <span style={{ color: '#ff3300', fontWeight: 500, fontSize: '15px' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPay)}</span>
                    </span>
                  </div>
                  <div className='btn-order'>
                    {order.status === 'Chờ xác nhận' && order.isPay === 'Đang chờ thanh toán' && order.paymentMethod !== 'Thanh toán khi nhận hàng' && (
                      <Button
                        style={{ background: '#C13346', color: '#fff' }}
                        onClick={() => {
                          handlePayment(order);
                        }}
                      >
                        Thanh toán đơn hàng
                      </Button>
                    )}

                    {order.status === 'Đã giao hàng' && (
                      <Button
                        style={{ background: '#C13346', color: '#fff' }}
                        onClick={() => {
                          setCompleteOrder(true);
                          setCurrentComplete(order.orderCode);
                        }}
                      >
                        Đã nhận được hàng
                      </Button>
                    )}
                    <div>
                      <NavLink to={`/order-detail/${order.orderCode}`}>
                        <Button style={{ background: '#C13346', color: '#fff' }}>
                          {order.status === 'Đã hoàn thành' ? 'Xem chi tiết/Đánh giá' : 'Xem chi tiết'}
                        </Button>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
              <Modal
                title="Hoàn thành đơn hàng"
                visible={completeOrder}
                onOk={() => {
                  handleCompleteOrder(currentComplete)
                  setCompleteOrder(false);
                }}
                onCancel={() => setCompleteOrder(false)}
              >
                <p>Bạn có chắc chắn muốn hoàn thành đơn hàng này</p>
              </Modal>
            </div>
          ))
        )}
      </Loading>
      <div className="pagination">
        {/* <Pagination
          current={currentPage}
          // total={orders.length}
          // defaultPageSize={itemsPerPage}
          onChange={handlePageChange}
        /> */}
      </div>
    </WrapperList>
  )
}

export default OrderList