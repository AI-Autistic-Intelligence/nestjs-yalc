"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgGridField = exports.getAgGridFieldMetadata = exports.getAgGridFieldMetadataList = exports.FilterOptionType = exports.hasAgGridObjectMetadata = exports.getAgGridObjectMetadata = exports.AgGridObject = exports.hasAgGridFieldMetadata = exports.hasAgGridFieldMetadataList = exports.getPrototype = exports.AGGRID_FIELD_METADATA_KEY = exports.AGGRID_OBJECT_METADATA_KEY = exports.isDstExtended = void 0;
const object_decorator_js_1 = require("@node-yalc/datagrid/object.decorator.js");
Object.defineProperty(exports, "isDstExtended", { enumerable: true, get: function () { return object_decorator_js_1.isDstExtended; } });
Object.defineProperty(exports, "AGGRID_OBJECT_METADATA_KEY", { enumerable: true, get: function () { return object_decorator_js_1.YALC_AGGRID_OBJECT_METADATA_KEY; } });
Object.defineProperty(exports, "AGGRID_FIELD_METADATA_KEY", { enumerable: true, get: function () { return object_decorator_js_1.YALC_AGGRID_FIELD_METADATA_KEY; } });
Object.defineProperty(exports, "getPrototype", { enumerable: true, get: function () { return object_decorator_js_1.getPrototype; } });
Object.defineProperty(exports, "hasAgGridFieldMetadataList", { enumerable: true, get: function () { return object_decorator_js_1.hasYalcAgGridFieldMetadataList; } });
Object.defineProperty(exports, "hasAgGridFieldMetadata", { enumerable: true, get: function () { return object_decorator_js_1.hasYalcAgGridFieldMetadata; } });
Object.defineProperty(exports, "AgGridObject", { enumerable: true, get: function () { return object_decorator_js_1.YalcAgGridObject; } });
Object.defineProperty(exports, "getAgGridObjectMetadata", { enumerable: true, get: function () { return object_decorator_js_1.getYalcAgGridObjectMetadata; } });
Object.defineProperty(exports, "hasAgGridObjectMetadata", { enumerable: true, get: function () { return object_decorator_js_1.hasYalcAgGridObjectMetadata; } });
Object.defineProperty(exports, "FilterOptionType", { enumerable: true, get: function () { return object_decorator_js_1.FilterOptionType; } });
const graphql_1 = require("@nestjs/graphql");
const getAgGridFieldMetadataList = (target) => {
    return (0, object_decorator_js_1.getYalcAgGridFieldMetadataList)(target);
};
exports.getAgGridFieldMetadataList = getAgGridFieldMetadataList;
const getAgGridFieldMetadata = (target, propertyName) => {
    return (0, object_decorator_js_1.getYalcAgGridFieldMetadata)(target, propertyName);
};
exports.getAgGridFieldMetadata = getAgGridFieldMetadata;
const AgGridField = ({ gqlType, gqlOptions, ...options } = {}) => {
    return (target, property) => {
        (0, object_decorator_js_1.YalcAgGridField)({
            ...options,
            src: gqlOptions?.name ?? options.src ?? property.toString(),
        })(target, property);
        if (gqlOptions || gqlType) {
            if (gqlType) {
                (0, graphql_1.Field)(gqlType, gqlOptions)(target, property);
            }
            else {
                (0, graphql_1.Field)(gqlOptions)(target, property);
            }
        }
    };
};
exports.AgGridField = AgGridField;
//# sourceMappingURL=object.decorator.js.map