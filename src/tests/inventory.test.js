const RedisPubsubService = require("../services/redisPubsub.service");

class InventoryService {
  constructor() {
    RedisPubsubService.handleSubscribe('purchase_event', (channel, message) => {
      InventoryService.updateInventory(message);
    })
  }


  static updateInventory(productId, quantity) {
    console.log(`Updated inventory ${productId} with quantity ${quantity}`);
  }
}

module.exports = new InventoryService();