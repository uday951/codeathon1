"use strict";
/**
 * Logging utility for OAuth operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
class Logger {
    constructor(options = {}) {
        this.options = {
            level: options.level || 'INFO',
            timestamp: options.timestamp !== false
        };
    }
    formatMessage(level, message, provider) {
        const timestamp = this.options.timestamp ? new Date().toISOString() : '';
        const providerInfo = provider ? `[${provider}]` : '';
        return `${timestamp} [${level}] ${providerInfo} ${message}`.trim();
    }
    shouldLog(level) {
        const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
        const currentLevelIndex = levels.indexOf(this.options.level);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex >= currentLevelIndex;
    }
    debug(message, provider) {
        if (this.shouldLog('DEBUG')) {
            console.debug(this.formatMessage('DEBUG', message, provider));
        }
    }
    info(message, provider) {
        if (this.shouldLog('INFO')) {
            console.info(this.formatMessage('INFO', message, provider));
        }
    }
    warn(message, provider) {
        if (this.shouldLog('WARN')) {
            console.warn(this.formatMessage('WARN', message, provider));
        }
    }
    error(message, provider, error) {
        if (this.shouldLog('ERROR')) {
            console.error(this.formatMessage('ERROR', message, provider));
            if (error) {
                console.error(error.stack);
            }
        }
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map