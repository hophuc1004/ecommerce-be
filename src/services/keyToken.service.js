const { Types } = require("mongoose");
const keyTokenModel = require("../models/keytoken.model");

class KeyTokenService {
  //1.
  // level 0
  // static createKeyToken = async ({ userId, publicKey, privateKey }) => {
  //   try {
  //     const tokenCreate = await keyTokenModel.create({
  //       user: userId,
  //       publicKey,
  //       privateKey
  //     });
  //     return tokenCreate ? tokenCreate.publicKey : null;
  //   } catch (error) {

  //   }
  // }

  //2.
  // level 1
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      const filter = { user: userId };
      const update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken };
      const options = { upsert: true, new: true }; // with mongoose, with two params, find record and update, if do not have record -> create new record

      const tokenCreate = await keyTokenModel.findOneAndUpdate(filter, update, options);
      return tokenCreate ? tokenCreate.publicKey : null;
    } catch (error) {

    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
  };


  static removeTokenById = async (keyId) => {
    const result = await keyTokenModel.deleteOne({
      _id: new Types.ObjectId(keyId)
    })
    return result;
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken }).lean();
  };

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: new Types.ObjectId(userId) }).lean();
  }

  static updateKeyById = async (userId, refreshToken, payload) => {
    return await keyTokenModel.updateOne({ user: new Types.ObjectId(userId) }, { $push: { refreshTokensUsed: refreshToken }, $set: { refreshToken: payload.refreshToken } }).lean();
  }
}

module.exports = KeyTokenService;

// const { Types: { ObjectId } } = require('mongoose');
/*
static findByUserId = async (userId) => {
  return await keyTokenModel.findOne({ user: new ObjectId(userId) }).lean();
    }
static removeKeyById = async (id) => {
  return await keyTokenModel.deleteOne({ _id: new ObjectId(id) });
}
*/