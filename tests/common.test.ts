/// <reference path="../typings/all.d.ts" />

import should = require('should');
import common = require('../lib/common');

describe('ExpectedVersion', () => {

	describe('Append to stream', () => {
		it('should return -2', () => {
			common.ExpectedVersion.append.should.eql(-2);
		});
	});

	describe('Stream should not exist', () => {
		it('should return -1', () => {
			common.ExpectedVersion.notExist.should.eql(-1);
		});
	});
});
