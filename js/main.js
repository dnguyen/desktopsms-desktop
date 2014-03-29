
$(document).ready(function() {
    var app = require('./js/controllers/AppController'),
        socket = require('./js/core/socket'),
        emitter = require('./js/eventEmitter');

    // Route message headers to Emitter events.
    socket.on('message', function(data, flags) {
        var messageHeader = data.substring(0, data.indexOf(':'));
        var messageData = data.substring(data.indexOf(':') + 1);

        console.group('Recieved Message: ' + messageHeader);
        console.log(messageData);
        console.groupEnd();

        emitter.emit(messageHeader, messageData ? JSON.parse(messageData) : null);
    });

    // Once WebSocket connection has been made, ask for message data.
    socket.on('open', function() {
        socket.send('getMessages');
    });

});