var _ = require('lodash'),
    fs = require('fs'),
    ejs = require('ejs'),
    Emitter = require('../eventEmitter'),
    $ = window.$,
    ThreadsModel = require('../models/threads'),
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

    var messagesView = new MessagesView({ messages : this.threads[ThreadsModel.currentThreadId].messages });
    messagesView.render();
};

ThreadsView.prototype.setupEvents = function() {
    var that = this;

    $('.thread').on('click', function(e) {
        var clickedThreadId = $(this).attr('data-threadid');

        if (clickedThreadId != ThreadsModel.currentThreadId) {
            ThreadsModel.currentThreadId = clickedThreadId;
            ThreadsModel.currentThreadObj = _.find(that.threads, function(thread) {
                return thread.id == ThreadsModel.currentThreadId;
            });

            console.log('clicked thread');
            console.log(ThreadsModel.currentThreadObj);

            var messagesView = new MessagesView({ messages : ThreadsModel.currentThreadObj.messages });
            messagesView.render();
        }
    });
};

module.exports = ThreadsView;