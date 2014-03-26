var _ = require('lodash'),
    fs = require('fs'),
    ejs = require('ejs');
    $ = window.$,
    threadTemplate = 'templates/thread.ejs',
    MessagesView = require('./messages');

var ThreadsView = function(data) {
    this.el = $('.threads');
    this.threads = data.threads;
    this.currentThreadId = 0;
};

ThreadsView.prototype.render = function() {
    this.el.empty();

    var threadsHtml = '';
    _.each(this.threads, function(thread) {
        threadsHtml += ejs.render(fs.readFileSync(threadTemplate, 'utf8'), { thread : thread, filename: threadTemplate });
    });
    $('.threads').append(threadsHtml);

    this.setupEvents();

    var messagesView = new MessagesView({ messages : this.threads[this.currentThreadId].messages });
    messagesView.render();
};

ThreadsView.prototype.setupEvents = function() {
    var that = this;

    $('.thread').on('click', function(e) {
        if ($(this).attr('data-threadid') != that.currentThreadId) {
            that.currentThreadId = $(this).attr('data-threadid');
            var currentThreadObj = _.find(that.threads, function(thread) {
                return thread.id == that.currentThreadId;
            });

            console.log('clicked thread');
            console.log(currentThreadObj);

            var messagesView = new MessagesView({ messages : currentThreadObj.messages });
            messagesView.render();
        }
    });
};

module.exports = ThreadsView;