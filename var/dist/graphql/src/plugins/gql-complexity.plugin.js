import { __decorate } from "tslib";
import { Plugin } from '@nestjs/apollo';
import { GqlComplexityHelper } from './gql-complexity.helper';
let GqlComplexityPlugin = class GqlComplexityPlugin {
    async requestDidStart() {
        return {
            async didResolveOperation({ document, schema }) {
                GqlComplexityHelper.processDocumentAST(document, schema);
            },
        };
    }
};
GqlComplexityPlugin = __decorate([
    Plugin()
], GqlComplexityPlugin);
export { GqlComplexityPlugin };
//# sourceMappingURL=gql-complexity.plugin.js.map