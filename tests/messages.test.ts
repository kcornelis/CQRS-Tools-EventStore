/// <reference path="../typings/all.d.ts" />

import should = require('should');
import messages = require('../lib/messages');
import common = require('../lib/common');
import uuid = require('node-uuid');

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

describe('TransactionStart', () => {

	describe('Transaction start message defaults', () => {

		var transactionStart = new messages.TransactionStart('stream');

		it('should have expected version set to any', () => {
			transactionStart.expectedVersion.should.eql(-2);
		});

		it('should have require master set to true', () => {
			transactionStart.requireMaster.should.be.true;
		});
	});

	describe('Create transaction start message', () => {

		var transactionStart = new messages.TransactionStart('stream', 10, false);

		it('should have an event stream id', () => {
			transactionStart.eventStreamId.should.eql('stream');
		});

		it('should have an expected version', () => {
			transactionStart.expectedVersion.should.eql(10);
		});

		it('should have require master set to false', () => {
			transactionStart.requireMaster.should.be.false;
		});
	});
});

describe('TransactionWrite', () => {

	describe('Transaction write message defaults', () => {

		var transactionWrite = new messages.TransactionWrite(1);

		it('should have an empty events list', () => {
			transactionWrite.events.should.be.empty;
		});

		it('should have require master set to true', () => {
			transactionWrite.requireMaster.should.be.true;
		});
	});

	describe('Create transaction write message', () => {

		var transactionWrite = new messages.TransactionWrite(1, [ new messages.NewEvent(uuid.v4(), 'eventtype', null, null) ], false);

		it('should have transaction id', () => {
			transactionWrite.transactionId.should.eql(1);
		});

		it('should have a list of events to add to the stream', () => {
			transactionWrite.events[0].eventType.should.eql('eventtype');
		});

		it('should have require master set to false', () => {
			transactionWrite.requireMaster.should.be.false;
		});
	});
});

describe('TransactionCommit', () => {

	describe('Transaction commit message defaults', () => {

		var transactionCommit = new messages.TransactionCommit(1);

		it('should have require master set to true', () => {
			transactionCommit.requireMaster.should.be.true;
		});
	});

	describe('Create transaction commit message', () => {

		var transactionCommit = new messages.TransactionCommit(1, false);

		it('should have transaction id', () => {
			transactionCommit.transactionId.should.eql(1);
		});

		it('should have require master set to false', () => {
			transactionCommit.requireMaster.should.be.false;
		});
	});
});

describe('ReadEvent', () => {

	describe('Read event message defaults', () => {

		var readEvent = new messages.ReadEvent('stream', 0);

		it('should have resolve links set to false', () => {
			readEvent.resolveLinkTos.should.be.false;
		});

		it('should have require master set to true', () => {
			readEvent.requireMaster.should.be.true;
		});
	});

	describe('Create read event message', () => {

		var readEvent = new messages.ReadEvent('stream', 10, true, false);

		it('should have stream id', () => {
			readEvent.eventStreamId.should.eql('stream');
		});

		it('should have event number', () => {
			readEvent.eventNumber.should.eql(10);
		});

		it('should have resolve links set to true', () => {
			readEvent.resolveLinkTos.should.be.true;
		});

		it('should have require master set to false', () => {
			readEvent.requireMaster.should.be.false;
		});
	});
});

describe('ReadStreamEvents', () => {

	describe('Read stream events message defaults', () => {

		var readStreamEvents = new messages.ReadStreamEvents('stream', 0, 10);

		it('should have resolve links set to false', () => {
			readStreamEvents.resolveLinkTos.should.be.false;
		});

		it('should have require master set to true', () => {
			readStreamEvents.requireMaster.should.be.true;
		});
	});

	describe('Create read stream events message', () => {

		var readStreamEvents = new messages.ReadStreamEvents('stream', 10, 20, true, false);

		it('should have stream id', () => {
			readStreamEvents.eventStreamId.should.eql('stream');
		});

		it('should have start position', () => {
			readStreamEvents.fromEventNumber.should.eql(10);
		});

		it('should have end position', () => {
			readStreamEvents.maxCount.should.eql(20);
		});

		it('should have resolve links set to true', () => {
			readStreamEvents.resolveLinkTos.should.be.true;
		});

		it('should have require master set to false', () => {
			readStreamEvents.requireMaster.should.be.false;
		});
	});
});

describe('ReadAllEvents', () => {

	describe('Read all events message defaults', () => {

		var readAllEvents = new messages.ReadAllEvents(0, 0, 10);

		it('should have resolve links set to false', () => {
			readAllEvents.resolveLinkTos.should.be.false;
		});

		it('should have require master set to true', () => {
			readAllEvents.requireMaster.should.be.true;
		});
	});

	describe('Create read stream events message', () => {

		var readAllEvents = new messages.ReadAllEvents(10, 20, 30, true, false);

		it('should have a commit position', () => {
			readAllEvents.commitPosition.should.eql(10);
		});

		it('should have a prepare position', () => {
			readAllEvents.preparePosition.should.eql(20);
		});

		it('should have end position', () => {
			readAllEvents.maxCount.should.eql(30);
		});

		it('should have resolve links set to true', () => {
			readAllEvents.resolveLinkTos.should.be.true;
		});

		it('should have require master set to false', () => {
			readAllEvents.requireMaster.should.be.false;
		});
	});
});

