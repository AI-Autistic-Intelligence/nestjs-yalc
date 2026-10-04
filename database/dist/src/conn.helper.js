"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONN_SUFFIX = exports.DBCONF_PREFIX = void 0;
exports.getConfNameByConnection = getConfNameByConnection;
exports.getConnectionName = getConnectionName;
exports.getDBNameByConnection = getDBNameByConnection;
exports.DBCONF_PREFIX = 'dbConf_';
exports.CONN_SUFFIX = 'Connection';
function getConfNameByConnection(connName) {
    return `${exports.DBCONF_PREFIX}${connName}`;
}
function getConnectionName(dbName) {
    return `${dbName}${exports.CONN_SUFFIX}`;
}
function getDBNameByConnection(connName) {
    return connName.substring(0, connName.indexOf(exports.CONN_SUFFIX));
}
//# sourceMappingURL=conn.helper.js.map