'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const { findAllDiscountCodesUnSelect, checkDiscountExists, findAllDiscountCodesSelect } = require("../models/repositories/discount.repo");
const { rFindAllProducts, rFindProduct } = require("../models/repositories/product.repo");
const { convertToObjectIdMongoDb } = require("../utils");


/*
  Discount Services
  1 - Generator Discount Code [Shop | Admin]
  2 - Get discount amount [User]
  3 - Get all discount codes [User | Shop]
  4 - Verify discount code [User]
  5 - Delete discount code [Admin | Shop]
  6 - Cancel discount code [User]
*/

// discount_name, discount_description, discount_type, discount_value, discount_code, discount_start_date, discount_end_date, discount_max_uses, discount_uses_count, discount_users_used, discount_max_uses_per_user, discount_min_order_value, discount_shopId, discount_isActive, discount_applies_to, discount_product_ids

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      name,
      description,
      type,
      value,
      code,
      start_date,
      end_date,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
      min_order_value,
      shopId,
      is_active,
      applies_to,
      productIds
    } = payload;

    if ((new Date() < new Date(start_date)) || (new Date()) > new Date(end_date)) {
      throw new BadRequestError('Discount code has expired!')
    }

    if ((new Date(start_date)) > new Date(end_date)) {
      throw new BadRequestError('Start date must be before end_date!')
    }

    // create index for discount code
    const foundDiscountCode = discountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongoDb(shopId)
    }).lean();

    if (foundDiscountCode && foundDiscountCode.discount_isActive) {
      throw new BadRequestError('Discount code already exist!')
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_shopId: shopId,
      discount_isActive: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : productIds
    })

    return newDiscount;
  }

  static updateDiscountCode() {
    //
  }

  // Get all discount codes available with products (show for users)
  // Get list products by discount_code
  // Example if discount_code use for 3 product A, B, C -> Get all 3 product can apply with this discount_code 
  static async getAllDiscountCodesWithProduct({ code, shopId, userId, limit, page }) {
    //create index for discount_code
    const foundDiscountCode = await discountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongoDb(shopId)
    }).lean();

    if (!foundDiscountCode && !foundDiscountCode.discount_isActive) {
      throw new NotFoundError('Discount code not exist!');
    }

    const { discount_applies_to, discount_product_ids } = foundDiscountCode;
    let products;
    if (discount_applies_to === 'all') {
      // get all products
      products = await rFindAllProducts({
        limit: +limit,
        sort: 'ctime',
        page: +page,
        filter: {
          product_shop: convertToObjectIdMongoDb(shopId),
          is_published: true
        },
        select: ['product_name']
      })
      return products;
    }

    if (discount_applies_to === 'specific') {
      // get the products ids
      products = await rFindAllProducts({
        limit: +limit,
        sort: 'ctime',
        page: +page,
        filter: {
          _id: {
            $in: discount_product_ids
          },
          is_published: true
        },
        select: ['product_name']
      })
      return products;
    }
  }

  // Get all discount code of shop
  // Get list discount_code by shopId
  // Example if shopId have 3 discount_code, code1 - code2 - code3 -> get all 3 discount_code
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const arrDiscount = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongoDb(shopId),
        discount_isActive: true
      },
      select: ['discount_code', 'discount_name'],
      model: discountModel
    })

    console.log('arrDiscount:', arrDiscount)
    return arrDiscount;
  }

  /*
    Apply discount_code
    products = [
      {
        productId,
        shopId,
        quantity,
        name,
        price
      },
      {
        productId,
        shopId,
        quantity,
        name,
        price
      }
    ]
  */

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    console.log('products:', products)
    console.log('shopId:', shopId)
    console.log('userId:', userId)
    console.log('codeId:', codeId)

    const foundDiscountCode = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongoDb(shopId)
      }
    });

    if (!foundDiscountCode) throw new NotFoundError('Discount does not exist to apply!');

    const { discount_isActive, discount_end_date, discount_max_uses, discount_min_order_value, discount_max_uses_per_user, discount_users_used, discount_type, discount_value } = foundDiscountCode;

    if (!discount_isActive) throw new NotFoundError('Discount expired!');

    if (!discount_max_uses) throw new NotFoundError('Discount is have maximum!'); // 1000 voucher -> user use voucher 1003

    if (new Date() > new Date(discount_end_date)) throw new NotFoundError('Discount code has expired');

    // check if total price of the order is enough discount_min_order_value
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(`Discount require a min order value ${discount_min_order_value}!`);
      };
    }

    if (discount_max_uses_per_user > 0) {
      const userUseDiscount = discount_users_used?.find(user => user.userId === userId);
      if (userUseDiscount) {
        //....
      }
    }

    // check type of discount is fixed or percentage
    const amount = discount_type === 'fixed' ? discount_value : (totalOrder * (discount_value / 100));

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  // have 2 way to delete
  // hard delete vs sort delete
  // with mongodb, do not use sort delete, because it effect to index, you should user another database to save record delete
  // before delete you should check the discount_code is using for anywhere
  static async deleteDiscountCode({ shopId, codeId }) {

    const foundDiscount = '';
    if (foundDiscount) {
      // deleted
      // ...
    }

    const deletedDiscount = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongoDb(shopId)
    })

    return deletedDiscount;
  }

  // user cancel discount code
  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongoDb(shopId)
      }
    });

    if (!foundDiscount) throw new NotFoundError(`Discount does not exist!`);

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    });

    return result;
  }


}

module.exports = DiscountService;