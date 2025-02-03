import { Response } from 'express';

export interface ISuccessResponse {
  success?: boolean;
  code?: number;
  message: string;
  data?: any;
  pagination?: ResponsePaginationDto;
}

export interface IErrorResponse {
  success: boolean;
  code: number;
  message: string;
  error: IErrorField[] | null;
}

export interface IErrorField {
  field: string;
  message: string[];
}

export interface ResponsePaginationDto {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
}

export const resSuccess = (data: ISuccessResponse, res: Response) => {
  const newData = {
    code: data.code ? data.code : 200,
    message: data.message ? data.message : 'SUCCESS',
    success: true,
    data: data.data ? data.data : undefined,
    pagination: data.pagination ? data.pagination : undefined
  };

  res.status(newData.code).json(newData);
  res.end();
};

export const resError = (err: IErrorResponse, res: Response) => {
  const newData: IErrorResponse = {
    code: err.code ? err.code : 500,
    message: err.message ? err.message : 'ERROR',
    success: false,
    error: err.error ? err.error : []
  };

  res.status(newData.code).json(newData);
  res.end();
};

export class HttpException extends Error {
  code: number = 500;
  message: string = 'Internal Server Error';
  error: any;
  constructor(code: number, message: string, error?: any) {
    super(message);
    this.code = code;
    this.message = message;
    this.error = error;
  }
}

export const resPagination = (
  page: number,
  limit: number,
  total: number
): ResponsePaginationDto => {
  return {
    currentPage: page + 1,
    total,
    lastPage: Math.ceil(total / limit),
    perPage: limit
  };
};
