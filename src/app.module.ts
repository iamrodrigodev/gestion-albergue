import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HealthController } from './health.controller';
import { GlobalExceptionFilter } from '@common/filters';
import { ResponseInterceptor } from '@common/interceptors';
import { DatabaseModule } from '@database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
