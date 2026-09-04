import { inflateSync, deflateSync } from 'zlib';
export const inflate = (input) => {
    try {
        const inflated = inflateSync(Buffer.from(input, 'base64')).toString();
        return inflated;
    }
    catch (error) {
        return input;
    }
};
export const deflate = (input) => {
    try {
        const deflated = deflateSync(input);
        return deflated;
    }
    catch (error) {
        return input;
    }
};
//# sourceMappingURL=zlib.helper.js.map