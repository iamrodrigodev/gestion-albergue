import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Los nombres no pueden estar vacíos' })
  @IsString({ message: 'Los nombres deben ser texto' })
  nombres: string;

  @IsNotEmpty({ message: 'Los apellidos no pueden estar vacíos' })
  @IsString({ message: 'Los apellidos deben ser texto' })
  apellidos: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsString({ message: 'El teléfono debe ser texto' })
  @Matches(/^9\d{8}$/, {
    message: 'El teléfono debe empezar con 9 y tener exactamente 9 dígitos',
  })
  telefono: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  correoElectronico: string;

  @IsNotEmpty({ message: 'La clave es obligatoria' })
  @IsString({ message: 'La clave debe ser texto' })
  @MinLength(6, { message: 'La clave debe tener más de 6 caracteres' })
  clave: string;

  @IsOptional()
  @IsString({ message: 'La URL de la foto debe ser texto' })
  fotoUrl?: string;
}
