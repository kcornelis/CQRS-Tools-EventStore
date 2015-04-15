/// <reference path="../typings/all.d.ts" />

import should = require('should');
import messages = require('../lib/messages');
import common = require('../lib/common');
import uuid = require('node-uuid');

describe('DeleteStream', () => {

	describe('Delete stream message defaults', () => {

		var deleteStream = new messages.DeleteStream('stream');

		it('should have expected version set to any', () => {
			deleteStream.expectedVersion.should.eql(-2);
		});

		it('should have require master set to true', () => {
			deleteStream.requireMaster.should.be.true;
		});

		it('should have hard delete set to false', () => {
			deleteStream.hardDelete.should.be.false;
		});
	});

	describe('Create delete stream message', () => {

		var deleteStream = new messages.DeleteStream('stream', 10, false, false);

		it('should have an event stream id', () => {
			deleteStream.eventStreamId.should.eql('stream');
		});

		it('should have an expected version', () => {
			deleteStream.expectedVersion.should.eql(10);
		});

		it('should have require master set to false', () => {
			deleteStream.requireMaster.should.be.false;
		});

		it('should have hard delete set to false', () => {
			deleteStream.hardDelete.should.be.false;
		});
	});
});

describe('NewEvent', () => {

	describe('Create new event message', () => {

		var id = uuid.v4();
		var newEvent = new messages.NewEvent(id, 'eventtype', { data: 1 }, { metadata: 2 });

		it('should an event id', () => {
			newEvent.eventId.toString('hex').should.eql(id.replace(/[^0-9a-fA-F]/g, ''));
		});

		it('should have a type', () => {
			newEvent.eventType.should.eql('eventtype');
		});

		it('should contain the data as json', () => {
			newEvent.data.toString('utf8').should.eql('{"data":1}');
		});

		it('should contain the data type', () => {
			newEvent.dataContentType.should.eql(common.ContentType.json);
		});

		it('should contain the metadata as json', () => {
			newEvent.metadata.toString('utf8').should.eql('{"metadata":2}');
		});

		it('should contain the metadata type', () => {
			newEvent.metadataContentType.should.eql(common.ContentType.json);
		});
	});

	describe('Event id', () => {

		it('can only contain a valid guid', () => {
			should.throws(() => new messages.NewEvent('abc', 'eventtype', { data: 1 }, { metadata: 2 }));
		});

		it('strips non hex characters', () => {
			var message = new messages.NewEvent('xxxe6aad3c3-21ae-4024-b05b-d545c47b1e41@@@', 'eventtype', { data: 1 }, { metadata: 2 });
			message.eventId.toString('hex').should.eql('e6aad3c321ae4024b05bd545c47b1e41');
		});
	});

	describe('Data and metadata can be binary', () => {

		var id = uuid.v4();
		var data = new Buffer('data');
		var metadata = new Buffer('metadata');
		var newEvent = new messages.NewEvent(id, 'eventtype', data, metadata);

		it('should contain the data as json', () => {
			newEvent.data.toString('utf8').should.eql('data');
		});

		it('should contain the data type', () => {
			newEvent.dataContentType.should.eql(common.ContentType.binary);
		});

		it('should contain the metadata as json', () => {
			newEvent.metadata.toString('utf8').should.eql('metadata');
		});

		it('should contain the metadata type', () => {
			newEvent.metadataContentType.should.eql(common.ContentType.binary);
		});
	});

	describe('Data and metadata can be null', () => {

		var id = uuid.v4();
		var newEvent = new messages.NewEvent(id, 'eventtype', null, null);

		it('should contain the data as json', () => {
			newEvent.data.toString('utf8').should.eql('');
		});

		it('should contain the data type', () => {
			newEvent.dataContentType.should.eql(common.ContentType.binary);
		});

		it('should contain the metadata as json', () => {
			newEvent.metadata.toString('utf8').should.eql('');
		});

		it('should contain the metadata type', () => {
			newEvent.metadataContentType.should.eql(common.ContentType.binary);
		});
	});
});


describe('WriteEvents', () => {

	describe('Create write events message', () => {

		var writeEvents = new messages.WriteEvents('stream', 10, [ new messages.NewEvent(uuid.v4(), 'eventtype', null, null) ], false);

		it('should have an event stream id', () => {
			writeEvents.eventStreamId.should.eql('stream');
		});

		it('should have an expected version', () => {
			writeEvents.expectedVersion.should.eql(10);
		});

		it('should have a list of events to add to the stream', () => {
			writeEvents.events[0].eventType.should.eql('eventtype');
		});

		it('should have require master set to false', () => {
			writeEvents.requireMaster.should.be.false;
		});
	});

	describe('Write events defaults', () => {

		var writeEvents = new messages.WriteEvents('stream');

		it('should have expected version any', () => {
			writeEvents.expectedVersion.should.eql(-2);
		});

		it('should have an empty events list', () => {
			writeEvents.events.should.be.empty;
		});

		it('should have require master set to true', () => {
			writeEvents.requireMaster.should.be.true;
		});
	});
});

