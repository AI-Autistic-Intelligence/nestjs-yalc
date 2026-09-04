"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeRabbitResource = closeRabbitResource;
async function closeRabbitResource(resource) {
    if (!resource) {
        return;
    }
    let timeout;
    try {
        await Promise.race([
            resource.close(),
            new Promise((resolve) => {
                timeout = setTimeout(resolve, 1000);
            }),
        ]);
    }
    catch (error) {
        if (!(error instanceof Error) || !error.message.includes('closing')) {
            throw error;
        }
    }
    finally {
        if (timeout) {
            clearTimeout(timeout);
        }
        forceCloseRabbitResource(resource);
    }
}
function forceCloseRabbitResource(resource) {
    var _a, _b, _c, _d;
    const connection = resource.connection;
    (_a = connection === null || connection === void 0 ? void 0 : connection.heartbeater) === null || _a === void 0 ? void 0 : _a.clear();
    (_b = resource.heartbeater) === null || _b === void 0 ? void 0 : _b.clear();
    (_c = connection === null || connection === void 0 ? void 0 : connection.stream) === null || _c === void 0 ? void 0 : _c.destroy();
    (_d = resource.stream) === null || _d === void 0 ? void 0 : _d.destroy();
}
//# sourceMappingURL=task-events-rabbitmq-connection.js.map