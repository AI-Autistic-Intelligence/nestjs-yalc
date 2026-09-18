"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GqlComplexityPlugin = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const gql_complexity_helper_js_1 = require("./gql-complexity.helper.js");
let GqlComplexityPlugin = class GqlComplexityPlugin {
    async requestDidStart() {
        return {
            async didResolveOperation({ document, schema, }) {
                gql_complexity_helper_js_1.GqlComplexityHelper.processDocumentAST(document, schema);
            },
        };
    }
};
exports.GqlComplexityPlugin = GqlComplexityPlugin;
exports.GqlComplexityPlugin = GqlComplexityPlugin = tslib_1.__decorate([
    (0, common_1.Injectable)()
], GqlComplexityPlugin);
//# sourceMappingURL=gql-complexity.plugin.js.map