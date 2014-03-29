var _ = require('lodash'),
    moment = require('moment'),
    Emitter = require('../eventEmitter'),
    ThreadsView = require('../views/Threads');

var ThreadsController = function(data) {
    console.log('new ThreadsController');
    console.log(data);
    this.el = data.el;
    this.threads = [];
    this.build(data.messages);
};

_.extend(ThreadsController.prototype, {

    /**
     * Builds the data structure that will store threads and messages.
     * @param  {array} data - Array of messages returned from the phone.
     * @return {void}
     */
    build: function(data) {
        var that = this;

        _.each(data, function(message) {
            // If thread hasn't been added to the array already, create it.
            if (!that.threads[message.thread_id]) {
                that.threads[message.thread_id] = {
                    id: message.thread_id,
                    address: message.address,
                    name: message.name,
                    messages: [],
                    unread: 0
                };
            }

            // Increase unread count for the thread if there is an unread message.
            if (message.read == 0) {
                that.threads[message.thread_id].unread++;
            }

            // Add the message to the proper thread
            that.threads[message.thread_id].messages.push({
                id: message.id,
                address: message.address,
                name: message.name,
                message: message.message,
                type: message.msgtype,
                time: message.time,
                date: moment(new Date(parseInt(message.time))).format('MMM D, h:mmA')
            });
        });

        // Remove any undefined indices
        that.threads = _.compact(that.threads);

        // Sort the messages in each thread by time they were recieved. Latest messages should be last.
        _.each(that.threads, function(thread) {
            thread.messages = _.sortBy(thread.messages, function(message) { return message.time; });
            // Latest text message of the thread will always be the last element in the messages array
            thread.lastMessage = thread.messages[thread.messages.length - 1].time;
        });

        that.threads = _.sortBy(that.threads, function(thread) {
            return thread.lastMessage;
        }).reverse();
    },

    renderView: function() {
        var threadsView = new ThreadsView({
            el: this.el,
            threads: this.threads
        });

        return threadsView.render();
    }
});

module.exports = ThreadsController;