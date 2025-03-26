const { default: mongoose } = require("mongoose");
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

// count Connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections::${numConnection}`);

  return numConnection
};

// check over load
const checkOverLoad = () => {
  setInterval(() => {
    const currentConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // Example maximum number of connections based on number of cores
    const maxConnections = numCores * 5;

    console.log(`Active connections:${currentConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

    if (currentConnection > maxConnections) {
      console.log(`Connection overload detected`);
      //notify.send(...)
    }
  }, _SECONDS); // Monitor every 5 seconds
}

module.exports = {
  countConnect,
  checkOverLoad
}