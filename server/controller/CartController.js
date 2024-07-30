const Cart = require('../Model/CartModel');
const Product = require('../Model/ProductModel');
const ProductVariant = require('../Model/ProductVariantModel');

const addToCart = async (req, res) => {
  try {
    const { userId, productName, SKU, quantity } = req.query;
    if(userId === 'undefined' || userId === null || userId === ''){
      return res.status(200).json({error: 'Vui lòng đăng nhập để tiếp tục'})
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }
    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Sản phẩm không tồn tại' });
    }
    const productVariant = await ProductVariant.findOne({
      'attributes.sku': SKU
    });
    if (!productVariant) {
      return res.status(404).json({ success: false, error: 'Sản phẩm biến thể không tồn tại' });
    }
    let color = ''; 
    let matchingPictures = null;
 
    for (const attribute of productVariant.attributes) {
      if (attribute.sku === SKU) {
        color = attribute.color;
        matchingPictures = attribute.pictures;
        if (attribute.quantity < quantity) {
          return res.status(200).json({ success: false, error: 'Số lượng vượt quá giới hạn trong kho' });
        }
        break;
      }
    }
    let matchingItem = null;
    for (const item of cart.items) {
      if (
        item.product.toString() === product._id.toString() &&
        item.productVariant._id.toString() === productVariant._id.toString() &&
        item.color.toString() === color
      ) {
        matchingItem = item;
        break;
      }
    }
    
    if (matchingItem) {
      const newQuantity = Number(matchingItem.quantity) + Number(quantity);
      const sku = productVariant.attributes.find(attr => attr.sku === matchingItem.sku);

      if (newQuantity > sku.quantity) {
        return res.status(200).json({ success: false, error: 'Số lượng vượt quá giới hạn trong kho' });
      }

      if (productVariant.memory) {
        if (newQuantity <= 3) {
          matchingItem.quantity = newQuantity;
          matchingItem.subtotal = Number(matchingItem.subtotal) + (productVariant.newPrice * quantity);
        } else {
          return res.status(200).json({ success: false, error: 'Số lượng tồn tại trong giỏ hàng đã tới mức 3.Nếu muốn mua số lượng lớn vui lòng liên hệ hotline' });
        }
      } else {
        matchingItem.quantity = newQuantity;
        matchingItem.subtotal = Number(matchingItem.subtotal) + (productVariant.newPrice * quantity);
      }
    } else {
      if (productVariant.memory) {
        if (quantity <= 3) {
          const price = productVariant.newPrice;
          const subtotal = price * quantity;
          cart.items.push({
            product: product._id,
            productVariant: productVariant,
            price: productVariant.newPrice,
            color: color,
            memory: productVariant?.memory,
            pictures: matchingPictures,
            quantity,
            subtotal,
            sku: SKU
          });
        } else {
          return res.status(200).json({ success: false, error: 'Số lượng tồn tại trong giỏ hàng đã tới mức 3.Nếu muốn mua số lượng lớn vui lòng liên hệ hotline' });
        }
      } else {
        const price = productVariant.newPrice;
        const subtotal = price * quantity;
        cart.items.push({
          product: product._id,
          productVariant: productVariant,
          price: productVariant.newPrice,
          color: color,
          memory: productVariant?.memory,
          pictures: matchingPictures,
          quantity,
          subtotal,
          sku: SKU
        });
      }
    }

    await cart.save();
    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  const userId = req.params.userId; 
  const cartItemId = req.params.cartItemId; 
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Giỏ hàng không tồn tại' });
    }
    const itemIndex = cart.items.findIndex((item) => item._id.toString() === cartItemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Mục giỏ hàng không tồn tại' });
    }
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const updateCartItemQuantity = async (req, res) => {
  const userId = req.params.userId;
  const cartItemId = req.params.cartItemId;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Giỏ hàng không tồn tại' });
    }

    const item = cart.items.find((item) => item._id.toString() === cartItemId);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Mục giỏ hàng không tồn tại' });
    }
    const productVariant = await ProductVariant.findById(item.productVariant);
    const sku = productVariant.attributes.find(attr => attr.sku === item.sku);
    if (quantity > sku.quantity) {
      return res.status(400).json({ success: false, error: 'Số lượng trong kho không đủ' });
    }

    item.quantity = quantity;
    item.subtotal = productVariant.newPrice * quantity;
    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const getCartItemsByUserId = async (req, res) => {
  const userId = req.params.userId; 
  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Giỏ hàng của người dùng không tồn tại' });
    }
    for (const item of cart.items) {
      const productVariant = await ProductVariant.findById(item.productVariant);
      if (productVariant) {
       
        item.price = productVariant.newPrice; 
        item.subtotal = item.price * item.quantity; 
      }
    }

    await cart.save(); 
    const populatedCart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items',
        populate: {
          path: 'product',
          select: 'name warrantyPeriod'
        }
      })
      .populate({
        path: 'items',
        populate: {
          path: 'productVariant',
        }
      });
    res.status(200).json({ success: true, data: populatedCart.items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateCartItemChecked = async (req, res) => {
  const userId = req.params.userId;
  const cartItemId = req.params.cartItemId;
  const { checked } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Giỏ hàng không tồn tại' });
    }

    const item = cart.items.find((item) => item._id.toString() === cartItemId);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Mục giỏ hàng không tồn tại' });
    }

    item.checked = checked;
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const updateAllCartItemsChecked = async (req, res) => {
  const userId = req.params.userId;
  const { checked } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Giỏ hàng không tồn tại' });
    }

    cart.items.forEach((item) => {
      item.checked = checked;
    });

    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getCheckedCartItemsByUserId = async (req, res) => {
  const userId = req.params.userId; 
  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items',
      match: { checked: true }, 
      populate: {
        path: 'product',
        select: 'name warrantyPeriod'
      }
    }).populate({
      path: 'items',
      match: { checked: true },
      populate: {
        path: 'productVariant',
      }
    });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Giỏ hàng của người dùng không tồn tại' });
    }
    const checkedItems = cart.items.filter(item => item.checked); 
    res.status(200).json({ success: true, data: checkedItems });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const saveToCart = async (req, res) => {
  try {
    const { userId, productName, SKU, quantity } = req.query;
    if(userId === 'undefined' || userId === null || userId === ''){
      return res.status(200).json({error: 'Vui lòng đăng nhập để tiếp tục'})
    }
    const cart = {
      user: userId,
      items: [],
    };
    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Sản phẩm không tồn tại' });
    }
    const productVariant = await ProductVariant.findOne({
      'attributes.sku': SKU
    });
    if (!productVariant) {
      return res.status(404).json({ success: false, error: 'Sản phẩm biến thể không tồn tại' });
    }
    let color = ''; 
    let matchingPictures = null;
 
    for (const attribute of productVariant.attributes) {
      if (attribute.sku === SKU) {
        color = attribute.color;
        matchingPictures = attribute.pictures;
        if (attribute.quantity < quantity) {
          return res.status(200).json({ success: false, error: 'Số lượng vượt quá giới hạn trong kho' });
        }
        break;
      }
    }
    if (productVariant.memory) {
      if (quantity <= 3) {
        const price = productVariant.newPrice;
        const subtotal = price * quantity;
        cart.items.push({
          product: product._id,
          productVariant: productVariant,
          price: productVariant.newPrice,
          color: color,
          memory: productVariant?.memory,
          pictures: matchingPictures,
          quantity,
          subtotal,
          sku: SKU
        });
      } else {
        return res.status(200).json({ success: false, error: 'Số lượng tồn tại trong giỏ hàng đã tới mức 3.Nếu muốn mua số lượng lớn vui lòng liên hệ hotline' });
      }
    } else {
      const price = productVariant.newPrice;
      const subtotal = price * quantity;
      cart.items.push({
        product: product._id,
        productVariant: productVariant,
        price: productVariant.newPrice,
        color: color,
        memory: productVariant?.memory,
        pictures: matchingPictures,
        quantity,
        subtotal,
        sku: SKU
      });
    }
    await Cart.populate(cart, {
      path: 'items',
      populate: [
        {
          path: 'product',
          select: 'name warrantyPeriod'
        },
        {
          path: 'productVariant',
        }
      ]
    });
    
    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const updateCartItemAfterPayment = async (req, res) => {
  const userId = req.params.userId;
  const { items } = req.body; 
  const messages = [];
  try {
    const cart = await Cart.findOne({ user: userId })
    .populate({
      path: 'items.product',
      select: 'name' 
    })

    if (!cart) {
      return res.status(404).json({ success: false, error: 'Giỏ hàng không tồn tại' });
    }
    
    for (const cartItem of items) {
      const { _id, quantity } = cartItem;

      const item = cart.items.find((item) => item._id.toString() === _id);

      if (!item) {
        continue; 
      }

      const productVariant = await ProductVariant.findById(item.productVariant);
      const sku = productVariant.attributes.find(attr => attr.sku === item.sku);

      if (!sku) {
        continue; 
      }

      if (quantity > sku.quantity) {
        messages.push({
          productName: item.product.name, 
          image: item.pictures,
          availableQuantity: sku.quantity,
        });
        if (sku.quantity > 0) {
          item.quantity = sku.quantity;
          item.price = productVariant.newPrice;
          item.subtotal = item.price* sku.quantity;
        } else {
          cart.items = cart.items.filter((item) => item._id.toString() !== _id);
        }
      } else {
        item.quantity = quantity;
        item.price = productVariant.newPrice;
        item.subtotal = item.price * quantity;
      }
    }
    await cart.save();
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};



module.exports = { updateCartItemAfterPayment,addToCart,deleteCartItem,updateCartItemQuantity,getCartItemsByUserId ,updateAllCartItemsChecked,updateCartItemChecked,getCheckedCartItemsByUserId,saveToCart};
