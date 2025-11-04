/**
 * Custom error classes for better error handling
 */

/**
 * Base API error class
 */
export class ApiError extends Error {
  public code?: string;
  public statusCode?: number;
  public details?: unknown;

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Check if error is an ApiError instance
   */
  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }

  /**
   * Convert any error to ApiError
   */
  static fromError(error: unknown, context?: string): ApiError {
    if (ApiError.isApiError(error)) {
      return error;
    }

    if (error instanceof Error) {
      return new ApiError(
        context ? `${context}: ${error.message}` : error.message,
      );
    }

    return new ApiError(
      context || 'An unknown error occurred',
      'UNKNOWN_ERROR',
    );
  }
}

/**
 * Authentication related errors
 */
export class AuthError extends ApiError {
  constructor(message: string, code?: string, details?: unknown) {
    super(message, code, 401, details);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * Resource not found errors
 */
export class NotFoundError extends ApiError {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with id "${id}" not found`
      : `${resource} not found`;
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Validation errors
 */
export class ValidationError extends ApiError {
  public fields?: Record<string, string[]>;

  constructor(message: string, fields?: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', 400, fields);
    this.name = 'ValidationError';
    this.fields = fields;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Permission/authorization errors
 */
export class PermissionError extends ApiError {
  constructor(
    message: string = 'You do not have permission to perform this action',
  ) {
    super(message, 'PERMISSION_DENIED', 403);
    this.name = 'PermissionError';
    Object.setPrototypeOf(this, PermissionError.prototype);
  }
}

/**
 * Network/connection errors
 */
export class NetworkError extends ApiError {
  constructor(message: string = 'Network error occurred') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Helper to handle Supabase errors
 */
export function handleSupabaseError(
  error: { message: string; code?: string; details?: unknown },
  context?: string,
): ApiError {
  const message = context ? `${context}: ${error.message}` : error.message;

  // Map common Supabase error codes
  switch (error.code) {
    case 'PGRST116':
      return new NotFoundError(context || 'Resource');
    case '42501':
      return new PermissionError();
    case '23505':
      return new ValidationError(
        'Duplicate entry',
        error.details as Record<string, string[]>,
      );
    case '23503':
      return new ValidationError('Referenced item does not exist');
    default:
      return new ApiError(message, error.code);
  }
}

/**
 * Format error for user display
 */
export function formatErrorMessage(error: unknown): string {
  if (ApiError.isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}
