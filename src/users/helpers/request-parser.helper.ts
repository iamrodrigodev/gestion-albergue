import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { FastifyRequest } from 'fastify';
import type { MultipartFile, MultipartValue } from '@fastify/multipart';
import { CreateUserDto } from '../dtos/create-user.dto';
import { BusinessException } from '@common/exceptions';
import { ErrorCodes } from '@common/constants';

export class RequestParserHelper {
  static async parseCreateUser(
    req: FastifyRequest,
  ): Promise<{ dto: CreateUserDto; file?: MultipartFile }> {
    let file: MultipartFile | undefined;
    let data: Record<string, unknown>;

    if (req.isMultipart()) {
      const parts = req.parts();
      const fields: Record<string, string> = {};
      for await (const part of parts) {
        if (part.type === 'file') file = part;
        else fields[part.fieldname] = (part as MultipartValue<string>).value;
      }
      data = fields;
    } else {
      data = req.body as Record<string, unknown>;
    }

    const dto = plainToInstance(CreateUserDto, data);
    const errores = await validate(dto);
    if (errores.length > 0) {
      throw new BusinessException(ErrorCodes.PETICION_INCORRECTA);
    }

    return { dto, file };
  }
}
