"use strict";
/**
 * HTTP client utility for making OAuth requests
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("./logger");
class HttpClient {
    /**
     * Make a GET request
     */
    static async get(url, headers, provider) {
        try {
            logger_1.logger.debug(`Making GET request to ${url}`, provider);
            const response = await axios_1.default.get(url, { headers });
            logger_1.logger.debug(`GET request successful: ${response.status}`, provider);
            return response.data;
        }
        catch (error) {
            this.handleError(error, provider);
            throw error;
        }
    }
    /**
     * Make a POST request
     */
    static async post(url, data, headers, provider) {
        try {
            logger_1.logger.debug(`Making POST request to ${url}`, provider);
            const response = await axios_1.default.post(url, data, { headers });
            logger_1.logger.debug(`POST request successful: ${response.status}`, provider);
            return response.data;
        }
        catch (error) {
            this.handleError(error, provider);
            throw error;
        }
    }
    static handleError(error, provider) {
        const status = error.response?.status;
        const message = error.response?.data || error.message;
        logger_1.logger.error(`HTTP request failed: ${status} - ${message}`, provider, error);
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=httpClient.js.map