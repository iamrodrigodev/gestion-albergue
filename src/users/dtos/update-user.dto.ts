import { IsString, IsOptional, IsEmail, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Los nombres deben ser texto' })
  nombres?: string;

  @IsOptional()
  @IsString({ message: 'Los apellidos deben ser texto' })
  apellidos?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto' })
  @Matches(/^9\d{8}$/, {
    message: 'El teléfono debe empezar con 9 y tener exactamente 9 dígitos',
  })
  telefono?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  correoElectronico?: string;
}
