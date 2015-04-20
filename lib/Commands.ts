class Commands {
	private static _codeToCommandMap: any;
	private static _commandToCodeMap: any;

	static commandToCode(command: string): number {
		if (!this._commandToCodeMap) {
			this._commandToCodeMap = { };
			for (var key in this) {
				if (this.hasOwnProperty(key)) {
					this._commandToCodeMap[key] = this[key];
				}
			}
		}

		return this._commandToCodeMap[command];
	}

	static codeToCommand(code: number): string {
		if (!this._codeToCommandMap) {
			this._codeToCommandMap = { };
			for (var key in this) {
				if (this.hasOwnProperty(key)) {
					this._codeToCommandMap[this[key]] = key;
				}
			}
		}

		return this._codeToCommandMap[code];
	}

	static HeartbeatRequestCommand: number = 0x01;
	static HeartbeatResponseCommand: number = 0x02;

	static Ping: number = 0x03;
	static Pong: number = 0x04;

	static PrepareAck: number = 0x05;
	static CommitAck: number = 0x06;

	static SlaveAssignment: number = 0x07;
	static CloneAssignment: number = 0x08;

	static SubscribeReplica: number = 0x10;
	static ReplicaLogPositionAck: number = 0x11;
	static CreateChunk: number = 0x12;
	static RawChunkBulk: number = 0x13;
	static DataChunkBulk: number = 0x14;
	static ReplicaSubscriptionRetry: number = 0x15;
	static ReplicaSubscribed: number = 0x16;

	// CLIENT COMMANDS
	// CreateStream: number = 0x80;
	// CreateStreamCompleted: number = 0x81;

	static WriteEvents: number = 0x82;
	static WriteEventsCompleted: number = 0x83;

	static TransactionStart: number = 0x84;
	static TransactionStartCompleted: number = 0x85;
	static TransactionWrite: number = 0x86;
	static TransactionWriteCompleted: number = 0x87;
	static TransactionCommit: number = 0x88;
	static TransactionCommitCompleted: number = 0x89;

	static DeleteStream: number = 0x8A;
	static DeleteStreamCompleted: number = 0x8B;

	static ReadEvent: number = 0xB0;
	static ReadEventCompleted: number = 0xB1;
	static ReadStreamEventsForward: number = 0xB2;
	static ReadStreamEventsForwardCompleted: number = 0xB3;
	static ReadStreamEventsBackward: number = 0xB4;
	static ReadStreamEventsBackwardCompleted: number = 0xB5;
	static ReadAllEventsForward: number = 0xB6;
	static ReadAllEventsForwardCompleted: number = 0xB7;
	static ReadAllEventsBackward: number = 0xB8;
	static ReadAllEventsBackwardCompleted: number = 0xB9;

	static SubscribeToStream: number = 0xC0;
	static SubscriptionConfirmation: number = 0xC1;
	static StreamEventAppeared: number = 0xC2;
	static UnsubscribeFromStream: number = 0xC3;
	static SubscriptionDropped: number = 0xC4;
	static ConnectToPersistentSubscription: number = 0xC5;
	static PersistentSubscriptionConfirmation: number = 0xC6;
	static PersistentSubscriptionStreamEventAppeared: number = 0xC7;
	static CreatePersistentSubscription: number = 0xC8;
	static CreatePersistentSubscriptionCompleted: number = 0xC9;
	static DeletePersistentSubscription: number = 0xCA;
	static DeletePersistentSubscriptionCompleted: number = 0xCB;
	static PersistentSubscriptionAckEvents: number = 0xCC;
	static PersistentSubscriptionNakEvents: number = 0xCD;
	static UpdatePersistentSubscription: number = 0xCE;
	static UpdatePersistentSubscriptionCompleted: number = 0xCF;

	static ScavengeDatabase: number = 0xD0;
	static ScavengeDatabaseCompleted: number = 0xD1;

	static BadRequest: number = 0xF0;
	static NotHandled: number = 0xF1;
	static Authenticate: number = 0xF2;
	static Authenticated: number = 0xF3;
	static NotAuthenticated: number = 0xF4;
}

export = Commands;
