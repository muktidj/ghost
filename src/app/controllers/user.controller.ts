import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { encrypt } from '../../utils';
import { RequestWithAuth } from '../../types/express';

export class UserControllerV1 {
  static async create(req: RequestWithAuth, res: Response, next: NextFunction) {
    try {
      const prisma = new PrismaClient();
      const { name, age, password, email, pekerjaan } = req.body;

      if (!name || !age || !password || !email) {
        res.status(400).json({ message: 'All fields are required' });
      }

      const hashedPassword = encrypt(password);

      const result = await prisma.users.create({
        data: { name, age, password: hashedPassword, email, pekerjaan },
      });

      res
        .status(201)
        .json({ data: result, message: 'Successfully created user' });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: RequestWithAuth, res: Response, next: NextFunction) {
    try {
      const prisma = new PrismaClient();
      const users = await prisma.users.findMany();
      res.status(200).json(users);
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
      const { id } = req.params;
      await prisma.users.delete({
        where: {
          id: Number(id),
        },
      });
      res.json({ message: 'Successfully delete user' });
    } catch (error) {
      next(error);
    }
  }
}
