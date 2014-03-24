/*
	Threads data structure
	{
		'threadid' : {
			id: 'threadid',
			name: 'person's name'
			messages:[
				{
					id
					address
					name
					message
					type
					time
				},
				{ }
			]
		}
	}
*/
//todo: MAJOR refactoring...just a proof of concept for now.
$(document).ready(function() {
	var WebSocket = require('ws'),
		_ = require('lodash');

	var ws = new WebSocket('ws://192.168.0.100:9003');
	var threads = [];
	ws.on('open', function() {
	    ws.send('getMessages');
	});

	ws.on('message', function(data, flags) {
	    console.log('recv a message');
	    console.log(data);
		var data = JSON.parse(data);
		console.log(data);
		_.each(data, function(message) {
			// If thread hasn't been added to the map already, create it.
			if (!threads[message.thread_id]) {
				threads[message.thread_id] = {
					id: message.thread_id,
					address: message.address,
					name: message.name,
					messages: []
				};
			}

			threads[message.thread_id].messages.push({
				id: message.id,
				address: message.address,
				name: message.name,
				message: message.message,
				type: message.msgtype,
				time: message.time
			});
			//console.log('message: ' + message.address + ' - ' + message.message);
		});

		console.group('Finished building threads data structure');
		console.log(threads);
		console.groupEnd();

		var threadsHtml = "";
		_.each(threads, function(thread) {
			if (thread) {
				if (thread.name === '') {
					threadsHtml += '<div class="thread" data-threadid="' + thread.id + '">' + thread.address + '</div>';
				} else {
					threadsHtml += '<div class="thread" data-threadid="' + thread.id + '">' + thread.name + '</div>';
				}
			}
		});
		$('.threads').append(threadsHtml);

		$('.thread').on('click', function(e) {
			var thread = threads[$(this).attr('data-threadid')];
			console.log('clicked thread');
			console.log(thread);
			var messagesHtml = "";
			_.each(thread.messages.reverse(), function(message) {
				if (message.type == 1) {
					messagesHtml += '<div class="message recieved"><div class="text">' + message.message + '</div></div>';
				} else if (message.type == 2) {
					messagesHtml += '<div class="message sent"><div class="text">' + message.message + '</div></div>'
				}
			});
			$('.messages').html('');
			$('.messages').append(messagesHtml);

			window.scrollTo(0, document.body.scrollHeight);
		});

	});
});