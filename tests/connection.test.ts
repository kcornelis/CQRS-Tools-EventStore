/// <reference path="../typings/all.d.ts" />

import should = require('should');
import EventStore = require('../lib/eventstore');

describe('Event store - TCP connection', () => {

	var eventStore = EventStore.createConnection();
	eventStore.connect();

	describe('When connecting with default settings', () => {
		it('should trigger the connected event', (done) => {
			var es = EventStore.createConnection();
			es.onConnect(done);
			es.connect();
		});
	});

	describe('When sending a ping command', () => {
		it('should execute the callback', (done) => {
			eventStore.ping(done);
		});
	});
});
