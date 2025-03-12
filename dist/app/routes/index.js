"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const v1_1 = require("./v1");
const middlewares_1 = require("../middlewares");
const app = express_1.default.Router();
app.use('/auth', v1_1.authRouteV1);
app.use('/users', middlewares_1.authorizationJWT, v1_1.userRouteV1);
app.use('/products', middlewares_1.authorizationJWT, v1_1.productRouteV1);
exports.default = app;
