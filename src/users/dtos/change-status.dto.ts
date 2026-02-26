import { IsEnum, IsInt } from 'class-validator';
import { EstadoUsuario } from '../enums/user-status.enum';

export class ChangeStatusDto {
  @IsInt({ message: 'El estado debe ser un número entero' })
  @IsEnum(EstadoUsuario, {
    message: 'El estado debe ser 1 (HABILITADO) o 0 (DESHABILITADO)',
  })
  estado: EstadoUsuario;
}
