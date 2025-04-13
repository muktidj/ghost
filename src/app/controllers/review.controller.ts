import { RequestWithAuth } from '../../types/express';
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import csv from 'csv-parser';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import multer from 'multer';

const prisma = new PrismaClient();

// Konfigurasi storage untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/imports');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'reviews-' + uniqueSuffix + ext);
  }
});

// Konfigurasi filter file
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.csv' || ext === '.xlsx' || ext === '.xls') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file CSV atau Excel yang diperbolehkan'));
  }
};

// Export konfigurasi multer
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

export class ReviewControllerV1 {
  static async import(req: RequestWithAuth, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'Please upload a file',
        });
      }

      console.log("File uploaded:", req.file);

      const filePath = req.file.path;
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      let reviews = [];

      if (fileExt === '.csv') {
        reviews = await ReviewControllerV1.parseCSV(filePath);
      } else if (fileExt === '.xlsx' || fileExt === '.xls') {
        reviews = ReviewControllerV1.parseExcel(filePath);
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'Unsupported file format',
        });
      }

      console.log("Parsed data:", reviews);

      if (!reviews || reviews.length === 0) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return res.status(400).json({
          status: 'error',
          message: 'No valid data found in the file',
        });
      }

      const formattedData = reviews.map((review: any) => {
        console.log("Raw review data:", review);

        const starValueRaw = parseInt(review.star, 10);
        const starValue = isNaN(starValueRaw) ? 0 : Math.min(Math.max(starValueRaw, 1), 5); // optional range 1-5

        return {
          name: review.name?.toString().trim() || '',
          photos: review.photos?.toString().trim() || '',
          star: starValue,
          comment: review.comment?.toString().trim() || '',
        };
      });

      console.log("Formatted data for DB:", formattedData);

      const created = await prisma.product_reviews.createMany({
        data: formattedData,
        skipDuplicates: false,
      });

      console.log("DB response:", created);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(201).json({
        status: 'success',
        message: `Successfully imported ${created.count} reviews`,
        count: created.count,
      });
    } catch (err: unknown) {
      console.error("Error during import:", err);

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      if (err instanceof Error) {
        return res.status(500).json({
          status: 'error',
          message: `Import failed: ${err.message}`,
        });
      } else {
        return res.status(500).json({
          status: 'error',
          message: 'Import failed: Unknown error occurred',
        });
      }
    }
  }

  private static parseCSV(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: any) => {
          console.log("CSV row data:", data);
          results.push(data);
        })
        .on('end', () => {
          console.log(`Parsed ${results.length} rows from CSV`);
          resolve(results);
        })
        .on('error', (error: any) => {
          console.error("CSV parsing error:", error);
          reject(error);
        });
    });
  }

  private static parseExcel(filePath: string): any[] {
    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const results = xlsx.utils.sheet_to_json(worksheet);
      console.log(`Parsed ${results.length} rows from Excel`);
      return results;
    } catch (error) {
      console.error("Excel parsing error:", error);
      throw error;
    }
  }
}
