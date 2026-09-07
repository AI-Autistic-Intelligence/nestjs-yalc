"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingArgumentsError = void 0;
var crud_gen_1 = require("@nest-yalc-2/crud-gen");
Object.defineProperty(exports, "MissingArgumentsError", { enumerable: true, get: function () { return crud_gen_1.MissingArgumentsError; } });
__exportStar(require("./error.enum.js"), exports);
__exportStar(require("./error.class.js"), exports);
__exportStar(require("./default.error.js"), exports);
__exportStar(require("./result.error.js"), exports);
//# sourceMappingURL=index.js.map