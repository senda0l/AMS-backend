import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { File } from 'multer';

@Injectable()
export class UploadService {
  private readonly uploadPath: string;

  constructor(private configService: ConfigService) {
    this.uploadPath = path.join(process.cwd(), 'uploads');
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async saveFile(file: File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only images are allowed.');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit.');
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `issue-${uniqueSuffix}${ext}`;
    const filepath = path.join(this.uploadPath, filename);

    // Save file
    fs.writeFileSync(filepath, file.buffer);

    // Return relative URL path
    return `/uploads/${filename}`;
  }

  async saveMultipleFiles(files: File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      return [];
    }

    const savedFiles = await Promise.all(
      files.map((file) => this.saveFile(file)),
    );

    return savedFiles;
  }

  deleteFile(filename: string): void {
    const filepath = path.join(this.uploadPath, filename.replace('/uploads/', ''));
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
}

