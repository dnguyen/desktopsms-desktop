var _ = require('lodash'),
    fs = require('fs'),
    ejs = require('ejs'),
    $ = window.$;

var MessagesView = function(data) {
    this.el = $('.messages');
    this.messages = data.messages;
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