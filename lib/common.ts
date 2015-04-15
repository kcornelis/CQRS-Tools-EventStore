export class ExpectedVersion {
	static any: number = -2;
	static notExist: number = -1;
}

export class ContentType {
	static binary: number = 0;
	static json: number = 1;
}

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
