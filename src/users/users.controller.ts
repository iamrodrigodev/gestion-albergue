import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Patch,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Req,
  Logger,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { plainToInstance } from 'class-transformer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { BusinessResponse } from '@common/decorators';
import { SuccessCodes, ErrorCodes } from '@common/constants';
import { EstadoUsuario } from './enums/user-status.enum';
import { ParseEstadoPipe } from '@common/pipes';
import type { FastifyRequest } from 'fastify';
import type { MultipartFile, MultipartValue } from '@fastify/multipart';
import { StorageService } from '../storage/storage.service';
import { BusinessException } from '@common/exceptions';
import { validate } from 'class-validator';

@Controller('usuarios')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @BusinessResponse(SuccessCodes.USUARIO_CREADO)
  async registrar(@Req() req: FastifyRequest): Promise<UserResponseDto> {
    if (!req.isMultipart()) {
      throw new BusinessException(ErrorCodes.PETICION_INCORRECTA);
    }

    const parts = req.parts();
    const data: Record<string, string> = {};
    let file: MultipartFile | null = null;

    for await (const part of parts) {
      if (part.type === 'file') {
        file = part;
      } else {
        data[part.fieldname] = (part as MultipartValue<string>).value;
      }
    }

    // Mapear datos al DTO y validar antes de subir nada
    const dto = plainToInstance(CreateUserDto, data);
    const errores = await validate(dto);

    if (errores.length > 0) {
      this.logger.warn('Validacion fallida al crear usuario');
      throw new BusinessException(ErrorCodes.PETICION_INCORRECTA);
    }

    // Solo si los datos son validos, procedemos con la foto (si hay)
    if (file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BusinessException(ErrorCodes.PETICION_INCORRECTA);
      }
      dto.fotoUrl = await this.storageService.uploadFile(file);
    }

    const usuario = await this.usersService.crear(dto);
    return plainToInstance(UserResponseDto, usuario, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @BusinessResponse(SuccessCodes.USUARIO_ACTUALIZADO)
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const usuario = await this.usersService.actualizar(id, dto);
    return plainToInstance(UserResponseDto, usuario, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id/cambiar-clave')
  @HttpCode(HttpStatus.OK)
  @BusinessResponse(SuccessCodes.CLAVE_ACTUALIZADA)
  async cambiarClave(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    await this.usersService.cambiarClave(id, dto);
  }

  @Patch(':id/estado/:estado')
  @BusinessResponse(SuccessCodes.ESTADO_ACTUALIZADO)
  async cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Param('estado', ParseEstadoPipe) estado: EstadoUsuario,
  ): Promise<UserResponseDto> {
    const usuario = await this.usersService.cambiarEstado(id, estado);
    return plainToInstance(UserResponseDto, usuario, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @BusinessResponse(SuccessCodes.USUARIO_ENCONTRADO)
  async buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const usuario = await this.usersService.obtenerPorId(id);
    return plainToInstance(UserResponseDto, usuario, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @BusinessResponse(SuccessCodes.LISTADO_USUARIOS)
  async listarPorEstado(
    @Query('estado', ParseEstadoPipe) estado?: EstadoUsuario,
  ): Promise<UserResponseDto[]> {
    const estadoBusqueda =
      estado !== undefined ? estado : EstadoUsuario.HABILITADO;
    const usuarios = await this.usersService.obtenerPorEstado(estadoBusqueda);
    return plainToInstance(UserResponseDto, usuarios, {
      excludeExtraneousValues: true,
    });
  }
}
