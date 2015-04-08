/// <reference path="../typings/all.d.ts" />

import should = require('should');
import messages = require('../lib/messages');

describe('DeleteStream', () => {

	describe('Default constructor', () => {

		var deleteStream = new messages.DeleteStream();

		it('should have no event stream', () => {
			should.not.exist(deleteStream.eventStreamId);
		});

		it('should have expected version append', () => {
			deleteStream.expectedVersion.should.eql(-2);
		});

		it('should have require master set to true', () => {
			deleteStream.requireMaster.should.be.true;
		});

		it('should have hard delete set to true', () => {
			deleteStream.hardDelete.should.be.true;
		});
	});

	describe('Create delete stream message', () => {

		var deleteStream = new messages.DeleteStream('stream', 10, false, false);

		it('should have no event stream', () => {
			deleteStream.eventStreamId.should.eql('stream');
		});

		it('should have expected version append', () => {
			deleteStream.expectedVersion.should.eql(10);
		});

		it('should have require master set to true', () => {
			deleteStream.requireMaster.should.be.false;
		});

		it('should have hard delete set to true', () => {
			deleteStream.hardDelete.should.be.false;
		});
	});
});
