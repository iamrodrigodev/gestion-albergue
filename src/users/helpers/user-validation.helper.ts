import { BusinessException } from '@common/exceptions';
import { ErrorCodes } from '@common/constants';
import { User } from '../entities/user.entity';
import { EstadoUsuario } from '../enums/user-status.enum';

export class UserValidationHelper {
  static verificarUsuarioHabilitado(usuario: User): void {
    if (usuario.estado === EstadoUsuario.DESHABILITADO) {
      throw new BusinessException(ErrorCodes.USUARIO_DESHABILITADO);
    }
  }
}
