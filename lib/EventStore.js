var TcpConnection = require('./TcpConnection');
var EventStore = (function () {
    function EventStore() {
    }
    EventStore.createConnection = function () {
        return new TcpConnection();
    };
    return EventStore;
})();
module.exports = EventStore;
