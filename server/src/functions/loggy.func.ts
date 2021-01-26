/**
 * Global Log handler
 */
export default class Loggy {
    /**
     * Globally enable or disable logging
     * @constructor
     * @param loggingEnabled when set to false, only "error"-level logs will be shown
     */
    constructor(public loggingEnabled: boolean = false) {
    }

    /**
     * Log "log"-level data
     * @param data
     */
    public log(...data: unknown[]): void {
        if (!this.loggingEnabled) return;
        console.log('📗', ...data);
    }

    /**
     * Log "info"-level data
     * @param data
     */
    public info(...data: unknown[]): void {
        if (!this.loggingEnabled) return;
        console.info('📘', ...data);
    }

    /**
     * Log "warning"-level data
     * @param data
     */
    public warn(...data: unknown[]): void {
        if (!this.loggingEnabled) return;
        console.warn('📙', ...data);
    }

    /**
     * Log "error"-level data
     * @param data
     */
    public error(...data: unknown[]): void {
        console.error('📕', ...data, '\x1b[0m');
    }

}
