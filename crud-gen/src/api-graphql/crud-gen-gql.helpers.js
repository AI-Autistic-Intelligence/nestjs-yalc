export const isAskingForCount = (info) => {
    try {
        return (info.fieldNodes?.[0]?.selectionSet?.selections.some((item) => {
            return (item.name.value === 'pageData' &&
                item.selectionSet &&
                item.selectionSet.selections.some((subItem) => subItem.name.value === 'count'));
        }) ?? false);
    }
    catch (e) {
        // quick way to avoid having dozens of conditions to check the info structure
        return false;
    }
};
//# sourceMappingURL=crud-gen-gql.helpers.js.map