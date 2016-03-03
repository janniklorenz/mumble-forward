"use strict";
var servers = require("./config.js");

var mumble = require("mumble");
var fs = require('fs');

var options = {
	key: fs.readFileSync( 'key.pem' ),
	cert: fs.readFileSync( 'cert.pem' )
};


mumble.connect(servers.main.url, options, function ( error, connection ) {
	if( error ) { throw new Error( error ); }

	connection.authenticate(servers.main.username);

	connection.on( "initialized", function () {
		console.log("Main: connection ready");
	});

	// var sessions = {};
	// 	connection.on( 'userState', function (state) {
	// 		sessions[state.session] = state;
	// 	});
	// connection.on( 'textMessage', function (data) {
	// 	var user = sessions[data.actor];
	// 	console.log(user.name + ':', data.message);
	// 	console.log(data);
	//
	// 	connection2.sendMessage("Text", data.message);
	// });

	connection.on( "voice", function (event) {
		servers.slave.connection.sendVoice(event);
	});

	servers.main.connection = connection;
});


mumble.connect(servers.slave.url, options, function ( error, connection ) {
	if( error ) { throw new Error( error ); }

	connection.authenticate(servers.slave.username);

	connection.on( "initialized", function () {
		console.log("Slave: connection ready");
	});

	// var sessions = {};
	// connection.on( 'userState', function (state) {
	// 	sessions[state.session] = state;
	// });
	//
	// connection.on( 'textMessage', function (data) {
	// 	var user = sessions[data.actor];
	// 	console.log(user.name + ':', data.message);
	//
	// 	servers.main.connection.sendMessage("Text", data.message);
	// });

	connection.on( 'voice', function (event) {
		servers.main.connection.sendVoice(event);
	});

	servers.slave.connection = connection;
});
