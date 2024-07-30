const Cart = require('../Model/CartModel');
const ProductVariant = require('../Model/ProductVariantModel');
const Order = require('../Model/OrderModel');
const Voucher = require('../Model/VourcherModel');
const Product = require('../Model/ProductModel')
const cron = require('node-cron');
const moment = require("moment-timezone");
const { format } = require('date-fns');
const orderSendMail = require('../ultils/oderSendMail');
const generateRandomOrderCode = async () => {
  const prefix = 'GGZ';
  let orderCode;
  let isCodeUnique = false;
  let suffix = 0;
  while (!isCodeUnique) {
    const randomCode = (10000 + suffix).toString();
    orderCode = prefix + randomCode;
    const existingOrder = await Order.findOne({ orderCode });
    if (!existingOrder) {
      isCodeUnique = true;
    } else {
      suffix++;
    }
  }
  return orderCode;
};

const addOrder = async (req, res) => {
  try {
    const orderCode = await generateRandomOrderCode();
    const { userId } = req.params;
    const { userName, userEmail, address, shippingMethod, paymentMethod, subTotal, totalPay, userPhone, vouchercode, items, shippingFee } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Giỏ hàng trống' });
    }

    let voucher = await Voucher.findOne({ code: vouchercode });
    if (voucher && voucher.quantity > 0) {
      voucher.quantity--;
      await voucher.save();
    } else {
      voucher = null;
    }

    const newOrder = new Order({
      orderCode,
      user: userId,
      items,
      userName,
      userEmail,
      address,
      shippingMethod,
      status: 'Chờ xác nhận',
      paymentMethod,
      subTotal,
      shippingFee,
      totalPay,
      voucher: voucher ? voucher._id : null,
      userPhone,
      isPay: 'Đang chờ thanh toán'
    });

    for (const item of items) {
      const productVariantId = item.productVariant;
      const productVariant = await ProductVariant.findById(productVariantId);
      const productId = item.product;
      const product = await Product.findById(productId);
      if (!productVariant) {
        return res.status(400).json({ success: false, error: 'Sản phẩm biến thể không tồn tại' });
      }
      const matchedAttribute = productVariant.attributes.find(attribute => attribute.sku === item.sku);
      if (!matchedAttribute) {
        return res.status(400).json({ success: false, error: 'Sản phẩm đã hết hàng' });
      }
      const quantityInCart = parseInt(item.quantity, 10);
      const remainingQuantity = matchedAttribute.quantity - quantityInCart;
      if (remainingQuantity < 0) {
        return res.status(400).json({ success: false, error: `Sản phẩm ${product.name} với màu ${item.color} đã hết hàng hoặc không đủ số lượng` });
      }

      matchedAttribute.quantity = remainingQuantity;
      matchedAttribute.sold += quantityInCart;

      await productVariant.save();
    }
    const itemIds = items.map(item => item._id);

    await Cart.updateOne({ user: userId }, { $pull: { items: { _id: { $in: itemIds } } } });
    const savedOrder = await newOrder.save();

    res.status(200).json({ success: true, order: savedOrder });
    const populatedOrder = await Order.findById(newOrder._id).populate('items.product items.productVariant');
    let emailHTML = `
    <html>
    <head>
        <style>
          body {
              font-family: Arial, sans-serif;
          }
          h2 {
              text-align: center;
          }
          .order-info {
              background-color: #f2f2f2;
              padding: 10px;
              margin: 20px 0;
          }
          h1 {
              
          }
          ul {
              list-style: none;
              padding: 0;
          }
          li {
              margin: 10px 0;
          }
          .product-item {
            display: flex;
            margin-bottom: 20px;
          }
          .product-image {
              max-width: 100px;
              margin-right: 10px;
          }
          table {
              width: 100%;
              border-collapse: collapse;
          }
          table, th, td {
              border: 1px solid #ccc;
          }
          th, td {
              padding: 8px;
              text-align: left;
          }
          th {
              background-color: #f2f2f2;
          }
        </style>
    </head>
    <body>
    <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="display: flex; align-items: center;">
        <img src="https://res.cloudinary.com/doq4spvys/image/upload/v1698228631/mqjpap63hv6bxuddgfbx.png" style="width: 40px; height: 40px; margin-right: 10px;"/>
        <span style="line-height: 40px; font-size: 17px; font-weight: 600"> Di Động Gen Z</span> 
      </div>
        <p>Di Động Gen Z chân thành cảm ơn sự ủng hộ của bạn, chúc bạn có trải nghiệm mua sắm thật vui vẻ cùng Di Động Gen Z!</p>
        <h2 style="color: #d70018;">Đơn hàng của bạn</h2>
        <div class="order-info">
          <p><strong>Mã đơn hàng:</strong> ${orderCode}</p>
          <p><strong>Tên khách hàng:</strong> ${userName}</p>
          <p><strong>Địa chỉ nhận hàng:</strong> ${address}</p>
          <p><strong>Số điện thoại:</strong> ${userPhone}</p>
          <p><strong>Ngày mua:</strong> ${populatedOrder.createDate}</p>
          <p><strong>Tổng tiền thanh toán:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPay)}</p>
        </div>
      
`;

    emailHTML += `
        <h2>Sản phẩm</h2>
        <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <th style="border: 1px solid #000;">Tên sản phẩm</th>
          <th style="border: 1px solid #000;">Hình ảnh</th>
          <th style="border: 1px solid #000;">Số lượng</th>
          <th style="border: 1px solid #000;">Màu sắc</th>
          <th style="border: 1px solid #000;">Đơn giá</th>
          <th style="border: 1px solid #000;">Bảo hành</th>
          <th style="border: 1px solid #000;">Thành tiền</th>
        </tr>
        <!-- Duyệt qua danh sách sản phẩm đã đặt -->
        ${populatedOrder.items.map(item => `
          <tr>
          <td style="border: 1px solid #000; text-align: center;">
          ${item.product.name}  ${item.memory !== undefined ? item.memory : ''}
        </td>        
            <td style="border: 1px solid #000; text-align: center;"><img src="${item.pictures}" alt="Hình ảnh sản phẩm" class="product-image" style="width: 100px; height: 100px;"></td>
            <td style="border: 1px solid #000; text-align: center;">${item.quantity}</td>
            <td style="border: 1px solid #000; text-align: center;">${item.color}</td>
            <td style="border: 1px solid #000; text-align: center;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
            <td style="border: 1px solid #000; text-align: center;">${item.product.warrantyPeriod} tháng</td>
            <td style="border: 1px solid #000; text-align: center;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.subtotal)}</td>
          </tr>
        `).join('')}
      </table>
      <p>Lưu ý: Đây là email tự động, vui lòng không trả lời email này.</p>   
      </div>   
          `;

    const data = {
      email: userEmail,
      html: emailHTML,
    };

    await orderSendMail(data);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Lỗi khi thêm đơn hàng:' });
  }
};
const getAllOrdersPending = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let query = { status: "Chờ xác nhận" };
    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })
      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const getAllOrdersReady = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let query = { status: "Đang chuẩn bị đơn hàng" };
    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })

      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const getAllOrdersDelivery = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let query = { status: "Đang giao hàng" };
    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })

      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const getAllOrdersDelivered = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let query = { status: "Đã giao hàng" };
    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })

      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const getAllOrdersComplete = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let query = { status: "Đã hoàn thành" };
    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })

      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const getAllOrdersReadyCancel = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let query = { status: "Đang chờ huỷ" };
    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })

      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const getAllOrdersCancel = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let query = { status: "Đã huỷ" };
    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })

      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
    }
    const vnTime = moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");


    let updateData = {
      status: 'Đã hoàn thành',
      completeDate: vnTime,
    };


    if (order.isPay === 'Đang chờ thanh toán') {
      updateData.isPay = 'Đã thanh toán';
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const deliveredOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const vnTime = moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
    }

    let updateData = {
      status: 'Đã giao hàng',
      completeDate: vnTime,
    };


    if (order.isPay === 'Đang chờ thanh toán') {
      updateData.isPay = 'Đã thanh toán';
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const getAllOrdersDashboard = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product')
      .populate('voucher')
      .lean();
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
    }
    for (const cartItem of order.items) {
      const productVariantId = cartItem.productVariant;
      const productVariant = await ProductVariant.findById(productVariantId);

      if (productVariant) {
        const matchedAttribute = productVariant.attributes.find(attribute => attribute.sku === cartItem.sku);

        if (matchedAttribute) {
          const quantityInCart = cartItem.quantity;
          const totalQuantity = matchedAttribute.quantity + quantityInCart;
          const totalSold = matchedAttribute.sold - quantityInCart;

          matchedAttribute.quantity = totalQuantity;
          matchedAttribute.sold = totalSold;

          await productVariant.save();
        }
      }
    }
    await Order.findByIdAndDelete(orderId);

    res.status(200).json({ success: true, message: 'Đã hủy đơn hàng' });
  } catch (error) {
    console.error('Lỗi khi hủy đơn hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const cancelOrderWithReason = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
    }
    for (const cartItem of order.items) {
      const productVariantId = cartItem.productVariant;
      const productVariant = await ProductVariant.findById(productVariantId);

      if (productVariant) {
        const matchedAttribute = productVariant.attributes.find(attribute => attribute.sku === cartItem.sku);

        if (matchedAttribute) {
          const quantityInCart = cartItem.quantity;
          const totalQuantity = matchedAttribute.quantity + quantityInCart;
          const totalSold = matchedAttribute.sold - quantityInCart;

          matchedAttribute.quantity = totalQuantity;
          matchedAttribute.sold = totalSold;

          await productVariant.save();
        }
      }
    }
    order.status = 'Đã huỷ';
    order.reasonCancelled = reason || order.reasonCancelled;
    await order.save();
    res.status(200).json({ success: true, message: 'Đã cập nhật trạng thái đơn hàng thành đã huỷ' });
  } catch (error) {
    console.error('Lỗi khi huỷ đơn hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const searchOrderPending = async (req, res) => {
  try {
    const query = req.query.q;
    const shippingMethod = req.query.shippingMethod;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let searchConditions = [{ status: 'Chờ xác nhận' }];

    if (query) {
      const regex = new RegExp(query, 'i');
      searchConditions.push({
        $or: [
          { userPhone: { $regex: regex } },
          { userEmail: { $regex: regex } },
          { userName: { $regex: regex } },
          { orderCode: { $regex: regex } }
        ]
      });
    }

    if (shippingMethod) {
      searchConditions.push({ shippingMethod: shippingMethod });
    }

    const totalOrders = await Order.countDocuments({ $and: searchConditions });
    const orders = await Order.find({ $and: searchConditions })
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })
      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};


