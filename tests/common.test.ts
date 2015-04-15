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

describe('ContentType', () => {

	describe('success', () => {
		it('should return 0', () => {
			common.OperationResult.success.should.eql(0);
		});
	});

	describe('prepareTimeout', () => {
		it('should return 0', () => {
			common.OperationResult.prepareTimeout.should.eql(1);
		});
	});

	describe('commitTimeout', () => {
		it('should return 0', () => {
			common.OperationResult.commitTimeout.should.eql(2);
		});
	});

	describe('forwardTimeout', () => {
		it('should return 0', () => {
			common.OperationResult.forwardTimeout.should.eql(3);
		});
	});

	describe('wrongExpectedVersion', () => {
		it('should return 0', () => {
			common.OperationResult.wrongExpectedVersion.should.eql(4);
		});
	});

	describe('streamDeleted', () => {
		it('should return 0', () => {
			common.OperationResult.streamDeleted.should.eql(5);
		});
	});

	describe('invalidTransaction', () => {
		it('should return 0', () => {
			common.OperationResult.invalidTransaction.should.eql(6);
		});
	});

	describe('accessDenied', () => {
		it('should return 0', () => {
			common.OperationResult.accessDenied.should.eql(7);
		});
	});
});
