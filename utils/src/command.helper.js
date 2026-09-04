"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandWithErrors = void 0;
const commandWithErrors = (command) => {
    return async (...args) => {
        try {
            await command(...args);
        }
        catch (e) {
            console.error(e);
            process.exit(1);
        }
    };
};
exports.commandWithErrors = commandWithErrors;
//# sourceMappingURL=command.helper.js.map