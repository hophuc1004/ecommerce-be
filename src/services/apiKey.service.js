'use strict';

const apiKeyModel = require("../models/apiKey.model");
const crypto = require('crypto');

const findById = async (key) => {
  try {
    // const newKey = await apiKeyModel.create({ key: crypto.randomBytes(64).toString('hex'), permissions: ['0000'] });
    // console.log('newKey:', newKey)
    const objectKey = apiKeyModel.findOne({ key, status: true }).lean();
    if (!objectKey) {
      return {
        code: 'xxx',
        message: `objectKey error!`,
      }
    }
    return objectKey
  } catch (error) {
    return {
      code: 'xxx',
      message: error.message,
      status: 'error'
    }
  }
}

module.exports = {
  findById
}