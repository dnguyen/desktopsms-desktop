
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



    /*
    $('#send-btn').click(function() {
        ws.send('sendSMS:' + JSON.stringify({ address: ThreadsModel.currentThreadObj.address , message: $('#message-input').val() }));

        console.group('Sending SMS');
        console.log(ThreadsModel.currentThreadObj.address + " - " + $('#message-input').val());
        console.groupEnd();

        Emitter.emit('newSMS', {
            message: $('#message-input').val()
        });
    });*/
});