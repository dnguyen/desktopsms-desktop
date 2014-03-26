
$(document).ready(function() {
    var fs = require('fs'),
        WebSocket = require('ws'),
        _ = require('lodash'),
        ejs = require('ejs'),
        moment = require('moment'),
        ThreadsModel = require('./js/models/threads'),
        ThreadsView = require('./js/views/threads');

    var ws = new WebSocket('ws://192.168.0.100:9003');

    ws.on('open', function() {
        ws.send('getMessages');
    });

    ws.on('message', function(data, flags) {
        console.log('recv a message');
        var data = JSON.parse(data);
        console.group("JSON DATA");
        console.log(data);
        console.groupEnd();

        ThreadsModel.build(data);
        console.log(ThreadsModel.threads);
        var newThreadsView = new ThreadsView({ threads : ThreadsModel.threads });
        newThreadsView.render();
    });
});