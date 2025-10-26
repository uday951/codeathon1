/**
 * HTTP client utility for making OAuth requests
 */

import axios, { AxiosResponse, AxiosError } from 'axios';
import { logger } from './logger';
import { OAuthError } from '../errors/CustomError';

export class HttpClient {
  /**
   * Make a GET request
   */
  static async get<T>(url: string, headers?: Record<string, string>, provider?: string): Promise<T> {
    try {
      logger.debug(`Making GET request to ${url}`, provider);
      const response: AxiosResponse<T> = await axios.get(url, { headers });
      logger.debug(`GET request successful: ${response.status}`, provider);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError, provider);
      throw error;
    }
  }

  /**
   * Make a POST request
   */
  static async post<T>(url: string, data?: any, headers?: Record<string, string>, provider?: string): Promise<T> {
    try {
      logger.debug(`Making POST request to ${url}`, provider);
      const response: AxiosResponse<T> = await axios.post(url, data, { headers });
      logger.debug(`POST request successful: ${response.status}`, provider);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError, provider);
      throw error;
    }
  }

  private static handleError(error: AxiosError, provider?: string): void {
    const status = error.response?.status;
    const message = error.response?.data || error.message;
    logger.error(`HTTP request failed: ${status} - ${message}`, provider, error);
  }
}