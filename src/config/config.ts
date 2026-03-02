export class ConfiguracionSeguridad {
  static readonly RONDAS_SAL_BCRYPT: number = 10;
}

export const NOMBRE_APLICACION: string = 'GestionAlbergue';

export class ConfiguracionCache {
  static readonly TTL_CACHE: number = 10000;
  static readonly MAX_CACHE: number = 100;
  static readonly IS_GLOBAL: boolean = true;
}

export class ConfiguracionServidor {
  static readonly PUERTO_SERVIDOR: number = 3000;
  static readonly HOST_SERVIDOR: string = 'localhost';
}

export class ConfiguracionBaseDatos {
  static readonly SYNCHRONIZE: boolean = false;
  static readonly LOGGING: boolean = false;
  static readonly PUERTO_BASE_DE_DATOS: number = 5432;
  static readonly CONFIGURACION_EXTRA = {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
  static readonly SSL = {
    rejectUnauthorized: false,
  };
}
