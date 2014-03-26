var _ = require('lodash'),
    fs = require('fs'),
    ejs = require('ejs'),
    moment = require('moment'),
    Emitter = require('../eventEmitter'),
    ThreadsModel = require('../models/threads'),
    $ = window.$;

var MessagesView = function(data) {
    this.el = $('.messages');
    this.messages = data.messages;

    var that = this;
    Emitter.on('newSMS', function(data) {
        var newMessage = ejs.render(fs.readFileSync('templates/message.ejs', 'utf8'), {
            message : {
                name: ThreadsModel.currentThreadObj.name,
                message: data.message,
                date: moment(new Date()).format('MMM D, h:mmA')
            },
            filename: 'templates/message.ejs'
        });

        that.el.append(newMessage);

        window.scrollTo(0, window.document.body.scrollHeight);
    });
};

MessagesView.prototype.render = function() {
    this.el.empty();
    var messagesHtml = '';
    _.each(this.messages, function(message) {
        messagesHtml += ejs.render(fs.readFileSync('templates/message.ejs', 'utf8'), { message : message, filename: 'templates/message.ejs' });
    });
    this.el.html('');
    this.el.append(messagesHtml);
    window.scrollTo(0, window.document.body.scrollHeight);
};

module.exports = MessagesView;