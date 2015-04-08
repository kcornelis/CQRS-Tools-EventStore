/// <reference path="../typings/all.d.ts" />
var EventStore = require('../lib/eventstore');
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
});
