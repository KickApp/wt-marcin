import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
}

export function errorHandler(
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('ERROR', (err as any)?.response.data ?? err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || 500;
  console.error(err.message, err.stack);

  res.status(statusCode).json({
    message: err.message || 'An unexpected error occurred',
    statusCode,
  });
}
