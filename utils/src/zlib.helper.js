"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deflate = exports.inflate = void 0;
const zlib_1 = require("zlib");
const inflate = (input) => {
    try {
        const inflated = (0, zlib_1.inflateSync)(Buffer.from(input, 'base64')).toString();
        return inflated;
    }
    catch (error) {
        return input;
    }
};
exports.inflate = inflate;
const deflate = (input) => {
    try {
        const deflated = (0, zlib_1.deflateSync)(input);
        return deflated;
    }
    catch (error) {
        return input;
    }
};
exports.deflate = deflate;
//# sourceMappingURL=zlib.helper.js.map