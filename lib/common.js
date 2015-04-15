var ExpectedVersion = (function () {
    function ExpectedVersion() {
    }
    ExpectedVersion.any = -2;
    ExpectedVersion.notExist = -1;
    return ExpectedVersion;
})();
exports.ExpectedVersion = ExpectedVersion;
var ContentType = (function () {
    function ContentType() {
    }
    ContentType.binary = 0;
    ContentType.json = 1;
    return ContentType;
})();
exports.ContentType = ContentType;
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
