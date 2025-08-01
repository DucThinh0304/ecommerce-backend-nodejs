"use strict";

const mongoose = require("mongoose");
const os = require("os");
const _SECOND = 5000;

let intervalChecker;

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connection: ${numConnection}`);
};

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnection = numCores * 5;
    console.log(`Active Conection: ${numConnection}`);
    console.log(`Memory Usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnection) {
      console.log("Conection Overload detected!");
    }
  }, _SECOND);
};
module.exports = {
  countConnect,
  checkOverload,
};
