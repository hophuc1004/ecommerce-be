'use strict'
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getIntoData } = require('../utils');
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const ShopService = require('./shop.service');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {

  /*
    1 - check email in dbs
    2 - match password
    3 - create accessToken and refreshToken and save into db
    4 - generate token
    5 - get data return when login
  */

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await ShopService.findByEmail({ email });

    //1.
    if (!foundShop) {
      throw new BadRequestError('Shop not registered!')
    };

    //2.
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError('Authentication error!');

    //3.
    // create privateKey, publicKey
    const publicKey = crypto.randomBytes(64).toString('hex');
    const privateKey = crypto.randomBytes(64).toString('hex');

    const userId = foundShop._id;

    //4.
    // generate tokens
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

    //5.
    // save publicKey and privateKey to db
    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })

    return {
      shop: getIntoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
      tokens
    }
  }

  static signUp = async ({ name, email, password }) => {
    // step1: check email exist??
    const shop = await ShopService.findByEmail({ email }) // if do not include .lean(), return object of mongoose when query, it's very heavy, when have .lean(), decrease object to light

    if (shop) {
      throw new BadRequestError('Error: Shop already exist');
    };

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await ShopService.createNewShop({
      name, email, password: passwordHash, roles: RoleShop.SHOP
    });

    // generate publickey and private key token
    // using package crypto
    if (newShop) {
      // create privatekey and publickey, private forward for user, public save to db to verify
      // privatekey use for sign token, public key use for verify token (increase security if using two key for verify)
      const publicKey = crypto.randomBytes(64).toString('hex');
      const privateKey = crypto.randomBytes(64).toString('hex');


      // created token pair
      const tokenPair = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

      // save publicKey and privateKey to db
      await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: tokenPair?.refreshToken
      });

      return {
        code: 201,
        metadata: getIntoData({ fields: ['_id', 'name', 'email'], object: newShop }),
        tokenPair
      }
    };
  }

  static handleRefreshToken = async ({ refreshToken, user, keyStore }) => {

    const { userId, email } = user;

    // should create new pair token to security if hacker have token

    if (keyStore?.refreshTokensUsed?.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError(`Some thing wrong! Please re-login again!`);
    };

    if (keyStore?.refreshToken !== refreshToken) throw new AuthFailureError(`Shop not register 1!`);

    const foundShop = await ShopService.findByEmail({ email });

    if (!foundShop) throw new AuthFailureError(`Shop not register 2!`)

    // create new tokens pair
    const tokens = await createTokenPair({ userId, email }, keyStore.privateKey, keyStore.publicKey);

    // update tokens

    await KeyTokenService.updateKeyById(userId, refreshToken, { refreshToken: tokens.refreshToken });

    return {
      user,
      tokens
    }
  }

  static logout = async (keyStore) => {
    const delKeyWhenLogout = await KeyTokenService.removeTokenById(keyStore._id);

    return delKeyWhenLogout;
  }
}

module.exports = AccessService;