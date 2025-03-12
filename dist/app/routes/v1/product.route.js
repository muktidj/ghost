"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouteV1 = void 0;
const express_1 = require("express");
const controllers_1 = require("../../controllers");
exports.productRouteV1 = (0, express_1.Router)();
exports.productRouteV1.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield controllers_1.ProductControllerV1.getAll(req, res, next);
}));
exports.productRouteV1.post('/create', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield controllers_1.ProductControllerV1.create(req, res, next);
}));
exports.productRouteV1.put('/update/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield controllers_1.ProductControllerV1.update(req, res, next);
}));
exports.productRouteV1.delete('/delete/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield controllers_1.ProductControllerV1.delete(req, res, next);
}));
