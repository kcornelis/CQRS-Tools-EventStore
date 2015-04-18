/// <reference path="../typings/all.d.ts" />
require('should');
var messages = require('../lib/messages');
var Serializer = require('../lib/Serializer');
describe('Serializer', function () {
    describe('When serializing a message', function () {
        var serializer = new Serializer();
        it('it should deserialize with the same values', function () {
            var original = new messages.DeleteStream('abc', 10, true, false);
            var buffer = serializer.serialize('DeleteStream', original);
            var copy = serializer.deserialize('DeleteStream', buffer);
            copy.eventStreamId.should.eql('abc');
            copy.expectedVersion.should.eql(10);
            copy.requireMaster.should.eql(true);
            copy.hardDelete.should.eql(false);
        });
    });
});
