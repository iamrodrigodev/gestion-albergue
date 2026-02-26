import { PipeTransform, Injectable } from '@nestjs/common';
import { BusinessException } from '@common/exceptions';
import { ErrorCodes } from '@common/constants';
import { EstadoUsuario } from '@src/users/enums/user-status.enum';

@Injectable()
export class ParseEstadoPipe implements PipeTransform {
  transform(
    valor: string | number | undefined | null,
  ): EstadoUsuario | undefined | null {
    if (valor === undefined || valor === null) {
      return valor;
    }

    const estadoNumerico = parseInt(String(valor), 10);

    if (
      isNaN(estadoNumerico) ||
      !Object.values(EstadoUsuario).includes(estadoNumerico)
    ) {
      throw new BusinessException(
        ErrorCodes.VALOR_DESCONOCIDO,
        `Valor desconocido: ${String(valor)}`,
      );
    }

    return estadoNumerico as EstadoUsuario;
  }
}
