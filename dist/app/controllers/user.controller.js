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
exports.UserControllerV1 = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const client_1 = require("@prisma/client");
const utils_1 = require("../../utils");
const prisma = new client_1.PrismaClient();
class UserControllerV1 {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, age, password, email, pekerjaan } = req.body;
                if (!name || !age || !password || !email) {
                    return res.status(400).json({ message: 'All fields are required' });
                }
                // Cek apakah email sudah digunakan
                const existingUser = yield prisma.users.findFirst({ where: { email } });
                if (existingUser) {
                    return res.status(400).json({ message: 'Email is already in use' });
                }
                const hashedPassword = (0, utils_1.encrypt)(password);
                const result = yield prisma.users.create({
                    data: { name, age, password: hashedPassword, email, pekerjaan },
                });
                res
                    .status(201)
                    .json({ data: result, message: 'Successfully created user' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma.users.findMany();
                res.status(200).json(users);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getFindOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                //     Cari berdasarkan user id
                const user = yield prisma.users.findUnique({
                    where: { id: Number(id) },
                });
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "User found with id " + id,
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, age, password, email, pekerjaan } = req.body;
                const result = yield prisma.users.update({
                    data: {
                        name: name,
                        age: age,
                        password: password,
                        email: email,
                        pekerjaan: pekerjaan,
                    },
                    where: {
                        id: Number(id),
                    },
                });
                res.json({
                    data: result,
                    message: 'Successfully update user',
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield prisma.users.delete({
                    where: {
                        id: Number(id),
                    },
                });
                res.json({ message: 'Successfully delete user' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static exportToExcel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma.users.findMany();
                const workbook = new exceljs_1.default.Workbook();
                const worksheet = workbook.addWorksheet('Users');
                // Definisikan Header
                worksheet.columns = [
                    { header: 'ID', key: 'id', width: 10 },
                    { header: 'Name', key: 'name', width: 20 },
                    { header: 'Age', key: 'age', width: 10 },
                    { header: 'Email', key: 'email', width: 25 },
                    { header: 'Pekerjaan', key: 'pekerjaan', width: 20 },
                ];
                // Tambahkan data ke worksheet
                users.forEach(user => {
                    worksheet.addRow(user);
                });
                // Atur respons HTTP
                const buffer = yield workbook.xlsx.writeBuffer();
                res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.send(buffer);
                // Simpan ke stream dan kirim ke response
                yield workbook.xlsx.write(res);
                res.end();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserControllerV1 = UserControllerV1;
