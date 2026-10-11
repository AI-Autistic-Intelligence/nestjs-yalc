/**
 * Abstract base class for HTTP-based API call strategies.
 * Provides convenience methods (get, post) that delegate to the abstract `call` method.
 * Concrete implementations must implement the `call` method for their specific transport mechanism
 * (e.g., Axios, Fastify inject, native fetch).
 * @example
 * ```typescript
 * class MyHttpStrategy extends HttpAbstractStrategy {
 *   async call<TOptData, TParams extends Record<string, unknown>, TResData>(
 *     path: string,
 *     options?: HttpOptions<TOptData, TParams>
 *   ): Promise<IHttpCallStrategyResponse<TResData>> {
 *     // Implementation using your HTTP client
 *     const response = await myHttpClient.request({ url: path, ...options });
 *     return { data: response.body, status: response.statusCode, ... };
 *   }
 * }
 * ```
 */
export class HttpAbstractStrategy {
    /**
     * Convenience method to execute an HTTP GET request.
     * Delegates to `call()` with method set to 'GET'.
     * @template TOptData - The type of request body data (typically unused for GET)
     * @template TParams - The shape of URL query parameters
     * @template TResData - The expected type of the response body
     * @param path - The URL path or full URL to request
     * @param options - HTTP request configuration (method will be overridden to GET)
     * @returns Promise resolving to the HTTP response with typed data
     */
    get(path, options) {
        return this.call(path, {
            ...options,
            method: 'GET',
        });
    }
    /**
     * Convenience method to execute an HTTP POST request.
     * Delegates to `call()` with method set to 'POST'.
     * @template TOptData - The type of request body data to send
     * @template TParams - The shape of URL query parameters
     * @template TResData - The expected type of the response body
     * @param path - The URL path or full URL to request
     * @param options - HTTP request configuration (method will be overridden to POST)
     * @returns Promise resolving to the HTTP response with typed data
     */
    post(path, options) {
        return this.call(path, {
            ...options,
            method: 'POST',
        });
    }
}
//# sourceMappingURL=http-abstract-call.strategy.js.map