const searchOrderReady = async (req, res) => {
  try {
    const query = req.query.q;
    const shippingMethod = req.query.shippingMethod;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let searchConditions = [{ status: 'Đang chuẩn bị đơn hàng' }];

    if (query) {
      const regex = new RegExp(query, 'i');
      searchConditions.push({
        $or: [
          { userPhone: { $regex: regex } },
          { userEmail: { $regex: regex } },
          { userName: { $regex: regex } },
          { orderCode: { $regex: regex } }
        ]
      });
    }

    if (shippingMethod) {
      searchConditions.push({ shippingMethod: shippingMethod });
    }

    const totalOrders = await Order.countDocuments({ $and: searchConditions });
    const orders = await Order.find({ $and: searchConditions })
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })
      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};

const searchOrderDelivery = async (req, res) => {
  try {
    const query = req.query.q;
    const shippingMethod = req.query.shippingMethod;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let searchConditions = [{ status: 'Đang giao hàng' }];

    if (query) {
      const regex = new RegExp(query, 'i');
      searchConditions.push({
        $or: [
          { userPhone: { $regex: regex } },
          { userEmail: { $regex: regex } },
          { userName: { $regex: regex } },
          { orderCode: { $regex: regex } }
        ]
      });
    }

    if (shippingMethod) {
      searchConditions.push({ shippingMethod: shippingMethod });
    }

    const totalOrders = await Order.countDocuments({ $and: searchConditions });
    const orders = await Order.find({ $and: searchConditions })
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })
      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};

