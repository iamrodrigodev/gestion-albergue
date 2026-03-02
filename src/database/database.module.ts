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
        synchronize: false, // Desactivado para produccion, usa migraciones
        logging: false, // Desactiva logs excesivos
        extra: {
          max: 20, // Maximo 20 clientes concurrentes
          idleTimeoutMillis: 30000, // Cierra conexiones inactivas tras 30s
          connectionTimeoutMillis: 5000, // Tiempo limite para conectar (Azure puede ser lento)
        },
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      dataSourceFactory(options) {
        if (!options) {
          throw new Error(
            'No se proporcionaron opciones de conexión a la base de datos',
          );
        }
        const dataSource = new DataSource(options);
        return Promise.resolve(addTransactionalDataSource(dataSource));
      },
    }),
  ],
})
export class DatabaseModule {}
