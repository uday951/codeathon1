/**
 * HTTP client utility for making OAuth requests
 */
export declare class HttpClient {
    /**
     * Make a GET request
     */
    static get<T>(url: string, headers?: Record<string, string>, provider?: string): Promise<T>;
    /**
     * Make a POST request
     */
    static post<T>(url: string, data?: any, headers?: Record<string, string>, provider?: string): Promise<T>;
    private static handleError;
}
//# sourceMappingURL=httpClient.d.ts.map