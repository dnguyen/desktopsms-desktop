
$(document).ready(function() {
    var fs = require('fs'),
        WebSocket = require('ws'),
        _ = require('lodash'),
        ejs = require('ejs'),
        moment = require('moment'),
        events = require('events'),
        Emitter = new events.EventEmitter(),
        ThreadsModel = require('./js/models/threads'),
        ThreadsView = require('./js/views/threads');

    var ws = new WebSocket('ws://192.168.0.100:9003');

    Emitter.on('getMessages', function(data) {
        ThreadsModel.build(data);

        var newThreadsView = new ThreadsView({ threads : ThreadsModel.threads });
        newThreadsView.render();
    });

    ws.on('open', function() {
        ws.send('getMessages');
    });

    ws.on('message', function(data, flags) {
        var messageHeader = data.substring(0, data.indexOf(':'));
        var messageData = data.substring(data.indexOf(':') + 1);

        Emitter.emit(messageHeader, JSON.parse(messageData));
    });
});