/// <reference path="../typings/all.d.ts" />
var should = require('should');
var messages = require('../lib/messages');
describe('DeleteStream', function () {
    describe('Default constructor', function () {
        var deleteStream = new messages.DeleteStream();
        it('should have no event stream', function () {
            should.not.exist(deleteStream.eventStreamId);
        });
        it('should have expected version append', function () {
            deleteStream.expectedVersion.should.eql(-2);
        });
        it('should have require master set to true', function () {
            deleteStream.requireMaster.should.be.true;
        });
        it('should have hard delete set to true', function () {
            deleteStream.hardDelete.should.be.true;
        });
    });
    describe('Create delete stream message', function () {
        var deleteStream = new messages.DeleteStream('stream', 10, false, false);
        it('should have no event stream', function () {
            deleteStream.eventStreamId.should.eql('stream');
        });
        it('should have expected version append', function () {
            deleteStream.expectedVersion.should.eql(10);
        });
        it('should have require master set to true', function () {
            deleteStream.requireMaster.should.be.false;
        });
        it('should have hard delete set to true', function () {
            deleteStream.hardDelete.should.be.false;
        });
    });
});
