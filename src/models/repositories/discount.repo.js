'use strict'

const { unGetSelectData, getSelectData } = require("../../utils");
const discountModel = require("../discount.model");

const findOneDiscount = async ({ discount_code, discount_shopId }) => {
  const foundDiscountCode = await discountModel.findOne({
    discount_code,
    discount_shopId
  }).lean();

  return foundDiscountCode
}

const createNewDiscount = async ({
  discount_name,
  discount_description,
  discount_type,
  discount_value,
  discount_code,
  discount_start_date,
  discount_end_date,
  discount_max_uses,
  discount_uses_count,
  discount_users_used,
  discount_max_uses_per_user,
  discount_min_order_value,
  discount_shopId: shopId,
  discount_isActive,
  discount_applies_to,
  discount_product_ids
}) => {
  const newDiscount = await discountModel.create({
    discount_name,
    discount_description,
    discount_type,
    discount_value,
    discount_code,
    discount_start_date,
    discount_end_date,
    discount_max_uses,
    discount_uses_count,
    discount_users_used,
    discount_max_uses_per_user,
    discount_min_order_value,
    discount_shopId: shopId,
    discount_isActive,
    discount_applies_to,
    discount_product_ids
  })

  return newDiscount
}

const findAllDiscountCodesUnSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, unSelect }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

  const documents = await discountModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();

  return documents;
};

const findAllDiscountCodesSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

  const documents = await discountModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return documents;
};

const checkDiscountExists = async ({ filter }) => {
  return await discountModel.findOne(filter).lean();
};

const findAndDeleteDiscount = async ({ discount_code,
  discount_shopId }) => {
  const deletedDiscount = await discountModel.findOneAndDelete({
    discount_code,
    discount_shopId
  })

  return deletedDiscount
}

const findAndUpdateDiscount = async ({ discountId, userId }) => {
  const result = await discountModel.findByIdAndUpdate(discountId, {
    $pull: {
      discount_users_used: userId
    },
    $inc: {
      discount_max_uses: 1,
      discount_uses_count: -1
    }
  });

  return result
}

module.exports = { findAllDiscountCodesUnSelect, findAllDiscountCodesSelect, checkDiscountExists, findOneDiscount, createNewDiscount, findAndDeleteDiscount, findAndUpdateDiscount };