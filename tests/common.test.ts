/// <reference path="../typings/all.d.ts" />

require('should');
import common = require('../lib/common');

describe('ExpectedVersion', () => {

	describe('Append to stream', () => {
		it('should return -2', () => {
			common.ExpectedVersion.any.should.eql(-2);
		});
	});

	describe('Stream should not exist', () => {
		it('should return -1', () => {
			common.ExpectedVersion.notExist.should.eql(-1);
		});
	});
});

describe('ContentType', () => {

	describe('Binary', () => {
		it('should return 0', () => {
			common.ContentType.binary.should.eql(0);
		});
	});

	describe('Json', () => {
		it('should return 1', () => {
			common.ContentType.json.should.eql(1);
		});
	});
});

describe('StreamPosition', () => {

	describe('Start', () => {
		it('should return 0', () => {
			common.StreamPosition.start.should.eql(0);
		});
	});

	describe('End', () => {
		it('should return -1', () => {
			common.StreamPosition.end.should.eql(-1);
		});
	});
});
