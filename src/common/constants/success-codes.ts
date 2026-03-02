import { NOMBRE_APLICACION } from '@config/config';

export interface DetalleCodigoExito {
  codigo: string;
  mensaje: string;
}

export class SuccessCodes {
  static readonly OPERACION_EXITOSA: DetalleCodigoExito = {
    codigo: 'GEN_200',
    mensaje: 'Operación realizada exitosamente',
  };

  static readonly SALUD_200: DetalleCodigoExito = {
    codigo: 'SALUD_200',
    mensaje: `Servidor ${NOMBRE_APLICACION} funcionando correctamente`,
  };

  static readonly USUARIO_CREADO: DetalleCodigoExito = {
    codigo: 'USR_201',
    mensaje: 'Usuario registrado exitosamente',
  };

  static readonly USUARIO_ENCONTRADO: DetalleCodigoExito = {
    codigo: 'USR_200',
    mensaje: 'Usuario encontrado exitosamente',
  };

  static readonly LISTADO_USUARIOS: DetalleCodigoExito = {
    codigo: 'USR_200_L',
    mensaje: 'Listado de usuarios obtenido exitosamente',
  };

  static readonly USUARIO_ACTUALIZADO: DetalleCodigoExito = {
    codigo: 'USR_200_A',
    mensaje: 'Usuario actualizado exitosamente',
  };

  static readonly CLAVE_ACTUALIZADA: DetalleCodigoExito = {
    codigo: 'USR_200_P',
    mensaje: 'Contraseña actualizada exitosamente',
  };

  static readonly ESTADO_ACTUALIZADO: DetalleCodigoExito = {
    codigo: 'USR_200_E',
    mensaje: 'Estado del usuario actualizado exitosamente',
  };
}
