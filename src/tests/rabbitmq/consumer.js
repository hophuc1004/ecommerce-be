'use strict';
const amqp = require('amqplib');
const message = 'Hello, RabbitQM for Hophuc1004';

const runConsumer = async () => {
  try {
    const connection = await amqp.connect(`amqp://guest:Phuc101297@localhost`);
    const channel = await connection.createChannel();

    const queueName = 'test-topic';
    await channel.assertQueue(queueName, {
      durable: true
    });

    // send message to consumer channel
    await channel.consume(queueName, (msg) => {
      console.log(`Received message: ${msg.content.toString()}`);
    }, {
      noAck: false
    });
  } catch (error) {
    console.error(error);
  }
}

runConsumer().catch(console.error);