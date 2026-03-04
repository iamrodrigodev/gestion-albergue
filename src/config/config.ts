export class ConfiguracionSeguridad {
  static readonly RONDAS_SAL_BCRYPT: number = 10;
}

export const NOMBRE_APLICACION: string = 'GestionAlbergueApi';

export class ConfiguracionCache {
  static readonly TTL_CACHE: number = 10000;
  static readonly MAX_CACHE: number = 100;
  static readonly IS_GLOBAL: boolean = true;
}

export class ConfiguracionServidor {
  static readonly PUERTO_SERVIDOR: number = parseInt(
    process.env.PORT || '3000',
    10,
  );
  static readonly HOST_SERVIDOR: string = '0.0.0.0';
}

export class ConfiguracionBaseDatos {
  static readonly SYNCHRONIZE: boolean = true;
  static readonly LOGGING: boolean = true;
  static readonly PUERTO_BASE_DE_DATOS: number = 5432;
  static readonly CONFIGURACION_EXTRA = {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
  };
  static readonly SSL = {
    rejectUnauthorized: false,
  };
}
