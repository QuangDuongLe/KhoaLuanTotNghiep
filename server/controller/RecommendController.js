const UserAccess = require('../Model/RecommendModel');
const Cart = require('../Model/CartModel');
const Product = require('../Model/ProductModel');
const ProductVariant = require('../Model/ProductVariantModel');
const saveUserAccess = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        if (!userId || !productId) {
            return res.status(400).json({ success: false, error: 'Thiếu thông tin userId hoặc productId' });
        }

        const productVariants = await ProductVariant.find({ productName: productId });
        if (!productVariants || productVariants.length === 0) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm' });
        }

        const productIds = productVariants.map(variant => variant._id.toString());

        const userAccesses = productIds.map(productIdString => ({
            user: userId,
            product: productIdString
        }));

        const data = await UserAccess.insertMany(userAccesses);

        res.status(201).json({ success: true, message: data });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};


const calculateSimilarityScore = (variant1, variant2) => {
    let similarityScore = 0;

    if (variant1?.productName?.category && variant2?.productName?.category &&
        variant1.productName.category.toString() === variant2.productName.category.toString()) {
        similarityScore += 0.5;
    }
    
    if (variant1?.productName?.brand && variant2?.productName?.brand &&
        variant1.productName.brand.toString() === variant2.productName.brand.toString()) {
        similarityScore += 0.5;
    }

    if (variant1?.newPrice && variant2?.newPrice) {
        const priceDifference = Math.abs(variant1.newPrice - variant2.newPrice);
        const maxPrice = Math.max(variant1.newPrice, variant2.newPrice);
        const priceSimilarity = 1 - (priceDifference / maxPrice);
        similarityScore += priceSimilarity * 0.3;
    }

    if (variant1?.memory && variant2?.memory) {
        if (variant1.memory === variant2.memory) {
            similarityScore += 0.2;
        }
    }

    return similarityScore;
};

const generateRecommendations = async (variants, excludedVariants, userCart, limit) => {
    const recommendedProducts = new Set();
    const excludedVariantIds = excludedVariants
        .filter(id => id != null) 
        .map(id => id.toString());

    const allVariantDetails = await ProductVariant.find({
        _id: { $in: variants.map(v => v._id) }
    }).populate({
        path: 'productName',
        select: '_id category brand name ratings isHide thumnails',
        populate: {
            path: 'category brand',
            select: 'name'
        }
    });

    const variantDetailsMap = new Map();
    allVariantDetails.forEach(variant => {
        variantDetailsMap.set(variant._id.toString(), variant);
    });

    for (const excludedVariantId of excludedVariantIds) {
        const excludedVariant = variantDetailsMap.get(excludedVariantId);

        if (!excludedVariant) continue; 

        const uniqueVariants = variants.filter(variant => variant._id.toString() !== excludedVariantId);

        const similarityScores = [];

        uniqueVariants.forEach(variant => {
            if (variant?._id) {  
                const variantDetail = variantDetailsMap.get(variant._id.toString());
                if (variantDetail) {
                    const similarityScore = calculateSimilarityScore(variantDetail, excludedVariant);
                    similarityScores.push({ variant: variantDetail, score: similarityScore });
                }
            }
        });

        similarityScores.sort((a, b) => b.score - a.score);

        const topSimilarProducts = similarityScores.slice(0, 5).map(score => score.variant);

        topSimilarProducts.forEach(product => {
            if (userCart && userCart.items) {
                const isProductInCart = userCart.items.some(item => item?.productVariant?.toString() === product._id.toString());
                if (!isProductInCart) {
                    recommendedProducts.add(product);
                }
            } else {
                recommendedProducts.add(product);
            }
        });
    }

    const finalRecommendedProducts = Array.from(recommendedProducts).filter(product => {
        const quantities = product?.attributes?.map(attr => attr.quantity);
        const averageQuantity = quantities?.reduce((acc, val) => acc + val, 0) / (quantities?.length || 1);
        return averageQuantity > 0;
    });

    return Array.from(finalRecommendedProducts).slice(0, limit).map(product => ({
        productId: product.productName?._id,
        productName: product.productName?.name,
        ratings: product.productName?.ratings,
        isHide: product.productName?.isHide,
        thumnails: product.productName?.thumnails,
        memory: product.memory,
        imPrice: product.imPrice,
        oldPrice: product.oldPrice,
        newPrice: product.newPrice
    }));
};



