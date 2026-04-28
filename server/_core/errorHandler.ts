import { Express, Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class ErrorHandler {
  static handle(err: AppError, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    // Log error
    console.error(`[${new Date().toISOString()}] ${statusCode} - ${message}`, {
      path: req.path,
      method: req.method,
      stack: err.stack,
    });
    
    // Send response
    res.status(statusCode).json({
      success: false,
      error: {
        message,
        statusCode,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    });
  }

  static asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

export function setupErrorHandling(app: Express) {
  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: { message: 'Not Found', statusCode: 404 },
    });
  });

  // Global error handler
  app.use(ErrorHandler.handle);
}
