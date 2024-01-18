'use strict';
const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(`amqp://guest:Phuc101297@localhost`);
    if (!connection) throw new Error('Connection not established!');

    const channel = await connection.createChannel();

    return { channel, connection };

  } catch (error) {
    console.log('error connect rabbitMQ: ', error);
  }
}

const consumerOrderedMessage = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();

    const queueName = 'ordered-queue-message';
    await channel.assertQueue(queueName, {
      durable: true
    });

    for (let i = 0; i < 10; i++) {
      const message = `Ordered queue message ${i}`;
      console.log(`message:: ${message}`);
      channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true
      })
    }

    setTimeout(() => {
      connection.close()
    }, 1000);

  } catch (error) {
    console.error(error);
  }
}

consumerOrderedMessage().catch(err => console.error(err));

