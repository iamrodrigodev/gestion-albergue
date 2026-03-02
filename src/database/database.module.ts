import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ConfiguracionBaseDatos } from '@config/config';
import { env } from 'node:process';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: env.HOST_BASE_DE_DATOS,
        username: env.USUARIO_BASE_DE_DATOS,
        password: env.CLAVE_BASE_DE_DATOS,
        database: env.NOMBRE_BASE_DE_DATOS,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        port: ConfiguracionBaseDatos.PUERTO_BASE_DE_DATOS,
        synchronize: ConfiguracionBaseDatos.SYNCHRONIZE,
        logging: ConfiguracionBaseDatos.LOGGING,
        extra: ConfiguracionBaseDatos.CONFIGURACION_EXTRA,
        ssl: ConfiguracionBaseDatos.SSL,
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
