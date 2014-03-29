var fs = require('fs'),
    ejs = require('ejs'),
    Emitter = require('../eventEmitter'),
    BaseView = require('../core/BaseView'),
    templatePath = 'templates/sendbar.ejs';

var SendBarView = BaseView.extend({
    template: fs.readFileSync(templatePath, 'utf8'),
    events: {
        'click #send-btn' : 'sendSMS'
    },

    initialize: function() {

    },

    render: function() {
        this.el.append(ejs.render(this.template));
        this.setupDOMEvents();

        return this;
    },

    sendSMS: function() {
        Emitter.emit('app:sendSMS', {
            message: $('#message-input').val()
        });
    }
});

module.exports = SendBarView;