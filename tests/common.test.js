/// <reference path="../typings/all.d.ts" />
var common = require('../lib/common');
describe('ExpectedVersion', function () {
    describe('Append to stream', function () {
        it('should return -2', function () {
            common.ExpectedVersion.append.should.eql(-2);
        });
    });
    describe('Stream should not exist', function () {
        it('should return -1', function () {
            common.ExpectedVersion.notExist.should.eql(-1);
        });
    });
});
