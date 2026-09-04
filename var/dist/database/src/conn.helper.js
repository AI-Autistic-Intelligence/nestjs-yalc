export const DBCONF_PREFIX = 'dbConf_';
export const CONN_SUFFIX = 'Connection';
export function getConfNameByConnection(connName) {
    return `${DBCONF_PREFIX}${connName}`;
}
export function getConnectionName(dbName) {
    return `${dbName}${CONN_SUFFIX}`;
}
export function getDBNameByConnection(connName) {
    return connName.substring(0, connName.indexOf(CONN_SUFFIX));
}
//# sourceMappingURL=conn.helper.js.map