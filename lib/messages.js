/// <reference path="../typings/all.d.ts" />
var common = require('./common');
var OperationResult = (function () {
    function OperationResult() {
    }
    OperationResult.success = 0;
    OperationResult.prepareTimeout = 1;
    OperationResult.commitTimeout = 2;
    OperationResult.forwardTimeout = 3;
    OperationResult.wrongExpectedVersion = 4;
    OperationResult.streamDeleted = 5;
    OperationResult.invalidTransaction = 6;
    OperationResult.accessDenied = 7;
    return OperationResult;
})();
exports.OperationResult = OperationResult;
var ReadEventResult = (function () {
    function ReadEventResult() {
    }
    ReadEventResult.success = 0;
    ReadEventResult.notFound = 1;
    ReadEventResult.noStream = 2;
    ReadEventResult.streamDeleted = 3;
    ReadEventResult.error = 4;
    ReadEventResult.accessDenied = 5;
    return ReadEventResult;
})();
exports.ReadEventResult = ReadEventResult;
var ReadStreamResult = (function () {
    function ReadStreamResult() {
    }
    ReadStreamResult.success = 0;
    ReadStreamResult.noStream = 1;
    ReadStreamResult.streamDeleted = 2;
    ReadStreamResult.notModified = 3;
    ReadStreamResult.error = 4;
    ReadStreamResult.accessDenied = 5;
    return ReadStreamResult;
})();
exports.ReadStreamResult = ReadStreamResult;
var ReadAllResult = (function () {
    function ReadAllResult() {
    }
    ReadAllResult.success = 0;
    ReadAllResult.notModified = 1;
    ReadAllResult.error = 2;
    ReadAllResult.accessDenied = 3;
    return ReadAllResult;
})();
exports.ReadAllResult = ReadAllResult;
var UpdatePersistentSubscriptionResult = (function () {
    function UpdatePersistentSubscriptionResult() {
    }
    UpdatePersistentSubscriptionResult.success = 0;
    UpdatePersistentSubscriptionResult.doesNotExists = 1;
    UpdatePersistentSubscriptionResult.fail = 2;
    UpdatePersistentSubscriptionResult.accessDenied = 3;
    return UpdatePersistentSubscriptionResult;
})();
exports.UpdatePersistentSubscriptionResult = UpdatePersistentSubscriptionResult;
var CreatePersistentSubscriptionResult = (function () {
    function CreatePersistentSubscriptionResult() {
    }
    CreatePersistentSubscriptionResult.success = 0;
    CreatePersistentSubscriptionResult.alreadyExists = 1;
    CreatePersistentSubscriptionResult.fail = 2;
    CreatePersistentSubscriptionResult.accessDenied = 3;
    return CreatePersistentSubscriptionResult;
})();
exports.CreatePersistentSubscriptionResult = CreatePersistentSubscriptionResult;
var DeletePersistentSubscriptionResult = (function () {
    function DeletePersistentSubscriptionResult() {
    }
    DeletePersistentSubscriptionResult.success = 0;
    DeletePersistentSubscriptionResult.doesNotExist = 1;
    DeletePersistentSubscriptionResult.fail = 2;
    DeletePersistentSubscriptionResult.accessDenied = 3;
    return DeletePersistentSubscriptionResult;
})();
exports.DeletePersistentSubscriptionResult = DeletePersistentSubscriptionResult;
var NakAction = (function () {
    function NakAction() {
    }
    NakAction.unknown = 0;
    NakAction.park = 1;
    NakAction.retry = 2;
    NakAction.skip = 3;
    NakAction.stop = 4;
    return NakAction;
})();
exports.NakAction = NakAction;
var SubscriptionDropReason = (function () {
    function SubscriptionDropReason() {
    }
    SubscriptionDropReason.unsubscribed = 0;
    SubscriptionDropReason.accessDenied = 1;
    SubscriptionDropReason.notFound = 2;
    SubscriptionDropReason.persistentSubscriptionDeleted = 3;
    SubscriptionDropReason.subscriberMaxCountReached = 4;
    return SubscriptionDropReason;
})();
exports.SubscriptionDropReason = SubscriptionDropReason;
var NotHandledReason = (function () {
    function NotHandledReason() {
    }
    NotHandledReason.notReady = 0;
    NotHandledReason.tooBusy = 1;
    NotHandledReason.notMaster = 2;
    return NotHandledReason;
})();
exports.NotHandledReason = NotHandledReason;
var ScavengeResult = (function () {
    function ScavengeResult() {
    }
    ScavengeResult.success = 0;
    ScavengeResult.inProgress = 1;
    ScavengeResult.failed = 2;
    return ScavengeResult;
})();
exports.ScavengeResult = ScavengeResult;
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
                this.dataContentType = common.ContentType.binary;
                this.data = data;
            }
            else {
                this.dataContentType = common.ContentType.json;
                this.data = new Buffer(JSON.stringify(data));
            }
        }
        else {
            this.dataContentType = common.ContentType.binary;
            this.data = new Buffer([]);
        }
    };
    NewEvent.prototype.populateMetadata = function (metadata) {
        if (metadata) {
            if (Buffer.isBuffer(metadata)) {
                this.metadataContentType = common.ContentType.binary;
                this.metadata = metadata;
            }
            else {
                this.metadataContentType = common.ContentType.json;
                this.metadata = new Buffer(JSON.stringify(metadata));
            }
        }
        else {
            this.metadataContentType = common.ContentType.binary;
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
        if (expectedVersion === void 0) { expectedVersion = common.ExpectedVersion.any; }
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
        if (expectedVersion === void 0) { expectedVersion = common.ExpectedVersion.any; }
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
        if (expectedVersion === void 0) { expectedVersion = common.ExpectedVersion.any; }
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
        if (startFrom === void 0) { startFrom = common.StreamPosition.end; }
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
        if (startFrom === void 0) { startFrom = common.StreamPosition.end; }
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
