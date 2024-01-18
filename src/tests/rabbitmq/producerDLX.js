'use strict';
const amqp = require('amqplib');
const message = 'New product have add to shop';


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

const runProducerDLX = async () => {
  try {
    // 1. Create channel and connection
    const { channel, connection } = await connectToRabbitMQ();

    // 2. Create exchange
    const notificationExchange = 'notificationEx'; // type of exchange is "direct" // handle success

    // 3. Create a queue
    const notificationQueue = 'notificationQueueProcess'; // assertQueue // handle logic

    // 4. Create exchange to set DLX
    const notificationExchangeDLX = 'notificationExDLX'; // handle failed

    // 5. Create a routing key
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'; // assert

    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true
    });

    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false, // cho phep cac connection van o trong hang doi neu nhu no da exit
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX
    });

    await channel.bindQueue(queueResult.queue, notificationExchange);

    const msg = 'A new product just have created!';
    console.log(`Producer message::: `, msg);
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: '10000'
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 1000);

  } catch (error) {
    console.error(error);
  }
}

runProducerDLX().catch(console.error);