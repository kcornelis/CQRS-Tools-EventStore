/// <reference path="../typings/all.d.ts" />

import should = require('should');
import EventStore = require('../lib/eventstore');
import common = require('../lib/common');
import messages = require('../lib/messages');
import uuid = require('node-uuid');

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

	describe('When appending new events', () => {

		it('should execute the callback with no error and the response message', (done) => {
			eventStore.appendToStream('Hello', common.ExpectedVersion.any,
				new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }),
				(error, response) => {
					should.not.exist(error);
					response.result.should.eql(common.OperationResult.success);
					done();
				});
		});

		it('can append one event', (done) => {
			eventStore.appendToStream('Hello', common.ExpectedVersion.any,
				new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }),
				(error, response) => {
					should.not.exist(error);
					response.result.should.eql(common.OperationResult.success);
					done();
				});
		});

		it('can append multiple events', (done) => {
			eventStore.appendToStream('Hello', common.ExpectedVersion.any,
				[ new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }),
				  new messages.NewEvent(uuid.v4(), 'Test', { somedata: 2 }, { somemetadata: 4 }) ],
				(error, response) => {
					should.not.exist(error);
					response.result.should.eql(common.OperationResult.success);
					done();
				});
		});

		it('should return an error if the event is not appended', (done) => {
			eventStore.appendToStream('Hello', 99999999999,
				new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }),
				(error, response) => {
					error.should.exist;
					response.result.should.eql(common.OperationResult.wrongExpectedVersion);
					done();
				});
		});
	});
});