const generateProductRecommendations = async (req, res) => {
    try {
        const { userId, limit } = req.body;


        if (!userId || userId === undefined) {
            const limitNumber = limit || 10;

            const topSoldProducts = await ProductVariant.aggregate([
                {
                    $unwind: "$attributes"
                },
                {
                    $group: {
                        _id: "$_id",
                        productName: { $first: "$productName" },
                        avgSold: { $avg: "$attributes.sold" },
                        memory: { $first: "$memory" },
                        imPrice: { $first: "$imPrice" },
                        oldPrice: { $first: "$oldPrice" },
                        newPrice: { $first: "$newPrice" }
                    }
                },
                {
                    $sort: { avgSold: -1 }
                },
                {
                    $limit: limitNumber
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "productName",
                        foreignField: "_id",
                        as: "productName"
                    }
                },
                {
                    $unwind: "$productName"
                },
                {
                    $match: { "productName.isHide": false }
                },
                {
                    $project: {
                        "productName._id": 1,
                        "productName.name": 1,
                        "productName.ratings": 1,
                        "productName.isHide": 1,
                        "productName.thumnails": 1,
                        "memory": 1,
                        "imPrice": 1,
                        "oldPrice": 1,
                        "newPrice": 1
                    }
                }
            ]);

            const topRatedProducts = await ProductVariant.aggregate([
                {
                    $group: {
                        _id: "$productName",
                        productName: { $first: "$productName" },
                        memory: { $first: "$memory" },
                        imPrice: { $first: "$imPrice" },
                        oldPrice: { $first: "$oldPrice" },
                        newPrice: { $first: "$newPrice" },
                        variants: { $push: "$$ROOT" }
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "productName"
                    }
                },
                {
                    $unwind: "$productName"
                },
                {
                    $match: { "productName.isHide": false }
                },
                {
                    $lookup: {
                        from: "ratings",
                        localField: "productName.ratings",
                        foreignField: "_id",
                        as: "ratings"
                    }
                },
                {
                    $unwind: { path: "$ratings", preserveNullAndEmptyArrays: true }
                },
                {
                    $group: {
                        _id: "$_id",
                        productName: { $first: "$productName" },
                        memory: { $first: "$memory" },
                        imPrice: { $first: "$imPrice" },
                        oldPrice: { $first: "$oldPrice" },
                        newPrice: { $first: "$newPrice" },
                        averageRating: { $avg: "$ratings.rating" }, // Tính trung bình đánh giá
                        variants: { $first: "$variants" }
                    }
                },
                {
                    $sort: { averageRating: -1 }
                },
                {
                    $limit: limitNumber
                },
                {
                    $project: {
                        "productName._id": 1,
                        "productName.name": 1,
                        "productName.ratings": 1,
                        "productName.isHide": 1,
                        "productName.thumnails": 1,
                        "memory": 1,
                        "imPrice": 1,
                        "oldPrice": 1,
                        "newPrice": 1
                    }
                }
            ]);

            const combinedProducts = [...topSoldProducts, ...topRatedProducts];
            const uniqueCombinedProducts = combinedProducts.filter((product, index, self) =>
                index === self.findIndex((p) => (
                    p._id === product._id
                ))
            );

            const limitedCombinedProducts = uniqueCombinedProducts.slice(0, limitNumber);

            return res.status(200).json({
                success: true,
                data: limitedCombinedProducts.map(product => ({
                    productId: product.productName._id,
                    productName: product.productName.name,
                    ratings: product.productName.ratings,
                    isHide: product.productName.isHide,
                    thumnails: product.productName.thumnails,
                    memory: product.memory,
                    imPrice: product.imPrice,
                    oldPrice: product.oldPrice,
                    newPrice: product.newPrice
                }))
            });


        }
        const userAccessHistory = await UserAccess.find({ user: userId })
            .sort({ timestamp: -1 })
            .limit(10)
            .select('product');
        const variants = await ProductVariant.find()
            .select('_id');
        const userCart = await Cart.findOne({ user: userId })
            .select('items.productVariant');
        if (userAccessHistory.length === 0 && (!userCart || userCart.items.length === 0)) {
            const limitNumber = limit || 10;

            const topSoldProducts = await ProductVariant.aggregate([
                {
                    $unwind: "$attributes"
                },
                {
                    $group: {
                        _id: "$_id",
                        productName: { $first: "$productName" },
                        avgSold: { $avg: "$attributes.sold" },
                        memory: { $first: "$memory" },
                        imPrice: { $first: "$imPrice" },
                        oldPrice: { $first: "$oldPrice" },
                        newPrice: { $first: "$newPrice" }
                    }
                },
                {
                    $sort: { avgSold: -1 }
                },
                {
                    $limit: limitNumber
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "productName",
                        foreignField: "_id",
                        as: "productName"
                    }
                },
                {
                    $unwind: "$productName"
                },
                {
                    $match: { "productName.isHide": false }
                },
                {
                    $project: {
                        "productName._id": 1,
                        "productName.name": 1,
                        "productName.ratings": 1,
                        "productName.isHide": 1,
                        "productName.thumnails": 1,
                        "memory": 1,
                        "imPrice": 1,
                        "oldPrice": 1,
                        "newPrice": 1
                    }
                }
            ]);

            const topRatedProducts = await ProductVariant.aggregate([
                {
                    $group: {
                        _id: "$productName",
                        productName: { $first: "$productName" },
                        memory: { $first: "$memory" },
                        imPrice: { $first: "$imPrice" },
                        oldPrice: { $first: "$oldPrice" },
                        newPrice: { $first: "$newPrice" },
                        variants: { $push: "$$ROOT" }
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "productName"
                    }
                },
                {
                    $unwind: "$productName"
                },
                {
                    $match: { "productName.isHide": false }
                },
                {
                    $lookup: {
                        from: "ratings",
                        localField: "productName.ratings",
                        foreignField: "_id",
                        as: "ratings"
                    }
                },
                {
                    $unwind: { path: "$ratings", preserveNullAndEmptyArrays: true }
                },
                {
                    $group: {
                        _id: "$_id",
                        productName: { $first: "$productName" },
                        memory: { $first: "$memory" },
                        imPrice: { $first: "$imPrice" },
                        oldPrice: { $first: "$oldPrice" },
                        newPrice: { $first: "$newPrice" },
                        averageRating: { $avg: "$ratings.rating" }, // Tính trung bình đánh giá
                        variants: { $first: "$variants" }
                    }
                },
                {
                    $sort: { averageRating: -1 }
                },
                {
                    $limit: limitNumber
                },
                {
                    $project: {
                        "productName._id": 1,
                        "productName.name": 1,
                        "productName.ratings": 1,
                        "productName.isHide": 1,
                        "productName.thumnails": 1,
                        "memory": 1,
                        "imPrice": 1,
                        "oldPrice": 1,
                        "newPrice": 1
                    }
                }
            ]);

            const combinedProducts = [...topSoldProducts, ...topRatedProducts];
            const uniqueCombinedProducts = combinedProducts.filter((product, index, self) =>
                index === self.findIndex((p) => (
                    p._id === product._id
                ))
            );


            const limitedCombinedProducts = uniqueCombinedProducts.slice(0, limitNumber);

            return res.status(200).json({
                success: true,
                data: limitedCombinedProducts.map(product => ({
                    productId: product.productName._id,
                    productName: product.productName.name,
                    ratings: product.productName.ratings,
                    isHide: product.productName.isHide,
                    thumnails: product.productName.thumnails,
                    memory: product.memory,
                    imPrice: product.imPrice,
                    oldPrice: product.oldPrice,
                    newPrice: product.newPrice
                }))
            });
        }
        let recommendations;
        if (userCart) {
            const excludedVariantIds = [
                ...new Set([
                    ...userAccessHistory
                        .filter(access => access.product != null)  // Ensure product is not null
                        .map(access => access.product.toString()),
                    ...userCart.items
                        .filter(item => item.productVariant != null)  // Ensure productVariant is not null
                        .map(item => item.productVariant.toString())
                ])
            ];            
            recommendations = await generateRecommendations(variants, excludedVariantIds, userCart, limit || 10);
        }
        else {
            const excludedVariantIds = [...new Set(userAccessHistory.map(access => access.product.toString()))];
            recommendations = await generateRecommendations(variants, excludedVariantIds, null, limit || 10);
        }
        res.status(200).json({ success: true, data: recommendations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



module.exports = { saveUserAccess, generateProductRecommendations };
