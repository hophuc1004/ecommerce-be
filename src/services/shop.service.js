'use strict'

const shopModel = require("../models/shop.model")

class ShopService {
  static findByEmail = async ({ email }) => {
    return await shopModel.findOne({ email }).lean();
  }
}

module.exports = ShopService;