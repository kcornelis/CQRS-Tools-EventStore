/// <reference path="../typings/all.d.ts" />

import ProtoBuf = require('protobufjs');
import common = require('./common');

export interface IMessage { }

export class OperationResult {
	static success: number = 0;
	static prepareTimeout: number = 1;
	static commitTimeout: number = 2;
	static forwardTimeout: number = 3;
	static wrongExpectedVersion: number = 4;
	static streamDeleted: number = 5;
	static invalidTransaction: number = 6;
	static accessDenied: number = 7;
}

export class ReadEventResult {
	static success: number = 0;
	static notFound: number = 1;
	static noStream: number = 2;
	static streamDeleted: number = 3;
	static error: number = 4;
	static accessDenied: number = 5;
}

export class ReadStreamResult {
	static success: number = 0;
	static noStream: number = 1;
	static streamDeleted: number = 2;
	static notModified: number = 3;
	static error: number = 4;
	static accessDenied: number = 5;
}

export class ReadAllResult {
	static success: number = 0;
	static notModified: number = 1;
	static error: number = 2;
	static accessDenied: number = 3;
}

export class UpdatePersistentSubscriptionResult {
	static success: number = 0;
	static doesNotExists: number = 1;
	static fail: number = 2;
	static accessDenied: number = 3;
}

export class CreatePersistentSubscriptionResult {
	static success: number = 0;
	static alreadyExists: number = 1;
	static fail: number = 2;
	static accessDenied: number = 3;
}

export class DeletePersistentSubscriptionResult {
	static success: number = 0;
	static doesNotExist: number = 1;
	static fail: number = 2;
	static accessDenied: number = 3;
}

export class NakAction {
	static unknown: number = 0;
	static park: number = 1;
	static retry: number = 2;
	static skip: number = 3;
	static stop: number = 4;
}

export class SubscriptionDropReason {
	static unsubscribed: number = 0;
	static accessDenied: number = 1;
	static notFound: number = 2;
	static persistentSubscriptionDeleted: number = 3;
	static subscriberMaxCountReached: number = 4;
}

export class NotHandledReason {
	static notReady: number = 0;
	static tooBusy: number = 1;
	static notMaster: number = 2;
}

export class ScavengeResult {
	static success: number = 0;
	static inProgress: number = 1;
	static failed: number = 2;
}

export class NewEvent {

	eventId: Buffer;
	eventType : string;
	dataContentType: number;
	metadataContentType: number;
	data: Buffer;
	metadata : Buffer;

	constructor(eventId: string = null, eventType: string = null, data: any = null, metadata: any = null) {
		eventId = eventId.replace(/[^0-9a-fA-F]/g, '');

		if (eventId.length !== 32) {
			throw new Error('eventId does not contain a valid GUID');
		}

		this.eventId = new Buffer(eventId, 'hex');
		this.eventType = eventType;
		this.populateData(data);
		this.populateMetadata(metadata);
	}

	populateData(data: any) {
		if (data) {
			if (Buffer.isBuffer(data)) {
				this.dataContentType = common.ContentType.binary;
				this.data = data;
			} else {
				this.dataContentType = common.ContentType.json;
				this.data = new Buffer(JSON.stringify(data));
			}
		} else {
			this.dataContentType = common.ContentType.binary;
			this.data = new Buffer([]);
		}
	}

	populateMetadata(metadata: any) {
		if (metadata) {
			if (Buffer.isBuffer(metadata)) {
				this.metadataContentType = common.ContentType.binary;
				this.metadata = metadata;
			} else {
				this.metadataContentType = common.ContentType.json;
				this.metadata = new Buffer(JSON.stringify(metadata));
			}
		} else {
			this.metadataContentType = common.ContentType.binary;
			this.metadata = new Buffer([]);
		}
	}
}

export class EventRecord {
	eventStreamId: string;
	eventNumber: number;
	eventId: Buffer;
	eventType: string;
	dataContentType: number;
	metadataContentType: number;
	data: Buffer;
	metadata: Buffer;
	created: number;
	createdEpoch: number;
}

export class ResolvedIndexedEvent {
	event: EventRecord;
	link: EventRecord;
}

export class ResolvedEvent {
	event: EventRecord;
	link: EventRecord;
	preparePosition: number;
	commitPosition: number;
}

export class WriteEvents implements IMessage {

	eventStreamId: string;
	expectedVersion: number;
	events: NewEvent[];
	requireMaster: boolean;

	constructor(eventStreamId: string, expectedVersion: number = common.ExpectedVersion.any,
			events: NewEvent[] = [], requireMaster: boolean = true) {

		this.eventStreamId = eventStreamId;
		this.events = events;
		this.expectedVersion = expectedVersion;
		this.requireMaster = requireMaster;
	}
}

