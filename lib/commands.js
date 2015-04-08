var Commands = (function () {
    function Commands() {
    }
    Commands.commandToCode = function (command) {
        if (!this._commandToCodeMap) {
            this._commandToCodeMap = {};
            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    this._commandToCodeMap[key] = this[key];
                }
            }
        }
        return this._commandToCodeMap[command];
    };
    Commands.codeToCommand = function (code) {
        if (!this._codeToCommandMap) {
            this._codeToCommandMap = {};
            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    this._codeToCommandMap[this[key]] = key;
                }
            }
        }
        return this._codeToCommandMap[code];
    };
    Commands.HeartbeatRequestCommand = 0x01;
    Commands.HeartbeatResponseCommand = 0x02;
    Commands.Ping = 0x03;
    Commands.Pong = 0x04;
    Commands.PrepareAck = 0x05;
    Commands.CommitAck = 0x06;
    Commands.SlaveAssignment = 0x07;
    Commands.CloneAssignment = 0x08;
    Commands.SubscribeReplica = 0x10;
    Commands.ReplicaLogPositionAck = 0x11;
    Commands.CreateChunk = 0x12;
    Commands.RawChunkBulk = 0x13;
    Commands.DataChunkBulk = 0x14;
    Commands.ReplicaSubscriptionRetry = 0x15;
    Commands.ReplicaSubscribed = 0x16;
    // CLIENT COMMANDS
    // CreateStream: number = 0x80;
    // CreateStreamCompleted: number = 0x81;
    Commands.WriteEvents = 0x82;
    Commands.WriteEventsCompleted = 0x83;
    Commands.TransactionStart = 0x84;
    Commands.TransactionStartCompleted = 0x85;
    Commands.TransactionWrite = 0x86;
    Commands.TransactionWriteCompleted = 0x87;
    Commands.TransactionCommit = 0x88;
    Commands.TransactionCommitCompleted = 0x89;
    Commands.DeleteStream = 0x8A;
    Commands.DeleteStreamCompleted = 0x8B;
    Commands.ReadEvent = 0xB0;
    Commands.ReadEventCompleted = 0xB1;
    Commands.ReadStreamEventsForward = 0xB2;
    Commands.ReadStreamEventsForwardCompleted = 0xB3;
    Commands.ReadStreamEventsBackward = 0xB4;
    Commands.ReadStreamEventsBackwardCompleted = 0xB5;
    Commands.ReadAllEventsForward = 0xB6;
    Commands.ReadAllEventsForwardCompleted = 0xB7;
    Commands.ReadAllEventsBackward = 0xB8;
    Commands.ReadAllEventsBackwardCompleted = 0xB9;
    Commands.SubscribeToStream = 0xC0;
    Commands.SubscriptionConfirmation = 0xC1;
    Commands.StreamEventAppeared = 0xC2;
    Commands.UnsubscribeFromStream = 0xC3;
    Commands.SubscriptionDropped = 0xC4;
    Commands.ConnectToPersistentSubscription = 0xC5;
    Commands.PersistentSubscriptionConfirmation = 0xC6;
    Commands.PersistentSubscriptionStreamEventAppeared = 0xC7;
    Commands.CreatePersistentSubscription = 0xC8;
    Commands.CreatePersistentSubscriptionCompleted = 0xC9;
    Commands.DeletePersistentSubscription = 0xCA;
    Commands.DeletePersistentSubscriptionCompleted = 0xCB;
    Commands.PersistentSubscriptionAckEvents = 0xCC;
    Commands.PersistentSubscriptionNakEvents = 0xCD;
    Commands.UpdatePersistentSubscription = 0xCE;
    Commands.UpdatePersistentSubscriptionCompleted = 0xCF;
    Commands.ScavengeDatabase = 0xD0;
    Commands.ScavengeDatabaseCompleted = 0xD1;
    Commands.BadRequest = 0xF0;
    Commands.NotHandled = 0xF1;
    Commands.Authenticate = 0xF2;
    Commands.Authenticated = 0xF3;
    Commands.NotAuthenticated = 0xF4;
    return Commands;
})();
module.exports = Commands;
