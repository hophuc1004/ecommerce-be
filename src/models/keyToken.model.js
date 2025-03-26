const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'key';
const COLLECTION_NAME = 'keys';

// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    trim: true,
    ref: 'shop'
  },
  publicKey: {
    type: String,
    unique: true,
  },
  privateKey: {
    type: String,
    unique: true,
  },
  refreshTokensUsed: {
    type: Array,
    default: [] // refreshTokens used
  },
  refreshToken: {
    type: String,
    required: true // refreshToken in using
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

// Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema)