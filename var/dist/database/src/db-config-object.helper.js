import { envIsTrue } from '@nestjs-yalc/utils/env.helper';
import { getConnectionName } from './conn.helper';
export function buildDbConfigObject({ dbName, entities, seeds, sourceDir, migrationsDir, extraMigrationDirs, connectionName, __seedAsync, }) {
    let connNameTemp = connectionName;
    if (!connNameTemp && dbName) {
        connNameTemp = dbName;
    }
    if (!connNameTemp) {
        throw new Error('Cannot create a connection without a name, provide at least a dbName or connectionName');
    }
    const connName = getConnectionName(connNameTemp);
    const dbConfObj = () => {
        const noSelDb = envIsTrue(process.env.TYPEORM_NO_SEL_DB || 'false');
        const canLoad = envIsTrue(process.env.TYPEORM_LOAD_MIGRATIONS) ||
            process.env.NODE_ENV !== 'production';
        const migrationDirs = [];
        if (migrationsDir) {
            migrationDirs.push(`${migrationsDir}/**/*.{ts,js}`);
        }
        if (extraMigrationDirs) {
            migrationDirs.push(...extraMigrationDirs);
        }
        return {
            ..._getDefaultDbConnectionConfig(dbName),
            name: connName,
            database: noSelDb ? undefined : dbName,
            entities: noSelDb ? undefined : entities,
            seeds,
            factories: sourceDir && canLoad
                ? [`${sourceDir}/**/*.factory.{ts,js}`]
                : undefined,
            migrations: migrationDirs.length > 0 && canLoad ? migrationDirs : undefined,
            cli: {
                migrationsDir: canLoad ? migrationsDir : undefined,
            },
            __seedAsync,
        };
    };
    dbConfObj.connName = connName;
    dbConfObj.dbName = dbName ?? connNameTemp;
    return dbConfObj;
}
function _getDefaultDbConnectionConfig(dbName) {
    const { TYPEORM_SYNCHRONIZE, TYPEORM_LOGGING } = process.env;
    const dbConfigParams = _makeDbConfigParams(dbName);
    return {
        ...dbConfigParams,
        type: 'mysql',
        supportBigNumbers: true,
        bigNumberStrings: false,
        synchronize: envIsTrue(TYPEORM_SYNCHRONIZE || 'false'),
        logging: envIsTrue(TYPEORM_LOGGING || 'false'),
    };
}
function _makeDbConfigParams(dbName) {
    const { MYSQL_TOTAL_REPLICATION_NODES } = process.env;
    if (MYSQL_TOTAL_REPLICATION_NODES) {
        return _makeReplicatedDbConfigParams(parseInt(MYSQL_TOTAL_REPLICATION_NODES, 10), dbName);
    }
    return _makeSingleDbConfigParams(dbName);
}
function _makeSingleDbConfigParams(dbName) {
    const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_ROOT_PASSWORD, } = process.env;
    const host = global.__JEST_DISABLE_DB !== true ? MYSQL_HOST : 'jest-db-disabled';
    const port = _getDbPort(MYSQL_PORT);
    const username = MYSQL_USER || 'root';
    const password = MYSQL_PASSWORD ?? MYSQL_ROOT_PASSWORD;
    let result = {
        host,
        port,
        username,
        password,
    };
    if (dbName) {
        result = {
            ...result,
            database: dbName,
        };
    }
    return result;
}
function _makeReplicatedDbConfigParams(totalReplicaNodes, dbName) {
    const replicas = _getSingleDbConfigParams(totalReplicaNodes, dbName);
    return {
        replication: {
            master: _makeSingleDbConfigParams(dbName),
            slaves: replicas,
            selector: 'RR',
        },
    };
}
function _getSingleDbConfigParams(totalReplicaNodes, dbName) {
    const replicas = [];
    for (let i = 1; i <= totalReplicaNodes; i++) {
        const host = process.env[`MYSQL_REPLICA_HOST_${i}`];
        const port = _getDbPort(process.env[`MYSQL_REPLICA_PORT_${i}`]);
        const username = process.env[`MYSQL_REPLICA_USERNAME_${i}`];
        const password = process.env[`MYSQL_REPLICA_PASSWORD_${i}`];
        let credentialsOptions = {
            host,
            port,
            username,
            password,
        };
        if (dbName) {
            credentialsOptions = {
                ...credentialsOptions,
                database: dbName,
            };
        }
        replicas.push(credentialsOptions);
    }
    return replicas;
}
function _getDbPort(port) {
    return port ? parseInt(port, 10) : 3306;
}
//# sourceMappingURL=db-config-object.helper.js.map