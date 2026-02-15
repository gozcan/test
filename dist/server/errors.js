"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.validationError = validationError;
exports.notFoundError = notFoundError;
class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(statusCode, code, message, details) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}
exports.AppError = AppError;
function validationError(message, details) {
    return new AppError(400, "VALIDATION_ERROR", message, details);
}
function notFoundError(message) {
    return new AppError(404, "NOT_FOUND", message);
}
