/// <reference path="../typings/all.d.ts" />

import should = require('should');
import EventStore = require('../lib/EventStore');
import IConnection = require('../lib/IConnection');
import uuid = require('node-uuid');
import ExpectedVersion = require('../lib/ExpectedVersion');
import results = require('../lib/results');
import messages = require('../lib/messages');

describe('Event store - TCP connection', () => {

	var eventStore: IConnection;

	before(() => {
		eventStore = EventStore.createConnection();
		eventStore.connect();
	});

	describe('When connecting with default settings', () => {

		it('should trigger the connected event', (done) => {
			var es = EventStore.createConnection();
			es.onConnect(done);
			es.connect();
		});
	});

	describe('When sending a ping command', () => {

		it('should execute the callback', (done) => {
			eventStore.ping().then(done);
		});
	});

	describe('When appending new events', () => {

		var streamName = 'test-stream';

		beforeEach(done => {
			eventStore.deleteStream(streamName, ExpectedVersion.any).finally(done);
		});

		it('should execute resolve the promise', (done) => {
			eventStore.appendToStream(streamName, ExpectedVersion.any, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }))
				.then(response => {
					response.result.should.eql(results.OperationResult.success);
					done();
				});
		});

		it('can append one event', (done) => {

			eventStore.appendToStream(streamName, ExpectedVersion.any,
				new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }))
			.then(response => {
				response.result.should.eql(results.OperationResult.success);
				done();
			});
		});

		it('can append multiple events', (done) => {
			eventStore.appendToStream(streamName, ExpectedVersion.any,
				[ new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }),
				  new messages.NewEvent(uuid.v4(), 'Test', { somedata: 2 }, { somemetadata: 4 }) ])
			.then(response => {
				response.result.should.eql(results.OperationResult.success);
				done();
			});
		});

		it('should return an error if the event is not appended', (done) => {
			eventStore.appendToStream(streamName, 99999999999,
				new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }))
			.catch(error => {
				error.should.exist;
				error.result.should.eql(results.OperationResult.wrongExpectedVersion);
				done();
			});
		});
	});

	describe('When deleting a stream', () => {

		var streamName = 'test-stream';

		beforeEach(done => {
			eventStore.appendToStream(streamName, ExpectedVersion.any, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }))
			.finally(done);
		});

		it('should execute the callback with no error and the response message', (done) => {
			eventStore.deleteStream(streamName, ExpectedVersion.any)
				.then(response => {
					response.result.should.eql(results.OperationResult.success);
					done();
				});
		});

		it('should return an error if the stream is not deleted', (done) => {
			eventStore.deleteStream(streamName, 99999999999)
				.catch(response => {
					response.result.should.eql(results.OperationResult.wrongExpectedVersion);
					done();
				});
		});

		it('should delete the stream', (done) => {
			// todo read the stream
			done();
		});
	});

	describe('When reading a stream', () => {

		var streamName = 'test-stream';

		beforeEach(done => {
			eventStore.deleteStream(streamName, ExpectedVersion.any).finally(() => {
				eventStore.appendToStream(streamName, ExpectedVersion.any,
					new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }))
					.finally(done);
			});
		});

		it('should execute the callback with no error and the response message', (done) => {
			eventStore.readStreamEventsForward(streamName, 0, 10)
				.then(response => {
					response.result.should.eql(results.ReadStreamResult.success);
					done();
				});
		});

		it('should return the stream events', (done) => {
			eventStore.readStreamEventsForward(streamName, 0, 99999999999)
				.then(response => {
					response.events[0].event.data.toString('utf8').should.eql('{"somedata":1}');
					done();
				});
		});

		it('should return an error if the response is no success', (done) => {
			eventStore.readStreamEventsForward('blablablabla', 0, 99999999999)
				.catch(response => {
					response.result.should.eql(results.ReadStreamResult.noStream);
					done();
				});
		});
	});
});
