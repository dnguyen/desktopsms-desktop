var _ = require('lodash'),
    moment = require('moment'),
    Emitter = require('../eventEmitter'),
    BaseView = require('../core/BaseView'),
    MessageView = require('./Message');

var MessagesView = BaseView.extend({
    initialize: function(options) {
        console.log('MessagesView initialize');
        this.emitter.on('show', this.onShow);
        Emitter.on('app:sendSMS', this.renderPendingMessage.bind(this));
        Emitter.on('messages:newMessage', this.renderNewMessage.bind(this));
    },

    render: function() {
        var that = this;
        var htmlAppend = '';
        _.each(this.messages, function(message) {
            var messageView = new MessageView({
                message: message
            });
            that.el.append(messageView.render().el);
        });
        
        return this;
    },

    onShow: function() {
        window.scrollTo(0, window.document.body.scrollHeight);
    },

    // Renders a new message that user sent
    renderPendingMessage: function() {
        var PendingView = require('./PendingMessage');
        var pendingView = new PendingView();
        this.el.append(pendingView.render().el);

        $('#message-input').val('');
        window.scrollTo(0, window.document.body.scrollHeight);
    },

    // Renders new incoming messages
    renderNewMessage: function(data) {
        console.log('render new message');
        $('.pending-message').remove();
        var messageView = new MessageView({
            message: data
        });
        this.el.append(messageView.render().el);

        window.scrollTo(0, window.document.body.scrollHeight);
    }
});

module.exports = MessagesView;