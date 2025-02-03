import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestWithAuth } from '../../types/express';

export class ProductControllerV1 {
  static async create(req: RequestWithAuth, res: Response, next: NextFunction) {
    try {
      const prisma = new PrismaClient();
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
      const prisma = new PrismaClient();
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
      const prisma = new PrismaClient();
      const { id } = req.params;
      const { name, age, password, email, pekerjaan } = req.body;

      const result = await prisma.users.update({
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
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: RequestWithAuth, res: Response, next: NextFunction) {
    try {
      const prisma = new PrismaClient();
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
