var _ = require('lodash'),
    moment = require('moment'),
    Emitter = require('../eventEmitter'),
    BaseView = require('../core/BaseView'),
    MessageView = require('./Message');

var MessagesView = BaseView.extend({
    initialize: function(options) {
        console.log('MessagesView initialize');
        this.emitter.on('show', this.onShow);
        Emitter.on('app:sendSMS', this.addNewMessage.bind(this));
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

    addNewMessage: function(data) {
        var messageView = new MessageView({
            message: {
                type: 2,
                message: data.message,
                date: moment(new Date()).format('MMM D, h:mmA')
            }
        });
        this.el.append(messageView.render().el);

        $('#message-input').val('');
        window.scrollTo(0, window.document.body.scrollHeight);
    }
});

module.exports = MessagesView;