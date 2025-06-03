import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/Task';

/**
 * Global error handling middleware
 * This middleware catches all unhandled errors and returns a consistent error response
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Unhandled error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const response: ApiResponse<null> = {
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  };

  res.status(500).json(response);
};

/**
 * 404 Not Found middleware
 * This middleware handles requests to non-existent routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response: ApiResponse<null> = {
    success: false,
    error: `Route ${req.method} ${req.url} not found`
  };

  res.status(404).json(response);
};

/**
 * Request logging middleware
 * This middleware logs all incoming requests for debugging purposes
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  
  next();
};
