"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./app/routes"));
const middlewares_1 = require("./app/middlewares");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const corsOpts = {
    origin: [
        'http://localhost:5000',
        'https://dev-web-order.whitehorse.id',
        'https://order.whitehorse.id',
        'https://stg-web-order.whitehorse.id',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    optionsSuccessStatus: 200,
};
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json({ limit: '3mb' }));
app.use((0, cors_1.default)(corsOpts));
app.use(routes_1.default);
app.use(middlewares_1.notFound);
app.use(middlewares_1.handleError);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
