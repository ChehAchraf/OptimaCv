/**
 * Centralized Logging Utility
 * Provides structured logging with different levels
 * Can be easily integrated with external logging services (Sentry, LogRocket, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    [key: string]: any;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';
    private isServer = typeof window === 'undefined';

    /**
     * Format log message with context
     */
    private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
        const location = this.isServer ? '[SERVER]' : '[CLIENT]';

        let formatted = `${prefix} ${location} ${message}`;

        if (context && Object.keys(context).length > 0) {
            formatted += `\n${JSON.stringify(context, null, 2)}`;
        }

        return formatted;
    }

    /**
     * Send logs to external service (placeholder for integration)
     */
    private sendToExternalService(level: LogLevel, message: string, context?: LogContext) {
        // TODO: Integrate with Sentry, LogRocket, or other logging service
        // Example:
        // if (level === 'error') {
        //   Sentry.captureException(new Error(message), { extra: context });
        // }
    }

    /**
     * Debug level logging (development only)
     */
    debug(message: string, context?: LogContext) {
        if (this.isDevelopment) {
            console.debug(this.formatMessage('debug', message, context));
        }
    }

    /**
     * Info level logging
     */
    info(message: string, context?: LogContext) {
        const formatted = this.formatMessage('info', message, context);
        console.info(formatted);

        if (!this.isDevelopment) {
            this.sendToExternalService('info', message, context);
        }
    }

    /**
     * Warning level logging
     */
    warn(message: string, context?: LogContext) {
        const formatted = this.formatMessage('warn', message, context);
        console.warn(formatted);

        this.sendToExternalService('warn', message, context);
    }

    /**
     * Error level logging
     */
    error(message: string, error?: Error, context?: LogContext) {
        const errorContext = {
            ...context,
            errorMessage: error?.message,
            errorStack: error?.stack,
        };

        const formatted = this.formatMessage('error', message, errorContext);
        console.error(formatted);

        this.sendToExternalService('error', message, errorContext);
    }

    /**
     * Log user action for analytics
     */
    userAction(action: string, metadata?: LogContext) {
        this.info(`User action: ${action}`, metadata);
    }

    /**
     * Log API call
     */
    api(method: string, endpoint: string, metadata?: LogContext) {
        this.debug(`API ${method} ${endpoint}`, metadata);
    }

    /**
     * Log performance metric
     */
    performance(metric: string, value: number, unit: string = 'ms') {
        this.info(`Performance: ${metric}`, { value, unit });
    }
}

// Export singleton instance
export const logger = new Logger();

// Helper function for Server Actions
export function logServerAction(actionName: string, userId?: string, metadata?: LogContext) {
    logger.info(`Server Action: ${actionName}`, {
        userId,
        ...metadata,
    });
}

// Helper function for API routes
export function logApiRequest(method: string, path: string, statusCode?: number, metadata?: LogContext) {
    logger.api(method, path, {
        statusCode,
        ...metadata,
    });
}
