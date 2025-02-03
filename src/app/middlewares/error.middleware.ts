import { NextFunction, Response, Request } from 'express';
import { HttpException, IErrorField, IErrorResponse, resError } from '../../utils';
import { ValidationError } from 'yup';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new HttpException(404, 'Not Found');
  next(error);
};

export const handleError = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err); // If headers are already sent, delegate to default error handler
  }

  if (typeof err.code === 'number') {
    const dataError: IErrorResponse = {
      code: err.code || 500,
      message: err.message || 'Internal Server Error',
      error: err.error,
      success: false
    };

    const groupedErrors: { [key: string]: IErrorField } = {};

    if (dataError.error) {
      if (err.code == 422) {
        const errors: ValidationError = err.error;
        if (errors.inner.length > 0) {
          errors.inner.forEach((el: ValidationError) => {
            const field = el.path as string;

            if (!groupedErrors[field]) {
              groupedErrors[field] = {
                field,
                message: [...el.errors]
              } as IErrorField;
            } else {
              groupedErrors[field].message.push(...el.errors);
            }
          });
        }
      } else {
        err.error.forEach((el: IErrorField) => {
          groupedErrors[el.field] = {
            field: el.field,
            message: el.message
          };
        });
      }
    }

    // remove key and get the value only
    const result = Object.values(groupedErrors);

    resError(
      {
        code: dataError.code,
        message: dataError.message,
        error: result,
        success: dataError.success
      },
      res
    );
  } else {
    if (err.code === 'ECONNABORTED') {
      resError(
        { code: 504, message: err.message, success: false, error: [] },
        res
      );
    } else {
      console.error(err);
      resError(
        { code: 500, message: err.message, success: false, error: [] },
        res
      );
    }
  }
};
