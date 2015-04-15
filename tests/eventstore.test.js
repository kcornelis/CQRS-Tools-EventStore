/// <reference path="../typings/all.d.ts" />
var should = require('should');
var EventStore = require('../lib/eventstore');
var common = require('../lib/common');
var messages = require('../lib/messages');
var uuid = require('node-uuid');
describe('Event store - TCP connection', function () {
    var eventStore = EventStore.createConnection();
    eventStore.connect();
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
        it('should execute the callback with no error and the response message', function (done) {
            eventStore.appendToStream('Hello', common.ExpectedVersion.any, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }), function (error, response) {
                should.not.exist(error);
                response.result.should.eql(common.OperationResult.success);
                done();
            });
        });
        it('can append one event', function (done) {
            eventStore.appendToStream('Hello', common.ExpectedVersion.any, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }), function (error, response) {
                should.not.exist(error);
                response.result.should.eql(common.OperationResult.success);
                done();
            });
        });
        it('can append multiple events', function (done) {
            eventStore.appendToStream('Hello', common.ExpectedVersion.any, [new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }), new messages.NewEvent(uuid.v4(), 'Test', { somedata: 2 }, { somemetadata: 4 })], function (error, response) {
                should.not.exist(error);
                response.result.should.eql(common.OperationResult.success);
                done();
            });
        });
        it('should return an error if the event is not appended', function (done) {
            eventStore.appendToStream('Hello', 99999999999, new messages.NewEvent(uuid.v4(), 'Test', { somedata: 1 }, { somemetadata: 2 }), function (error, response) {
                error.should.exist;
                response.result.should.eql(common.OperationResult.wrongExpectedVersion);
                done();
            });
        });
    });
});
