/*
	Threads data structure
	{
		'threadid' : {
			id: 'threadid',
			messages:[
				{
					id
					address
					message
					type
					time
				},
				{ }
			]
		}
	}
*/
//todo: MAJOR refactoring...just a proof of concept for not.
$(document).ready(function() {

	// Find the computer's local ip address to bind to.
	var os=require('os');
	var ifaces=os.networkInterfaces();
	var networkInterfaces = [];
	for (var dev in ifaces) {
	  var alias=0;
	  ifaces[dev].forEach(function(details){
	    if (details.family=='IPv4') {
	      networkInterfaces.push(details.address);
	      ++alias;
	    }
	  });
	}
	console.log('Create server at ' + networkInterfaces[0] + ":3005");
	var app = require('http').createServer()
		app.listen(3005, networkInterfaces[0]);

	var io = require('socket.io').listen(app),
		fs = require('fs'),
		_ = require('lodash');

	var threads = { };

	io.sockets.on('connection', function(socket) {
		console.log('MADE A SOCKET CONNECTION!');
		socket.on('getMessages', function(data) {
			var data = JSON.parse(data);
			console.log(data);
			_.each(data, function(message) {
				// If thread hasn't been added to the map already, create it.
				if (!threads[message.thread_id]) {
					threads[message.thread_id] = {
						id: message.thread_id,
						messages: []
					};
				}

				threads[message.thread_id].messages.push({
					id: message.id,
					address: message.address,
					message: message.message,
					type: message.msgType,
					time: message.time
				});
				//console.log('message: ' + message.address + ' - ' + message.message);
			});

			console.group('Finished building threads data structure');
			console.log(threads);
			console.groupEnd();
		});
	});
});

/*var currentThread = "1";

var	request = require('request');
var needle = require('needle');

function getThread(threadId, callback) {
	request('http://localhost:28964/api/threads?id=' + threadId, function(err, resp, body) {
		if (err) throw err;

		callback(JSON.parse(body));
	});
}

$(document).ready(function() {
	request('http://localhost:28964/api/threads', function(err, resp, body) {
		if (err) throw err;

		var threadsObj = JSON.parse(body);
		for (var thread in threadsObj) {
			// Looping through object properties, so use threadsObj[thread]
			var threadObj = threadsObj[thread];

			// Can start rendering threads list
			// TODO: Move append outside of loop.
			$('.threads').append('<div data-id="' + thread + '" class="thread"><a>' + threadObj.address + '</a></div>');

			// Setup events for thread clicking
			$.each($('.threads').children(), function (i, threadEl) {
	    		$(this).click(function(e) {

	        		var clickedThreadId = $(this).attr('data-id');

	        		if (currentThread !== clickedThreadId) {
		        		currentThread = clickedThreadId;

		        		$('.messages').html('');

		        		getThread(currentThread, function(threadObj) {

			        		$.each(threadObj.messages.reverse(), function(i, messageObj) {
								if (messageObj.msgtype === "1") {
									$('.messages').append('<div class="recv-msg">' + messageObj.message + '</div>');

								// If message is a sent message
								} else if (messageObj.msgtype === "2") {
									$('.messages').append('<div class="sent-msg">' + messageObj.message + '</div>');

								}
			        		});

		        		});
	        		}
	    		});
			});
		}
	});

	$('#send-btn').click(function(e) {
		request.post({
			headers: {
				'content-type' : 'application/x-www-form-urlencoded'
			},
			url: 'http://localhost:28964/api/messages',
			form: {
				message: $('#message-input').val()
			}
		}, function(err, resp, body) {
			if (err) throw err;
			console.log('done');
			console.log(resp);
		});
	});
});*/