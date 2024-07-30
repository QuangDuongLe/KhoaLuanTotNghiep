import React, { useEffect, useState } from 'react';
import { Space, Table, Button, Input, Modal, message, Skeleton, Checkbox, notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux';
import axios from 'axios';
import CartTotal from './CartTotal';
import { Hidden } from '@mui/material';
import { Link, NavLink } from "react-router-dom";
import { WrapperPhoneCart } from './style';
import Loading from '../LoadingComponents/Loading';

function CartList() {
  const user = useSelector((state) => state.user)
  const [modalDelete, setModalDelete] = useState(false);
  const [currentCartId, setCurrentCartId] = useState(null);
  const [total, setTotal] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [isDis, setIsDis] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    document.title = `Giỏ Hàng`;
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, []);
  const isMobile = windowWidth < 730;

  const calculateTotalPrice = (cartData) => {
    return cartData.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };
  const updateTotalPrice = (cartData) => {
    const totalPrice = calculateTotalPrice(cartData);
    setTotal(totalPrice);
  };
  const checkAllChecked = (cartData) => {
    if (cartData && cartData.length > 0) {
      return cartData.every(item => item.checked);
    }
    return false;
  };

  const handleItemCheckedChange = (index) => {
    const updatedData = [...data];
    updatedData[index].checked = !updatedData[index].checked;
    setData(updatedData);
    updateIsAnyItemChecked(updatedData); // Update the new state

    axios.put(`${process.env.REACT_APP_API_URL}/cart/updateChecked/${updatedData[index]._id}/${user._id}`, { checked: updatedData[index].checked })
      .then((response) => {
        const filteredItems = response.data.data.items.filter(item => item.checked);
        updateTotalPrice(filteredItems)
        setSelectAll(checkAllChecked(updatedData));
      })
      .catch((error) => {
        console.error('Lỗi khi cập nhật trạng thái checked:', error);
      });
  };
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    const updatedData = data.map((item) => {
      return { ...item, checked };
    });
    setData(updatedData);
    updateIsAnyItemChecked(updatedData); // Update the new state


    axios.put(`${process.env.REACT_APP_API_URL}/cart/updateCheckedAll/${user._id}`, { checked })
      .then((response) => {
        const filteredItems = response.data.data.items.filter(item => item.checked);
        updateTotalPrice(filteredItems)
      })
      .catch((error) => {
        console.error('Lỗi khi cập nhật tất cả trạng thái checked:', error);
      });
  };
  const updateIsAnyItemChecked = (cartData) => {
    const anyChecked = cartData.some(item => item.checked);
    setIsDis(!anyChecked);
  };

  const columns = [
    {
      title: (
        <div style={{ textAlign: 'center', minWidth: 100, fontWeight: 'bold' }}>
          Chọn tất cả
          <div>
            <Checkbox checked={selectAll} onChange={handleSelectAll} />

          </div>
        </div>
      ),
      dataIndex: 'checked',
      render: (text, record, index) => (
        <div style={{ textAlign: 'center' }}>
          <Checkbox
            checked={record.checked}
            onChange={() => handleItemCheckedChange(index)}
          />
        </div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: 'center', minWidth: 350, fontWeight: 'bold' }}>
          Tên sản phẩm
        </div>
      ),
      dataIndex: 'product',
      render: (product, record) => (
        <div style={{ display: 'flex' }}>
          <img src={record.pictures} alt={record.product} style={{ width: '100px', marginRight: '10px' }} />
          <div>
            <NavLink to={`/product/${product.name}/${record?.memory}`}>
              <span style={{ fontSize: "15px", color: '#000' }}>{product.name} {record?.memory}</span></NavLink>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div style={{ textAlign: 'center', minWidth: 50, fontWeight: 'bold' }}>
          Màu
        </div>
      ),
      dataIndex: 'color',
      render: color => (
        <div style={{ textAlign: 'center' }}>
          {color}
        </div>
      ),

    },
    {
      title: (
        <div style={{ textAlign: 'center', minWidth: 100, fontWeight: 'bold' }}>
          Đơn giá
        </div>
      ),
      dataIndex: 'price',
      render: price => (
        <span style={{ fontSize: '17px', fontWeight: 'bold', display: 'flex', justifyContent: 'center' }}>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(price)}
        </span>
      ),
    },
    {
      title: (
        <div style={{ textAlign: 'center', minWidth: 100, fontWeight: 'bold' }}>
          Số lượng
        </div>
      ),
      dataIndex: 'quantity',
      render: (text, record, index) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" size='medium' style={{ background: 'transparent', border: '1px solid #ccc', color: '#000', boxShadow: 'none', borderRadius: '0px' }} onClick={() => handleDecreaseQuantity(index)}>-</Button>
            <Input
              value={quantities[index]}
              style={{ width: '50px', fontWeight: 'bold' }}
              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
            />
            <Button type="primary" size='medium' style={{ background: 'transparent', border: '1px solid #ccc', color: '#000', boxShadow: 'none', borderRadius: '0px' }} onClick={() => handleIncreaseQuantity(index)}>+</Button>
          </div>
        )
      }
    },
    {
      title: (
        <div style={{ textAlign: 'center', minWidth: 150, fontWeight: 'bold' }}>
          Tổng tiền
        </div>
      ),
      dataIndex: 'subtotal',
      render: subtotal => (
        <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#FF3300', display: 'flex', justifyContent: 'center' }}>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(subtotal)}
        </span>
      ),
    },
    {
      title: (
        <div style={{ textAlign: 'center', minWidth: 50, fontWeight: 'bold' }}>
          Thao tác
        </div>
      ),
      key: 'action',
      render: (record) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <a onClick={() => { setModalDelete(true); setCurrentCartId(record._id) }}> <DeleteOutlined /></a>
            <Modal
              title="Xoá giỏ hàng"
              visible={modalDelete}
              onOk={() => {
                handleDeleteCartItem(currentCartId);
                setModalDelete(false);
              }}
              onCancel={() => setModalDelete(false)}
            >
              <p>Bạn có chắc chắn muốn xoá sản phâm {record.name} này khỏi giỏ hàng?</p>
            </Modal>
          </div>
        );
      },
    },
  ];
  const [reload, setReload] = useState(false);
  const handleDeleteCartItem = (cartItemId) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/cart/deleteCart/${cartItemId}/${user._id}`)
      .then((response) => {
        notification.success({
          message: 'Thông báo',
          description: 'Xoá sản phẩm khỏi giỏ hàng thành công.'
        });

        setReload(!reload);
      })
      .catch((error) => {
        console.error('Lỗi khi xóa mục giỏ hàng:', error);
      });
  };
  const [soldoutpd, setSoldoutpd] = useState([]);

  const handlePayment = () => {
    const filteredItems = data.filter(item => item.checked === true);

    axios.put(`${process.env.REACT_APP_API_URL}/cart/updatecart/${user._id}`, { items: filteredItems })
      .then((response) => {
        if (response.data.data && response.data.data.length <= 0) {
          window.location.href = '/payment-infor';
        } else {
          setSoldoutpd(response.data.data);
          setIsModalOpen(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    localStorage.removeItem('cartItems');
    axios.get(`${process.env.REACT_APP_API_URL}/cart/getToCart/${user._id}`)
      .then((response) => {
        const cartData = response.data.data;
        setData(cartData);
        const initialQuantities = cartData.map((item) => item.quantity);
        setQuantities(initialQuantities);
        const filteredCartData = cartData.filter(item => item.checked === true);
        const totalPrice = calculateTotalPrice(filteredCartData);
        setTotal(totalPrice);
        setSelectAll(checkAllChecked(cartData));
        updateIsAnyItemChecked(cartData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
        setLoading(false);
      });
  }, [user, reload]);

  const [data, setData] = useState(null);
  const [quantities, setQuantities] = useState('');

  const handleQuantityChange = (index, value) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] = value;
    setQuantities(updatedQuantities);
    axios.put(`${process.env.REACT_APP_API_URL}/cart/update/${data[index]._id}/${user._id}`, { quantity: value })
      .then((response) => {
        if (user && user._id) {
          axios.get(`${process.env.REACT_APP_API_URL}/cart/getToCart/${user._id}`)
            .then((response) => {
              const cartData = response.data.data;
              const filteredCartData = cartData.filter(item => item.checked === true);
              const totalPrice = calculateTotalPrice(filteredCartData);
              setTotal(totalPrice);
              setData(cartData);
            })
            .catch((error) => {
              console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Lỗi khi cập nhật số lượng:', error);
      });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    window.location.href = '/payment-infor';
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setReload(!reload)
  };


  const handleIncreaseQuantity = (index) => {
    const updatedQuantities = [...quantities];
    const cartItem = data[index];

    // Tìm productVariant phù hợp dựa trên SKU
    const productVariant = cartItem.productVariant.attributes.find(attr => attr.sku === cartItem.sku);

    if (productVariant) {
      // Nếu có thuộc tính memory, số lượng tối đa là số lượng tồn kho hoặc 3 (tùy cái nào nhỏ hơn)
      const maxQuantity = cartItem.memory ? Math.min(productVariant.quantity, 3) : productVariant.quantity;

      if (updatedQuantities[index] < maxQuantity) {
        updatedQuantities[index] += 1;

        setQuantities(updatedQuantities);
        axios.put(`${process.env.REACT_APP_API_URL}/cart/update/${data[index]._id}/${user._id}`, { quantity: updatedQuantities[index] })
          .then((response) => {
            if (user && user._id) {
              axios.get(`${process.env.REACT_APP_API_URL}/cart/getToCart/${user._id}`)
                .then((response) => {
                  const cartData = response.data.data;
                  const filteredCartData = cartData.filter(item => item.checked === true);
                  const totalPrice = calculateTotalPrice(filteredCartData);
                  setTotal(totalPrice);
                  setData(cartData);
                })
                .catch((error) => {
                  console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
                });
            }
          })
          .catch((error) => {
            notification.error({
              message: 'Thông báo',
              description: error.response.data.error
            });
  
          });
      } else {
        notification.warning({
          message: 'Thông báo',
          description: 'Bạn đã đạt số lượng tối đa cho sản phẩm này.'
        });
      }
    } else {
      notification.error({
        message: 'Thông báo',
        description: 'Không tìm thấy biến thể sản phẩm tương ứng.'
      });
    }
  };



  const handleDecreaseQuantity = (index) => {
    const updatedQuantities = [...quantities];
    if (updatedQuantities[index] > 1) {
      updatedQuantities[index] -= 1;
      setQuantities(updatedQuantities);
      axios.put(`${process.env.REACT_APP_API_URL}/cart/update/${data[index]._id}/${user._id}`, { quantity: updatedQuantities[index] })
        .then((response) => {
          if (user && user._id) {
            axios.get(`${process.env.REACT_APP_API_URL}/cart/getToCart/${user._id}`)
              .then((response) => {
                const cartData = response.data.data;
                const filteredCartData = cartData.filter(item => item.checked === true);
                const totalPrice = calculateTotalPrice(filteredCartData);
                setTotal(totalPrice);
                setData(cartData);
              })
              .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
              });
          }
        })
        .catch((error) => {
          console.error('Lỗi khi cập nhật số lượng:', error);
        });
    }
  };

  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState();

  const scroll = {};
  if (yScroll) {
    scroll.y = 240;
  }
  if (xScroll) {
    scroll.x = '100vw';
  }
  const tableColumns = columns.map((item) => ({
    ...item,

  }));
  if (xScroll === 'fixed') {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = 'right';
  }

  const isCartEmpty = !data || data.length === 0;

  const renderContent = () => {
    if (isCartEmpty) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '25vh ', marginTop: '' }}>
          <i style={{ fontSize: '100px', color: '#C13346' }} class="fas fa-box-open"></i>
          <h2>BẠN CHƯA CÓ MÓN NÀO TRONG GIỎ HÀNG</h2>
          <NavLink to={`/`}>
            <Button size='large' style={{ background: '#C13346', color: '#fff' }}>
              Đi Tới Sản Phẩm
            </Button>
          </NavLink>
        </div>
      );
    }

    else {
      return (
        <Loading isLoading={loading}>
          <Table
            columns={tableColumns}
            dataSource={data}
            scroll={{ x: '100vw' }}
            pagination={false}
          />
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Tổng giá:&nbsp;</span>
              <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#FF3300' }}>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(total)}
              </span>

              <Button size='large' style={{ marginLeft: '100px', background: '#B63245', color: '#fff' }} disabled={isDis} onClick={handlePayment}>Mua hàng</Button>
              <Modal title="KHÔNG ĐỦ HÀNG" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="ĐỒNG Ý" cancelText="HỦY BỎ"
                okButtonProps={{
                  style: {
                    backgroundColor: '#B63245',
                    borderColor: '#B63245',
                    color: '#fff'
                  }
                }}
                closable={false}
                width={'50%'}>
                {soldoutpd?.map((item) => (
                  <div style={{ display: 'flex' }}>
                    <img src={item.image} width={'100px'} height={'100px'} style={{ padding: '10px' }} alt={item.productName} />
                    <div>
                      <b style={{ fontSize: '17px' }}>{item.productName}</b>
                      <p style={{ fontSize: '17px' }}>
                        Chỉ còn <b style={{ color: '#B63245' }}>{item.availableQuantity}</b> sản phẩm.</p>
                    </div>
                  </div>
                ))}
                <p style={{ fontSize: '17px' }}>Bạn có muốn mua số lượng sản phẩm còn lại không?</p>
                <div style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                  <img src='../../image/soldout.png' width={'200px'}></img>
                </div>

              </Modal>
            </div>
          </div>
        </Loading>
      );
    }

  };

  return (
    <>
      {loading ? (
        <Skeleton style={{ padding: 10 }} active={true} />
      ) : (
        <>
          {renderContent()}
        </>
      )}
    </>
  );
}

export default CartList;
