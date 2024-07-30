const User = require('../Model/UserModel');
const argon2 = require('argon2');
const { generalAcesstoken, generalRefreshtoken } = require('../middleware/JWT');
const JWT = require('../middleware/JWT')
const sendMail = require('../ultils/sendMail')
const userRegister = async (req, res) => {
  try {

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).json({ success: false, msg: 'Email đã được sử dụng' });
    }
    const hashPass = await argon2.hash(req.body.passWord);
    const newUser = new User({
      fullName: req.body.fullName,
      phone_number: req.body.phone_number,
      email: req.body.email,
      passWord: hashPass,
      googleId: req.body.googleId,
      facebookId: req.body.facebookId,
      role_id: 2,
      addRess: [{
        address: req.body.addRess,
        isDefault: true
      }],
      isBlocked: false,
      createdAt: Date.now()
    });
    await newUser.save();
    res.status(200).json({ success: true, msg: 'Đăng ký thành công' });
  } catch (error) {

    res.status(400).json({ success: false, msg: 'Thất bại' });
  }
};


const userLogin = async (req, res) => {
  const password = req.body.passWord;
  const email = req.body.email.toLowerCase();
  try {
    const userFound = await User.findOne({ email: email });
    if (userFound) {
      const validPassword = await argon2.verify(userFound.passWord, password);
      if (validPassword) {
        const access_Token = await generalAcesstoken({
          id: userFound._id,
          fullName: userFound.fullName,
          phone_number: userFound.phone_number,
          email: userFound.email,
          addRess: userFound.addRess,
          avatar: userFound.avatar,
          birthDay: userFound.birthDay,
          role_id: userFound.role_id
        });
        const refresh_Token = await generalRefreshtoken({
          id: userFound._id,
          fullName: userFound.fullName,
          phone_number: userFound.phone_number,
          email: userFound.email,
          addRess: userFound.addRess,
          avatar: userFound.avatar,
          birthDay: userFound.birthDay,
          role_id: userFound.role_id
        });


        const tokenData = refresh_Token
        res.cookie('refresh_token', tokenData, { httpOnly: true, secure: true, samesite: 'strict', expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
        return res.status(200).json({
          access_Token,
          refresh_Token
        });
      } else {
        return res.status(401).json({ err: 'Username/Password not match!' });
      }
    } else {
      return res.status(401).json({ err: 'Username/Password not match!' });
    }
  } catch (error) {

    return res.status(500).json({ err: 'Something went wrong' });
  }
};


const userUpdate = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (userId) {
      const updatedUser = await User.findByIdAndUpdate(userId, data);
      if (updatedUser === null) {
        return res.status(401).json({ msg: 'Không tồn tại người dùng' });
      }
      return res.status(200).json({ msg: 'Cập nhật thành công', updatedUser });
    } else {
      return res.status(401).json({ msg: 'Không tìm thấy ID' });
    }
  } catch (error) {

    return res.status(500).json({ msg: 'Lỗi Server' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId) {
      const user = await User.findByIdAndDelete(userId);
      if (user === null) {
        return res.status(401).json({ msg: 'Không tồn tại người dùng' })
      }
      return res.status(200).json({ data: user });

    } else {
      return res.status(401).json({ msg: 'Không tìm thấy ID' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Lỗi Server' });
  }
};
const getAllUser = async (req, res) => {
  try {
    const data = await User.find();
    return res.status(200).json({
      data: data
    });
  } catch (error) {
    return res.status(500).json({ msg: 'Lỗi Server' });
  }
};
const getAdmin = async (req, res) => {
  try {
    const data = await User.find({ role_id: 1 });
    return res.status(200).json({
      data: data
    });
  } catch (error) {
    return res.status(500).json({ msg: 'Lỗi Server' });
  }
};

const getDetailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId) {
      const data = await User.findOne({ _id: userId });
      if (data) {
        return res.status(200).json({ data: data });
      } else {
        return res.status(500).json({ err: 'Không tồn tại User' });
      }
    } else {
      return res.status(400).json({ msg: 'Không tìm thấy ID' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Lỗi Server' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      return res.status(401).json({ msg: 'Không tìm thấy ID' });
    }

    const result = await JWT.refreshTokenJWT(token);
    if (result.status === 'error') {
      return res.status(401).json({ msg: 'Lỗi khi làm mới token' });
    }
    res.status(200).json({ access_Token: result.access_Token });
  } catch (error) {

    return res.status(500).json({ msg: 'Lỗi Server' });
  }
};


const userLogout = (req, res) => {
  res.clearCookie('refresh_token', { httpOnly: true });
  return res.status(200).json({ msg: 'Tạm biệt!' });

};
function generateRandomPassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const newPassword = generateRandomPassword();
    const hashPass = await argon2.hash(newPassword);
    user.passWord = hashPass;
    await user.save();

    const disclaimer = "<p>Lưu ý: Đây là email tự động, vui lòng không trả lời email này.</p>";
    const emailContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              text-align: center;
              padding: 20px;
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              padding: 20px;
            }
            h1 {
              color: #333;
            }
            p {
              color: #555;
            }
            .password {
              font-size: 24px;
              font-weight: bold;
              color: #0073e6;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Di động Gen Z, xin chào</h1>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Dưới đây là mật khẩu mới của bạn:</p>
            <p class="password">${newPassword}</p>
            <p>Vui lòng lưu trữ mật khẩu này một cách an toàn.</p>
            <p class="footer">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
          </div>
          ${disclaimer}
        </body>
        </html>
      `;

    const data = {
      email,
      html: emailContent,
    };

    const rs = await sendMail(data);

    return res.status(200).json({
      success: true,
      rs,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ msg: 'Không tìm thấy ID' });
    }
    const isPasswordValid = await argon2.verify(user.passWord, currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Mật khẩu cũ không đúng' });
    }
    const hashPass = await argon2.hash(newPassword);
    await User.findByIdAndUpdate(userId, { passWord: hashPass }, { new: true });
    return res.status(200).json({ msg: 'Cập nhật mật khẩu thành công' });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const searchUser = async (req, res) => {
  try {
    const query = req.query.q; 
    const regex = new RegExp(query, 'i'); 

   
    const users = await User.find({
      $or: [
        { phone_number: { $regex: regex } }, 
        { fullName: { $regex: regex } }, 
        { email: { $regex: regex } } 
      ]
    });

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};



const checkAcc = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ isBlocked: user.isBlocked });
  } catch (error) {

    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const addAddress = async (req, res) => {
  const userId = req.params.id;
  const { address } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }


    user.addRess.push({ address, isDefault: false });
    await user.save();

    res.status(200).json({ success: true, message: 'Đã thêm địa chỉ mới thành công', user });
  } catch (error) {
    console.error('Lỗi khi thêm địa chỉ mới:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi thêm địa chỉ mới' });
  }
};
const setDefaultAddress = async (req, res) => {
  const userId = req.params.id;
  const { address } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    let addressFound = false;
    user.addRess.forEach(addr => {
      if (addr.address === address) { // Kiểm tra theo tên của địa chỉ
        addr.isDefault = true;
        addressFound = true;
      } else {
        addr.isDefault = false;
      }
    });

    if (!addressFound) {
      return res.status(404).json({ success: false, message: 'Địa chỉ không tồn tại' });
    }

    await user.save();

    res.status(200).json({ success: true, message: 'Đã đặt địa chỉ mặc định thành công', user });
  } catch (error) {
    console.error('Lỗi khi đặt địa chỉ mặc định:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi đặt địa chỉ mặc định' });
  }
};
const deleteAddress = async (req, res) => {
  const userId = req.params.id;
  const addressId = req.params.addressId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    const addressIndex = user.addRess.findIndex(address => address._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ success: false, message: 'Địa chỉ không tồn tại' });
    }

    user.addRess.splice(addressIndex, 1);
    await user.save();

    res.status(200).json({ success: true, message: 'Đã xoá địa chỉ thành công', user });
  } catch (error) {
    console.error('Lỗi khi xoá địa chỉ:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi xoá địa chỉ' });
  }
};

const updateAddress = async (req, res) => {
  const userId = req.params.id;
  const addressId = req.params.addressId;
  const { address } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    const addressToUpdate = user.addRess.find(address => address._id.toString() === addressId);
    if (!addressToUpdate) {
      return res.status(404).json({ success: false, message: 'Địa chỉ không tồn tại' });
    }

    addressToUpdate.address = address;
    await user.save();

    res.status(200).json({ success: true, message: 'Đã cập nhật địa chỉ thành công', user });
  } catch (error) {
    console.error('Lỗi khi cập nhật địa chỉ:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi cập nhật địa chỉ' });
  }
};
const getAddresses = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    const addresses = user.addRess.filter(address => !address.isDefault);
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.error('Lỗi khi lấy địa chỉ của người dùng:', error);
    res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi lấy địa chỉ của người dùng' });
  }
};
const createAdmin = async (req, res) => {
  try {

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).json({ success: false, msg: 'Email đã được sử dụng' });
    }
    const hashPass = await argon2.hash(req.body.passWord);
    const newUser = new User({
      fullName: req.body.fullName,
      phone_number: req.body.phone_number,
      email: req.body.email,
      passWord: hashPass,
      role_id: 1,
      addRess: [{
        address: req.body.addRess,
        isDefault: true
      }],
      isBlocked: false,
      createdAt: Date.now()
    });
    await newUser.save();
    res.status(200).json({ success: true, msg: 'Đăng ký thành công' });
  } catch (error) {

    res.status(400).json({ success: false, msg: 'Thất bại' });
  }
};


module.exports = { createAdmin, getAddresses, updateAddress, deleteAddress, setDefaultAddress, addAddress, getAdmin, userRegister, userLogin, userLogout, userUpdate, deleteUser, getAllUser, refreshToken, getDetailUser, forgotPassword, changePassword, searchUser, checkAcc };