import { RequestWithAuth } from '../../types/express';
import { NextFunction, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import csv from 'csv-parser';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

export class ReviewControllerV1 {
  static async import(req: RequestWithAuth, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'Please upload a file',
        });
      }

      const filePath = req.file.path;
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      let reviews = [];

      if (fileExt === '.csv') {
        reviews = await this.parseCSV(filePath);
      } else if (fileExt === '.xlsx' || fileExt === '.xls') {
        reviews = this.parseExcel(filePath);
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'Unsupported file format',
        });
      }

      if (!reviews || reviews.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'No valid data found in the file',
        });
      }

      const formattedData = reviews.map((review: any) => ({
        name: review.name?.toString().trim() || '',
        photos: review.photos?.toString().trim() || '',
        star: parseInt(review.star, 10) || 0,
        comment: review.comment?.toString().trim() || '',
      }));

      const created = await prisma.product_reviews.createMany({
        data: formattedData,
        skipDuplicates: false,
      });

      fs.unlinkSync(filePath);

      return res.status(201).json({
        status: 'success',
        message: `Successfully imported ${created.count} reviews`,
        count: created.count,
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  }

  private static parseCSV(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error: any) => reject(error));
    });
  }

  private static parseExcel(filePath: string): any[] {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
  }
}
