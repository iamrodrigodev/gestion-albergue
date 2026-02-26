import { HttpException, HttpStatus } from '@nestjs/common';
import { DetalleCodigoError } from '@common/constants';

export class BusinessException extends HttpException {
  private readonly codigoNegocio: string;

  constructor(
    detalle: DetalleCodigoError,
    mensajePersonalizado?: string,
    estadoHttp: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    const mensajeFinal = mensajePersonalizado || detalle.mensaje;
    super(mensajeFinal, estadoHttp);
    this.codigoNegocio = detalle.codigo;
  }

  obtenerCodigoNegocio(): string {
    return this.codigoNegocio;
  }
}
