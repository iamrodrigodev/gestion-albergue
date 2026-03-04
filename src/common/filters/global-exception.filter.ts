import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { BusinessException } from '@common/exceptions';
import { ErrorCodes } from '@common/constants';
import { obtenerFechaYHoraActual } from '@common/utils';

interface RespuestaExcepcion {
  message?: string | string[];
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(
    exception: Error | BusinessException | HttpException,
    host: ArgumentsHost,
  ) {
    const contexto = host.switchToHttp();
    const respuesta = contexto.getResponse<FastifyReply>();
    const peticion = contexto.getRequest<FastifyRequest>();

    let estado = HttpStatus.INTERNAL_SERVER_ERROR;
    let codigoEstado = ErrorCodes.ERROR_INTERNO.codigo;
    let mensaje = ErrorCodes.ERROR_INTERNO.mensaje;

    if (exception instanceof BusinessException) {
      estado = exception.getStatus();
      codigoEstado = exception.obtenerCodigoNegocio();
      mensaje = exception.message;
    } else if (exception instanceof HttpException) {
      estado = exception.getStatus();
      const respuestaCuerpo = exception.getResponse() as RespuestaExcepcion;
      const mensajeExtraido = respuestaCuerpo.message;

      mensaje = Array.isArray(mensajeExtraido)
        ? mensajeExtraido.join(', ')
        : mensajeExtraido || exception.message;

      switch (estado) {
        case HttpStatus.NOT_FOUND:
          codigoEstado = ErrorCodes.RECURSO_NO_ENCONTRADO.codigo;
          break;
        case HttpStatus.BAD_REQUEST:
          codigoEstado = ErrorCodes.PETICION_INCORRECTA.codigo;
          break;
        case HttpStatus.UNAUTHORIZED:
          codigoEstado = ErrorCodes.NO_AUTORIZADO.codigo;
          break;
        case HttpStatus.FORBIDDEN:
          codigoEstado = ErrorCodes.PROHIBIDO.codigo;
          break;
      }
    } else {
      const errorDetalle =
        exception instanceof Error ? exception.stack : String(exception);
      this.logger.error(
        `Error no controlado en ${peticion.url}: ${errorDetalle}`,
      );
    }

    const { fecha, hora } = obtenerFechaYHoraActual();

    const cuerpoRespuesta = {
      estado,
      codigoEstado,
      mensaje,
      fecha,
      hora,
      ruta: peticion.url,
    };

    respuesta.status(estado).send(cuerpoRespuesta);
  }
}
