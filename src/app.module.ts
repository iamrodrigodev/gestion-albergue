import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { HealthController } from './health.controller';
import { GlobalExceptionFilter } from '@common/filters';
import { ResponseInterceptor } from '@common/interceptors';
import { DatabaseModule } from '@database/database.module';
import { UsersModule } from './users/users.module';
import { ConfiguracionCache } from '@config/config';

@Module({
  imports: [
    CacheModule.register({
      ttl: ConfiguracionCache.TTL_CACHE,
      max: ConfiguracionCache.MAX_CACHE,
      isGlobal: ConfiguracionCache.IS_GLOBAL,
    }),
    DatabaseModule,
    UsersModule,
  ],
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
