"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouteV1 = void 0;
const express_1 = require("express");
const controllers_1 = require("../../controllers");
exports.authRouteV1 = (0, express_1.Router)();
exports.authRouteV1.post('/login', controllers_1.AuthControllerV1.login);
