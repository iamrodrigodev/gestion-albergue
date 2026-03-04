import { Injectable, Logger } from '@nestjs/common';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { BusinessException } from '@common/exceptions';
import { ErrorCodes } from '@common/constants';
import { MultipartFile } from '@fastify/multipart';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private containerClient: ContainerClient;

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName =
      process.env.AZURE_STORAGE_CONTAINER || 'fotos-usuarios';

    if (!connectionString) {
      this.logger.error(
        'AZURE_STORAGE_CONNECTION_STRING no esta configurada en el entorno',
      );
      return;
    }

    try {
      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);
      this.containerClient =
        blobServiceClient.getContainerClient(containerName);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(
        `Error al inicializar Azure Blob Storage Client: ${message}`,
      );
    }
  }

  async uploadFile(file: MultipartFile): Promise<string> {
    if (!this.containerClient) {
      throw new BusinessException(ErrorCodes.ERROR_INTERNO);
    }

    try {
      const buffer = await file.toBuffer();
      const extension = path.extname(file.filename);
      const fileName = `${uuidv4()}${extension}`;

      const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);

      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      this.logger.log(`Archivo subido exitosamente: ${fileName}`);
      return blockBlobClient.url;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Error al subir archivo a Azure: ${message}`);
      throw new BusinessException(ErrorCodes.ERROR_INTERNO);
    }
  }
}
