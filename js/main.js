
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



    /*var App = require('./js/controllers/AppController');

    var spinner = new Spinner().spin();
    $('body').prepend('<div class="overlay"></div>');
    $('.overlay').append(spinner.el);

    var WebSocket = require('ws'),
        Emitter = require('./js/eventEmitter'),
        ThreadsModel = require('./js/models/threads'),
        ThreadsView = require('./js/views/threads');

    var ws = new WebSocket('ws://192.168.0.100:9003');

    Emitter.on('changeFocusedThread', App.changeFocusedThread);

    Emitter.on('newSMS', function(data) {

    });

    Emitter.on('getMessages', function(data) {
        ThreadsModel.build(data);

        var newThreadsView = new ThreadsView({ threads : ThreadsModel.threads });
        newThreadsView.render();
        $('.overlay').hide();
    });

    ws.on('open', function() {
        ws.send('getMessages');
    });

    ws.on('message', function(data, flags) {

        var messageHeader = data.substring(0, data.indexOf(':'));
        var messageData = data.substring(data.indexOf(':') + 1);

        console.group('Recieved Message: ' + messageHeader);
        console.log(messageData);
        console.groupEnd();

        Emitter.emit(messageHeader, messageData ? JSON.parse(messageData) : null);
    });

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