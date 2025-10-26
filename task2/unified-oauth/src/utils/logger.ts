/**
 * Logging utility for OAuth operations
 */

import { LoggerOptions } from '../types';

export class Logger {
  private options: LoggerOptions;

  constructor(options: Partial<LoggerOptions> = {}) {
    this.options = {
      level: options.level || 'INFO',
      timestamp: options.timestamp !== false
    };
  }

  private formatMessage(level: string, message: string, provider?: string): string {
    const timestamp = this.options.timestamp ? new Date().toISOString() : '';
    const providerInfo = provider ? `[${provider}]` : '';
    return `${timestamp} [${level}] ${providerInfo} ${message}`.trim();
  }

  private shouldLog(level: string): boolean {
    const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    const currentLevelIndex = levels.indexOf(this.options.level);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  debug(message: string, provider?: string): void {
    if (this.shouldLog('DEBUG')) {
      console.debug(this.formatMessage('DEBUG', message, provider));
    }
  }

  info(message: string, provider?: string): void {
    if (this.shouldLog('INFO')) {
      console.info(this.formatMessage('INFO', message, provider));
    }
  }

  warn(message: string, provider?: string): void {
    if (this.shouldLog('WARN')) {
      console.warn(this.formatMessage('WARN', message, provider));
    }
  }

  error(message: string, provider?: string, error?: Error): void {
    if (this.shouldLog('ERROR')) {
      console.error(this.formatMessage('ERROR', message, provider));
      if (error) {
        console.error(error.stack);
      }
    }
  }
}

export const logger = new Logger();