'use strict'

const { Schema, model } = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'product';
const COLLECTION_NAME = 'products';

// this is the parent structure of product
// Declare the Schema of the Mongo model
const productSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_thumb: {
    type: String,
    required: true
  },
  product_description: {
    type: String,
  },
  product_slug: { // quan-jean-cao-cap
    type: String,
  },
  product_price: {
    type: Number,
    required: true,
  },
  product_quantity: {
    type: Number,
    required: true,
  },
  product_type: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothes', 'Furnitures']
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'shop'
  },
  product_attributes: {
    type: Schema.Types.Mixed,
    required: true
  },
  product_ratings_average: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be about 5'],
    // 4.346666 -> 4.3
    set: (val) => Math.round(val * 10) / 10
  },
  product_variations: {
    type: Array,
    default: []
  },
  is_draft: {
    type: Schema.Types.Boolean,
    default: true,
    index: true, // index for column to support search, cause this field appear so much
    select: false // select mean the field be able return when query or not
  },
  is_published: {
    type: Schema.Types.Boolean,
    default: false,
    index: true, // index for column to support search, cause this field appear so much
    select: false // select mean the field be able return when query or not
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

// create index for column usually search
productSchema.index({ product_name: 'text', product_description: 'text' });

// document middleware: run before .save() and .create()
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
})

// this is child for detail of product, it is still a product but for detail
// define the product type = clothes
const clothesSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  size: {
    type: String
  },
  material: {
    type: String
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'shop'
  }
}, {
  collection: 'clothes',
  timestamps: true
})

// this is child for detail of product, it is still a product but for detail
// define the product type = electronic
const electronicSchema = new Schema({
  manufacturer: {
    type: String,
    required: true
  },
  model: {
    type: String
  },
  color: {
    type: String
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'shop'
  }
}, {
  collection: 'electronics',
  timestamps: true
})

// this is child for detail of product, it is still a product but for detail
// define the product type = furniture
const furnitureSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  size: {
    type: String
  },
  material: {
    type: String
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'shop'
  }
}, {
  collection: 'furnitures',
  timestamps: true
})


// Export the model
module.exports = {
  products: model(DOCUMENT_NAME, productSchema),
  clothes: model('Clothes', clothesSchema),
  electronics: model('Electronics', electronicSchema),
  furnitures: model('Furnitures', furnitureSchema),
} 