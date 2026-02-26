export interface DetalleCodigoError {
  codigo: string;
  mensaje: string;
}

export class ErrorCodes {
  static readonly ERROR_INTERNO: DetalleCodigoError = {
    codigo: 'GEN_500',
    mensaje: 'Error interno del servidor',
  };

  static readonly RECURSO_NO_ENCONTRADO: DetalleCodigoError = {
    codigo: 'GEN_404',
    mensaje: 'El recurso solicitado no existe',
  };

  static readonly PETICION_INCORRECTA: DetalleCodigoError = {
    codigo: 'GEN_400',
    mensaje: 'La petición contiene errores o está mal formada',
  };

  static readonly NO_AUTORIZADO: DetalleCodigoError = {
    codigo: 'SEC_401',
    mensaje: 'No tiene autorización para realizar esta acción',
  };

  static readonly PROHIBIDO: DetalleCodigoError = {
    codigo: 'SEC_403',
    mensaje: 'Acceso prohibido al recurso',
  };

  static readonly USUARIO_CORREO_DUPLICADO: DetalleCodigoError = {
    codigo: 'USR_409',
    mensaje: 'El correo electrónico ya está registrado',
  };

  static readonly USUARIO_NO_ENCONTRADO: DetalleCodigoError = {
    codigo: 'USR_404',
    mensaje: 'El usuario solicitado no existe',
  };

  static readonly VALOR_DESCONOCIDO: DetalleCodigoError = {
    codigo: 'GEN_400_V',
    mensaje: 'Valor desconocido proporcionado',
  };

  static readonly CLAVE_ACTUAL_INCORRECTA: DetalleCodigoError = {
    codigo: 'USR_401_P',
    mensaje: 'La clave actual proporcionada es incorrecta',
  };

  static readonly CLAVES_NO_COINCIDEN: DetalleCodigoError = {
    codigo: 'USR_400_P',
    mensaje: 'La nueva clave y su confirmación no coinciden',
  };

  static readonly USUARIO_DESHABILITADO: DetalleCodigoError = {
    codigo: 'USR_403_D',
    mensaje:
      'La cuenta de usuario está deshabilitada y no puede realizar esta operación',
  };
}
