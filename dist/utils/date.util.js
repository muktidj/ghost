"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todayDate = exports.responseDate = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const responseDate = (date, timezone = null) => {
    if (timezone)
        (0, dayjs_1.default)(date).add(timezone, 'hour').toDate();
    return (0, dayjs_1.default)(date).add(7, 'hour').toDate();
};
exports.responseDate = responseDate;
const todayDate = () => {
    return (0, dayjs_1.default)().toDate();
};
exports.todayDate = todayDate;
