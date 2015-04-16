/// <reference path="../typings/all.d.ts" />
var should = require('should');
var EventStore = require('../lib/eventstore');
var common = require('../lib/common');
var messages = require('../lib/messages');
var uuid = require('node-uuid');
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
            eventStore.ping(done);
        });
    });
    describe('When appending new events', function () {
        var streamName = 'demo-stream';
        beforeEach(function (done) {
            eventStore.deleteStream(streamName, common.ExpectedVersion.any, done);
        });
        it('should execute the callback with no error and the response message', function (done) {
            eventStore.appendToStream(streamName, common.ExpectedVersion.any, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }), function (error, response) {
                should.not.exist(error);
                response.result.should.eql(messages.OperationResult.success);
                done();
            });
        });
        it('can append one event', function (done) {
            eventStore.appendToStream(streamName, common.ExpectedVersion.any, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }), function (error, response) {
                should.not.exist(error);
                response.result.should.eql(messages.OperationResult.success);
                done();
            });
        });
        it('can append multiple events', function (done) {
            eventStore.appendToStream(streamName, common.ExpectedVersion.any, [new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }), new messages.NewEvent(uuid.v4(), 'Test', { somedata: 2 }, { somemetadata: 4 })], function (error, response) {
                should.not.exist(error);
                response.result.should.eql(messages.OperationResult.success);
                done();
            });
        });
        it('should return an error if the event is not appended', function (done) {
            eventStore.appendToStream(streamName, 99999999999, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }), function (error, response) {
                error.should.exist;
                response.result.should.eql(messages.OperationResult.wrongExpectedVersion);
                done();
            });
        });
    });
    describe('When appending new events (raw)', function () {
        var streamName = 'demo-stream';
        beforeEach(function (done) {
            eventStore.deleteStream(streamName, common.ExpectedVersion.any, done);
        });
        it('sends the message to the event store', function (done) {
            eventStore.appendToStreamRaw(new messages.WriteEvents(streamName, common.ExpectedVersion.any, [new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }), new messages.NewEvent(uuid.v4(), 'Test', { somedata: 2 }, { somemetadata: 4 })]), function (error, response) {
                should.not.exist(error);
                response.result.should.eql(messages.OperationResult.success);
                done();
            });
        });
    });
    describe('When deleting a stream', function () {
        var streamName = 'demo-stream';
        beforeEach(function (done) {
            eventStore.appendToStream(streamName, common.ExpectedVersion.any, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }), done);
        });
        it('should execute the callback with no error and the response message', function (done) {
            eventStore.deleteStream(streamName, common.ExpectedVersion.any, function (error, response) {
                should.not.exist(error);
                response.result.should.eql(messages.OperationResult.success);
                done();
            });
        });
        it('should return an error if the stream is not deleted', function (done) {
            eventStore.deleteStream(streamName, 99999999999, function (error, response) {
                error.should.exist;
                response.result.should.eql(messages.OperationResult.wrongExpectedVersion);
                done();
            });
        });
        it('should delete the stream', function (done) {
            // todo read the stream
            done();
        });
    });
    describe('When deleting a stream (raw)', function () {
        var streamName = 'demo-stream';
        beforeEach(function (done) {
            eventStore.appendToStream(streamName, common.ExpectedVersion.any, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }), done);
        });
        it('it sends the message to the server', function (done) {
            eventStore.deleteStreamRaw(new messages.DeleteStream(streamName, common.ExpectedVersion.any), function (error, response) {
                should.not.exist(error);
                response.result.should.eql(messages.OperationResult.success);
                done();
            });
        });
    });
    describe('When reading a stream', function () {
        var streamName = 'demo-stream';
        beforeEach(function (done) {
            eventStore.deleteStream(streamName, common.ExpectedVersion.any, function () {
                eventStore.appendToStream(streamName, common.ExpectedVersion.any, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }), done);
            });
        });
        it('should execute the callback with no error and the response message', function (done) {
            eventStore.readStreamEventsForward(streamName, 0, 10, function (error, response) {
                should.not.exist(error);
                response.result.should.eql(messages.ReadStreamResult.success);
                done();
            });
        });
        it('should return the stream events', function (done) {
            eventStore.readStreamEventsForward(streamName, 0, 99999999999, function (error, response) {
                response.events[0].event.data.toString('utf8').should.eql('{"somedata":1}');
                done();
            });
        });
        it('should return an error if the response is no success', function (done) {
            eventStore.readStreamEventsForward('blablablabla', 0, 99999999999, function (error, response) {
                error.should.exist;
                response.result.should.eql(messages.ReadStreamResult.noStream);
                done();
            });
        });
    });
    describe('When reading a stream (raw)', function () {
        var streamName = 'demo-stream';
        beforeEach(function (done) {
            eventStore.deleteStream(streamName, common.ExpectedVersion.any, function () {
                eventStore.appendToStream(streamName, common.ExpectedVersion.any, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }), done);
            });
        });
        it('should send the message to the event store', function (done) {
            eventStore.readStreamEventsForwardRaw(new messages.ReadStreamEvents(streamName, 0, 99999999999), function (error, response) {
                response.events[0].event.data.toString('utf8').should.eql('{"somedata":1}');
                done();
            });
        });
    });
});
