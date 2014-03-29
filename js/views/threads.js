var _ = require('lodash'),
    BaseView = require('../core/BaseView'),
    ThreadView = require('./ThreadView');

var ThreadsView = BaseView.extend({
    initialize: function(options) {
        console.log('initialize ThreadsView');
    },

    render: function() {
        var that = this;
        _.each(this.threads, function(thread) {
            var threadView = new ThreadView({ data: thread });
            that.el.append(threadView.render().el);
        });

        return this;
    }
});

module.exports = ThreadsView;