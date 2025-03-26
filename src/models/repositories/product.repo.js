'use strict'

const { Types } = require("mongoose");
const { products: productModel } = require("../product.model");
const { getSelectData, unGetSelectData, convertToObjectIdMongoDb } = require("../../utils");

const rFindAllProductDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
}

const rFindAllProductPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
}

const rPublishProductForShop = async ({ product_shop, product_id }) => {
  const foundShop = await productModel.findOne({
    product_shop: convertToObjectIdMongoDb(product_shop),
    _id: convertToObjectIdMongoDb(product_id)
  });

  if (!foundShop) return null;
  foundShop.is_draft = false;
  foundShop.is_published = true;

  await foundShop.save();
  return 1; // Update successful
}

const rUnPublishProductForShop = async ({ product_shop, product_id }) => {
  const foundShop = await productModel.findOne({
    product_shop: convertToObjectIdMongoDb(product_shop),
    _id: convertToObjectIdMongoDb(product_id)
  });

  if (!foundShop) return null;
  foundShop.is_draft = true;
  foundShop.is_published = false;

  await foundShop.save();
  return 1; // Update successful
}

const rSearchProductByUser = async ({ keySearch }) => {
  // const regexSearch = new RegExp(keySearch); // need to hit index for column usually search (name product, description)
  const results = await productModel.find({
    is_published: true,
    $text: { $search: keySearch },
  }, { score: { $meta: 'textScore' } }) // search incorrect
    .sort({ score: { $meta: 'textScore' } })
    .lean()

  return results;
}

const rFindAllProducts = async ({ limit, sort, page, filter, select }) => {
  console.log('filter:', filter)
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

  const products = await productModel.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean();
  return products;
}

const rFindProduct = async ({ product_id, unSelect }) => {
  return await productModel.findById(product_id).select(unGetSelectData(unSelect));
}

const updateProductById = async ({ productId, bodyUpdate, model, isNew = true }) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew })
}

const queryProduct = async ({ query, skip, limit }) => {
  return await productModel.find(query)
    .populate('product_shop', 'email name -_id') // ref to shop that contain that product, email-name are pick field and -_id is exclude field
    .sort({ updatedAt: -1 })
    .skip(skip).limit(limit)
    .lean()
    .exec();
}

const getProductById = async (productId) => {
  return await productModel.findOne({ _id: convertToObjectIdMongoDb(productId) }).lean();
}

const checkProductByServer = async (products) => {
  return await Promise.all(products.map(async product => {
    const foundProduct = await getProductById(product.productId);

    if (foundProduct) {
      return {
        price: foundProduct.product_price,
        quantity: product.quantity,
        productId: product.productId
      }
    }
  }))
}


module.exports = {
  rFindAllProductDraftForShop,
  rFindAllProductPublishedForShop,
  rPublishProductForShop,
  rUnPublishProductForShop,
  rSearchProductByUser,
  rFindAllProducts,
  rFindProduct,
  updateProductById,
  getProductById,
  checkProductByServer
}