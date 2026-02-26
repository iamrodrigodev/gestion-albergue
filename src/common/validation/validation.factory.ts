import { BadRequestException, ValidationError } from '@nestjs/common';

export const validationFactory = (errors: ValidationError[]) => {
  if (errors.length >= 3) {
    return new BadRequestException(
      'El cuerpo de la petición no puede estar vacío o faltan demasiados datos obligatorios',
    );
  }

  const firstError = errors[0];
  const firstConstraint = Object.values(firstError.constraints || {})[0];

  return new BadRequestException(firstConstraint);
};
