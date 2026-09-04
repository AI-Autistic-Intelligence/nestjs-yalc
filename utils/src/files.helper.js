"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__filename = __filename;
exports.___dirname = ___dirname;
const node_url_1 = require("node:url");
const node_path_1 = require("node:path");
function __filename(path) {
    return (0, node_url_1.fileURLToPath)(path);
}
function ___dirname(path) {
    return (0, node_path_1.dirname)(__filename(path));
}
//# sourceMappingURL=files.helper.js.map