'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'notification';
const COLLECTION_NAME = 'notifications';

// ORDER-001: order successfully
// ORDER-002: order failed
// PROMOTION-001: new PROMOTION (khuyen mai)
// SHOP-001: new product by user following


// you receive one Voucher of shop
const notificationSchema = new Schema({
  noti_type: {
    type: String,
    enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001']
  },
  noti_senderId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  noti_receivedId: {
    type: Number,
    required: true
  },
  noti_content: {
    type: String,
    required: true
  },
  noti_options: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, notificationSchema);