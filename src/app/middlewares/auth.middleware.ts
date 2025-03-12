import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { HttpException, UserJWT } from "../../utils";
import { NextFunction, Request, Response } from 'express';

dotenv.config();

export const authorizationJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authToken = req.headers.authorization;

    try {
        if (!authToken) {
            throw new HttpException(401, 'Unauthorized');
        }

        const token: string[] = authToken.split(' ');
        if (token[0] !== 'Bearer') {
            throw new HttpException(401, 'Invalid Type Token');
        }

        const jwtKey = process.env.JWT_SECRET_KEY;
        if (!jwtKey) {
            throw new Error("JWT Secret key is missing in environment variables.");
        }

        const result = jwt.verify(token[1], jwtKey) as UserJWT;
        (req as any).user = result; // Simpan data user di req.user

        next();
    } catch (e: any) {
        console.error("JWT Verification Error:", e.message);
        next(e);
    }
};
