'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'order'
const COLLECTION_NAME = 'orders'

const orderSchema = new Schema({

  oder_userId: {
    type: Number,
    required: true
  },
  /*
    order_checkout = {
      totalPrice,
      totalApplyDiscount,
      feeShip
    }
  */
  order_checkout: {
    type: Object,
    default: {}
  },
  /*
    order_shipping: {
      street,
      city,
      state,
      country
    }
  */
  order_shipping: {
    type: Object,
    default: {}
  },
  order_payment: {
    type: Object,
    required: true
  },
  order_products: {
    type: Array,
    required: true
  },
  order_tracking_number: {
    type: String,
    default: '#000103012024'
  },
  order_status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
    default: 'pending'
  }
},
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'modifiedOn'
    }
  })

module.exports = model(DOCUMENT_NAME, orderSchema);