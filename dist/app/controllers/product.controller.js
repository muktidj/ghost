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
exports.ProductControllerV1 = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ProductControllerV1 {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { product_name, duration, city, province, amount, isActive } = req.body;
                if (!product_name || !duration || !amount || !isActive) {
                    res.status(400).json({ message: 'All fields are required' });
                }
                const result = yield prisma.products.create({
                    data: { product_name, duration, city, province, amount, isActive },
                });
                res
                    .status(201)
                    .json({ data: result, message: 'Successfully created product' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma.products.findMany();
                res.json({
                    data: result,
                    message: 'Successfully Get Data Products',
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
                const { product_name, duration, city, province, amount, isActive } = req.body;
                // Konversi ID ke number
                const productId = Number(id);
                if (isNaN(productId)) {
                    return res.status(400).json({ message: 'Invalid product ID' });
                }
                // Pastikan isActive adalah enum yang valid
                if (!['Active', 'Inactive'].includes(isActive)) {
                    return res.status(400).json({ message: 'Invalid value for isActive. Must be "Active" or "Inactive".' });
                }
                // Update data
                const result = yield prisma.products.update({
                    where: { id_product: productId },
                    data: {
                        product_name,
                        duration,
                        city,
                        province,
                        amount,
                        isActive: isActive, // Konversi ke enum Prisma
                    },
                });
                res.json({
                    data: result,
                    message: 'Successfully updated product',
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
                const { id_product } = req.params;
                // Pastikan id_product dikonversi ke angka jika id_product bertipe Int
                const productId = parseInt(id_product, 10);
                if (isNaN(productId)) {
                    res.status(400).json({ message: 'Invalid product ID' });
                }
                const result = yield prisma.products.delete({
                    where: {
                        id_product: productId, // Sesuaikan dengan nama kolom di model Prisma
                    },
                });
                res.json({
                    message: `Successfully deleted product with ID ${productId}`,
                    data: result,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ProductControllerV1 = ProductControllerV1;
