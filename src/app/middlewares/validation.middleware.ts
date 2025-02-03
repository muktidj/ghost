import { NextFunction, Request, Response } from 'express';
import { IErrorResponse } from '../../utils';
import { ObjectSchema } from 'yup';

export const validateRequest = (schema: ObjectSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const valid = await schema.validate(req.body, { abortEarly: false });
      req.body = valid;
      next();
    } catch (e: any) {
      const error: IErrorResponse = {
        code: 422,
        success: false,
        error: e,
        message: 'Mohon cek kembali inputan data yang dimasukkan'
      };
      next(error);
    }
  };
};
