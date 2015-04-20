/// <reference path="../typings/all.d.ts" />
var should = require('should');
var messages = require('../lib/messages');
var uuid = require('node-uuid');
var ContentType = require('../lib/ContentType');
describe('NewEvent', function () {
    describe('Create new event message', function () {
        var id = uuid.v4();
        var newEvent = new messages.NewEvent(id, 'eventtype', { data: 1 }, { metadata: 2 });
        it('should an event id', function () {
            newEvent.eventId.toString('hex').should.eql(id.replace(/[^0-9a-fA-F]/g, ''));
        });
        it('should have a type', function () {
            newEvent.eventType.should.eql('eventtype');
        });
        it('should contain the data as json', function () {
            newEvent.data.toString('utf8').should.eql('{"data":1}');
        });
        it('should contain the data type', function () {
            newEvent.dataContentType.should.eql(ContentType.json);
        });
        it('should contain the metadata as json', function () {
            newEvent.metadata.toString('utf8').should.eql('{"metadata":2}');
        });
        it('should contain the metadata type', function () {
            newEvent.metadataContentType.should.eql(ContentType.json);
        });
    });
    describe('Event id', function () {
        it('can only contain a valid guid', function () {
            should.throws(function () { return new messages.NewEvent('abc', 'eventtype', { data: 1 }, { metadata: 2 }); });
        });
        it('strips non hex characters', function () {
            var message = new messages.NewEvent('xxxe6aad3c3-21ae-4024-b05b-d545c47b1e41@@@', 'eventtype', { data: 1 }, { metadata: 2 });
            message.eventId.toString('hex').should.eql('e6aad3c321ae4024b05bd545c47b1e41');
        });
    });
    describe('Data and metadata can be binary', function () {
        var id = uuid.v4();
        var data = new Buffer('data');
        var metadata = new Buffer('metadata');
        var newEvent = new messages.NewEvent(id, 'eventtype', data, metadata);
        it('should contain the data as json', function () {
            newEvent.data.toString('utf8').should.eql('data');
        });
        it('should contain the data type', function () {
            newEvent.dataContentType.should.eql(ContentType.binary);
        });
        it('should contain the metadata as json', function () {
            newEvent.metadata.toString('utf8').should.eql('metadata');
        });
        it('should contain the metadata type', function () {
            newEvent.metadataContentType.should.eql(ContentType.binary);
        });
    });
    describe('Data and metadata can be null', function () {
        var id = uuid.v4();
        var newEvent = new messages.NewEvent(id, 'eventtype', null, null);
        it('should contain the data as json', function () {
            newEvent.data.toString('utf8').should.eql('');
        });
        it('should contain the data type', function () {
            newEvent.dataContentType.should.eql(ContentType.binary);
        });
        it('should contain the metadata as json', function () {
            newEvent.metadata.toString('utf8').should.eql('');
        });
        it('should contain the metadata type', function () {
            newEvent.metadataContentType.should.eql(ContentType.binary);
        });
    });
});
describe('WriteEvents', function () {
    describe('Create write events message', function () {
        var writeEvents = new messages.WriteEvents('stream', 10, [new messages.NewEvent(uuid.v4(), 'eventtype', null, null)], false);
        it('should have an event stream id', function () {
            writeEvents.eventStreamId.should.eql('stream');
        });
        it('should have an expected version', function () {
            writeEvents.expectedVersion.should.eql(10);
        });
        it('should have a list of events to add to the stream', function () {
            writeEvents.events[0].eventType.should.eql('eventtype');
        });
        it('should have require master set to false', function () {
            writeEvents.requireMaster.should.be.false;
        });
    });
    describe('Write events defaults', function () {
        var writeEvents = new messages.WriteEvents('stream');
        it('should have expected version any', function () {
            writeEvents.expectedVersion.should.eql(-2);
        });
        it('should have an empty events list', function () {
            writeEvents.events.should.be.empty;
        });
        it('should have require master set to true', function () {
            writeEvents.requireMaster.should.be.true;
        });
    });
});
describe('DeleteStream', function () {
    describe('Delete stream message defaults', function () {
        var deleteStream = new messages.DeleteStream('stream');
        it('should have expected version set to any', function () {
            deleteStream.expectedVersion.should.eql(-2);
        });
        it('should have require master set to true', function () {
            deleteStream.requireMaster.should.be.true;
        });
        it('should have hard delete set to false', function () {
            deleteStream.hardDelete.should.be.false;
        });
    });
    describe('Create delete stream message', function () {
        var deleteStream = new messages.DeleteStream('stream', 10, false, false);
        it('should have an event stream id', function () {
            deleteStream.eventStreamId.should.eql('stream');
        });
        it('should have an expected version', function () {
            deleteStream.expectedVersion.should.eql(10);
        });
        it('should have require master set to false', function () {
            deleteStream.requireMaster.should.be.false;
        });
        it('should have hard delete set to false', function () {
            deleteStream.hardDelete.should.be.false;
        });
    });
});
describe('TransactionStart', function () {
    describe('Transaction start message defaults', function () {
        var transactionStart = new messages.TransactionStart('stream');
        it('should have expected version set to any', function () {
            transactionStart.expectedVersion.should.eql(-2);
        });
        it('should have require master set to true', function () {
            transactionStart.requireMaster.should.be.true;
        });
    });
    describe('Create transaction start message', function () {
        var transactionStart = new messages.TransactionStart('stream', 10, false);
        it('should have an event stream id', function () {
            transactionStart.eventStreamId.should.eql('stream');
        });
        it('should have an expected version', function () {
            transactionStart.expectedVersion.should.eql(10);
        });
        it('should have require master set to false', function () {
            transactionStart.requireMaster.should.be.false;
        });
    });
});
describe('TransactionWrite', function () {
    describe('Transaction write message defaults', function () {
        var transactionWrite = new messages.TransactionWrite(1);
        it('should have an empty events list', function () {
            transactionWrite.events.should.be.empty;
        });
        it('should have require master set to true', function () {
            transactionWrite.requireMaster.should.be.true;
        });
    });
    describe('Create transaction write message', function () {
        var transactionWrite = new messages.TransactionWrite(1, [new messages.NewEvent(uuid.v4(), 'eventtype', null, null)], false);
        it('should have transaction id', function () {
            transactionWrite.transactionId.should.eql(1);
        });
        it('should have a list of events to add to the stream', function () {
            transactionWrite.events[0].eventType.should.eql('eventtype');
        });
        it('should have require master set to false', function () {
            transactionWrite.requireMaster.should.be.false;
        });
    });
});
describe('TransactionCommit', function () {
    describe('Transaction commit message defaults', function () {
        var transactionCommit = new messages.TransactionCommit(1);
        it('should have require master set to true', function () {
            transactionCommit.requireMaster.should.be.true;
        });
    });
    describe('Create transaction commit message', function () {
        var transactionCommit = new messages.TransactionCommit(1, false);
        it('should have transaction id', function () {
            transactionCommit.transactionId.should.eql(1);
        });
        it('should have require master set to false', function () {
            transactionCommit.requireMaster.should.be.false;
        });
    });
});
describe('ReadEvent', function () {
    describe('Read event message defaults', function () {
        var readEvent = new messages.ReadEvent('stream', 0);
        it('should have resolve links set to false', function () {
            readEvent.resolveLinkTos.should.be.false;
        });
        it('should have require master set to true', function () {
            readEvent.requireMaster.should.be.true;
        });
    });
    describe('Create read event message', function () {
        var readEvent = new messages.ReadEvent('stream', 10, true, false);
        it('should have stream id', function () {
            readEvent.eventStreamId.should.eql('stream');
        });
        it('should have event number', function () {
            readEvent.eventNumber.should.eql(10);
        });
        it('should have resolve links set to true', function () {
            readEvent.resolveLinkTos.should.be.true;
        });
        it('should have require master set to false', function () {
            readEvent.requireMaster.should.be.false;
        });
    });
});
describe('ReadStreamEvents', function () {
    describe('Read stream events message defaults', function () {
        var readStreamEvents = new messages.ReadStreamEvents('stream', 0, 10);
        it('should have resolve links set to false', function () {
            readStreamEvents.resolveLinkTos.should.be.false;
        });
        it('should have require master set to true', function () {
            readStreamEvents.requireMaster.should.be.true;
        });
    });
    describe('Create read stream events message', function () {
        var readStreamEvents = new messages.ReadStreamEvents('stream', 10, 20, true, false);
        it('should have stream id', function () {
            readStreamEvents.eventStreamId.should.eql('stream');
        });
        it('should have start position', function () {
            readStreamEvents.fromEventNumber.should.eql(10);
        });
        it('should have end position', function () {
            readStreamEvents.maxCount.should.eql(20);
        });
        it('should have resolve links set to true', function () {
            readStreamEvents.resolveLinkTos.should.be.true;
        });
        it('should have require master set to false', function () {
            readStreamEvents.requireMaster.should.be.false;
        });
    });
});
describe('ReadAllEvents', function () {
    describe('Read all events message defaults', function () {
        var readAllEvents = new messages.ReadAllEvents(0, 0, 10);
        it('should have resolve links set to false', function () {
            readAllEvents.resolveLinkTos.should.be.false;
        });
        it('should have require master set to true', function () {
            readAllEvents.requireMaster.should.be.true;
        });
    });
    describe('Create read stream events message', function () {
        var readAllEvents = new messages.ReadAllEvents(10, 20, 30, true, false);
        it('should have a commit position', function () {
            readAllEvents.commitPosition.should.eql(10);
        });
        it('should have a prepare position', function () {
            readAllEvents.preparePosition.should.eql(20);
        });
        it('should have end position', function () {
            readAllEvents.maxCount.should.eql(30);
        });
        it('should have resolve links set to true', function () {
            readAllEvents.resolveLinkTos.should.be.true;
        });
        it('should have require master set to false', function () {
            readAllEvents.requireMaster.should.be.false;
        });
    });
});
describe('CreatePersistentSubscription', function () {
    describe('Create persistent subscription message defaults', function () {
        var createPersistentSubscription = new messages.CreatePersistentSubscription('name', 'stream');
        it('should have resolve links set to false', function () {
            createPersistentSubscription.resolveLinkTos.should.be.false;
        });
        it('should have start from set to the end position', function () {
            createPersistentSubscription.startFrom.should.eql(-1);
        });
        it('should have messageTimeoutMilliseconds set to 30 seconds', function () {
            createPersistentSubscription.messageTimeoutMilliseconds.should.eql(30000);
        });
        it('should have recordStatistics set to false', function () {
            createPersistentSubscription.recordStatistics.should.be.false;
        });
        it('should have liveBufferSize set to 500', function () {
            createPersistentSubscription.liveBufferSize.should.eql(500);
        });
        it('should have readBatchSize set to 10', function () {
            createPersistentSubscription.readBatchSize.should.eql(10);
        });
        it('should have bufferSize set to 20', function () {
            createPersistentSubscription.bufferSize.should.eql(20);
        });
        it('should have maxRetryCount set to 500', function () {
            createPersistentSubscription.maxRetryCount.should.eql(500);
        });
        it('should have preferRoundRobin set to true', function () {
            createPersistentSubscription.preferRoundRobin.should.be.true;
        });
        it('should have checkpointAfterTime set to 2 seconds', function () {
            createPersistentSubscription.checkpointAfterTime.should.eql(2000);
        });
        it('should have checkpointMaxCount set to 10', function () {
            createPersistentSubscription.checkpointMaxCount.should.eql(10);
        });
        it('should have checkpointMinCount set to 1000', function () {
            createPersistentSubscription.checkpointMinCount.should.eql(1000);
        });
        it('should have subscriberMaxCount set to 0', function () {
            createPersistentSubscription.subscriberMaxCount.should.eql(0);
        });
    });
    describe('Create create persistent subscription message', function () {
        var createPersistentSubscription = new messages.CreatePersistentSubscription('name', 'stream', true, 0, 10000, true, 1, 2, 3, 4, false, 1000, 10, 11, 12);
        it('should have a subscription group name', function () {
            createPersistentSubscription.subscriptionGroupName.should.eql('name');
        });
        it('should have a stream id', function () {
            createPersistentSubscription.eventStreamId.should.eql('stream');
        });
        it('should have a resolve links tos', function () {
            createPersistentSubscription.resolveLinkTos.should.be.true;
        });
        it('should have a start from position', function () {
            createPersistentSubscription.startFrom.should.eql(0);
        });
        it('should have a messageTimeoutMilliseconds', function () {
            createPersistentSubscription.messageTimeoutMilliseconds.should.eql(10000);
        });
        it('should have a recordStatistics', function () {
            createPersistentSubscription.recordStatistics.should.be.true;
        });
        it('should have a liveBufferSize', function () {
            createPersistentSubscription.liveBufferSize.should.eql(1);
        });
        it('should have a readBatchSize', function () {
            createPersistentSubscription.readBatchSize.should.eql(2);
        });
        it('should have a bufferSize', function () {
            createPersistentSubscription.bufferSize.should.eql(3);
        });
        it('should have a maxRetryCount', function () {
            createPersistentSubscription.maxRetryCount.should.eql(4);
        });
        it('should have a preferRoundRobin', function () {
            createPersistentSubscription.preferRoundRobin.should.be.false;
        });
        it('should have a checkpointAfterTime', function () {
            createPersistentSubscription.checkpointAfterTime.should.eql(1000);
        });
        it('should have a checkpointMaxCount', function () {
            createPersistentSubscription.checkpointMaxCount.should.eql(10);
        });
        it('should have a checkpointMinCount', function () {
            createPersistentSubscription.checkpointMinCount.should.eql(11);
        });
        it('should have a subscriberMaxCount', function () {
            createPersistentSubscription.subscriberMaxCount.should.eql(12);
        });
    });
});
describe('DeletePersistentSubscription', function () {
    describe('Create delete persistent subscription message', function () {
        var deletePersistentSubscription = new messages.DeletePersistentSubscription('name', 'stream');
        it('should have a subscription group name', function () {
            deletePersistentSubscription.subscriptionGroupName.should.eql('name');
        });
        it('should have a stream id', function () {
            deletePersistentSubscription.eventStreamId.should.eql('stream');
        });
    });
});
describe('UpdatePersistentSubscription', function () {
    describe('Update persistent subscription message defaults', function () {
        var updatePersistentSubscription = new messages.UpdatePersistentSubscription('name', 'stream');
        it('should have resolve links set to false', function () {
            updatePersistentSubscription.resolveLinkTos.should.be.false;
        });
        it('should have start from set to the end position', function () {
            updatePersistentSubscription.startFrom.should.eql(-1);
        });
        it('should have messageTimeoutMilliseconds set to 30 seconds', function () {
            updatePersistentSubscription.messageTimeoutMilliseconds.should.eql(30000);
        });
        it('should have recordStatistics set to false', function () {
            updatePersistentSubscription.recordStatistics.should.be.false;
        });
        it('should have liveBufferSize set to 500', function () {
            updatePersistentSubscription.liveBufferSize.should.eql(500);
        });
        it('should have readBatchSize set to 10', function () {
            updatePersistentSubscription.readBatchSize.should.eql(10);
        });
        it('should have bufferSize set to 20', function () {
            updatePersistentSubscription.bufferSize.should.eql(20);
        });
        it('should have maxRetryCount set to 500', function () {
            updatePersistentSubscription.maxRetryCount.should.eql(500);
        });
        it('should have preferRoundRobin set to true', function () {
            updatePersistentSubscription.preferRoundRobin.should.be.true;
        });
        it('should have checkpointAfterTime set to 2 seconds', function () {
            updatePersistentSubscription.checkpointAfterTime.should.eql(2000);
        });
        it('should have checkpointMaxCount set to 10', function () {
            updatePersistentSubscription.checkpointMaxCount.should.eql(10);
        });
        it('should have checkpointMinCount set to 1000', function () {
            updatePersistentSubscription.checkpointMinCount.should.eql(1000);
        });
        it('should have subscriberMaxCount set to 0', function () {
            updatePersistentSubscription.subscriberMaxCount.should.eql(0);
        });
    });
    describe('Create update persistent subscription message', function () {
        var updatePersistentSubscription = new messages.UpdatePersistentSubscription('name', 'stream', true, 0, 10000, true, 1, 2, 3, 4, false, 1000, 10, 11, 12);
        it('should have a subscription group name', function () {
            updatePersistentSubscription.subscriptionGroupName.should.eql('name');
        });
        it('should have a stream id', function () {
            updatePersistentSubscription.eventStreamId.should.eql('stream');
        });
        it('should have a resolve links tos', function () {
            updatePersistentSubscription.resolveLinkTos.should.be.true;
        });
        it('should have a start from position', function () {
            updatePersistentSubscription.startFrom.should.eql(0);
        });
        it('should have a messageTimeoutMilliseconds', function () {
            updatePersistentSubscription.messageTimeoutMilliseconds.should.eql(10000);
        });
        it('should have a recordStatistics', function () {
            updatePersistentSubscription.recordStatistics.should.be.true;
        });
        it('should have a liveBufferSize', function () {
            updatePersistentSubscription.liveBufferSize.should.eql(1);
        });
        it('should have a readBatchSize', function () {
            updatePersistentSubscription.readBatchSize.should.eql(2);
        });
        it('should have a bufferSize', function () {
            updatePersistentSubscription.bufferSize.should.eql(3);
        });
        it('should have a maxRetryCount', function () {
            updatePersistentSubscription.maxRetryCount.should.eql(4);
        });
        it('should have a preferRoundRobin', function () {
            updatePersistentSubscription.preferRoundRobin.should.be.false;
        });
        it('should have a checkpointAfterTime', function () {
            updatePersistentSubscription.checkpointAfterTime.should.eql(1000);
        });
        it('should have a checkpointMaxCount', function () {
            updatePersistentSubscription.checkpointMaxCount.should.eql(10);
        });
        it('should have a checkpointMinCount', function () {
            updatePersistentSubscription.checkpointMinCount.should.eql(11);
        });
        it('should have a subscriberMaxCount', function () {
            updatePersistentSubscription.subscriberMaxCount.should.eql(12);
        });
    });
});
describe('ConnectToPersistentSubscription', function () {
    describe('Create connect to persistent subscription message', function () {
        var connectToPersistentSubscription = new messages.ConnectToPersistentSubscription('name', 'stream', 10);
        it('should have a subscription id', function () {
            connectToPersistentSubscription.subscriptionId.should.eql('name');
        });
        it('should have a stream id', function () {
            connectToPersistentSubscription.eventStreamId.should.eql('stream');
        });
        it('should have a allowed in flight messages', function () {
            connectToPersistentSubscription.allowedInFlightMessages.should.eql(10);
        });
    });
});
describe('SubscribeToStream', function () {
    describe('Subscribe to stream defaults', function () {
        var subscribeToStream = new messages.SubscribeToStream('stream');
        it('should have resolve links set to false', function () {
            subscribeToStream.resolveLinkTos.should.be.false;
        });
    });
    describe('Create subscribe to stream message', function () {
        var subscribeToStream = new messages.SubscribeToStream('stream', true);
        it('should have stream id', function () {
            subscribeToStream.eventStreamId.should.eql('stream');
        });
        it('should have resolve links set to true', function () {
            subscribeToStream.resolveLinkTos.should.be.true;
        });
    });
});
