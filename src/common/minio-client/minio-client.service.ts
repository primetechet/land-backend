import { HttpException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from 'src/common/types/buffered-file.type';

type FolderId = 'TITLE_DEED_DOCUMENT' | 'EMPLOYEE';

type FolderInfo = {
  folder_id: FolderId;
  folder_name: string;
  bucket: string;
};

const MINIO_FOLDERS: FolderInfo[] = [
  {
    folder_id: 'TITLE_DEED_DOCUMENT',
    folder_name: 'title-deed-application',
    bucket: 'default',
  },
];

@Injectable()
export class MinioClientService {
  constructor(private readonly minioService: MinioService) {}

  public async uploadSingleFile(file: BufferedFile, folder_id: FolderId) {
    const allowedMimeTypes = [
      'image/*',
      'application/pdf',
      'image/bmp',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'image/webp',
      'image/svg+xml',
      'video/webm',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new HttpException('Invalid File', 422);
    }
    const maxFileSizeInBytes = 5 * 1024 * 1024; // 5mb
    if (file.buffer.byteLength > maxFileSizeInBytes) {
      throw new HttpException('Invalid File', 422);
    }

    try {
      const folder = MINIO_FOLDERS.find(
        (_folder) => folder_id == _folder.folder_id,
      );

      const fileName = `${folder.folder_name}/${Date.now()}_${randomUUID()}.${file.mimetype.split('/')[1]}`;

      const path = await this.saveOnMinio(folder.bucket, fileName, file.buffer);

      return {
        path: path,
        fileName: fileName,
      };
    } catch (error) {
      console.log({ error });
      throw new HttpException('Failed to upload file', 500);
    }
  }

  public async uploadMultipleFile(files: BufferedFile[], folder_id: FolderId) {
    const responses = await Promise.all(
      files.map(async (attachment) => {
        const uploadResult = await this.uploadSingleFile(attachment, folder_id);
        return uploadResult;
      }),
    );

    return responses;
  }

  async saveOnMinio(bucket: string, file_path: string, file) {
    await this.minioService.client.putObject(bucket, file_path, file);

    return `${bucket}/${file_path}`;
  }
}
