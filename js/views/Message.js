var _ = require('lodash'),
    fs = require('fs'),
    ejs = require('ejs'),
    BaseView = require('../core/BaseView'),
    templatePath = 'templates/message.ejs';

var MessageView = BaseView.extend({
    className: 'message-wrapper',
    template: fs.readFileSync(templatePath, 'utf8'),
    events: {
        'click' : 'test'
    },

    initialize: function(options) {
    },

    render: function() {
        if (this.message.type == 1) {
            this.el.addClass('recieved');
        } else {
            this.el.addClass('sent');
        }

        this.el.append(ejs.render(this.template, { message : this.message }));

        return this;
    },

    test: function() {
        console.log('click message el');
    }
});

module.exports = MessageView;