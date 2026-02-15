"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestContext = requestContext;
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const node_crypto_1 = require("node:crypto");
const errors_1 = require("./errors");
function requestContext(req, res, next) {
    const requestIdHeader = req.header("x-request-id");
    const requestId = requestIdHeader && requestIdHeader.trim().length > 0 ? requestIdHeader : (0, node_crypto_1.randomUUID)();
    res.locals.requestId = requestId;
    res.setHeader("x-request-id", requestId);
    next();
}
function notFoundHandler(_req, res) {
    res.status(404).json({
        error: {
            code: "NOT_FOUND",
            message: "Route not found",
        },
        request_id: res.locals.requestId,
    });
}
function errorHandler(error, _req, res, _next) {
    if (error instanceof errors_1.AppError) {
        res.status(error.statusCode).json({
            error: {
                code: error.code,
                message: error.message,
                details: error.details,
            },
            request_id: res.locals.requestId,
        });
        return;
    }
    res.status(500).json({
        error: {
            code: "INTERNAL_ERROR",
            message: "Unexpected error",
        },
        request_id: res.locals.requestId,
    });
}
