var _ = require('lodash'),
    fs = require('fs'),
    ejs = require('ejs'),
    BaseView = require('../core/BaseView'),
    templatePath = 'templates/pending-message.ejs';

var PendingMessageView = BaseView.extend({
    className: 'pending-message',
    template: fs.readFileSync(templatePath, 'utf8'),

    initialize: function(options) {
    },

    render: function() {
        this.el.append(ejs.render(this.template));

        return this;
    }
});

module.exports = PendingMessageView;