describe('CreatePersistentSubscription', () => {

	describe('Create persistent subscription message defaults', () => {

		var createPersistentSubscription = new messages.CreatePersistentSubscription('name', 'stream');

		it('should have resolve links set to false', () => {
			createPersistentSubscription.resolveLinkTos.should.be.false;
		});

		it('should have start from set to the end position', () => {
			createPersistentSubscription.startFrom.should.eql(-1);
		});

		it('should have messageTimeoutMilliseconds set to 30 seconds', () => {
			createPersistentSubscription.messageTimeoutMilliseconds.should.eql(30000);
		});

		it('should have recordStatistics set to false', () => {
			createPersistentSubscription.recordStatistics.should.be.false;
		});

		it('should have liveBufferSize set to 500', () => {
			createPersistentSubscription.liveBufferSize.should.eql(500);
		});

		it('should have readBatchSize set to 10', () => {
			createPersistentSubscription.readBatchSize.should.eql(10);
		});

		it('should have bufferSize set to 20', () => {
			createPersistentSubscription.bufferSize.should.eql(20);
		});

		it('should have maxRetryCount set to 500', () => {
			createPersistentSubscription.maxRetryCount.should.eql(500);
		});

		it('should have preferRoundRobin set to true', () => {
			createPersistentSubscription.preferRoundRobin.should.be.true;
		});

		it('should have checkpointAfterTime set to 2 seconds', () => {
			createPersistentSubscription.checkpointAfterTime.should.eql(2000);
		});

		it('should have checkpointMaxCount set to 10', () => {
			createPersistentSubscription.checkpointMaxCount.should.eql(10);
		});

		it('should have checkpointMinCount set to 1000', () => {
			createPersistentSubscription.checkpointMinCount.should.eql(1000);
		});

		it('should have subscriberMaxCount set to 0', () => {
			createPersistentSubscription.subscriberMaxCount.should.eql(0);
		});
	});

	describe('Create create persistent subscription message', () => {

		var createPersistentSubscription = new messages.CreatePersistentSubscription('name', 'stream', true, 0, 10000, true, 1, 2, 3, 4, false, 1000, 10, 11, 12);

		it('should have a subscription group name', () => {
			createPersistentSubscription.subscriptionGroupName.should.eql('name');
		});

		it('should have a stream id', () => {
			createPersistentSubscription.eventStreamId.should.eql('stream');
		});

		it('should have a resolve links tos', () => {
			createPersistentSubscription.resolveLinkTos.should.be.true;
		});

		it('should have a start from position', () => {
			createPersistentSubscription.startFrom.should.eql(0);
		});

		it('should have a messageTimeoutMilliseconds', () => {
			createPersistentSubscription.messageTimeoutMilliseconds.should.eql(10000);
		});

		it('should have a recordStatistics', () => {
			createPersistentSubscription.recordStatistics.should.be.true;
		});

		it('should have a liveBufferSize', () => {
			createPersistentSubscription.liveBufferSize.should.eql(1);
		});

		it('should have a readBatchSize', () => {
			createPersistentSubscription.readBatchSize.should.eql(2);
		});

		it('should have a bufferSize', () => {
			createPersistentSubscription.bufferSize.should.eql(3);
		});

		it('should have a maxRetryCount', () => {
			createPersistentSubscription.maxRetryCount.should.eql(4);
		});

		it('should have a preferRoundRobin', () => {
			createPersistentSubscription.preferRoundRobin.should.be.false;
		});

		it('should have a checkpointAfterTime', () => {
			createPersistentSubscription.checkpointAfterTime.should.eql(1000);
		});

		it('should have a checkpointMaxCount', () => {
			createPersistentSubscription.checkpointMaxCount.should.eql(10);
		});

		it('should have a checkpointMinCount', () => {
			createPersistentSubscription.checkpointMinCount.should.eql(11);
		});

		it('should have a subscriberMaxCount', () => {
			createPersistentSubscription.subscriberMaxCount.should.eql(12);
		});
	});
});

describe('DeletePersistentSubscription', () => {

	describe('Create delete persistent subscription message', () => {

		var deletePersistentSubscription = new messages.DeletePersistentSubscription('name', 'stream');

		it('should have a subscription group name', () => {
			deletePersistentSubscription.subscriptionGroupName.should.eql('name');
		});

		it('should have a stream id', () => {
			deletePersistentSubscription.eventStreamId.should.eql('stream');
		});
	});
});

