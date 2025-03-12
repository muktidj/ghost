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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationJWT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../../utils");
dotenv_1.default.config();
const authorizationJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = req.headers.authorization;
    try {
        if (!authToken) {
            throw new utils_1.HttpException(401, 'Unauthorized');
        }
        const token = authToken.split(' ');
        if (token[0] !== 'Bearer') {
            throw new utils_1.HttpException(401, 'Invalid Type Token');
        }
        const jwtKey = process.env.JWT_SECRET_KEY;
        if (!jwtKey) {
            throw new Error("JWT Secret key is missing in environment variables.");
        }
        const result = jsonwebtoken_1.default.verify(token[1], jwtKey);
        req.user = result; // Simpan data user di req.user
        next();
    }
    catch (e) {
        console.error("JWT Verification Error:", e.message);
        next(e);
    }
});
exports.authorizationJWT = authorizationJWT;
