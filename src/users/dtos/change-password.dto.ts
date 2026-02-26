import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'La clave actual debe ser texto' })
  @IsNotEmpty({ message: 'La clave actual es obligatoria' })
  claveActual: string;

  @IsString({ message: 'La nueva clave debe ser texto' })
  @IsNotEmpty({ message: 'La nueva clave es obligatoria' })
  nuevaClave: string;

  @MinLength(6, { message: 'La nueva clave debe tener más de 6 caracteres' })
  @IsString()
  @IsNotEmpty()
  confirmarNuevaClave: string;
}