const searchOrderDelivered = async (req, res) => {
  try {
    const query = req.query.q;
    const shippingMethod = req.query.shippingMethod;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let searchConditions = [{ status: 'Đã giao hàng' }];

    if (query) {
      const regex = new RegExp(query, 'i');
      searchConditions.push({
        $or: [
          { userPhone: { $regex: regex } },
          { userEmail: { $regex: regex } },
          { userName: { $regex: regex } },
          { orderCode: { $regex: regex } }
        ]
      });
    }

    if (shippingMethod) {
      searchConditions.push({ shippingMethod: shippingMethod });
    }

    const totalOrders = await Order.countDocuments({ $and: searchConditions });
    const orders = await Order.find({ $and: searchConditions })
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })
      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};

const searchOrderComplete = async (req, res) => {
  try {
    const query = req.query.q;
    const shippingMethod = req.query.shippingMethod;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let searchConditions = [{ status: 'Đã hoàn thành' }];

    if (query) {
      const regex = new RegExp(query, 'i');
      searchConditions.push({
        $or: [
          { userPhone: { $regex: regex } },
          { userEmail: { $regex: regex } },
          { userName: { $regex: regex } },
          { orderCode: { $regex: regex } }
        ]
      });
    }

    if (shippingMethod) {
      searchConditions.push({ shippingMethod: shippingMethod });
    }

    const totalOrders = await Order.countDocuments({ $and: searchConditions });
    const orders = await Order.find({ $and: searchConditions })
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })
      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};

const searchOrderReadyCancel = async (req, res) => {
  try {
    const query = req.query.q;
    const shippingMethod = req.query.shippingMethod;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let searchConditions = [{ status: 'Đang chờ huỷ' }];

    if (query) {
      const regex = new RegExp(query, 'i');
      searchConditions.push({
        $or: [
          { userPhone: { $regex: regex } },
          { userEmail: { $regex: regex } },
          { userName: { $regex: regex } },
          { orderCode: { $regex: regex } }
        ]
      });
    }

    if (shippingMethod) {
      searchConditions.push({ shippingMethod: shippingMethod });
    }

    const totalOrders = await Order.countDocuments({ $and: searchConditions });
    const orders = await Order.find({ $and: searchConditions })
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })
      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};