describe('UpdatePersistentSubscription', () => {

	describe('Update persistent subscription message defaults', () => {

		var updatePersistentSubscription = new messages.UpdatePersistentSubscription('name', 'stream');

		it('should have resolve links set to false', () => {
			updatePersistentSubscription.resolveLinkTos.should.be.false;
		});

		it('should have start from set to the end position', () => {
			updatePersistentSubscription.startFrom.should.eql(-1);
		});

		it('should have messageTimeoutMilliseconds set to 30 seconds', () => {
			updatePersistentSubscription.messageTimeoutMilliseconds.should.eql(30000);
		});

		it('should have recordStatistics set to false', () => {
			updatePersistentSubscription.recordStatistics.should.be.false;
		});

		it('should have liveBufferSize set to 500', () => {
			updatePersistentSubscription.liveBufferSize.should.eql(500);
		});

		it('should have readBatchSize set to 10', () => {
			updatePersistentSubscription.readBatchSize.should.eql(10);
		});

		it('should have bufferSize set to 20', () => {
			updatePersistentSubscription.bufferSize.should.eql(20);
		});

		it('should have maxRetryCount set to 500', () => {
			updatePersistentSubscription.maxRetryCount.should.eql(500);
		});

		it('should have preferRoundRobin set to true', () => {
			updatePersistentSubscription.preferRoundRobin.should.be.true;
		});

		it('should have checkpointAfterTime set to 2 seconds', () => {
			updatePersistentSubscription.checkpointAfterTime.should.eql(2000);
		});

		it('should have checkpointMaxCount set to 10', () => {
			updatePersistentSubscription.checkpointMaxCount.should.eql(10);
		});

		it('should have checkpointMinCount set to 1000', () => {
			updatePersistentSubscription.checkpointMinCount.should.eql(1000);
		});

		it('should have subscriberMaxCount set to 0', () => {
			updatePersistentSubscription.subscriberMaxCount.should.eql(0);
		});
	});

	describe('Create update persistent subscription message', () => {

		var updatePersistentSubscription = new messages.UpdatePersistentSubscription('name', 'stream', true, 0, 10000, true, 1, 2, 3, 4, false, 1000, 10, 11, 12);

		it('should have a subscription group name', () => {
			updatePersistentSubscription.subscriptionGroupName.should.eql('name');
		});

		it('should have a stream id', () => {
			updatePersistentSubscription.eventStreamId.should.eql('stream');
		});

		it('should have a resolve links tos', () => {
			updatePersistentSubscription.resolveLinkTos.should.be.true;
		});

		it('should have a start from position', () => {
			updatePersistentSubscription.startFrom.should.eql(0);
		});

		it('should have a messageTimeoutMilliseconds', () => {
			updatePersistentSubscription.messageTimeoutMilliseconds.should.eql(10000);
		});

		it('should have a recordStatistics', () => {
			updatePersistentSubscription.recordStatistics.should.be.true;
		});

		it('should have a liveBufferSize', () => {
			updatePersistentSubscription.liveBufferSize.should.eql(1);
		});

		it('should have a readBatchSize', () => {
			updatePersistentSubscription.readBatchSize.should.eql(2);
		});

		it('should have a bufferSize', () => {
			updatePersistentSubscription.bufferSize.should.eql(3);
		});

		it('should have a maxRetryCount', () => {
			updatePersistentSubscription.maxRetryCount.should.eql(4);
		});

		it('should have a preferRoundRobin', () => {
			updatePersistentSubscription.preferRoundRobin.should.be.false;
		});

		it('should have a checkpointAfterTime', () => {
			updatePersistentSubscription.checkpointAfterTime.should.eql(1000);
		});

		it('should have a checkpointMaxCount', () => {
			updatePersistentSubscription.checkpointMaxCount.should.eql(10);
		});

		it('should have a checkpointMinCount', () => {
			updatePersistentSubscription.checkpointMinCount.should.eql(11);
		});

		it('should have a subscriberMaxCount', () => {
			updatePersistentSubscription.subscriberMaxCount.should.eql(12);
		});
	});
});

describe('ConnectToPersistentSubscription', () => {

	describe('Create connect to persistent subscription message', () => {

		var connectToPersistentSubscription = new messages.ConnectToPersistentSubscription('name', 'stream', 10);

		it('should have a subscription id', () => {
			connectToPersistentSubscription.subscriptionId.should.eql('name');
		});

		it('should have a stream id', () => {
			connectToPersistentSubscription.eventStreamId.should.eql('stream');
		});

		it('should have a allowed in flight messages', () => {
			connectToPersistentSubscription.allowedInFlightMessages.should.eql(10);
		});
	});
});

describe('SubscribeToStream', () => {

	describe('Subscribe to stream defaults', () => {

		var subscribeToStream = new messages.SubscribeToStream('stream');

		it('should have resolve links set to false', () => {
			subscribeToStream.resolveLinkTos.should.be.false;
		});
	});

	describe('Create subscribe to stream message', () => {

		var subscribeToStream = new messages.SubscribeToStream('stream', true);

		it('should have stream id', () => {
			subscribeToStream.eventStreamId.should.eql('stream');
		});

		it('should have resolve links set to true', () => {
			subscribeToStream.resolveLinkTos.should.be.true;
		});
	});
});
