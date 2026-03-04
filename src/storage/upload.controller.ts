import { Controller, Post, Req, Logger } from '@nestjs/common';
import { StorageService } from './storage.service';
import { BusinessException } from '@common/exceptions';
import { ErrorCodes } from '@common/constants';

@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly storageService: StorageService) {}

  @Post()
  async uploadFile(@Req() req: any) {
    const file = await req.file();
    
    if (!file) {
      this.logger.warn('Se intento subir un archivo pero no se encontro nada en la peticion');
      throw new BusinessException(ErrorCodes.PETICION_INCORRECTA);
    }
    
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      this.logger.warn(`Intento de subida de archivo no permitido: ${file.mimetype}`);
      throw new BusinessException(ErrorCodes.PETICION_INCORRECTA);
    }

    try {
      const url = await this.storageService.uploadFile(file);
      return { url };
    } catch (error) {
      this.logger.error(`Error procesando subida de archivo: ${error.message}`);
      throw new BusinessException(ErrorCodes.ERROR_INTERNO);
    }
  }
}
