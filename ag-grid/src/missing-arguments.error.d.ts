import { BadRequestException } from '@nestjs/common';
export declare class ArgumentsError extends BadRequestException {
    constructor(message: string);
}
export declare class MissingArgumentsError extends ArgumentsError {
    constructor(message?: string);
}
