import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class StorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async storeFile(file: Express.Multer.File, documentId: string): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${documentId}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);

    // Ensure unique filename
    let finalPath = filePath;
    let counter = 1;
    while (fs.existsSync(finalPath)) {
      const nameWithoutExt = path.basename(fileName, fileExtension);
      finalPath = path.join(this.uploadDir, `${nameWithoutExt}_${counter}${fileExtension}`);
      counter++;
    }

    // Write file to disk
    fs.writeFileSync(finalPath, file.buffer);

    // Generate public URL
    const publicUrl = `/uploads/${path.basename(finalPath)}`;

    return publicUrl;
  }

  async getFile(fileName: string): Promise<Buffer> {
    const filePath = path.join(this.uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    return fs.readFileSync(filePath);
  }

  async deleteFile(fileName: string): Promise<void> {
    const filePath = path.join(this.uploadDir, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  async getFileInfo(fileName: string) {
    const filePath = path.join(this.uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    const stats = fs.statSync(filePath);
    const fileExtension = path.extname(fileName);

    return {
      name: fileName,
      path: filePath,
      size: stats.size,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
      extension: fileExtension,
      mimeType: this.getMimeType(fileExtension),
    };
  }

  async listFiles(directory?: string): Promise<any[]> {
    const targetDir = directory ? path.join(this.uploadDir, directory) : this.uploadDir;

    if (!fs.existsSync(targetDir)) {
      return [];
    }

    const files = fs.readdirSync(targetDir);
    const fileInfo = [];

    for (const file of files) {
      const filePath = path.join(targetDir, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        fileInfo.push({
          name: file,
          path: filePath,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          extension: path.extname(file),
        });
      }
    }

    return fileInfo;
  }

  async moveFile(sourceName: string, destinationName: string): Promise<void> {
    const sourcePath = path.join(this.uploadDir, sourceName);
    const destinationPath = path.join(this.uploadDir, destinationName);

    if (!fs.existsSync(sourcePath)) {
      throw new Error('Source file not found');
    }

    // Ensure destination directory exists
    const destinationDir = path.dirname(destinationPath);
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    fs.renameSync(sourcePath, destinationPath);
  }

  async copyFile(sourceName: string, destinationName: string): Promise<void> {
    const sourcePath = path.join(this.uploadDir, sourceName);
    const destinationPath = path.join(this.uploadDir, destinationName);

    if (!fs.existsSync(sourcePath)) {
      throw new Error('Source file not found');
    }

    // Ensure destination directory exists
    const destinationDir = path.dirname(destinationPath);
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    fs.copyFileSync(sourcePath, destinationPath);
  }

  async generateThumbnail(fileName: string, options: any = {}): Promise<string> {
    const { width = 200, height = 200, quality = 80 } = options;
    const filePath = path.join(this.uploadDir, fileName);
    const fileExtension = path.extname(fileName).toLowerCase();

    if (!['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
      throw new Error('Thumbnail generation only supported for image files');
    }

    const thumbnailName = `thumb_${width}x${height}_${fileName}`;
    const thumbnailPath = path.join(this.uploadDir, 'thumbnails', thumbnailName);

    // Ensure thumbnails directory exists
    const thumbnailDir = path.dirname(thumbnailPath);
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    // In a real implementation, you would use a library like sharp to generate thumbnails
    // For now, we'll just copy the file as a placeholder
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, thumbnailPath);
    }

    return `/uploads/thumbnails/${thumbnailName}`;
  }

  async getStorageStats(): Promise<any> {
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      filesByType: {},
      directoryStructure: {},
    };

    const walkDirectory = (dir: string, depth = 0) => {
      if (depth > 3) return; // Limit depth to prevent infinite recursion

      if (!fs.existsSync(dir)) return;

      const items = fs.readdirSync(dir);

      for (const item of items) {
        const itemPath = path.join(dir, item);
        const itemStats = fs.statSync(itemPath);

        if (itemStats.isDirectory()) {
          if (!stats.directoryStructure[item]) {
            stats.directoryStructure[item] = { files: 0, size: 0, subdirectories: {} };
          }
          walkDirectory(itemPath, depth + 1);
        } else if (itemStats.isFile()) {
          stats.totalFiles++;
          stats.totalSize += itemStats.size;

          const extension = path.extname(item).toLowerCase() || 'no_extension';
          if (!stats.filesByType[extension]) {
            stats.filesByType[extension] = { count: 0, size: 0 };
          }
          stats.filesByType[extension].count++;
          stats.filesByType[extension].size += itemStats.size;
        }
      }
    };

    walkDirectory(this.uploadDir);
    return stats;
  }

  async cleanupOldFiles(daysOld: number = 30): Promise<any> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    let deletedFiles = 0;
    let deletedSize = 0;

    const files = await this.listFiles();

    for (const file of files) {
      if (file.createdAt < cutoffDate) {
        try {
          await this.deleteFile(file.name);
          deletedFiles++;
          deletedSize += file.size;
        } catch (error) {
          console.error(`Failed to delete file ${file.name}:`, error);
        }
      }
    }

    return {
      deletedFiles,
      deletedSize,
      cutoffDate,
      message: `Cleaned up ${deletedFiles} files older than ${daysOld} days`,
    };
  }

  async compressFile(fileName: string): Promise<string> {
    const filePath = path.join(this.uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    const compressedName = `compressed_${fileName}`;
    const compressedPath = path.join(this.uploadDir, compressedName);

    // In a real implementation, you would compress the file
    // For now, just copy it
    fs.copyFileSync(filePath, compressedPath);

    return compressedName;
  }

  async generateFileHash(fileName: string): Promise<string> {
    const filePath = path.join(this.uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);

    return hashSum.digest('hex');
  }

  private getMimeType(extension: string): string {
    const mimeTypes: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
  }

  async createBackup(fileName: string, backupSuffix: string = '_backup'): Promise<string> {
    const filePath = path.join(this.uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    const nameWithoutExt = path.basename(fileName, path.extname(fileName));
    const extension = path.extname(fileName);
    const backupName = `${nameWithoutExt}${backupSuffix}${extension}`;
    const backupPath = path.join(this.uploadDir, backupName);

    fs.copyFileSync(filePath, backupPath);

    return backupName;
  }

  async restoreFromBackup(backupName: string, originalName: string): Promise<void> {
    const backupPath = path.join(this.uploadDir, backupName);
    const originalPath = path.join(this.uploadDir, originalName);

    if (!fs.existsSync(backupPath)) {
      throw new Error('Backup file not found');
    }

    // Ensure original directory exists
    const originalDir = path.dirname(originalPath);
    if (!fs.existsSync(originalDir)) {
      fs.mkdirSync(originalDir, { recursive: true });
    }

    fs.copyFileSync(backupPath, originalPath);
  }
}
