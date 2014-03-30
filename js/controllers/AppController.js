var _ = require('lodash'),
    emitter = require('../eventEmitter'),
    socket = require('../core/socket'),
    ThreadsController = require('./ThreadsController'),
    MessagesController = require('./MessagesController'),
    SendBarView = require('../views/SendBar');
    $ = window.$;

var AppController = function() {
    // Layout contains the  DOM elements and views that will be rendered.
    this.layout = {
        overlay: {
            region: $('.overlay')
        },
        threads: {
            region: $('.threads')
        },
        messages: {
            region: $('.messages')
        },
        sendBar: {
            region: $('.send-bar')
        }
    };

    this.setupEvents();
    this.initialSetup();

    emitter.emit('app:showLoadingOverlay');
};

_.extend(AppController.prototype, {
    setupEvents: function() {
        // Use bind so we can change the scope of this to the AppController instead of EventEmitter
        emitter.on('getMessages', this.eventHandlers.createThreadsView.bind(this));
        emitter.on('incomingSMS', this.eventHandlers.incomingSMS.bind(this));

        emitter.on('app:createMessagesView', this.eventHandlers.createMessagesView.bind(this));
        emitter.on('app:switchThread', this.eventHandlers.switchThread.bind(this));
        emitter.on('app:showLoadingOverlay', this.eventHandlers.showLoadingOverlay.bind(this));
        emitter.on('app:closeLoadingOverlay', this.eventHandlers.closeLoadingOverlay.bind(this));
        emitter.on('app:sendSMS', this.eventHandlers.sendSMS.bind(this));
    },

    initialSetup: function() {
        var sendBar = new SendBarView();
        this.layout.sendBar.region.append(sendBar.render().el);
    },

    eventHandlers: {
        createThreadsView: function(data) {
            this.threadsController = new ThreadsController({
                messages: data,
                el: this.layout.threads.region
            });

            var threadsView = this.threadsController.renderView();
            this.layout.threads.view = threadsView;
            this.layout.threads.region.append(threadsView.el);
            emitter.emit('app:createMessagesView', { thread: this.threadsController.threads[0] });
            this.currentThread = this.threadsController.threads[0];
        },

        createMessagesView: function(data) {
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
            this.currentThread = data.thread;
            $('#message-input').val('');
        },

        showLoadingOverlay: function() {
            this.layout.overlay.region.empty();
            var spinner = new window.Spinner().spin();
            this.layout.overlay.region.append(spinner.el);
        },

        closeLoadingOverlay: function() {
            this.layout.overlay.region.empty();
            this.layout.overlay.region.hide();
        },

        sendSMS: function(data) {
            console.log('send sms');
            console.log(this.currentThread);
            socket.send('sendSMS:' + JSON.stringify({
                address: this.currentThread.address,
                message: data.message
            }));
        },

        incomingSMS: function(data) {
            emitter.emit('threads:newMessage', data);
        }
    }
});

module.exports = new AppController;