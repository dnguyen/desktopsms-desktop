var _ = require('lodash'),
    MessagesView = require('../views/Messages');

var MessagesController = function(options) {
    console.log('MessagesController constructor');

    this.el = options.el;
    this.thread = options.thread;
};

_.extend(MessagesController.prototype, {
    renderView: function() {
        var messagesView = new MessagesView({
            messages: this.thread.messages
        });

        this.el.append(messagesView.render().el);

        return messagesView;
    }
});

module.exports = MessagesController;
