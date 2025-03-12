"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthcheck = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const healthcheck = (req, res) => {
    const data = {
        message: 'Ok',
        uptime: (0, dayjs_1.default)()
            .subtract(process.uptime(), 'second')
            .format('YYYY-MM-DD HH:mm:ss'),
        date: (0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss')
    };
    res.status(200).send(data);
};
exports.healthcheck = healthcheck;
