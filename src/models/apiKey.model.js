'use strict'
// store token, time, expire

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'apiKey';
const COLLECTION_NAME = 'apiKeys';

// Declare the Schema of the Mongo model
const apiKeySchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: Boolean,
    default: true
  },
  permissions: {
    type: [String],
    required: true,
    enum: ['0000', '1111', '2222']
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

// Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema)