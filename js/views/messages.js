var _ = require('lodash'),
    BaseView = require('../core/BaseView'),
    MessageView = require('./Message');

var MessagesView = BaseView.extend({
    initialize: function(options) {
        console.log('MessagesView initialize');
        this.emitter.on('show', this.onShow);
    },

    render: function() {
        console.log('MessagesView Render');
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
        console.log('show MessagesView');
        window.scrollTo(0, window.document.body.scrollHeight);
    }
});

module.exports = MessagesView;