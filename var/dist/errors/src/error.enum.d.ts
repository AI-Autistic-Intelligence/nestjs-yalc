export declare enum ErrorsEnum {
    BAD_REQUEST = "Bad request",
    INVALID_VALUE = "Invalid value",
    UNAUTHORIZED = "Unauthorized",
    BAD_LOGIN = "Bad login",
    PAYMENT_REQUIRED = "Payment required",
    FORBIDDEN = "Forbidden",
    FORBIDDEN_RESOURCE = "Forbidden resource",
    NOT_FOUND = "Not found",
    METHOD_NOT_ALLOWED = "Method not allowed",
    NOT_ACCEPTABLE = "Not acceptable",
    CONFLICT = "Conflict",
    GONE = "Gone",
    UNSUPPORTED_MEDIA_TYPE = "Unsupported media type",
    UNPROCESSABLE_ENTITY = "Unprocessable entity",
    UNAVAILABLE_FOR_LEGAL_REASONS = "Unavailable for legal reasons",
    TOO_MANY_REQUESTS = "Too many requests",
    INTERNAL_SERVER_ERROR = "Internal server error",
    NOT_IMPLEMENTED = "Not implemented",
    BAD_GATEWAY = "Bad gateway",
    SERVICE_UNAVAILABLE = "Service unavailable",
    GATEWAY_TIMEOUT = "Gateway timeout"
}
export declare const getHttpStatusNameByCode: (code: number) => string;
export declare enum ExceptionContextEnum {
    DATABASE = "DatabaseException",
    HTTP = "HttpException",
    SYSTEM = "SystemException"
}
