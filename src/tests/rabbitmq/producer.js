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

const runProducer = async () => {
  try {
    // const connection = await amqp.connect(`amqp://guest:Phuc101297@localhost`);
    // const channel = await connection.createChannel();

    const { channel, connection } = await connectToRabbitMQ();

    const queueName = 'test-topic';
    await channel.assertQueue(queueName, {
      durable: true
    });

    // send message to consumer channel
    await channel.sendToQueue(queueName, Buffer.from(message), {
      expiration: '10000' // TTL
    });
    console.log(`Message sent::: `, message);
  } catch (error) {
    console.error(error);
  }
}

// using exchange to router message to queue specific
// 1. using exchange ['fanout']
const postVideo = async ({ msg }) => {
  try {
    // 1. Create channel and connect
    const { channel, connection } = await connectToRabbitMQ();

    // 2. Create exchange
    const nameExchange = 'video';
    await channel.assertExchange(nameExchange, 'fanout', {
      durable: true
    })

    // 3. Publish video
    await channel.publish(nameExchange, '', Buffer.from(msg)) // param '': nghia la khong muon publish cho 1 queue cu the nao ca, bat ky ai cung co the nhan thong qua viec dang ky kenh

    console.log(`[x] Send Ok::: ${msg}`);

    setTimeout(function () {
      connection.close();
      process.exit(0)
    }, 2000);

  } catch (error) {
    console.error(error)
  }
}

// using exchange to router message to queue specific
// 2. using exchange ['topic'] -> only group specific can received message
const sendMail = async () => {
  try {
    // 1. Create channel and connect
    const { channel, connection } = await connectToRabbitMQ();

    // 2. Create exchange
    const nameExchange = 'send-mail';
    await channel.assertExchange(nameExchange, 'topic', {
      durable: true
    })

    // 3. Get msg and topic want to send
    const args = process.argv.slice(2);
    const msg = args[1] || 'Message for Sendmail and Exchange topic!';
    const topic = args[0];

    console.log(`Sendmail::: msg: ${msg}:::topic::${topic}`);

    // 4. publish email for topic
    await channel.publish(nameExchange, topic, Buffer.from(msg));
    console.log(`[x] Send email topic ok::: ${msg}`);

    setTimeout(() => {
      connection.close();
      process.exit(0)
    }, 2000);

  } catch (error) {
    console.error(error.message);
  }
}

// const sendMailTest = async () => {
//   try {
//     // 1. Create channel and connection
//     const { channel, connection } = await connectToRabbitMQ();

//     // 2. Create exchange
//     const exchangeName = 'ex-send-mail-test';
//     await channel.assertExchange(exchangeName, 'topic', {
//       durable: true
//     });

//     // 3. Get message and topic from producer
//     const args = process.argv.slice(2);
//     const msg = args[1];
//     const topic = args[0];

//     // 4. Publish message for exchange with topic expect
//     await channel.publish(exchangeName, topic, Buffer.from(msg));

//     console.log(`[P]::send message for rabbitMQ start: ${msg}`);

//     setTimeout(() => {
//       connection.close();
//       process.exit(0);
//     }, 1000);

//   } catch (error) {
//     console.error(error);
//   }
// }



// runProducer().catch(console.error);

// const msg = process.argv.slice(2).join() || `Hello Exchange!`;
// postVideo({ msg }).catch(console.error);

const sendMailTest = async () => {
  try {
    // 1. Create channel and connection
    const { channel, connection } = await connectToRabbitMQ();

    // 2. Create exchange
    const exchangeName = 'ex-send-mail-test';
    await channel.assertExchange(exchangeName, 'topic', {
      durable: true
    });

    // 3. Get topic and message from producer
    const args = process.argv.slice(2);
    const msg = args[1];
    const topic = args[0];

    // 4. Publish message to exchange and topic that producer expect
    await channel.publish(exchangeName, topic, Buffer.from(msg));
    console.log(`[P]:send message started: ${msg}`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 1000);

  } catch (error) {
    console.error(error);
  }
}

sendMailTest().catch(console.error);

// Some reason a message to send become trash message
// 1. Nhung message error ma AWS tra ve, send grid tra ve, many connection -> push to trash letter || Loi do lap trinh vien handle
// 2. Nhung message, notify quy dinh trong vong 20s phai xu ly nhung no chua duoc xy ly -> push to trash letter || TLL Time To Live
// 3. Luong message trong queue cham toi limit -> kh con cho chua -> nhung thu moi den khong nhan -> push to trash letter