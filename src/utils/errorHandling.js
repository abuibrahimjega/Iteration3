// src/utils/errorHandling.js
export class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.errorCallbacks = [];

    // Global error handling
    window.addEventListener("error", (event) => {
      this.handleError({
        type: "unhandled",
        error: event.error,
        timestamp: new Date(),
      });
    });

    // Unhandled Promise rejection handling
    window.addEventListener("unhandledrejection", (event) => {
      this.handleError({
        type: "unhandledPromise",
        error: event.reason,
        timestamp: new Date(),
      });
    });
  }

  handleError(errorInfo) {
    // Log the error
    this.errorLog.push(errorInfo);

    // If log exceeds 100 entries, remove oldest
    if (this.errorLog.length > 100) {
      this.errorLog.shift();
    }

    // Send to any registered callbacks
    this.errorCallbacks.forEach((callback) => callback(errorInfo));

    // Optionally send to a logging service
    this.sendToLoggingService(errorInfo);
  }

  onError(callback) {
    this.errorCallbacks.push(callback);
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter((cb) => cb !== callback);
    };
  }

  sendToLoggingService(errorInfo) {
    // Example implementation - replace with actual service call
    console.log("Sending to logging service:", errorInfo);
    // fetch('https://your-logging-service.com/log', {
    //   method: 'POST',
    //   body: JSON.stringify(errorInfo)
    // });
  }
}

export const globalErrorHandler = new ErrorHandler();
