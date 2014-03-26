var _ = require('lodash'),
    moment = require('moment');

var Threads = function() {
    this.threads = [];
};

/**
 * Builds the thread data structure from JSON object from the server
 * @param  {object} data JSON object data from server
 * @return {void}
 */
Threads.prototype.build = function(data) {
    var that = this;

    // Build base threads structure.
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

        if (message.read == 0) {
            that.threads[message.thread_id].unread++;
        }

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
};

module.exports = new Threads();
