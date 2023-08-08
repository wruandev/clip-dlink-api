/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

const errorResponder = (error: any, _request: Request, response: Response, _next: NextFunction) => {
  response.header('Content-Type', 'application/json');

  const status = error.status || 400;
  response.status(status).send({
    status: 'error',
    error: error.message,
  });
};

export { errorResponder };
