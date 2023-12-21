'use strict'

const inventoryModel = require("../inventory.model")

const insertInventory = async ({ productId, location = 'unKnow', stock, shopId }) => {
  return await inventoryModel.create({
    inventory_productId: productId,
    inventory_location: location,
    inventory_stock: stock,
    inventory_shopId: shopId
  })
}

module.exports = {
  insertInventory
}