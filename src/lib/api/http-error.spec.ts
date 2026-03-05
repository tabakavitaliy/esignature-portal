import { describe, it, expect } from 'vitest';
import { HttpError } from './http-error';

describe('HttpError', () => {
  it('creates an instance with message and status', () => {
    const error = new HttpError('Not Found', 404);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HttpError);
    expect(error.message).toBe('Not Found');
    expect(error.status).toBe(404);
    expect(error.name).toBe('HttpError');
  });

  it('preserves error stack trace', () => {
    const error = new HttpError('Server Error', 500);

    expect(error.stack).toBeDefined();
  });

  it('handles different status codes', () => {
    const error404 = new HttpError('Not Found', 404);
    const error500 = new HttpError('Internal Server Error', 500);
    const error403 = new HttpError('Forbidden', 403);

    expect(error404.status).toBe(404);
    expect(error500.status).toBe(500);
    expect(error403.status).toBe(403);
  });

  it('can be caught and inspected', () => {
    try {
      throw new HttpError('Unauthorized', 401);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      if (error instanceof HttpError) {
        expect(error.status).toBe(401);
        expect(error.message).toBe('Unauthorized');
      }
    }
  });
});
