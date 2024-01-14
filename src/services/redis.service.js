'use strict'

const redis = require('redis');
const { promisify } = require('util'); // function use to convert a function to a async await function
const { reservationInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

const pExpire = promisify(redisClient.pExpire).bind(redisClient);
const setNXAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {

  // create key use for user to order, user complete order -> tru hang ton kho -> give key for next user -> move move...
  const key = `lock_v2024_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3s lock

  for (let i = 0; i < retryTimes; i++) {
    // create a key, person who keep key is going to pay order
    const result = await setNXAsync(key, expireTime);

    if (result === 1) {
      // thao tac voi inventory
      const isReservation = await reservationInventory({
        productId, cartId, quantity
      })

      if (isReservation.modifiedCount) {
        await pExpire(key, expireTime);
        return key;
      }

      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
}

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);

  return await delAsyncKey(keyLock);
}

module.exports = {
  acquireLock,
  releaseLock
}