/// <reference path="../typings/all.d.ts" />
require('should');
var common = require('../lib/common');
describe('ExpectedVersion', function () {
    describe('Append to stream', function () {
        it('should return -2', function () {
            common.ExpectedVersion.any.should.eql(-2);
        });
    });
    describe('Stream should not exist', function () {
        it('should return -1', function () {
            common.ExpectedVersion.notExist.should.eql(-1);
        });
    });
});
describe('ContentType', function () {
    describe('Binary', function () {
        it('should return 0', function () {
            common.ContentType.binary.should.eql(0);
        });
    });
    describe('Json', function () {
        it('should return 1', function () {
            common.ContentType.json.should.eql(1);
        });
    });
});
describe('ContentType', function () {
    describe('success', function () {
        it('should return 0', function () {
            common.OperationResult.success.should.eql(0);
        });
    });
    describe('prepareTimeout', function () {
        it('should return 0', function () {
            common.OperationResult.prepareTimeout.should.eql(1);
        });
    });
    describe('commitTimeout', function () {
        it('should return 0', function () {
            common.OperationResult.commitTimeout.should.eql(2);
        });
    });
    describe('forwardTimeout', function () {
        it('should return 0', function () {
            common.OperationResult.forwardTimeout.should.eql(3);
        });
    });
    describe('wrongExpectedVersion', function () {
        it('should return 0', function () {
            common.OperationResult.wrongExpectedVersion.should.eql(4);
        });
    });
    describe('streamDeleted', function () {
        it('should return 0', function () {
            common.OperationResult.streamDeleted.should.eql(5);
        });
    });
    describe('invalidTransaction', function () {
        it('should return 0', function () {
            common.OperationResult.invalidTransaction.should.eql(6);
        });
    });
    describe('accessDenied', function () {
        it('should return 0', function () {
            common.OperationResult.accessDenied.should.eql(7);
        });
    });
});
