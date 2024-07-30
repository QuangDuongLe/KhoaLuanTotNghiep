let express = require('express');
let router = express.Router();
let $ = require('jquery');
const request = require('request');
const moment = require('moment');
const querystring = require('qs');
const crypto = require("crypto");
const Order = require('../Model/OrderModel');
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

router.post('/create_payment_url', function (req, res, next) {

    process.env.TZ = 'Asia/Ho_Chi_Minh';

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;



    let tmnCode = process.env.VNP_TMN_CODE;
    let secretKey = process.env.VNP_HASH_SECRET;
    let vnpUrl = process.env.VNP_URL;
    let returnUrl = process.env.VNP_RETURN_URL;
    let orderCode = req.body.orderCode;
    let amount = req.body.amount;
    let OrderInfo = req.body.orderinfo;
    let bankCode = req.body.bankCode;
    let locale = req.body.language;
    if (locale === null || locale === '' || locale === 'undefined') {
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderCode;
    vnp_Params['vnp_OrderInfo'] = OrderInfo + orderCode;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '' && bankCode !== 'undefined') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);


    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.status(200).json({ data: vnpUrl })
});
router.get('/vnpay_return', async function (req, res, next) {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);


    let tmnCode = process.env.VNP_TMN_CODE;
    let secretKey = process.env.VNP_HASH_SECRET;

    ;
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];
        const vnp_TransactionNo = vnp_Params['vnp_TransactionNo'];
        const vnp_OrderInfoEncoded = vnp_Params['vnp_OrderInfo'];
        const vnp_TxnRef = vnp_Params['vnp_TxnRef'];
        const vnp_OrderInfoDecoded = decodeURIComponent(vnp_OrderInfoEncoded);
        const vnp_OrderInfoFormatted = vnp_OrderInfoDecoded.replace(/\+/g, ' ');
        const vnp_Amount = vnp_Params['vnp_Amount'];
        const vnp_BankCode = vnp_Params['vnp_BankCode'];
        const vnp_PayDate = vnp_Params['vnp_PayDate'];
        const formattedPayDate = moment(vnp_PayDate, 'YYYYMMDDHHmmss').format('DD/MM/YYYY HH:mm:ss');
        if (vnp_ResponseCode === '00') {
            const order = await Order.findOne({ orderCode: vnp_TxnRef });
            if (!order) {
                return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
            }
            order.isPay = 'Đã thanh toán thông qua VNPAY';
            const updatedOrder = await order.save();
            if (!updatedOrder) {
                return res.status(404).json({ success: false, error: 'Cập nhật đơn hàng không thành công' });
            }
        }
        res.status(200).json({
            vnp_ResponseCode,
            vnp_TransactionNo,
            vnp_OrderInfoFormatted,
            vnp_Amount,
            vnp_BankCode,
            vnp_PayDate: formattedPayDate,
            vnp_TxnRef
        });
    } else {
        res.status(200).json({ code: '97' });
    }
});
module.exports = router;
