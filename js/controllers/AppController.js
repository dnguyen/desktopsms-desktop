var _ = require('lodash'),
    emitter = require('../eventEmitter'),
    socket = require('../core/socket'),
    ThreadsController = require('./ThreadsController'),
    MessagesController = require('./MessagesController'),
    $ = window.$;

var AppController = function() {
    this.layout = {
        threads: {
            region: $('.threads')
        },
        messages: {
            region: $('.messages')
        }
    };
    this.setupEvents();

};

_.extend(AppController.prototype, {
    setupEvents: function() {
        // Use bind so we can change the scope of this to the AppController instead of EventEmitter
        emitter.on('getMessages', this.eventHandlers.createThreadsView.bind(this));
        emitter.on('app:createMessagesView', this.eventHandlers.createMessagesView.bind(this));
        emitter.on('app:switchThread', this.eventHandlers.switchThread.bind(this));
    },

    initialSetup: function() {
    },

    eventHandlers: {
        createThreadsView: function(data) {
            console.log('createThreadsView');
            console.log(data);
            var threadsController = new ThreadsController({
                messages: data,
                el: this.layout.threads.region
            });
            var threadsView = threadsController.renderView();
            this.layout.threads.view = threadsView;
            this.layout.threads.region.append(threadsView.el);
            emitter.emit('app:createMessagesView', { thread: threadsController.threads[0] });
        },

        createMessagesView: function(data) {
            console.log('createMessagesView');
            console.log(data);
            var messagesController = new MessagesController({
                el: this.layout.messages.region,
                thread: data.thread
            });

            var messagesView = messagesController.renderView();
            this.layout.messages.view = messagesView;
            this.layout.messages.region.append(messagesView.el);
            messagesView.emitter.emit('show');
        },

        switchThread: function(data) {
            this.layout.messages.view.remove();
            emitter.emit('app:createMessagesView', data);
        }
    }
});

module.exports = new AppController;