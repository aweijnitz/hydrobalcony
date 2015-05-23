#!/usr/bin/node

var request = require('superagent');
var conf = require('./conf/smsconf.json');


var sendSMS = function(msg, conf) {
    request
	.post(conf.apiUrl)
	.send({ text: msg, to: conf.recipients })
	.set('Authorization', ' bearer '+conf.apiKey)
	.set('Content-Type', 'application/json')
	.set('Accept', 'application/json')
	.set('X-Version', '1')
	.end(function(err, res){
	    if (res.ok) {
		console.log('yay got ' + JSON.stringify(res.body));
	    } else {
		console.log('Oh no! error ' + res.text);
		 }
	});
};

sendSMS('NO REPLY. Hydro Alert! Test message 2/2.', conf)

