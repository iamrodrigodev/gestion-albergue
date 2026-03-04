import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { UploadController } from './upload.controller';

@Module({
  providers: [StorageService],
  controllers: [UploadController],
  exports: [StorageService],
})
export class StorageModule {}
