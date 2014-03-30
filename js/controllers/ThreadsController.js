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
    Emitter.on('threads:newMessage', this.addNewMessage.bind(this));
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
    },

    addNewMessage: function(data) {
        console.log('adding new message to a thread');
        console.log(data);
        // Need to find the thread id the message belongs to.
        // Just try and match the number with all of the threads
        //console.log(this.threadsController.threads);
        var foundThread = _.findIndex(this.threads, function(thread) {
            return data.number == thread.address;
        });

        if (foundThread > -1) {
            var newMessage = {
                name: this.threads[foundThread].name,
                message: data.message,
                address: data.address,
                type: 1,
                date: moment(new Date()).format('MMM D, h:mmA')
            };

            this.threads[foundThread].messages.push(newMessage);
            Emitter.emit('messages:newMessage', newMessage);
        }
    }
});

module.exports = ThreadsController;