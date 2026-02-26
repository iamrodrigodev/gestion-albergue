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
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { BusinessResponse } from '@common/decorators';
import { SuccessCodes } from '@common/constants';
import { EstadoUsuario } from './enums/user-status.enum';
import { ParseEstadoPipe } from '@common/pipes';

@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @BusinessResponse(SuccessCodes.USUARIO_CREADO)
  async registrar(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
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
