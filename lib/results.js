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
