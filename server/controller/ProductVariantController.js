const ProductVariant = require('../Model/ProductVariantModel');
const Product = require('../Model/ProductModel');


const addProductVariant = async (req, res) => {
  try {
    const parentProductName = req.params.id;
    const parentProduct = await Product.findById(parentProductName);
    if (!parentProduct) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm chính' });
    }
    const { memory, imPrice, oldPrice, newPrice, attributes } = req.body;
    const duplicateSku = await ProductVariant.findOne({ "attributes.sku": { $in: attributes.map(attr => attr.sku) } });
    if (duplicateSku) {
      return res.status(400).json({ success: false, error: 'Thuộc tính SKU đã tồn tại' });
    }

    const productVariant = new ProductVariant({
      productName: parentProductName,
      memory,
      imPrice,
      oldPrice,
      newPrice,
      attributes,
    });

    const newProductVariant = await productVariant.save();
    parentProduct.variant.push(newProductVariant._id);
    await parentProduct.save();
    res.status(201).json({ success: true, data: newProductVariant });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

const getVariantsByProductId = async (req, res) => {
  try {
    const productId = req.params.id;
    const productVariants = await ProductVariant.find({ productName: productId }).populate('productName');
    if (!productVariants) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy biến thể sản phẩm' });
    }
    res.status(200).json({ success: true, data: productVariants });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
const IdVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const variants = await ProductVariant.findOne({ _id: id })
      .populate('productName')
    if (!variants) {
      return res.status(404).json({ success: false, error: 'Biến thể không tồn tại không tồn tại' });
    }
    res.status(200).json({ success: true, data: variants });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const getAttributesByVariantId = async (req, res) => {
  try {
    const { id } = req.params;

    const productVariant = await ProductVariant.findById(id);
    if (!productVariant) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy productVariant' });
    }
    res.status(200).json({ success: true, data: productVariant.attributes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getAttributeDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const attribute = await ProductVariant.findOne({ "attributes._id": id }, { "attributes.$": 1 });
    if (!attribute) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy thuộc tính' });
    }
    const attributeDetails = attribute.attributes[0];
    res.status(200).json({ success: true, data: attributeDetails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const editAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, color, quantity, pictures } = req.body;
    const productVariant = await ProductVariant.findOneAndUpdate(
      { "attributes._id": id },
      {
        $set: {
          "attributes.$.sku": sku,
          "attributes.$.color": color,
          "attributes.$.quantity": quantity,
          "attributes.$.pictures": pictures,
        }
      },
      { new: true }
    );

    if (!productVariant) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm biến thể hoặc thuộc tính' });
    }

    res.status(200).json({ success: true, data: productVariant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const addAttributes = async (req, res) => {
  try {
    const { id } = req.params;
    const { attributes } = req.body;
    const productVariant = await ProductVariant.findById(id);

    if (!productVariant) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy biến thể' });
    }
    const duplicateSku = await ProductVariant.findOne({ "attributes.sku": { $in: attributes.map(attr => attr.sku) } });
    if (duplicateSku) {
      return res.status(400).json({ success: false, error: 'Thuộc tính SKU đã tồn tại' });
    }
    productVariant.attributes.push(...attributes);
    const updatedProductVariant = await productVariant.save();

    res.status(200).json({ success: true, data: updatedProductVariant });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
const deleteAttributeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductVariant.updateOne(
      { "attributes._id": id },
      { $pull: { attributes: { _id: id } } }
    );
    if (result.nModified === 0) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy hoặc không thể xoá thuộc tính' });
    }
    res.status(200).json({ success: true, message: 'Xoá thuộc tính thành công' });
  } catch (error) {
    // Trả về thông báo lỗi nếu có lỗi xảy ra
    res.status(500).json({ success: false, error: error.message });
  }
};






const deleteProductVariant = async (req, res) => {
  try {
    const productVariantId = req.params.id;
    if (productVariantId) {
      const productVariant = await ProductVariant.findById(productVariantId);
      if (!productVariant) {
        return res.status(401).json({ err: 'Biến thể sản phẩm không tồn tại' });
      }
      await ProductVariant.findByIdAndDelete(productVariantId);
      const parentProductId = productVariant.productName;
      const parentProduct = await Product.findById(parentProductId);
      if (parentProduct) {
        parentProduct.variant = parentProduct.variant.filter(
          (variant) => variant.toString() !== productVariantId
        );
        await parentProduct.save();
      }
      res.status(200).json({ success: true, message: 'Biến thể đã được xóa thành công' });
    } else {
      return res.status(401).json({ msg: 'Không tìm thấy ID' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Lỗi Server' });
  }
};

const updateProductVariant = async (req, res) => {
  try {
    const productVariantId = req.params.id;
    const data = req.body;
    const updateData = {};
    if (data.memory !== undefined) {
      updateData.memory = data.memory;
    }
    if (data.imPrice !== undefined) {
      updateData.imPrice = data.imPrice;
    }
    if (data.oldPrice !== undefined) {
      updateData.oldPrice = data.oldPrice;
    }
    if (data.newPrice !== undefined) {
      updateData.newPrice = data.newPrice;
    }
    const updatedProduct = await ProductVariant.findByIdAndUpdate(productVariantId, updateData, { new: true });
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const getProductVariants = async (req, res) => {
  try {
    const { minPrice, maxPrice, memory, sort, page = 1, limit = 10, categoryId, brandId } = req.query;

    let filter = {};
    if (minPrice && maxPrice) {
      filter.newPrice = { $gte: minPrice, $lte: maxPrice };
    }
    if (memory) {
      filter.memory = memory;
    }

    let productFilter = {};
    if (categoryId) {
      productFilter.category = categoryId;
    }
    if (brandId) {
      productFilter.brand = brandId;
    }

    const products = await Product.find(productFilter);
    const productIds = products.map(product => product._id);
    filter.productName = { $in: productIds };

    let sortOrder = {};
    if (sort === 'asc') {
      sortOrder.newPrice = 1;
    } else if (sort === 'desc') {
      sortOrder.newPrice = -1;
    }

    const skip = (page - 1) * limit;

    
    const totalCount = await ProductVariant.countDocuments(filter);

    const productVariants = await ProductVariant.find(filter)
      .select('-attributes')  
      .sort(sortOrder)
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'productName',
        select: 'name thumnails properties isHide ratings',
      });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      productVariants,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const searchProductVariantsByName = async (req, res) => {
  try {
    const { keyword, minPrice, maxPrice, memory, sort, page = 1, limit = 10, categoryId, brandId } = req.query;
    const regex = new RegExp(keyword, 'i');

    let productFilter = {};
    if (regex) {
      productFilter.name = regex;
    }
    if (categoryId) {
      productFilter.category = categoryId;
    }
    if (brandId) {
      productFilter.brand = brandId;
    }

    const products = await Product.find(productFilter);
    const productIds = products.map(product => product._id);

    let filter = {};
    filter.productName = { $in: productIds };

    if (minPrice && maxPrice) {
      filter.newPrice = { $gte: minPrice, $lte: maxPrice };
    }
    if (memory) {
      filter.memory = memory;
    }

    let sortOrder = {};
    if (sort === 'asc') {
      sortOrder.newPrice = 1;
    } else if (sort === 'desc') {
      sortOrder.newPrice = -1;
    }

    const skip = (page - 1) * limit;

    const totalCount = await ProductVariant.countDocuments(filter);

    const productVariants = await ProductVariant.find(filter)
      .select('-attributes')
      .sort(sortOrder)
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'productName',
        select: 'name thumnails properties isHide ratings',
      });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      productVariants,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { searchProductVariantsByName,getProductVariants, deleteAttributeById, editAttribute, getAttributeDetailsById, getAttributesByVariantId, addProductVariant, deleteProductVariant, updateProductVariant, addAttributes, getVariantsByProductId, IdVariant };
