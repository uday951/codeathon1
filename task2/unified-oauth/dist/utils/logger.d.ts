/**
 * Logging utility for OAuth operations
 */
import { LoggerOptions } from '../types';
export declare class Logger {
    private options;
    constructor(options?: Partial<LoggerOptions>);
    private formatMessage;
    private shouldLog;
    debug(message: string, provider?: string): void;
    info(message: string, provider?: string): void;
    warn(message: string, provider?: string): void;
    error(message: string, provider?: string, error?: Error): void;
}
export declare const logger: Logger;
//# sourceMappingURL=logger.d.ts.map