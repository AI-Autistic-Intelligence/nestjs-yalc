import { Transform } from 'class-transformer';
export function ParseInt() {
    return Transform(({ value }) => parseInt(value, 10));
}
//# sourceMappingURL=class-transformer.helper.js.map