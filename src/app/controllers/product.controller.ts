import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestWithAuth } from '../../types/express';
import { Enum } from '@prisma/client';


const prisma = new PrismaClient();

export class ProductControllerV1 {
    static async create(req: RequestWithAuth, res: Response, next: NextFunction) {
        try {

            const { product_name, duration, city, province, amount, isActive } =
                req.body;

            if (!product_name || !duration || !amount || !isActive) {
                res.status(400).json({ message: 'All fields are required' });
            }

            const result = await prisma.products.create({
                data: { product_name, duration, city, province, amount, isActive },
            });
            res
                .status(201)
                .json({ data: result, message: 'Successfully created product' });
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req: RequestWithAuth, res: Response, next: NextFunction) {
        try {
            const result = await prisma.products.findMany();
            res.json({
                data: result,
                message: 'Successfully Get Data Products',
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: RequestWithAuth, res: Response, next: NextFunction) {
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
            const result = await prisma.products.update({
                where: { id_product: productId },
                data: {
                    product_name,
                    duration,
                    city,
                    province,
                    amount,
                    isActive: isActive as Enum, // Konversi ke enum Prisma
                },
            });

            res.json({
                data: result,
                message: 'Successfully updated product',
            });
        } catch (error) {
            next(error);
        }
    }


    static async delete(req: RequestWithAuth, res: Response, next: NextFunction) {
        try {

            const { id_product } = req.params;

            // Pastikan id_product dikonversi ke angka jika id_product bertipe Int
            const productId = parseInt(id_product, 10);
            if (isNaN(productId)) {
                res.status(400).json({ message: 'Invalid product ID' });
            }

            const result = await prisma.products.delete({
                where: {
                    id_product: productId, // Sesuaikan dengan nama kolom di model Prisma
                },
            });

            res.json({
                message: `Successfully deleted product with ID ${productId}`,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}