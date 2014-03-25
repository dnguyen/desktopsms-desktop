/*
    Threads data structure
    {
        'threadid' : {
            id: 'threadid',
            name: 'person's name'
            messages:[
                {
                    id
                    address
                    name
                    message
                    type
                    time
                },
                { }
            ]
        }
    }
*/
//todo: MAJOR refactoring...just a proof of concept for now.
$(document).ready(function() {
    var fs = require('fs'),
        WebSocket = require('ws'),
        _ = require('lodash'),
        ejs = require('ejs');

    var ws = new WebSocket('ws://192.168.0.100:9003');
    var threads = [];

    ws.on('open', function() {
        ws.send('getMessages');
    });

    ws.on('message', function(data, flags) {
        console.log('recv a message');
        console.log(data);
        var data = JSON.parse(data);
        console.log(data);
        _.each(data, function(message) {
            // If thread hasn't been added to the map already, create it.
            if (!threads[message.thread_id]) {
                threads[message.thread_id] = {
                    id: message.thread_id,
                    address: message.address,
                    name: message.name,
                    messages: []
                };
            }

            threads[message.thread_id].messages.push({
                id: message.id,
                address: message.address,
                name: message.name,
                message: message.message,
                type: message.msgtype,
                time: message.time
            });
            //console.log('message: ' + message.address + ' - ' + message.message);
        });

        console.group('Finished building threads data structure');
        console.log(threads);
        console.groupEnd();

        var threadsHtml = "";
        _.each(threads, function(thread) {
            if (thread) {
                threadsHtml += ejs.render(fs.readFileSync('templates/thread.ejs', 'utf8'), { thread : thread, filename: 'templates/thread.ejs' });
            }
        });
        $('.threads').append(threadsHtml);

        $('.thread').on('click', function(e) {
            var thread = threads[$(this).attr('data-threadid')];
            console.log('clicked thread');
            console.log(thread);

            var messagesHtml = "";
            _.each(thread.messages.reverse(), function(message) {
                messagesHtml += ejs.render(fs.readFileSync('templates/message.ejs', 'utf8'), { message : message, filename: 'templates/message.ejs' });
            });

            $('.messages').html('');
            $('.messages').append(messagesHtml);

            window.scrollTo(0, document.body.scrollHeight);
        });

    });
});