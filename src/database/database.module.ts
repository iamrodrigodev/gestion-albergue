import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { BaseDatos } from '@env/env';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: BaseDatos.HOST_BASE_DE_DATOS,
        port: BaseDatos.PUERTO_BASE_DE_DATOS,
        username: BaseDatos.USUARIO_BASE_DE_DATOS,
        password: BaseDatos.CLAVE_BASE_DE_DATOS,
        database: BaseDatos.NOMBRE_BASE_DE_DATOS,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false, // sin ssl
        },
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('No se proporcionaron opciones de conexión a la base de datos');
        }
        const dataSource = new DataSource(options);
        return addTransactionalDataSource(dataSource);
      },
    }),
  ],
})
export class DatabaseModule {}
