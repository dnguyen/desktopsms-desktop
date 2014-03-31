var _ = require('lodash'),
    events = require('events'),
    Emitter = new events.EventEmitter(),
    $ = window.$,
    extend = require('./extend');

var BaseView = function(options) {
    options || (options = { });
    _.extend(this, options);

    // Create DOM element
    this.el = $('<' + this.tag + '/>', {
        id: this.id,
        "class": this.className
    });

    // Give each view their own event emitter
    this.emitter = Emitter;

    // Can't setup dom events here...since template for views haven't been added to the el yet.
    // Need to come up with a way to have a render function that all views call. Instead of each view
    // defining their own render function.
    //this.setupDOMEvents();

    this.initialize.apply(this, arguments);
};

_.extend(BaseView.prototype, {
    tag: 'div',
    initialize: function(options) {
        console.log('initialize base view');
    },

    remove: function() {
        console.log('call remove');
        if (this.el) {
            this.el.remove();
        }
        this.emitter.removeAllListeners();
    },

    render: function() {
        console.log('BaseView Render');
    },

    /*
        Sets up jQuery UI event bindings defined in the this.events object
        Note: currently doesn't work for anything other than this.el
     */
    setupDOMEvents: function() {
        if (this.events) {
            for(var eventBind in this.events) {
                if (this.events.hasOwnProperty(eventBind)) {
                    var that = this;

                    // Get string up until the first space, this will be the event we're binding to the element
                    var jqueryEvent = eventBind.substring(0, eventBind.indexOf(' '));
                    // Get string after first space, this will be the element we're bindng the event to
                    var selector = eventBind.substring(eventBind.indexOf(' ') + 1);

                    // If no element was given an event to bind to. eg: click, ontouch, etc
                    // Bind the event to this.el
                    var bindElement;
                    if (!jqueryEvent) {
                        bindElement = $(this.el);
                        jQueryEvent = selector;
                    } else {
                        bindElement = $(this.el).find(selector);
                        selector = jqueryEvent;
                    }

                    $(bindElement).on(selector, function() {
                        that[that.events[eventBind]].apply(that, arguments);
                    });
                };
            }
        }
    }
});

BaseView.extend = extend;
module.exports = BaseView;

