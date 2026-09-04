"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpExceptionStatusCodes = exports.getHttpStatusDescription = exports.HttpStatusCodes = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
exports.HttpStatusCodes = Object.assign(Object.assign({}, common_1.HttpStatus), axios_1.HttpStatusCode);
const httpStatusDescriptions = {
    [common_1.HttpStatus.CONTINUE]: '100: Request received, server awaiting further info.',
    [common_1.HttpStatus.SWITCHING_PROTOCOLS]: '101: Client asked server to switch protocols.',
    [common_1.HttpStatus.PROCESSING]: '102: Server processing request, no response yet.',
    [common_1.HttpStatus.OK]: '200: Request successful and response provided.',
    [common_1.HttpStatus.CREATED]: '201: Request completed, and resource created.',
    [common_1.HttpStatus.ACCEPTED]: '202: Request accepted but processing not complete.',
    [common_1.HttpStatus.NON_AUTHORITATIVE_INFORMATION]: '203: Info from another source returned.',
    [common_1.HttpStatus.NO_CONTENT]: '204: Request succeeded with no content to send.',
    [common_1.HttpStatus.RESET_CONTENT]: '205: Client should reset document view.',
    [common_1.HttpStatus.PARTIAL_CONTENT]: '206: Partial resource returned due to range header.',
    [common_1.HttpStatus.MOVED_PERMANENTLY]: '301: Resource moved permanently.',
    [common_1.HttpStatus.FOUND]: '302: Resource temporarily moved, use given URI.',
    [common_1.HttpStatus.SEE_OTHER]: '303: Response found elsewhere, use GET for that.',
    [common_1.HttpStatus.NOT_MODIFIED]: '304: Resource not modified since last request.',
    [common_1.HttpStatus.TEMPORARY_REDIRECT]: '307: Resource temporarily moved, but use same method.',
    [common_1.HttpStatus.PERMANENT_REDIRECT]: '308: Resource moved permanently, use same method.',
    [common_1.HttpStatus.BAD_REQUEST]: "400: Server couldn't understand request due to invalid syntax.",
    [common_1.HttpStatus.UNAUTHORIZED]: '401: Authentication needed for request.',
    [common_1.HttpStatus.PAYMENT_REQUIRED]: '402: Payment required for this resource.',
    [common_1.HttpStatus.FORBIDDEN]: '403: Server understood but refuses to authorize.',
    [common_1.HttpStatus.NOT_FOUND]: "404: Server can't find the requested resource.",
    [common_1.HttpStatus.METHOD_NOT_ALLOWED]: '405: HTTP method not allowed for resource.',
    [common_1.HttpStatus.NOT_ACCEPTABLE]: "406: Resource doesn't match criteria.",
    [common_1.HttpStatus.PROXY_AUTHENTICATION_REQUIRED]: '407: Proxy authentication required.',
    [common_1.HttpStatus.REQUEST_TIMEOUT]: '408: Server timed out waiting for request.',
    [common_1.HttpStatus.CONFLICT]: '409: Request conflict with server state.',
    [common_1.HttpStatus.GONE]: '410: Resource requested is no longer available.',
    [common_1.HttpStatus.LENGTH_REQUIRED]: '411: Length of request not specified.',
    [common_1.HttpStatus.PRECONDITION_FAILED]: '412: Precondition for request not met.',
    [common_1.HttpStatus.PAYLOAD_TOO_LARGE]: '413: Request payload too large.',
    [common_1.HttpStatus.URI_TOO_LONG]: '414: URI requested is too long.',
    [common_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE]: '415: Media type not supported.',
    [common_1.HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE]: '416: Range specified is invalid.',
    [common_1.HttpStatus.EXPECTATION_FAILED]: "417: Server can't meet request expectation.",
    [common_1.HttpStatus.I_AM_A_TEAPOT]: "418: I'm a teapot (April Fools joke).",
    [common_1.HttpStatus.UNPROCESSABLE_ENTITY]: '422: Request understandable, but semantically wrong.',
    [common_1.HttpStatus.FAILED_DEPENDENCY]: "424: Request failed due to server's previous request.",
    [common_1.HttpStatus.PRECONDITION_REQUIRED]: '428: Precondition required for request.',
    [common_1.HttpStatus.TOO_MANY_REQUESTS]: '429: Too many requests from this client.',
    [axios_1.HttpStatusCode.UnavailableForLegalReasons]: '451: Unavailable due to legal reasons.',
    [common_1.HttpStatus.INTERNAL_SERVER_ERROR]: "500: Server faced an error and can't provide response.",
    [common_1.HttpStatus.NOT_IMPLEMENTED]: "501: Server doesn't support functionality needed.",
    [common_1.HttpStatus.BAD_GATEWAY]: '502: Server got invalid response from upstream server.',
    [common_1.HttpStatus.SERVICE_UNAVAILABLE]: '503: Server not ready to handle request.',
    [common_1.HttpStatus.GATEWAY_TIMEOUT]: "504: Server didn't get response from another server.",
    [common_1.HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: "505: Server doesn't support HTTP protocol version.",
};
const getHttpStatusDescription = (status, fallbackDescription = 'Unknown status code') => {
    var _a;
    return (_a = httpStatusDescriptions[status]) !== null && _a !== void 0 ? _a : fallbackDescription;
};
exports.getHttpStatusDescription = getHttpStatusDescription;
exports.httpExceptionStatusCodes = {
    [common_1.BadRequestException.name]: common_1.HttpStatus.BAD_REQUEST,
    [common_1.UnauthorizedException.name]: common_1.HttpStatus.UNAUTHORIZED,
    [common_1.ForbiddenException.name]: common_1.HttpStatus.FORBIDDEN,
    [common_1.NotFoundException.name]: common_1.HttpStatus.NOT_FOUND,
    [common_1.MethodNotAllowedException.name]: common_1.HttpStatus.METHOD_NOT_ALLOWED,
    [common_1.NotAcceptableException.name]: common_1.HttpStatus.NOT_ACCEPTABLE,
    [common_1.RequestTimeoutException.name]: common_1.HttpStatus.REQUEST_TIMEOUT,
    [common_1.ConflictException.name]: common_1.HttpStatus.CONFLICT,
    [common_1.GoneException.name]: common_1.HttpStatus.GONE,
    [common_1.PreconditionFailedException.name]: common_1.HttpStatus.PRECONDITION_FAILED,
    [common_1.PayloadTooLargeException.name]: common_1.HttpStatus.PAYLOAD_TOO_LARGE,
    [common_1.UnsupportedMediaTypeException.name]: common_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    [common_1.UnprocessableEntityException.name]: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
    [common_1.InternalServerErrorException.name]: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
    [common_1.NotImplementedException.name]: common_1.HttpStatus.NOT_IMPLEMENTED,
    [common_1.BadGatewayException.name]: common_1.HttpStatus.BAD_GATEWAY,
    [common_1.ServiceUnavailableException.name]: common_1.HttpStatus.SERVICE_UNAVAILABLE,
    [common_1.GatewayTimeoutException.name]: common_1.HttpStatus.GATEWAY_TIMEOUT,
    [common_1.HttpException.name]: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
    [common_1.MisdirectedException.name]: common_1.HttpStatus.MISDIRECTED,
};
//# sourceMappingURL=http.helper.js.map