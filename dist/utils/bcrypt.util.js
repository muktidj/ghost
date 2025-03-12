"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareEncrypt = exports.encrypt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const encrypt = (data) => {
    const saltRounds = 10;
    return bcrypt_1.default.hashSync(data, saltRounds);
};
exports.encrypt = encrypt;
const compareEncrypt = (data, hash) => {
    const replaceHash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
    return bcrypt_1.default.compareSync(data, replaceHash);
};
exports.compareEncrypt = compareEncrypt;
