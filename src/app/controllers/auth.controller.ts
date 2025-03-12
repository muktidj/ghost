import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { compareEncrypt } from '../../utils';
import jwt from 'jsonwebtoken';

export class AuthControllerV1 {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const prisma = new PrismaClient();
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
                return;
            }

            const user = await prisma.users.findFirst({
                where: {
                    email: String(email),
                },
            });

            if (!user) {
                res.status(401).json({ message: 'Invalid email or password' });
                return;
            }

            const isPasswordValid = await compareEncrypt(password, user.password);

            if (!isPasswordValid) {
                res.status(401).json({ message: 'Invalid email or password' });
                return;
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET_KEY || 'your-secret-key', // Gunakan environment variable untuk secret key
                { expiresIn: '1h' } // Token akan kadaluarsa dalam 1 jam
            );

            res.status(200).json({
                message: 'Login successful',
                user: { id: user.id, name: user.name, email: user.email },
                token: token // Kirim token ke client
            });
        } catch (err) {
            next(err);
        }
    }
}