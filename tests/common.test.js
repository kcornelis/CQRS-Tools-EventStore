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
describe('StreamPosition', function () {
    describe('Start', function () {
        it('should return 0', function () {
            common.StreamPosition.start.should.eql(0);
        });
    });
    describe('End', function () {
        it('should return -1', function () {
            common.StreamPosition.end.should.eql(-1);
        });
    });
});
