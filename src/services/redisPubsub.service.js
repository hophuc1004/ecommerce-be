const Redis = require('redis');

class RedisPubSubService {
  constructor() {
    // Listen for the 'connect' event
    this.clientSubscriber = Redis.createClient();
    this.clientPublish = Redis.createClient();
    this.clientSubscriber.connect();
    this.clientPublish.connect();
  }

  handlePublish(channel, message) {
    return new Promise((resolve, reject) => {
      this.clientPublish.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      })
    })
  }

  handleSubscribe(channel, callback) {
    this.clientSubscriber.subscribe(channel);
    this.clientSubscriber.on('message', (subscribeChannel, message) => {
      if (channel === subscribeChannel) {
        callback(channel, message);
      }
    })
  }
}

module.exports = new RedisPubSubService();