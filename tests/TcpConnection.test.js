/// <reference path="../typings/all.d.ts" />
var EventStore = require('../lib/EventStore');
var uuid = require('node-uuid');
var ExpectedVersion = require('../lib/ExpectedVersion');
var results = require('../lib/results');
var messages = require('../lib/messages');
describe('Event store - TCP connection', function () {
    var eventStore;
    before(function () {
        eventStore = EventStore.createConnection();
        eventStore.connect();
    });
    describe('When connecting with default settings', function () {
        it('should trigger the connected event', function (done) {
            var es = EventStore.createConnection();
            es.onConnect(done);
            es.connect();
        });
    });
    describe('When sending a ping command', function () {
        it('should execute the callback', function (done) {
            eventStore.ping().then(done);
        });
    });
    describe('When appending new events', function () {
        var streamName = 'test-stream';
        beforeEach(function (done) {
            eventStore.deleteStream(streamName, ExpectedVersion.any).finally(done);
        });
        it('should execute resolve the promise', function (done) {
            eventStore.appendToStream(streamName, ExpectedVersion.any, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 })).then(function (response) {
                response.result.should.eql(results.OperationResult.success);
                done();
            });
        });
        it('can append one event', function (done) {
            eventStore.appendToStream(streamName, ExpectedVersion.any, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 })).then(function (response) {
                response.result.should.eql(results.OperationResult.success);
                done();
            });
        });
        it('can append multiple events', function (done) {
            eventStore.appendToStream(streamName, ExpectedVersion.any, [new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }), new messages.NewEvent(uuid.v4(), 'Test', { somedata: 2 }, { somemetadata: 4 })]).then(function (response) {
                response.result.should.eql(results.OperationResult.success);
                done();
            });
        });
        it('should return an error if the event is not appended', function (done) {
            eventStore.appendToStream(streamName, 99999999999, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 })).catch(function (error) {
                error.should.exist;
                error.result.should.eql(results.OperationResult.wrongExpectedVersion);
                done();
            });
        });
    });
    describe('When deleting a stream', function () {
        var streamName = 'test-stream';
        beforeEach(function (done) {
            eventStore.appendToStream(streamName, ExpectedVersion.any, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 })).finally(done);
        });
        it('should execute the callback with no error and the response message', function (done) {
            eventStore.deleteStream(streamName, ExpectedVersion.any).then(function (response) {
                response.result.should.eql(results.OperationResult.success);
                done();
            });
        });
        it('should return an error if the stream is not deleted', function (done) {
            eventStore.deleteStream(streamName, 99999999999).catch(function (response) {
                response.result.should.eql(results.OperationResult.wrongExpectedVersion);
                done();
            });
        });
        it('should delete the stream', function (done) {
            // todo read the stream
            done();
        });
    });
    describe('When reading a stream', function () {
        var streamName = 'test-stream';
        beforeEach(function (done) {
            eventStore.deleteStream(streamName, ExpectedVersion.any).finally(function () {
                eventStore.appendToStream(streamName, ExpectedVersion.any, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 })).finally(done);
            });
        });
        it('should execute the callback with no error and the response message', function (done) {
            eventStore.readStreamEventsForward(streamName, 0, 10).then(function (response) {
                response.result.should.eql(results.ReadStreamResult.success);
                done();
            });
        });
        it('should return the stream events', function (done) {
            eventStore.readStreamEventsForward(streamName, 0, 99999999999).then(function (response) {
                response.events[0].event.data.toString('utf8').should.eql('{"somedata":1}');
                done();
            });
        });
        it('should return an error if the response is no success', function (done) {
            eventStore.readStreamEventsForward('blablablabla', 0, 99999999999).catch(function (response) {
                response.result.should.eql(results.ReadStreamResult.noStream);
                done();
            });
        });
    });
});
