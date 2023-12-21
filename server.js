const app = require("./src/app");

const PORT = process.env.EXPRESS_PORT || 3030;

const server = app.listen(PORT, () => {
  console.log(`WSV source be mongoose start with port ${PORT} `);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log(`Exit WSV source be mongoose`);
    // send notification when server crash
    // app.notify.send('Server crash...');
  })
})