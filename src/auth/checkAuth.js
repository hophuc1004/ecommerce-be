'use strict'

const ApiKeyService = require("../services/apiKey.service");

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();

  if (!key) {
    return res.status(403).json({
      message: 'Forbidden Error'
    })
  }

  // check objKey
  const objectKey = await ApiKeyService.findApiKeyById(key);

  if (!objectKey) {
    return res.status(403).json({
      message: `Forbidden Error`
    })
  }

  req.objectKey = objectKey;

  return next();
}

const checkKeyPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objectKey.permissions) {
      return res.status(403).json({
        message: 'Permission denied!'
      });
    };

    const validPermission = req.objectKey.permissions.includes(permission);

    if (!validPermission) {
      return res.status(403).json({
        message: 'Permission denied!'
      });
    };

    return next();
  }
}

module.exports = {
  apiKey,
  checkKeyPermission
}