export class WriteEventsCompleted implements IMessage {
	result: number;
	message: string;
	firstEventNumber: number;
	lastEventNumber: number;
	preparePosition: number;
	commitPosition: number;
}

export class DeleteStream implements IMessage {

	eventStreamId: string;
	expectedVersion: number;
	requireMaster: boolean;
	hardDelete: boolean;

	constructor(eventStreamId: string, expectedVersion: number = common.ExpectedVersion.any,
			requireMaster: boolean = true, hardDelete: boolean = false) {
		this.eventStreamId = eventStreamId;
		this.expectedVersion = expectedVersion;
		this.requireMaster = requireMaster;
		this.hardDelete = hardDelete;
	}
}

export class DeleteStreamCompleted implements IMessage {
	result: number;
	message: string;
	preparePosition: number;
	commitPosition: number;
}

export class TransactionStart implements IMessage {

	eventStreamId: string;
	expectedVersion: number;
	requireMaster: boolean;

	constructor(eventStreamId: string, expectedVersion: number = common.ExpectedVersion.any,
			requireMaster: boolean = true) {
		this.eventStreamId = eventStreamId;
		this.expectedVersion = expectedVersion;
		this.requireMaster = requireMaster;
	}
}

export class TransactionStartCompleted implements IMessage {
	result: number;
	message: string;
	transactionId: number;
}

export class TransactionWrite implements IMessage {

	transactionId: number;
	events: NewEvent[];
	requireMaster: boolean;

	constructor(transactionId: number, events: NewEvent[] = [], requireMaster: boolean = true) {
		this.transactionId = transactionId;
		this.events = events;
		this.requireMaster = requireMaster;
	}
}

export class TransactionWriteCompleted implements IMessage {
	result: number;
	message: string;
	transactionId: number;
}

export class TransactionCommit implements IMessage {

	transactionId: number;
	requireMaster: boolean;

	constructor(transactionId: number, requireMaster: boolean = true) {
		this.transactionId = transactionId;
		this.requireMaster = requireMaster;
	}
}

export class TransactionCommitCompleted implements IMessage {
	transactionId: number;
	result: number;
	message: string;
	firstEventNumber: number;
	lastEventNumber: number;
	preparePosition: number;
	commitPosition: number;
}

export class ReadEvent implements IMessage {

	eventStreamId: string;
	eventNumber: number;
	resolveLinkTos: boolean;
	requireMaster: boolean;

	constructor(eventStreamId: string, eventNumber: number,
			resolveLinkTos: boolean = false, requireMaster: boolean = true) {
		this.eventStreamId = eventStreamId;
		this.eventNumber = eventNumber;
		this.resolveLinkTos = resolveLinkTos;
		this.requireMaster = requireMaster;
	}
}

export class ReadEventCompleted implements IMessage {
	result: number;
	event: ResolvedIndexedEvent;
	error: string;
}

export class ReadStreamEvents implements IMessage {

	eventStreamId: string;
	fromEventNumber: number;
	maxCount: number;
	resolveLinkTos: boolean;
	requireMaster: boolean;

	constructor(eventStreamId: string,
			fromEventNumber: number, maxCount: number,
			resolveLinkTos: boolean = false, requireMaster: boolean = true) {
		this.eventStreamId = eventStreamId;
		this.fromEventNumber = fromEventNumber;
		this.maxCount = maxCount;
		this.resolveLinkTos = resolveLinkTos;
		this.requireMaster = requireMaster;
	}
}

export class ReadStreamEventsCompleted implements IMessage {
	result: number;
	events: ResolvedIndexedEvent[];
	nextEventNumber: number;
	lastEventNumber: number;
	isEndOfStream: boolean;
	lastCommitPosition: number;
	error: string;
}

export class ReadAllEvents implements IMessage {

	commitPosition: number;
	preparePosition: number;
	maxCount: number;
	resolveLinkTos: boolean;
	requireMaster: boolean;

	constructor(commitPosition: number, preparePosition: number, maxCount: number,
			resolveLinkTos: boolean = false, requireMaster: boolean = true) {
		this.commitPosition = commitPosition;
		this.preparePosition = preparePosition;
		this.maxCount = maxCount;
		this.resolveLinkTos = resolveLinkTos;
		this.requireMaster = requireMaster;
	}
}

export class ReadAllEventsCompleted implements IMessage {
	result: number;
	events: ResolvedEvent[];
	commitPosition: number;
	preparePosition: number;
	nextCommitPosition: number;
	nextPreparePosition: number;
	error: string;
}

