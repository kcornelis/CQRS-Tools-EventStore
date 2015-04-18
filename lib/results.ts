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
