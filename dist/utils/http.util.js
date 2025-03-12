"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resPagination = exports.HttpException = exports.resError = exports.resSuccess = void 0;
const resSuccess = (data, res) => {
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
exports.resSuccess = resSuccess;
const resError = (err, res) => {
    const newData = {
        code: err.code ? err.code : 500,
        message: err.message ? err.message : 'ERROR',
        success: false,
        error: err.error ? err.error : []
    };
    res.status(newData.code).json(newData);
    res.end();
};
exports.resError = resError;
class HttpException extends Error {
    constructor(code, message, error) {
        super(message);
        this.code = 500;
        this.message = 'Internal Server Error';
        this.code = code;
        this.message = message;
        this.error = error;
    }
}
exports.HttpException = HttpException;
const resPagination = (page, limit, total) => {
    return {
        currentPage: page + 1,
        total,
        lastPage: Math.ceil(total / limit),
        perPage: limit
    };
};
exports.resPagination = resPagination;
