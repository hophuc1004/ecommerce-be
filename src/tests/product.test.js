const RedisPubSubService = require("../services/redisPubsub.service");

class ProductServiceTest {
  purchaseProduct(productId, quantity) {
    const order = {
      productId, quantity
    };
    RedisPubSubService.handlePublish('purchase_event', JSON.stringify(order))
  }
}

module.exports = new ProductServiceTest();