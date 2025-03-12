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
exports.AuthControllerV1 = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../../utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthControllerV1 {
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prisma = new client_1.PrismaClient();
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({ message: 'Email and password are required' });
                    return;
                }
                const user = yield prisma.users.findFirst({
                    where: {
                        email: String(email),
                    },
                });
                if (!user) {
                    res.status(401).json({ message: 'Invalid email or password' });
                    return;
                }
                const isPasswordValid = yield (0, utils_1.compareEncrypt)(password, user.password);
                if (!isPasswordValid) {
                    res.status(401).json({ message: 'Invalid email or password' });
                    return;
                }
                // Generate JWT token
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY || 'your-secret-key', // Gunakan environment variable untuk secret key
                { expiresIn: '1h' } // Token akan kadaluarsa dalam 1 jam
                );
                res.status(200).json({
                    message: 'Login successful',
                    user: { id: user.id, name: user.name, email: user.email },
                    token: token // Kirim token ke client
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.AuthControllerV1 = AuthControllerV1;
