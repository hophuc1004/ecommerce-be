'use strict'

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const KeyTokenService = require('../services/keyToken.service');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'x-r-token-id'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // create access token and refresh token
    const accessToken = await JWT.sign(payload, privateKey, {
      expiresIn: '2 days'
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    });

    // verify using publicKey have saved to db
    JWT.verify(accessToken, privateKey, (err, decode) => {
      if (err) {
        console.log(`Error verify::: `, err);
      } else {
        console.log(`Decode verify::: `, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log('error::: ', error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1 - check userId missing ?
    2 - get accessToken
    3 - verify token
    4 - check user in dbs
    5 - check keyStore with this userId
    6 - Ok all -> return next()
  */


  //1.
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError('Invalid request!');
  };

  //2.
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError('Not found keyStore!');
  };

  //3.
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
    if (!refreshToken) {
      throw new AuthFailureError('Invalid request!');
    };

    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId!');

      req.keyStore = keyStore;
      req.refreshToken = refreshToken;
      req.user = decodeUser; // {userId, email}
      return next();
    } catch (error) {
      throw error
    };
  }

  //4.
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid request!');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.privateKey);
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId!');
    req.keyStore = keyStore;
    req.user = decodeUser
    next();
  } catch (error) {
    throw error;
  }


});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
}