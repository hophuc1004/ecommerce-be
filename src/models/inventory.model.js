const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'inventory';
const COLLECTION_NAME = 'inventories';

// Declare the Schema of the Mongo model
const inventorySchema = new Schema({
  inventory_productId: {
    type: Schema.Types.ObjectId,
    ref: 'product'
  },
  inventory_location: {
    type: String,
    default: 'unKnow'
  },
  inventory_stock: {
    type: Number,
    required: true
  },
  inventory_shopId: {
    type: Schema.Types.ObjectId,
    ref: 'shop'
  },
  inventory_reservations: { // when user add product to cart, this for store
    type: Array,
    default: []
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

// Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema)