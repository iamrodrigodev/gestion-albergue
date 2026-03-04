import { Exclude, Expose } from 'class-transformer';
import { RolUsuario } from '../enums/user-role.enum';
import { EstadoUsuario } from '../enums/user-status.enum';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  nombres: string;

  @Expose()
  apellidos: string;

  @Expose()
  telefono: string;

  @Expose()
  correoElectronico: string;

  @Expose()
  rol: RolUsuario;

  @Expose()
  estado: EstadoUsuario;

  @Expose()
  fotoUrl: string;

  @Expose()
  fechaCreacion: string;

  @Expose()
  horaCreacion: string;
}
