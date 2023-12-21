'use strict'

const { Types } = require("mongoose");
const { product } = require("../product.model");
const { getSelectData, unGetSelectData } = require("../../utils");

const rFindAllProductDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
}

const rFindAllProductPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
}

const rPublishProductForShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  });

  if (!foundShop) return null;
  foundShop.is_draft = false;
  foundShop.is_published = true;

  try {
    await foundShop.save();
    return 1; // Update successful
  } catch (error) {
    console.error('Error update published product:', error);
    return 0; // Update failed
  }
}

const rUnPublishProductForShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  });

  if (!foundShop) return null;
  foundShop.is_draft = true;
  foundShop.is_published = false;

  try {
    await foundShop.save();
    return 1; // Update successful
  } catch (error) {
    console.error('Error update published product:', error);
    return 0; // Update failed
  }
}

const rSearchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch); // need to hit index for column usually search (name product, description)
  const results = await product.find({
    is_draft: true,
    $text: { $search: regexSearch },
  }, { score: { $meta: 'textScore' } }) // search incorrect
    .sort({ score: { $meta: 'textScore' } })
    .lean()

  return results;
}

const rFindAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

  const products = await product.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean();
  return products;
}

const rFindProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect));
}

const updateProductById = async ({ productId, bodyUpdate, model, isNew = true }) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew })
}

const queryProduct = async ({ query, skip, limit }) => {
  return await product.find(query)
    .populate('product_shop', 'email name -_id')
    .sort({ updatedAt: -1 })
    .skip(skip).limit(limit)
    .lean()
    .exec();
}

module.exports = {
  rFindAllProductDraftForShop,
  rFindAllProductPublishedForShop,
  rPublishProductForShop,
  rUnPublishProductForShop,
  rSearchProductByUser,
  rFindAllProducts,
  rFindProduct,
  updateProductById
}