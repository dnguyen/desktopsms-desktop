var fs = require('fs'),
    ejs = require('ejs'),
    Emitter = require('../eventEmitter'),
    BaseView = require('../core/BaseView'),
    templatePath = 'templates/thread.ejs';

var ThreadView = BaseView.extend({
    className: 'thread',
    template: fs.readFileSync(templatePath, 'utf8'),
    events: {
        'click' : 'clickedThread'
    },

    initialize: function(options) {
    },

    render: function() {
        this.el.attr('data-threadid', this.data.id);
        this.el.append(ejs.render(this.template, { thread: this.data }));
        return this;
    },

    clickedThread: function() {
        Emitter.emit('app:switchThread', { thread: this.data });
    }
});

module.exports = ThreadView;