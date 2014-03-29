var WebSocket = require('ws'),
    socket = new WebSocket('ws://192.168.0.100:9003');

module.exports = socket;