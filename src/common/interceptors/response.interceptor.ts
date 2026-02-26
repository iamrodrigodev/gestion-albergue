import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResponse } from '@common/interfaces';
import { SuccessCodes, DetalleCodigoExito } from '@common/constants';
import { BUSINESS_RESPONSE_KEY } from '@common/decorators';
import { obtenerFechaYHoraActual } from '@common/utils';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    contexto: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const peticion = contexto.switchToHttp().getRequest<FastifyRequest>();
    const respuestaHttp = contexto.switchToHttp().getResponse<FastifyReply>();

    const detallePersonalizado = this.reflector.get<DetalleCodigoExito>(
      BUSINESS_RESPONSE_KEY,
      contexto.getHandler(),
    );

    return next.handle().pipe(
      map((datos: T): ApiResponse<T> => {
        const { fecha, hora } = obtenerFechaYHoraActual();
        const estado = respuestaHttp.statusCode;

        const detalle = detallePersonalizado || SuccessCodes.OPERACION_EXITOSA;

        return {
          estado,
          codigoEstado: detalle.codigo,
          mensaje: detalle.mensaje,
          fecha,
          hora,
          ruta: peticion.url,
          datos: datos ?? null,
        };
      }),
    );
  }
}
