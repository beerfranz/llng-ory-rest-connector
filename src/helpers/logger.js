// logs
const logManager = require('simple-node-logger').createLogManager({ 
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
  level: process.env.LOG_LEVEL || 'info'
});

module.exports = logManager;
