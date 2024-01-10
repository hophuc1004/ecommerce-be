'use strict'

const { convertToObjectIdMongoDb } = require("../../utils")
const inventoryModel = require("../inventory.model")

const insertInventory = async ({ productId, location = 'unKnow', stock, shopId }) => {
  return await inventoryModel.create({
    inventory_productId: productId,
    inventory_location: location,
    inventory_stock: stock,
    inventory_shopId: shopId
  })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inventory_productId: convertToObjectIdMongoDb(productId),
    inventory_stock: { $gte: quantity }
  };

  const updateSet = {
    $inc: {
      inventory_stock: -quantity
    },
    $push: {
      inventory_reservations: {
        quantity,
        cartId,
        createOn: new Date()
      }
    }
  };

  const options = { upsert: true, new: true };

  return await inventoryModel.updateOne(query, updateSet, options);
}

module.exports = {
  insertInventory,
  reservationInventory
}