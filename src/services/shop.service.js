'use strict'

const shopModel = require("../models/shop.model")

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}
class ShopService {
  static findByEmail = async ({ email }) => {
    return await shopModel.findOne({ email }).lean();
  }

  static createNewShop = async ({
    name, email, password: passwordHash, roles
  }) => {
    return await shopModel.create({ name, email, password: passwordHash, roles })
  }
}

module.exports = ShopService;