const searchOrderCancel = async (req, res) => {
  try {
    const query = req.query.q;
    const shippingMethod = req.query.shippingMethod;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let searchConditions = [{ status: 'Đã huỷ' }];

    if (query) {
      const regex = new RegExp(query, 'i');
      searchConditions.push({
        $or: [
          { userPhone: { $regex: regex } },
          { userEmail: { $regex: regex } },
          { userName: { $regex: regex } },
          { orderCode: { $regex: regex } }
        ]
      });
    }

    if (shippingMethod) {
      searchConditions.push({ shippingMethod: shippingMethod });
    }

    const totalOrders = await Order.countDocuments({ $and: searchConditions });
    const orders = await Order.find({ $and: searchConditions })
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })
      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const status = req.query.status;
    const orders = await Order.find({ user: userId, status: status })
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })
      .populate('voucher')
      .sort({ createDate: -1 })
      .lean();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getOrdersDetails = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const { userId } = req.query;
    const order = await Order.findOne({ orderCode: orderCode });
    if (order && order.user && order.user.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Không có quyền truy cập đơn hàng này' });
    }
    const orders = await Order.findOne({ orderCode: orderCode })
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })
      .populate('voucher').lean();

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const cancelOrderbyUser = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const { reason } = req.body;
    const { userId } = req.query;
    const order = await Order.findOne({ orderCode: orderCode });
    if (order && order.user.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Không có quyền truy cập đơn hàng này' });
    }
    for (const cartItem of order.items) {
      const productVariantId = cartItem.productVariant;
      const productVariant = await ProductVariant.findById(productVariantId);

      if (productVariant) {
        const matchedAttribute = productVariant.attributes.find(attribute => attribute.sku === cartItem.sku);

        if (matchedAttribute) {
          const quantityInCart = cartItem.quantity;
          const totalQuantity = matchedAttribute.quantity + quantityInCart;
          const totalSold = matchedAttribute.sold - quantityInCart;

          matchedAttribute.quantity = totalQuantity;
          matchedAttribute.sold = totalSold;

          await productVariant.save();
        }
      }
    }
    order.status = 'Đã huỷ';
    order.reasonCancelled = reason;
    await order.save();
    res.status(200).json({ success: true, message: 'Đã gửi yêu cầu huỷ đơn hàng' });
  } catch (error) {
    console.error('Lỗi khi hủy đơn hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const cancelOrderbyUser1 = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const { reason } = req.body;
    const { userId } = req.query;
    const order = await Order.findOne({ orderCode: orderCode });
    if (order && order.user.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Không có quyền truy cập đơn hàng này' });
    }
    for (const cartItem of order.items) {
      const productVariantId = cartItem.productVariant;
      const productVariant = await ProductVariant.findById(productVariantId);

      if (productVariant) {
        const matchedAttribute = productVariant.attributes.find(attribute => attribute.sku === cartItem.sku);

        if (matchedAttribute) {
          const quantityInCart = cartItem.quantity;
          const totalQuantity = matchedAttribute.quantity + quantityInCart;
          const totalSold = matchedAttribute.sold - quantityInCart;

          matchedAttribute.quantity = totalQuantity;
          matchedAttribute.sold = totalSold;

          await productVariant.save();
        }
      }
    }
    order.status = 'Đang chờ huỷ';
    order.reasonCancelled = reason;
    await order.save();
    res.status(200).json({ success: true, message: 'Đã gửi yêu cầu huỷ đơn hàng' });
  } catch (error) {
    console.error('Lỗi khi hủy đơn hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const completeOrderUser = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const { userId } = req.query;

    const order = await Order.findOne({ orderCode });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
    }
    if (order.user.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Không có quyền hoàn thành đơn hàng này' });
    }

    const updateData = {
      status: 'Đã hoàn thành'
    };

    const updatedOrder = await Order.findOneAndUpdate({ orderCode }, updateData, { new: true });

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const addProductRating = async (req, res) => {
  try {
    const { productId, userId, orderCode } = req.query;
    const { rating, comment, pictures } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Sản phẩm không tồn tại' });
    }
    const order = await Order.findOne({
      user: userId,
      orderCode,
      items: {
        $elemMatch: { product: productId, rated: false }
      }
    });
    if (!order) {
      return res.status(403).json({ success: false, error: 'Bạn không có quyền đánh giá sản phẩm này' });
    }
    order.items.forEach((item) => {
      if (item.product.toString() === productId && !item.rated) {
        item.rated = true;
      }
    });
    await order.save();
    const vnTime = moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");
    const newRating = {
      user: userId,
      rating,
      comment,
      pictures,
      createDate: vnTime
    };
    product.ratings.push(newRating);
    const updatedProduct = await product.save();

    res.status(201).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const changeProduct = async (req, res) => {
  const { id, orderId } = req.params;
  const order = await Order.findById(orderId).populate({
    path: 'items.product',
    select: 'name warrantyPeriod'
  });

  if (!order) {
    return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
  }

  const productItem = order.items.find((item) => item.id.toString() === id);

  if (!productItem) {
    return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm trong đơn hàng' });
  }
  const vnTime = moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");

  if (productItem.change) {
    productItem.change.isHave = true;
    productItem.change.dateChange = vnTime;

    const productVariantId = productItem.productVariant;
    const sku = productItem.sku;

    const productVariant = await ProductVariant.findById(productVariantId);

    if (!productVariant) {
      return res.status(404).json({ success: false, error: 'Sản phẩm không tồn tại' });
    }

    const matchedAttribute = productVariant.attributes.find(attribute => attribute.sku === sku);

    if (!matchedAttribute) {
      return res.status(400).json({ success: false, error: 'Sản phẩm đã hết hàng' });
    }
    const remainingQuantity = matchedAttribute.quantity - 1;
    if (remainingQuantity < 0) {
      return res.status(400).json({ success: false, error: `Sản phẩm ${productItem.product.name} ${productItem.memory} đã hết hàng` });
    }

    matchedAttribute.quantity = remainingQuantity;
    matchedAttribute.sold += 1;
    await productVariant.save();
  }
  await order.save();
  res.status(200).json({
    success: true,
    message: 'Đã cập nhật yêu cầu đổi trả',
    updatedItem: productItem
  });
}
const checkBH = async (req, res) => {
  try {
    const { phone } = req.body;
    const orders = await Order.find({ userPhone: phone, status: "Đã hoàn thành" }).populate({
      path: 'items.product',
      select: 'name warrantyPeriod'
    });
    if (!orders || orders.length === 0) {
      return res.status(200).json({ message: "Không tìm thấy đơn hàng" });
    }
    const allProducts = orders.reduce((products, order) => {
      const productsWithCompleteDate = order.items.map(item => ({ ...item.toObject(), completeDate: order.completeDate }));
      return products.concat(productsWithCompleteDate);
    }, []);
    return res.status(200).json({ products: allProducts });
  } catch (error) {
    console.error('Lỗi khi kiểm tra bảo hành:', error);
    return res.status(500).json({ message: "Đã xảy ra lỗi server" });
  }
};
const autoUpdateOrderStatus = async () => {
  try {
    const sevenDaysAgo = moment().tz("Asia/Ho_Chi_Minh").subtract(30, 'seconds').format("DD/MM/YYYY HH:mm:ss");

    const ordersToUpdate = await Order.find({ status: 'Đã giao hàng', completeDate: { $lte: sevenDaysAgo } });
    for (const order of ordersToUpdate) {
      await Order.findByIdAndUpdate(order._id, { status: 'Đã hoàn thành' });
    }

    console.log(`Đã cập nhật ${ordersToUpdate.length} đơn hàng thành trạng thái 'Đã hoàn thành'.`);
  } catch (error) {
    console.error('Lỗi khi tự động cập nhật trạng thái đơn hàng:', error);
  }
};
const autoUpdateCancelledStatus = async () => {
  try {
    const oneMinuteAgo = moment().tz("Asia/Ho_Chi_Minh").subtract(2, 'minutes').format("DD/MM/YYYY HH:mm:ss");

    const ordersToCancel = await Order.find({
      paymentMethod: { $ne: 'Thanh toán khi nhận hàng' },
      isPay: 'Đang chờ thanh toán',
      createDate: { $lte: oneMinuteAgo }
    });
    for (const order of ordersToCancel) {
      for (const cartItem of order.items) {
        const productVariantId = cartItem.productVariant;
        const productVariant = await ProductVariant.findById(productVariantId);

        if (productVariant) {
          const matchedAttribute = productVariant.attributes.find(attribute => attribute.sku === cartItem.sku);

          if (matchedAttribute) {
            const quantityInCart = cartItem.quantity;
            const totalQuantity = matchedAttribute.quantity + quantityInCart;
            const totalSold = matchedAttribute.sold - quantityInCart;

            matchedAttribute.quantity = totalQuantity;
            matchedAttribute.sold = totalSold;

            await productVariant.save();
          }
        }
      }
      await Order.findByIdAndUpdate(order._id, { status: 'Đã huỷ', reasonCancelled: 'Chưa thanh toán thông qua ví điện tử', isPay: 'Chưa thanh toán' });
    }

    console.log(`Đã cập nhật ${ordersToCancel.length} đơn hàng thành trạng thái 'Đã hủy'.`);
  } catch (error) {
    console.error('Lỗi khi tự động cập nhật trạng thái đơn hàng:', error);
  }
};

const getSoldProductsByDate = async (req, res) => {
  try {
    const weeklySales = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: {
            year: { $year: { $dateFromString: { dateString: '$createDate', format: '%d/%m/%Y %H:%M:%S' } } },
            week: { $isoWeek: { $dateFromString: { dateString: '$createDate', format: '%d/%m/%Y %H:%M:%S' } } }
          },
          totalSold: { $sum: '$items.quantity' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.week': 1
        }
      }
    ]);

    const monthlySales = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: {
            year: { $year: { $dateFromString: { dateString: '$createDate', format: '%d/%m/%Y %H:%M:%S' } } },
            month: { $month: { $dateFromString: { dateString: '$createDate', format: '%d/%m/%Y %H:%M:%S' } } }
          },
          totalSold: { $sum: '$items.quantity' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    const yearlySales = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: {
            year: { $year: { $dateFromString: { dateString: '$createDate', format: '%d/%m/%Y %H:%M:%S' } } }
          },
          totalSold: { $sum: '$items.quantity' }
        }
      },
      {
        $sort: {
          '_id.year': 1
        }
      }
    ]);

    res.status(200).json({ success: true, data: { weeklySales, monthlySales, yearlySales } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTotalPayByDate = async (req, res) => {
  try {
    const weeklyPay = await Order.aggregate([
      {
        $match: {
          isPay: { $in: ['Đã thanh toán', 'Đã thanh toán thông qua VNPAY'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: { $dateFromString: { dateString: '$createDate', format: '%d/%m/%Y %H:%M:%S' } } },
            week: { $isoWeek: { $dateFromString: { dateString: '$createDate', format: '%d/%m/%Y %H:%M:%S' } } }
          },
          totalPay: { $sum: '$totalPay' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.week': 1
        }
      }
    ]);

    const monthlyPay = await Order.aggregate([
      {
        $match: {
          isPay: { $in: ['Đã thanh toán', 'Đã thanh toán thông qua VNPAY'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: { $dateFromString: { dateString: '$createDate', format: '%d/%m/%Y %H:%M:%S' } } },
            month: { $month: { $dateFromString: { dateString: '$createDate', format: '%d/%m/%Y %H:%M:%S' } } }
          },
          totalPay: { $sum: '$totalPay' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    const yearlyPay = await Order.aggregate([
      {
        $match: {
          isPay: { $in: ['Đã thanh toán', 'Đã thanh toán thông qua VNPAY'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: { $dateFromString: { dateString: '$createDate', format: '%d/%m/%Y %H:%M:%S' } } }
          },
          totalPay: { $sum: '$totalPay' }
        }
      },
      {
        $sort: {
          '_id.year': 1
        }
      }
    ]);

    res.status(200).json({ success: true, data: { weeklyPay, monthlyPay, yearlyPay } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSoldProductsByCategory = async (req, res) => {
  try {
    const soldProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $lookup: {
          from: 'categories',
          localField: 'productDetails.category',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      { $unwind: '$categoryDetails' },
      {
        $group: {
          _id: '$categoryDetails.name',
          totalSold: { $sum: '$items.quantity' }
        }
      },
      {
        $sort: { totalSold: -1 }
      }
    ]);

    res.json({ data: soldProducts });
  } catch (error) {
    console.error('Error fetching sold products by category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const get7DaysTotalPay = async (req, res) => {
  // Chuyển startDate và endDate thành đối tượng moment với múi giờ Asia/Ho_Chi_Minh
  const start = moment.tz("Asia/Ho_Chi_Minh").subtract(7, 'days').startOf('day');
  const end = moment.tz("Asia/Ho_Chi_Minh").endOf('day');

  // Định dạng lại ngày tháng để so sánh
  const formattedStartDate = start.toDate(); // Chuyển startDate thành đối tượng Date
  const formattedEndDate = end.toDate();     // Chuyển endDate thành đối tượng Date

  try {
    const results = await Order.aggregate([
      {
        $match: {
          status: "Đã hoàn thành",
          $expr: {
            $and: [
              { $gte: [{ $dateFromString: { dateString: "$completeDate", format: "%d/%m/%Y %H:%M:%S", timezone: "Asia/Ho_Chi_Minh" } }, formattedStartDate] },
              { $lte: [{ $dateFromString: { dateString: "$completeDate", format: "%d/%m/%Y %H:%M:%S", timezone: "Asia/Ho_Chi_Minh" } }, formattedEndDate] }
            ]
          }
        }
      },
      {
        $project: {
          totalPay: 1,
          completeDate: {
            $dateFromString: {
              dateString: "$completeDate",
              format: "%d/%m/%Y %H:%M:%S",
              timezone: "Asia/Ho_Chi_Minh"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$completeDate"
            }
          },
          totalPay: {
            $sum: "$totalPay"
          },
          orderCount: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          _id: 1 // Sort by date ascending
        }
      }
    ]);

    res.json({ data: results });
  } catch (error) {
    console.error("Error aggregating orders: ", error);
    throw error;
  }
};


const get28DaysTotalPay = async (req, res) => {
  // Chuyển startDate và endDate thành đối tượng moment với múi giờ Asia/Ho_Chi_Minh
  const start = moment.tz("Asia/Ho_Chi_Minh").subtract(28, 'days').startOf('day');
  const end = moment.tz("Asia/Ho_Chi_Minh").endOf('day');

  // Định dạng lại ngày tháng để so sánh
  const formattedStartDate = start.toDate(); // Chuyển startDate thành đối tượng Date
  const formattedEndDate = end.toDate();     // Chuyển endDate thành đối tượng Date

  try {
    const results = await Order.aggregate([
      {
        $match: {
          status: "Đã hoàn thành",
          $expr: {
            $and: [
              { $gte: [{ $dateFromString: { dateString: "$completeDate", format: "%d/%m/%Y %H:%M:%S", timezone: "Asia/Ho_Chi_Minh" } }, formattedStartDate] },
              { $lte: [{ $dateFromString: { dateString: "$completeDate", format: "%d/%m/%Y %H:%M:%S", timezone: "Asia/Ho_Chi_Minh" } }, formattedEndDate] }
            ]
          }
        }
      },
      {
        $project: {
          totalPay: 1,
          completeDate: {
            $dateFromString: {
              dateString: "$completeDate",
              format: "%d/%m/%Y %H:%M:%S",
              timezone: "Asia/Ho_Chi_Minh"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$completeDate"
            }
          },
          totalPay: {
            $sum: "$totalPay"
          },
          orderCount: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          _id: 1 // Sort by date ascending
        }
      }
    ]);

    res.json({ data: results });
  } catch (error) {
    console.error("Error aggregating orders: ", error);
    throw error;
  }
};

const get90DaysTotalPay = async (req, res) => {
  // Chuyển startDate và endDate thành đối tượng moment với múi giờ Asia/Ho_Chi_Minh
  const start = moment.tz("Asia/Ho_Chi_Minh").subtract(90, 'days').startOf('day');
  const end = moment.tz("Asia/Ho_Chi_Minh").endOf('day');

  // Định dạng lại ngày tháng để so sánh
  const formattedStartDate = start.toDate(); // Chuyển startDate thành đối tượng Date
  const formattedEndDate = end.toDate();     // Chuyển endDate thành đối tượng Date

  try {
    const results = await Order.aggregate([
      {
        $match: {
          status: "Đã hoàn thành",
          $expr: {
            $and: [
              { $gte: [{ $dateFromString: { dateString: "$completeDate", format: "%d/%m/%Y %H:%M:%S", timezone: "Asia/Ho_Chi_Minh" } }, formattedStartDate] },
              { $lte: [{ $dateFromString: { dateString: "$completeDate", format: "%d/%m/%Y %H:%M:%S", timezone: "Asia/Ho_Chi_Minh" } }, formattedEndDate] }
            ]
          }
        }
      },
      {
        $project: {
          totalPay: 1,
          completeDate: {
            $dateFromString: {
              dateString: "$completeDate",
              format: "%d/%m/%Y %H:%M:%S",
              timezone: "Asia/Ho_Chi_Minh"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$completeDate"
            }
          },
          totalPay: {
            $sum: "$totalPay"
          },
          orderCount: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          _id: 1 // Sort by date ascending
        }
      }
    ]);

    res.json({ data: results });
  } catch (error) {
    console.error("Error aggregating orders: ", error);
    throw error;
  }
};


const get365DaysTotalPay = async (req, res) => {
  // Chuyển startDate và endDate thành đối tượng moment với múi giờ Asia/Ho_Chi_Minh
  const start = moment.tz("Asia/Ho_Chi_Minh").subtract(365, 'days').startOf('day');
  const end = moment.tz("Asia/Ho_Chi_Minh").endOf('day');

  // Định dạng lại ngày tháng để so sánh
  const formattedStartDate = start.toDate(); // Chuyển startDate thành đối tượng Date
  const formattedEndDate = end.toDate();     // Chuyển endDate thành đối tượng Date

  try {
    const results = await Order.aggregate([
      {
        $match: {
          status: "Đã hoàn thành",
          $expr: {
            $and: [
              { $gte: [{ $dateFromString: { dateString: "$completeDate", format: "%d/%m/%Y %H:%M:%S", timezone: "Asia/Ho_Chi_Minh" } }, formattedStartDate] },
              { $lte: [{ $dateFromString: { dateString: "$completeDate", format: "%d/%m/%Y %H:%M:%S", timezone: "Asia/Ho_Chi_Minh" } }, formattedEndDate] }
            ]
          }
        }
      },
      {
        $project: {
          totalPay: 1,
          completeDate: {
            $dateFromString: {
              dateString: "$completeDate",
              format: "%d/%m/%Y %H:%M:%S",
              timezone: "Asia/Ho_Chi_Minh"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$completeDate"
            }
          },
          totalPay: {
            $sum: "$totalPay"
          },
          orderCount: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          _id: 1 // Sort by date ascending
        }
      }
    ]);

    res.json({ data: results });
  } catch (error) {
    console.error("Error aggregating orders: ", error);
    throw error;
  }
};


const getAllDaysTotalPay = async (req, res) => {
  // Chuyển startDate và endDate thành đối tượng moment với múi giờ Asia/Ho_Chi_Minh
  const start = moment.tz("Asia/Ho_Chi_Minh").subtract(3650, 'days').startOf('day');
  const end = moment.tz("Asia/Ho_Chi_Minh").endOf('day');

  // Định dạng lại ngày tháng để so sánh
  const formattedStartDate = start.toDate(); // Chuyển startDate thành đối tượng Date
  const formattedEndDate = end.toDate();     // Chuyển endDate thành đối tượng Date

  try {
    const results = await Order.aggregate([
      {
        $match: {
          status: "Đã hoàn thành",
          $expr: {
            $and: [
              { $gte: [{ $dateFromString: { dateString: "$completeDate", format: "%d/%m/%Y %H:%M:%S", timezone: "Asia/Ho_Chi_Minh" } }, formattedStartDate] },
              { $lte: [{ $dateFromString: { dateString: "$completeDate", format: "%d/%m/%Y %H:%M:%S", timezone: "Asia/Ho_Chi_Minh" } }, formattedEndDate] }
            ]
          }
        }
      },
      {
        $project: {
          totalPay: 1,
          completeDate: {
            $dateFromString: {
              dateString: "$completeDate",
              format: "%d/%m/%Y %H:%M:%S",
              timezone: "Asia/Ho_Chi_Minh"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$completeDate"
            }
          },
          totalPay: {
            $sum: "$totalPay"
          },
          orderCount: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          _id: 1 // Sort by date ascending
        }
      }
    ]);

    res.json({ data: results });
  } catch (error) {
    console.error("Error aggregating orders: ", error);
    throw error;
  }
};


const calculateTotalPayByDateRange = async (req, res) => {
  const { startDate, endDate } = req.body;

  // Kiểm tra nếu không có startDate hoặc endDate
  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Vui lòng cung cấp ngày bắt đầu và ngày kết thúc." });
  }

  // Chuyển startDate và endDate thành đối tượng moment với múi giờ Asia/Ho_Chi_Minh
  const start = moment.tz(startDate, "Asia/Ho_Chi_Minh").startOf('day');
  const end = moment.tz(endDate, "Asia/Ho_Chi_Minh").endOf('day');

  // Định dạng lại ngày tháng để so sánh
  const formattedStartDate = start.toDate(); // Chuyển startDate thành đối tượng Date
  const formattedEndDate = end.toDate();     // Chuyển endDate thành đối tượng Date

  try {
    const results = await Order.aggregate([
      {
        $match: {
          status: "Đã hoàn thành",
          $expr: {
            $and: [
              { $gte: [{ $dateFromString: { dateString: "$completeDate", format: "%d/%m/%Y %H:%M:%S", timezone: "Asia/Ho_Chi_Minh" } }, formattedStartDate] },
              { $lte: [{ $dateFromString: { dateString: "$completeDate", format: "%d/%m/%Y %H:%M:%S", timezone: "Asia/Ho_Chi_Minh" } }, formattedEndDate] }
            ]
          }
        }
      },
      {
        $project: {
          totalPay: 1,
          completeDate: {
            $dateFromString: {
              dateString: "$completeDate",
              format: "%d/%m/%Y %H:%M:%S",
              timezone: "Asia/Ho_Chi_Minh"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$completeDate"
            }
          },
          totalPay: {
            $sum: "$totalPay"
          },
          orderCount: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          _id: 1 // Sắp xếp theo ngày tăng dần
        }
      }
    ]);

    res.json({ data: results });
  } catch (error) {
    console.error("Lỗi khi tổng hợp đơn hàng: ", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

//cron.schedule('0 0 * * *', autoUpdateCancelledStatus); 
//cron.schedule('0 0 */7 * *', autoUpdateOrderStatus);
cron.schedule('*/5 * * * *', autoUpdateOrderStatus);
cron.schedule('*/5 * * * *', autoUpdateCancelledStatus);
const requestItemChange = async (req, res) => {
  try {
    const { orderCode, productId, productVariantId, reason } = req.body;
    const userId = req.params.id;

    const order = await Order.findOne({ orderCode }).populate({
      path: 'items.product',
      select: 'name warrantyPeriod _id'
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const item = order.items.find(i =>
      i.product._id.toString() === productId && i.productVariant.toString() === productVariantId
    );


    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in the order'
      });
    }
    if (order.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to change request'
      });
    }

    const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');
    item.change.status = 'Đang xử lý';
    item.change.changeDates = vietnamTime;
    item.change.reasons = reason;


    await order.save();

    res.status(200).json({
      success: true,
      message: 'Change request submitted successfully',
      order
    });
  } catch (error) {
    console.error('Error requesting item change:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
const updateChangeStatus = async (req, res) => {
  try {
    const { orderCode, productId, productVariantId, newStatus } = req.body;


    const order = await Order.findOne({ orderCode }).populate({
      path: 'items.product',
      select: 'name warrantyPeriod _id'
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }


    const item = order.items.find(i =>
      i.product._id.toString() === productId && i.productVariant.toString() === productVariantId
    );
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in the order'
      });
    }


    const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');

    switch (newStatus) {
      case 'Từ chối':
        item.change.status = newStatus;
        item.change.changeDates = vietnamTime;
        break;
      case 'Đã hoàn thành':
        const productVariant = await ProductVariant.findById(productVariantId);
        const product = await Product.findById(productId);
        if (!productVariant) {
          return res.status(400).json({ success: false, error: 'Sản phẩm biến thể không tồn tại' });
        }
        const matchedAttribute = productVariant.attributes.find(attribute => attribute.sku === item.sku);
        if (!matchedAttribute || matchedAttribute.quantity < item.quantity) {
          return res.status(400).json({ success: false, error: `Sản phẩm ${product.name} với màu ${item.color} đã hết hàng hoặc không đủ số lượng` });
        }
        const quantityInCart = parseInt(item.quantity, 10);
        const remainingQuantity = matchedAttribute.quantity - quantityInCart;
        matchedAttribute.quantity = remainingQuantity;
        await productVariant.save();
        item.change.status = newStatus;
        item.change.changeDateComplete = vietnamTime;
        item.change.changeCount += 1;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Change status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating change status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
const getOrdersWithChangeStatus = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    // Tìm các đơn hàng có ít nhất một mục hàng có trạng thái là 'Đang xử lý'
    const query = {
      'items.change.status': 'Đang xử lý'
    };

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })
      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Error getting orders with change status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
const getOrdersWithoutProcessingStatus = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;


    const query = {
      $and: [
        { 'items.change.status': { $nin: ['Đang xử lý'] } },
        {
          $or: [
            { 'items.change.status': 'Từ chối' },
            { 'items.change.status': 'Đã hoàn thành' }
          ]
        }
      ]
    };

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })
      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Error getting orders without processing status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const searchOrdersWithChangeStatus = async (req, res) => {
  try {
    const { q: query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let searchConditions = [{ 'items.change.status': 'Đang xử lý' }];

    if (query) {
      const regex = new RegExp(query, 'i');
      searchConditions.push({
        $or: [
          { userPhone: { $regex: regex } },
          { userEmail: { $regex: regex } },
          { userName: { $regex: regex } },
          { orderCode: { $regex: regex } }
        ]
      });
    }

    const totalOrders = await Order.countDocuments({ $and: searchConditions });
    const orders = await Order.find({ $and: searchConditions })
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })
      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();


    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Error searching orders without processing status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
const searchOrdersWithoutStatus = async (req, res) => {
  try {
    const { q: query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    let searchConditions = [
      { 'items.change.status': { $nin: ['Đang xử lý'] } },
      {
        $or: [
          { 'items.change.status': 'Từ chối' },
          { 'items.change.status': 'Đã hoàn thành' }
        ]
      }
    ];

    if (query) {
      const regex = new RegExp(query, 'i');
      searchConditions.push({
        $or: [
          { userPhone: { $regex: regex } },
          { userEmail: { $regex: regex } },
          { userName: { $regex: regex } },
          { orderCode: { $regex: regex } }
        ]
      });
    }

    const totalOrders = await Order.countDocuments({ $and: searchConditions });
    const orders = await Order.find({ $and: searchConditions })
      .populate({
        path: 'items.product',
        select: 'name warrantyPeriod'
      })
      .populate('voucher')
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Return the search results
    res.status(200).json({
      success: true,
      data: orders,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    console.error('Error searching orders with change status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { searchOrdersWithoutStatus, getOrdersWithoutProcessingStatus, searchOrdersWithChangeStatus, getOrdersWithChangeStatus, updateChangeStatus, requestItemChange, cancelOrderbyUser1, calculateTotalPayByDateRange, get7DaysTotalPay, get28DaysTotalPay, get90DaysTotalPay, get365DaysTotalPay, getAllDaysTotalPay, getTotalPayByDate, getSoldProductsByCategory, getSoldProductsByDate, deliveredOrder, searchOrderDelivered, getAllOrdersDelivered, searchOrderReadyCancel, getAllOrdersReadyCancel, searchOrderDelivery, searchOrderComplete, searchOrderCancel, cancelOrderWithReason, searchOrderReady, getAllOrdersCancel, getAllOrdersComplete, getAllOrdersDelivery, getAllOrdersReady, getAllOrdersDashboard, getAllOrdersPending, checkBH, changeProduct, addProductRating, addOrder, cancelOrderbyUser, completeOrderUser, getOrdersDetails, updateOrderStatus, completeOrder, getOrdersByUserId, deleteOrder, searchOrderPending };
