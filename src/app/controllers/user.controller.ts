import ExcelJS from 'exceljs';
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { encrypt } from '../../utils';
import { RequestWithAuth } from '../../types/express';

const prisma = new PrismaClient();

export class UserControllerV1 {
    static async create(req: RequestWithAuth, res: Response, next: NextFunction) {
        try {
            const { name, age, password, email, pekerjaan } = req.body;

            if (!name || !age || !password || !email) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Cek apakah email sudah digunakan
            const existingUser = await prisma.users.findFirst(
                { where: { email } }
            );

            if (existingUser) {
                return res.status(400).json({ message: 'Email is already in use' });
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
            const users = await prisma.users.findMany();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    static async getFindOne(req: RequestWithAuth, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

        //     Cari berdasarkan user id
            const user = await prisma.users.findUnique({
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

        } catch (error) {
                    next(error);
        }
    }


    static async update(req: RequestWithAuth, res: Response, next: NextFunction) {
        try {

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

    static async exportToExcel(req: Request, res: Response, next: NextFunction) {
        try {
            // Ambil data dari database
            const users = await prisma.users.findMany({
                select: {
                    id: true,
                    name: true,
                    age: true,
                    email: true,
                    pekerjaan: true,
                }
            });

            // Buat workbook dan worksheet
            const workbook = new ExcelJS.Workbook();
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
                worksheet.addRow({
                    id: user.id,
                    name: user.name,
                    age: user.age,
                    email: user.email,
                    pekerjaan: user.pekerjaan,
                });
            });

            // Set header untuk response sebagai file Excel
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=users.xlsx'
            );
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );

            // Kirim file ke client
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            next(error);
        }
    }
}