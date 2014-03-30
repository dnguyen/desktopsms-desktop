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
        Emitter.on('thread-' + this.data.id + ':newMessage', this.renderNewMessageNotification.bind(this));
    },

    render: function() {
        this.el.attr('data-threadid', this.data.id);
        this.el.append(ejs.render(this.template, { thread: this.data }));
        this.setupDOMEvents();

        return this;
    },

    clickedThread: function() {
        Emitter.emit('app:switchThread', { thread: this.data });

        // If there are any unread messages, clear them.
        if (this.data.unread > 0) {
            this.data.unread = 0;
            this.el.html(ejs.render(this.template, { thread: this.data }));
        }
    },

    // Add unread count notification
    renderNewMessageNotification: function() {
        console.log(this.data.name + ' recieved a new message');
        this.data.unread++;
        this.el.html(ejs.render(this.template, { thread: this.data }));
    }
});

module.exports = ThreadView;