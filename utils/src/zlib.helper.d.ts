import { InputType } from 'zlib';
export declare const inflate: (input: string) => string;
export declare const deflate: (input: InputType) => Buffer | InputType;
