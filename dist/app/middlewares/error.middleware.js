"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.notFound = void 0;
const utils_1 = require("../../utils");
const notFound = (req, res, next) => {
    const error = new utils_1.HttpException(404, 'Not Found');
    next(error);
};
exports.notFound = notFound;
const handleError = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err); // If headers are already sent, delegate to default error handler
    }
    if (typeof err.code === 'number') {
        const dataError = {
            code: err.code || 500,
            message: err.message || 'Internal Server Error',
            error: err.error,
            success: false
        };
        const groupedErrors = {};
        if (dataError.error) {
            if (err.code == 422) {
                const errors = err.error;
                if (errors.inner.length > 0) {
                    errors.inner.forEach((el) => {
                        const field = el.path;
                        if (!groupedErrors[field]) {
                            groupedErrors[field] = {
                                field,
                                message: [...el.errors]
                            };
                        }
                        else {
                            groupedErrors[field].message.push(...el.errors);
                        }
                    });
                }
            }
            else {
                err.error.forEach((el) => {
                    groupedErrors[el.field] = {
                        field: el.field,
                        message: el.message
                    };
                });
            }
        }
        // remove key and get the value only
        const result = Object.values(groupedErrors);
        (0, utils_1.resError)({
            code: dataError.code,
            message: dataError.message,
            error: result,
            success: dataError.success
        }, res);
    }
    else {
        if (err.code === 'ECONNABORTED') {
            (0, utils_1.resError)({ code: 504, message: err.message, success: false, error: [] }, res);
        }
        else {
            console.error(err);
            (0, utils_1.resError)({ code: 500, message: err.message, success: false, error: [] }, res);
        }
    }
};
exports.handleError = handleError;
