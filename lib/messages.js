/// <reference path="../typings/all.d.ts" />
var ContentType = require('./ContentType');
var ExpectedVersion = require('./ExpectedVersion');
var StreamPosition = require('./StreamPosition');
var NewEvent = (function () {
    function NewEvent(eventId, eventType, data, metadata) {
        if (eventId === void 0) { eventId = null; }
        if (eventType === void 0) { eventType = null; }
        if (data === void 0) { data = null; }
        if (metadata === void 0) { metadata = null; }
        eventId = eventId.replace(/[^0-9a-fA-F]/g, '');
        if (eventId.length !== 32) {
            throw new Error('eventId does not contain a valid GUID');
        }
        this.eventId = new Buffer(eventId, 'hex');
        this.eventType = eventType;
        this.populateData(data);
        this.populateMetadata(metadata);
    }
    NewEvent.prototype.populateData = function (data) {
        if (data) {
            if (Buffer.isBuffer(data)) {
                this.dataContentType = ContentType.binary;
                this.data = data;
            }
            else {
                this.dataContentType = ContentType.json;
                this.data = new Buffer(JSON.stringify(data));
            }
        }
        else {
            this.dataContentType = ContentType.binary;
            this.data = new Buffer([]);
        }
    };
    NewEvent.prototype.populateMetadata = function (metadata) {
        if (metadata) {
            if (Buffer.isBuffer(metadata)) {
                this.metadataContentType = ContentType.binary;
                this.metadata = metadata;
            }
            else {
                this.metadataContentType = ContentType.json;
                this.metadata = new Buffer(JSON.stringify(metadata));
            }
        }
        else {
            this.metadataContentType = ContentType.binary;
            this.metadata = new Buffer([]);
        }
    };
    return NewEvent;
})();
exports.NewEvent = NewEvent;
var EventRecord = (function () {
    function EventRecord() {
    }
    return EventRecord;
})();
exports.EventRecord = EventRecord;
var ResolvedIndexedEvent = (function () {
    function ResolvedIndexedEvent() {
    }
    return ResolvedIndexedEvent;
})();
exports.ResolvedIndexedEvent = ResolvedIndexedEvent;
var ResolvedEvent = (function () {
    function ResolvedEvent() {
    }
    return ResolvedEvent;
})();
exports.ResolvedEvent = ResolvedEvent;
var WriteEvents = (function () {
    function WriteEvents(eventStreamId, expectedVersion, events, requireMaster) {
        if (expectedVersion === void 0) { expectedVersion = ExpectedVersion.any; }
        if (events === void 0) { events = []; }
        if (requireMaster === void 0) { requireMaster = true; }
        this.eventStreamId = eventStreamId;
        this.events = events;
        this.expectedVersion = expectedVersion;
        this.requireMaster = requireMaster;
    }
    return WriteEvents;
})();
exports.WriteEvents = WriteEvents;
var WriteEventsCompleted = (function () {
    function WriteEventsCompleted() {
    }
    return WriteEventsCompleted;
})();
exports.WriteEventsCompleted = WriteEventsCompleted;
var DeleteStream = (function () {
    function DeleteStream(eventStreamId, expectedVersion, requireMaster, hardDelete) {
        if (expectedVersion === void 0) { expectedVersion = ExpectedVersion.any; }
        if (requireMaster === void 0) { requireMaster = true; }
        if (hardDelete === void 0) { hardDelete = false; }
        this.eventStreamId = eventStreamId;
        this.expectedVersion = expectedVersion;
        this.requireMaster = requireMaster;
        this.hardDelete = hardDelete;
    }
    return DeleteStream;
})();
exports.DeleteStream = DeleteStream;
var DeleteStreamCompleted = (function () {
    function DeleteStreamCompleted() {
    }
    return DeleteStreamCompleted;
})();
exports.DeleteStreamCompleted = DeleteStreamCompleted;
var TransactionStart = (function () {
    function TransactionStart(eventStreamId, expectedVersion, requireMaster) {
        if (expectedVersion === void 0) { expectedVersion = ExpectedVersion.any; }
        if (requireMaster === void 0) { requireMaster = true; }
        this.eventStreamId = eventStreamId;
        this.expectedVersion = expectedVersion;
        this.requireMaster = requireMaster;
    }
    return TransactionStart;
})();
exports.TransactionStart = TransactionStart;
var TransactionStartCompleted = (function () {
    function TransactionStartCompleted() {
    }
    return TransactionStartCompleted;
})();
exports.TransactionStartCompleted = TransactionStartCompleted;
var TransactionWrite = (function () {
    function TransactionWrite(transactionId, events, requireMaster) {
        if (events === void 0) { events = []; }
        if (requireMaster === void 0) { requireMaster = true; }
        this.transactionId = transactionId;
        this.events = events;
        this.requireMaster = requireMaster;
    }
    return TransactionWrite;
})();
exports.TransactionWrite = TransactionWrite;
var TransactionWriteCompleted = (function () {
    function TransactionWriteCompleted() {
    }
    return TransactionWriteCompleted;
})();
exports.TransactionWriteCompleted = TransactionWriteCompleted;
var TransactionCommit = (function () {
    function TransactionCommit(transactionId, requireMaster) {
        if (requireMaster === void 0) { requireMaster = true; }
        this.transactionId = transactionId;
        this.requireMaster = requireMaster;
    }
    return TransactionCommit;
})();
exports.TransactionCommit = TransactionCommit;
var TransactionCommitCompleted = (function () {
    function TransactionCommitCompleted() {
    }
    return TransactionCommitCompleted;
})();
exports.TransactionCommitCompleted = TransactionCommitCompleted;
var ReadEvent = (function () {
    function ReadEvent(eventStreamId, eventNumber, resolveLinkTos, requireMaster) {
        if (resolveLinkTos === void 0) { resolveLinkTos = false; }
        if (requireMaster === void 0) { requireMaster = true; }
        this.eventStreamId = eventStreamId;
        this.eventNumber = eventNumber;
        this.resolveLinkTos = resolveLinkTos;
        this.requireMaster = requireMaster;
    }
    return ReadEvent;
})();
exports.ReadEvent = ReadEvent;
var ReadEventCompleted = (function () {
    function ReadEventCompleted() {
    }
    return ReadEventCompleted;
})();
exports.ReadEventCompleted = ReadEventCompleted;
var ReadStreamEvents = (function () {
    function ReadStreamEvents(eventStreamId, fromEventNumber, maxCount, resolveLinkTos, requireMaster) {
        if (resolveLinkTos === void 0) { resolveLinkTos = false; }
        if (requireMaster === void 0) { requireMaster = true; }
        this.eventStreamId = eventStreamId;
        this.fromEventNumber = fromEventNumber;
        this.maxCount = maxCount;
        this.resolveLinkTos = resolveLinkTos;
        this.requireMaster = requireMaster;
    }
    return ReadStreamEvents;
})();
exports.ReadStreamEvents = ReadStreamEvents;
var ReadStreamEventsCompleted = (function () {
    function ReadStreamEventsCompleted() {
    }
    return ReadStreamEventsCompleted;
})();
exports.ReadStreamEventsCompleted = ReadStreamEventsCompleted;
var ReadAllEvents = (function () {
    function ReadAllEvents(commitPosition, preparePosition, maxCount, resolveLinkTos, requireMaster) {
        if (resolveLinkTos === void 0) { resolveLinkTos = false; }
        if (requireMaster === void 0) { requireMaster = true; }
        this.commitPosition = commitPosition;
        this.preparePosition = preparePosition;
        this.maxCount = maxCount;
        this.resolveLinkTos = resolveLinkTos;
        this.requireMaster = requireMaster;
    }
    return ReadAllEvents;
})();
exports.ReadAllEvents = ReadAllEvents;
var ReadAllEventsCompleted = (function () {
    function ReadAllEventsCompleted() {
    }
    return ReadAllEventsCompleted;
})();
exports.ReadAllEventsCompleted = ReadAllEventsCompleted;
var CreatePersistentSubscription = (function () {
    function CreatePersistentSubscription(subscriptionGroupName, eventStreamId, resolveLinkTos, startFrom, messageTimeoutMilliseconds, recordStatistics, liveBufferSize, readBatchSize, bufferSize, maxRetryCount, preferRoundRobin, checkpointAfterTime, checkpointMaxCount, checkpointMinCount, subscriberMaxCount) {
        if (resolveLinkTos === void 0) { resolveLinkTos = false; }
        if (startFrom === void 0) { startFrom = StreamPosition.end; }
        if (messageTimeoutMilliseconds === void 0) { messageTimeoutMilliseconds = 30000; }
        if (recordStatistics === void 0) { recordStatistics = false; }
        if (liveBufferSize === void 0) { liveBufferSize = 500; }
        if (readBatchSize === void 0) { readBatchSize = 10; }
        if (bufferSize === void 0) { bufferSize = 20; }
        if (maxRetryCount === void 0) { maxRetryCount = 500; }
        if (preferRoundRobin === void 0) { preferRoundRobin = true; }
        if (checkpointAfterTime === void 0) { checkpointAfterTime = 2000; }
        if (checkpointMaxCount === void 0) { checkpointMaxCount = 10; }
        if (checkpointMinCount === void 0) { checkpointMinCount = 1000; }
        if (subscriberMaxCount === void 0) { subscriberMaxCount = 0; }
        this.subscriptionGroupName = subscriptionGroupName;
        this.eventStreamId = eventStreamId;
        this.resolveLinkTos = resolveLinkTos;
        this.startFrom = startFrom;
        this.messageTimeoutMilliseconds = messageTimeoutMilliseconds;
        this.recordStatistics = recordStatistics;
        this.liveBufferSize = liveBufferSize;
        this.readBatchSize = readBatchSize;
        this.bufferSize = bufferSize;
        this.maxRetryCount = maxRetryCount;
        this.preferRoundRobin = preferRoundRobin;
        this.checkpointAfterTime = checkpointAfterTime;
        this.checkpointMaxCount = checkpointMaxCount;
        this.checkpointMinCount = checkpointMinCount;
        this.subscriberMaxCount = subscriberMaxCount;
    }
    return CreatePersistentSubscription;
})();
exports.CreatePersistentSubscription = CreatePersistentSubscription;
var DeletePersistentSubscription = (function () {
    function DeletePersistentSubscription(subscriptionGroupName, eventStreamId) {
        this.subscriptionGroupName = subscriptionGroupName;
        this.eventStreamId = eventStreamId;
    }
    return DeletePersistentSubscription;
})();
exports.DeletePersistentSubscription = DeletePersistentSubscription;
var UpdatePersistentSubscription = (function () {
    function UpdatePersistentSubscription(subscriptionGroupName, eventStreamId, resolveLinkTos, startFrom, messageTimeoutMilliseconds, recordStatistics, liveBufferSize, readBatchSize, bufferSize, maxRetryCount, preferRoundRobin, checkpointAfterTime, checkpointMaxCount, checkpointMinCount, subscriberMaxCount) {
        if (resolveLinkTos === void 0) { resolveLinkTos = false; }
        if (startFrom === void 0) { startFrom = StreamPosition.end; }
        if (messageTimeoutMilliseconds === void 0) { messageTimeoutMilliseconds = 30000; }
        if (recordStatistics === void 0) { recordStatistics = false; }
        if (liveBufferSize === void 0) { liveBufferSize = 500; }
        if (readBatchSize === void 0) { readBatchSize = 10; }
        if (bufferSize === void 0) { bufferSize = 20; }
        if (maxRetryCount === void 0) { maxRetryCount = 500; }
        if (preferRoundRobin === void 0) { preferRoundRobin = true; }
        if (checkpointAfterTime === void 0) { checkpointAfterTime = 2000; }
        if (checkpointMaxCount === void 0) { checkpointMaxCount = 10; }
        if (checkpointMinCount === void 0) { checkpointMinCount = 1000; }
        if (subscriberMaxCount === void 0) { subscriberMaxCount = 0; }
        this.subscriptionGroupName = subscriptionGroupName;
        this.eventStreamId = eventStreamId;
        this.resolveLinkTos = resolveLinkTos;
        this.startFrom = startFrom;
        this.messageTimeoutMilliseconds = messageTimeoutMilliseconds;
        this.recordStatistics = recordStatistics;
        this.liveBufferSize = liveBufferSize;
        this.readBatchSize = readBatchSize;
        this.bufferSize = bufferSize;
        this.maxRetryCount = maxRetryCount;
        this.preferRoundRobin = preferRoundRobin;
        this.checkpointAfterTime = checkpointAfterTime;
        this.checkpointMaxCount = checkpointMaxCount;
        this.checkpointMinCount = checkpointMinCount;
        this.subscriberMaxCount = subscriberMaxCount;
    }
    return UpdatePersistentSubscription;
})();
exports.UpdatePersistentSubscription = UpdatePersistentSubscription;
var UpdatePersistentSubscriptionCompleted = (function () {
    function UpdatePersistentSubscriptionCompleted() {
    }
    return UpdatePersistentSubscriptionCompleted;
})();
exports.UpdatePersistentSubscriptionCompleted = UpdatePersistentSubscriptionCompleted;
var CreatePersistentSubscriptionCompleted = (function () {
    function CreatePersistentSubscriptionCompleted() {
    }
    return CreatePersistentSubscriptionCompleted;
})();
exports.CreatePersistentSubscriptionCompleted = CreatePersistentSubscriptionCompleted;
var DeletePersistentSubscriptionCompleted = (function () {
    function DeletePersistentSubscriptionCompleted() {
    }
    return DeletePersistentSubscriptionCompleted;
})();
exports.DeletePersistentSubscriptionCompleted = DeletePersistentSubscriptionCompleted;
var ConnectToPersistentSubscription = (function () {
    function ConnectToPersistentSubscription(subscriptionId, eventStreamId, allowedInFlightMessages) {
        this.subscriptionId = subscriptionId;
        this.eventStreamId = eventStreamId;
        this.allowedInFlightMessages = allowedInFlightMessages;
    }
    return ConnectToPersistentSubscription;
})();
exports.ConnectToPersistentSubscription = ConnectToPersistentSubscription;
var PersistentSubscriptionAckEvents = (function () {
    function PersistentSubscriptionAckEvents() {
    }
    return PersistentSubscriptionAckEvents;
})();
exports.PersistentSubscriptionAckEvents = PersistentSubscriptionAckEvents;
var PersistentSubscriptionNakEvents = (function () {
    function PersistentSubscriptionNakEvents() {
    }
    return PersistentSubscriptionNakEvents;
})();
exports.PersistentSubscriptionNakEvents = PersistentSubscriptionNakEvents;
var PersistentSubscriptionConfirmation = (function () {
    function PersistentSubscriptionConfirmation() {
    }
    return PersistentSubscriptionConfirmation;
})();
exports.PersistentSubscriptionConfirmation = PersistentSubscriptionConfirmation;
var PersistentSubscriptionStreamEventAppeared = (function () {
    function PersistentSubscriptionStreamEventAppeared() {
    }
    return PersistentSubscriptionStreamEventAppeared;
})();
exports.PersistentSubscriptionStreamEventAppeared = PersistentSubscriptionStreamEventAppeared;
var SubscribeToStream = (function () {
    function SubscribeToStream(eventStreamId, resolveLinkTos) {
        if (resolveLinkTos === void 0) { resolveLinkTos = false; }
        this.eventStreamId = eventStreamId;
        this.resolveLinkTos = resolveLinkTos;
    }
    return SubscribeToStream;
})();
exports.SubscribeToStream = SubscribeToStream;
var SubscriptionConfirmation = (function () {
    function SubscriptionConfirmation() {
    }
    return SubscriptionConfirmation;
})();
exports.SubscriptionConfirmation = SubscriptionConfirmation;
var StreamEventAppeared = (function () {
    function StreamEventAppeared() {
    }
    return StreamEventAppeared;
})();
exports.StreamEventAppeared = StreamEventAppeared;
var UnsubscribeFromStream = (function () {
    function UnsubscribeFromStream() {
    }
    return UnsubscribeFromStream;
})();
exports.UnsubscribeFromStream = UnsubscribeFromStream;
var SubscriptionDropped = (function () {
    function SubscriptionDropped() {
    }
    return SubscriptionDropped;
})();
exports.SubscriptionDropped = SubscriptionDropped;
var NotHandled = (function () {
    function NotHandled() {
    }
    return NotHandled;
})();
exports.NotHandled = NotHandled;
var ScavengeDatabase = (function () {
    function ScavengeDatabase() {
    }
    return ScavengeDatabase;
})();
exports.ScavengeDatabase = ScavengeDatabase;
var ScavengeDatabaseCompleted = (function () {
    function ScavengeDatabaseCompleted() {
    }
    return ScavengeDatabaseCompleted;
})();
exports.ScavengeDatabaseCompleted = ScavengeDatabaseCompleted;
