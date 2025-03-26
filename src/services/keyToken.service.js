const keyTokenModel = require("../models/keytoken.model");
const { convertToObjectIdMongoDb } = require("../utils");

class KeyTokenService {
  //1.
  // level 0
  // static createKeyToken = async ({ userId, publicKey, privateKey }) => {
  //     const tokenCreate = await keyTokenModel.create({
  //       user: userId,
  //       publicKey,
  //       privateKey
  //     });
  //     return tokenCreate ? tokenCreate.publicKey : null;
  // }

  //2.
  // level 1
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    const filter = { user: userId };
    const update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken };
    const options = { upsert: true, new: true }; // with mongoose, with two params, find record and update, if do not have record -> create new record

    const tokenCreate = await keyTokenModel.findOneAndUpdate(filter, update, options).lean();
    return tokenCreate ? tokenCreate.publicKey : null;
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: convertToObjectIdMongoDb(userId) }).lean();
  };


  static removeTokenById = async (keyId) => {
    const result = await keyTokenModel.deleteOne({
      _id: convertToObjectIdMongoDb(keyId)
    }).lean()
    return result;
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken }).lean();
  };

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: convertToObjectIdMongoDb(userId) }).lean();
  }

  static updateKeyById = async (userId, refreshToken, payload) => {
    return await keyTokenModel.updateOne({ user: convertToObjectIdMongoDb(userId) }, { $push: { refreshTokensUsed: refreshToken }, $set: { refreshToken: payload.refreshToken } }).lean();
  }
}

module.exports = KeyTokenService;