export class CreatePersistentSubscription implements IMessage {
	subscriptionGroupName: string;
	eventStreamId: string;
	resolveLinkTos: boolean;
	startFrom: number;
	messageTimeoutMilliseconds: number;
	recordStatistics: boolean;
	liveBufferSize: number;
	readBatchSize: number;
	bufferSize: number;
	maxRetryCount: number;
	preferRoundRobin: boolean;
	checkpointAfterTime: number;
	checkpointMaxCount: number;
	checkpointMinCount: number;
	subscriberMaxCount: number;

	constructor(subscriptionGroupName: string, eventStreamId: string, resolveLinkTos: boolean = false,
			startFrom: number = common.StreamPosition.end, messageTimeoutMilliseconds: number = 30000, recordStatistics: boolean = false,
			liveBufferSize: number = 500, readBatchSize: number = 10, bufferSize: number = 20,
			maxRetryCount: number = 500, preferRoundRobin: boolean = true, checkpointAfterTime: number = 2000,
			checkpointMaxCount: number = 10, checkpointMinCount: number = 1000, subscriberMaxCount: number = 0) {
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
}

export class DeletePersistentSubscription implements IMessage {
	subscriptionGroupName: string;
	eventStreamId: string;

	constructor(subscriptionGroupName: string, eventStreamId: string) {
		this.subscriptionGroupName = subscriptionGroupName;
		this.eventStreamId = eventStreamId;
	}
}

export class UpdatePersistentSubscription implements IMessage {
	subscriptionGroupName: string;
	eventStreamId: string;
	resolveLinkTos: boolean;
	startFrom: number;
	messageTimeoutMilliseconds: number;
	recordStatistics: boolean;
	liveBufferSize: number;
	readBatchSize: number;
	bufferSize: number;
	maxRetryCount: number;
	preferRoundRobin: boolean;
	checkpointAfterTime: number;
	checkpointMaxCount: number;
	checkpointMinCount: number;
	subscriberMaxCount: number;

	constructor(subscriptionGroupName: string, eventStreamId: string, resolveLinkTos: boolean = false,
			startFrom: number = common.StreamPosition.end, messageTimeoutMilliseconds: number = 30000, recordStatistics: boolean = false,
			liveBufferSize: number = 500, readBatchSize: number = 10, bufferSize: number = 20,
			maxRetryCount: number = 500, preferRoundRobin: boolean = true, checkpointAfterTime: number = 2000,
			checkpointMaxCount: number = 10, checkpointMinCount: number = 1000, subscriberMaxCount: number = 0) {
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
}

export class UpdatePersistentSubscriptionCompleted implements IMessage {
	result: number;
	reason: string;
}

export class CreatePersistentSubscriptionCompleted implements IMessage {
	result: number;
	reason: string;
}

export class DeletePersistentSubscriptionCompleted implements IMessage {
	result: number;
	reason: string;
}

export class ConnectToPersistentSubscription implements IMessage {
	subscriptionId: string;
	eventStreamId: string;
	allowedInFlightMessages: number;

	constructor(subscriptionId: string, eventStreamId: string, allowedInFlightMessages: number) {
		this.subscriptionId = subscriptionId;
		this.eventStreamId = eventStreamId;
		this.allowedInFlightMessages = allowedInFlightMessages;
	}
}

export class PersistentSubscriptionAckEvents implements IMessage {
	subscriptionId: string;
	processedEventIds: Buffer[];
}

export class PersistentSubscriptionNakEvents implements IMessage {
	subscriptionId: string;
	processedEventIds: Buffer[];
	message: string;
	action: number;
}

export class PersistentSubscriptionConfirmation implements IMessage {
	lastCommitPosition: number;
	subscriptionId: string;
	lastEventNumber: number;
}

export class PersistentSubscriptionStreamEventAppeared implements IMessage {
	event: ResolvedIndexedEvent;
}

export class SubscribeToStream implements IMessage {

	eventStreamId: string;
	resolveLinkTos: boolean;

	constructor(eventStreamId: string, resolveLinkTos: boolean = false) {
		this.eventStreamId = eventStreamId;
		this.resolveLinkTos = resolveLinkTos;
	}
}

export class SubscriptionConfirmation implements IMessage {
	lastCommitPosition: number;
	lastEventNumber: number;
}

export class StreamEventAppeared implements IMessage {
	event: ResolvedEvent;
}

export class UnsubscribeFromStream implements IMessage {
}

export class SubscriptionDropped implements IMessage {
	reason: number;
}

export class NotHandled implements IMessage {
	reason: number;
	additionalInfo: Buffer;
}

export class ScavengeDatabase implements IMessage {
}

export class ScavengeDatabaseCompleted implements IMessage {
	result: number;
	error: string;
	totalTimeMs: number;
	totalSpaceSaved: number;
}
