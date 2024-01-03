'use strict'

const { SuccessResponse } = require("../core/success.response")
const DiscountService = require("../services/discount.service")

class DiscountController {

  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Successful created discount code!',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  };

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list discount code success!',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  };

  getAllProductByDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list product with discount code success!',
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query
      })
    }).send(res)
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get discount amount success!',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body
      })
    }).send(res)
  };
}

module.exports = new DiscountController();

