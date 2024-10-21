"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
// Response utility function
const sendResponse = (res, { status, message, data, error }) => {
    res.status(status).json(Object.assign(Object.assign({ status,
        message }, (data && { data })), (error && { error })));
};
exports.sendResponse = sendResponse;
