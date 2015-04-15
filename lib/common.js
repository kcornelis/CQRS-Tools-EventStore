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
var StreamPosition = (function () {
    function StreamPosition() {
    }
    StreamPosition.start = 0;
    StreamPosition.end = -1;
    return StreamPosition;
})();
exports.StreamPosition = StreamPosition;
