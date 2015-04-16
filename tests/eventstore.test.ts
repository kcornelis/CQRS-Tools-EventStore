/// <reference path="../typings/all.d.ts" />

import should = require('should');
import EventStore = require('../lib/eventstore');
import IConnection = require('../lib/iconnection');
import common = require('../lib/common');
import messages = require('../lib/messages');
import uuid = require('node-uuid');

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
			eventStore.ping(done);
		});
	});

	describe('When appending new events', () => {

		var streamName = 'demo-stream';

		beforeEach(done => {
			eventStore.deleteStream(streamName, common.ExpectedVersion.any, done);
		});

		it('should execute the callback with no error and the response message', (done) => {
			eventStore.appendToStream(streamName, common.ExpectedVersion.any,
				new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }),
				(error, response) => {
					should.not.exist(error);
					response.result.should.eql(messages.OperationResult.success);
					done();
				});
		});

		it('can append one event', (done) => {
			eventStore.appendToStream(streamName, common.ExpectedVersion.any,
				new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }),
				(error, response) => {
					should.not.exist(error);
					response.result.should.eql(messages.OperationResult.success);
					done();
				});
		});

		it('can append multiple events', (done) => {
			eventStore.appendToStream(streamName, common.ExpectedVersion.any,
				[ new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }),
				  new messages.NewEvent(uuid.v4(), 'Test', { somedata: 2 }, { somemetadata: 4 }) ],
				(error, response) => {
					should.not.exist(error);
					response.result.should.eql(messages.OperationResult.success);
					done();
				});
		});

		it('should return an error if the event is not appended', (done) => {
			eventStore.appendToStream(streamName, 99999999999,
				new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }),
				(error, response) => {
					error.should.exist;
					response.result.should.eql(messages.OperationResult.wrongExpectedVersion);
					done();
				});
		});
	});

	describe('When appending new events (raw)', () => {

		var streamName = 'demo-stream';

		beforeEach(done => {
			eventStore.deleteStream(streamName, common.ExpectedVersion.any, done);
		});

		it('sends the message to the event store', (done) => {
			eventStore.appendToStreamRaw(new messages.WriteEvents(streamName, common.ExpectedVersion.any,
				[ new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }),
				  new messages.NewEvent(uuid.v4(), 'Test', { somedata: 2 }, { somemetadata: 4 }) ]),
				(error, response) => {
					should.not.exist(error);
					response.result.should.eql(messages.OperationResult.success);
					done();
				});
		});
	});

	describe('When deleting a stream', () => {

		var streamName = 'demo-stream';

		beforeEach(done => {
			eventStore.appendToStream(streamName, common.ExpectedVersion.any,
				new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }),
				done);
		});

		it('should execute the callback with no error and the response message', (done) => {
			eventStore.deleteStream(streamName, common.ExpectedVersion.any,
				(error, response) => {
					should.not.exist(error);
					response.result.should.eql(messages.OperationResult.success);
					done();
				});
		});

		it('should return an error if the stream is not deleted', (done) => {
			eventStore.deleteStream(streamName, 99999999999,
				(error, response) => {
					error.should.exist;
					response.result.should.eql(messages.OperationResult.wrongExpectedVersion);
					done();
				});
		});

		it('should delete the stream', (done) => {
			// todo read the stream
			done();
		});
	});

	describe('When deleting a stream (raw)', () => {

		var streamName = 'demo-stream';

		beforeEach(done => {
			eventStore.appendToStream(streamName, common.ExpectedVersion.any,
				new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }),
				done);
		});

		it('it sends the message to the server', (done) => {
			eventStore.deleteStreamRaw(new messages.DeleteStream(streamName, common.ExpectedVersion.any),
				(error, response) => {
					should.not.exist(error);
					response.result.should.eql(messages.OperationResult.success);
					done();
				});
		});
	});

	describe('When reading a stream', () => {

		var streamName = 'demo-stream';

		beforeEach(done => {
			eventStore.deleteStream(streamName, common.ExpectedVersion.any, () => {
				eventStore.appendToStream(streamName, common.ExpectedVersion.any,
					new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }),
					done);
			});
		});

		it('should execute the callback with no error and the response message', (done) => {
			eventStore.readStreamEventsForward(streamName, 0, 10,
				(error, response) => {
					should.not.exist(error);
					response.result.should.eql(messages.ReadStreamResult.success);
					done();
				});
		});

		it('should return the stream events', (done) => {
			eventStore.readStreamEventsForward(streamName, 0, 99999999999,
				(error, response) => {
					response.events[0].event.data.toString('utf8').should.eql('{"somedata":1}');
					done();
				});
		});

		it('should return an error if the response is no success', (done) => {
			eventStore.readStreamEventsForward('blablablabla', 0, 99999999999,
				(error, response) => {
					error.should.exist;
					response.result.should.eql(messages.ReadStreamResult.noStream);
					done();
				});
		});
	});

	describe('When reading a stream (raw)', () => {

		var streamName = 'demo-stream';

		beforeEach(done => {
			eventStore.deleteStream(streamName, common.ExpectedVersion.any, () => {
				eventStore.appendToStream(streamName, common.ExpectedVersion.any,
					new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }),
					done);
			});
		});

		it('should send the message to the event store', (done) => {
			eventStore.readStreamEventsForwardRaw(new messages.ReadStreamEvents(streamName, 0, 99999999999),
				(error, response) => {
					response.events[0].event.data.toString('utf8').should.eql('{"somedata":1}');
					done();
				});
		});
	});
});
