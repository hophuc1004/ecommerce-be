'use strict'

const redis = require('redis');
const { promisify } = require('util'); // function use to convert a function to a async await function
const redisClient = redis.createClient();

const pExpire = promisify(redisClient.pExpire).bind(redisClient);
const setNX = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {

  // create key use for user to order, user complete order -> tru hang ton kho -> give key for next user -> move move...
  const key = `lock_v2024_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000;

}