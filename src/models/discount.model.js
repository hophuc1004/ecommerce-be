'use strict' // reduce memory leak

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'discount';
const COLLECTION_NAME = 'discounts';

// Declare the Schema of the Mongo model
const discountSchema = new Schema({
  discount_name: {
    type: String,
    required: true
  },
  discount_description: {
    type: String,
    required: true
  },
  discount_type: {
    type: String,
    default: 'fixed_amount' // ['fixed amount', 'percentage']
  },
  discount_value: {
    type: Number,
    required: true // 10.000 -> 'fixed amount' | 10 -> 'percentage'
  },
  discount_code: {
    type: String,
    required: true
  },
  discount_start_date: { // when user add product to cart, this for store
    type: Date,
    required: true
  },
  discount_end_date: {
    type: Date,
    required: true
  },
  discount_max_uses: { // maximum that discount will use (this discount provide 1000 voucher) -> Maximum is 1000
    type: Number,
    required: true
  },
  discount_uses_count: {  // the number of discount have used (example provide 1000 and used 800 -> remaining 200)
    type: Number,
    required: true
  },
  discount_users_used: { // person who used
    type: Array,
    default: []
  },
  discount_max_uses_per_user: { // how much discount each user can use maximum (example each use can use only one discount)
    type: Number,
    required: true
  },
  discount_min_order_value: {
    type: Number,
    required: true
  },
  discount_shopId: {
    type: Schema.Types.ObjectId,
    ref: 'shop'
  },
  discount_isActive: {
    type: Boolean,
    default: true
  },
  discount_applies_to: {
    type: String,
    required: true,
    enum: ['all', 'specific']
  },
  discount_product_ids: { // the number of product to apply this discount
    type: Array,
    default: []
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

// Export the model
module.exports = model(DOCUMENT_NAME, discountSchema)