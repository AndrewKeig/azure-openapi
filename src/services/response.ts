import { Response, ErrorResponse } from '../interfaces';

export const responseHandler = <T>(status: number, body: T): Response<T> => {
  return { status, body };
};

export const errorResponse = (err: string): ErrorResponse => {
  return {
    status: 500,
    errors: [
      {
        errorCode: 'error',
        message: err,
        location: 'server',
      },
    ],
  };
};
