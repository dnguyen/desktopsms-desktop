var _ = require('lodash'),
    emitter = require('../eventEmitter'),
    socket = require('../core/socket'),
    ThreadsController = require('./ThreadsController'),
    MessagesController = require('./MessagesController'),
    $ = window.$;

var AppController = function() {
    this.layout = {
        overlay: {
            region: $('.overlay')
        },
        threads: {
            region: $('.threads')
        },
        messages: {
            region: $('.messages')
        }
    };

    this.setupEvents();

    emitter.emit('app:showLoadingOverlay');
};

_.extend(AppController.prototype, {
    setupEvents: function() {
        // Use bind so we can change the scope of this to the AppController instead of EventEmitter
        emitter.on('getMessages', this.eventHandlers.createThreadsView.bind(this));
        emitter.on('app:createMessagesView', this.eventHandlers.createMessagesView.bind(this));
        emitter.on('app:switchThread', this.eventHandlers.switchThread.bind(this));
        emitter.on('app:showLoadingOverlay', this.eventHandlers.showLoadingOverlay.bind(this));
        emitter.on('app:closeLoadingOverlay', this.eventHandlers.closeLoadingOverlay.bind(this));
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
            emitter.emit('app:closeLoadingOverlay');
        },

        switchThread: function(data) {
            this.layout.messages.view.remove();
            emitter.emit('app:createMessagesView', data);
        },

        showLoadingOverlay: function() {
            this.layout.overlay.region.empty();
            var spinner = new window.Spinner().spin();
            this.layout.overlay.region.append(spinner.el);
        },

        closeLoadingOverlay: function() {
            this.layout.overlay.region.empty();
            this.layout.overlay.region.hide();
        }
    }
});

module.exports = new AppController;