import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { BusinessException } from '@common/exceptions';
import { ErrorCodes } from '@common/constants';
import { TextUtil } from '@common/utils';
import { ConfiguracionSeguridad } from '@env/env';
import { EstadoUsuario } from './enums/user-status.enum';
import { UserValidationHelper } from './helpers/user-validation.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repositorioUsuarios: Repository<User>,
  ) {}

  @Transactional()
  async crear(dto: CreateUserDto): Promise<User> {
    const correoNormalizado = TextUtil.normalizar(dto.correoElectronico);
    const nombresNormalizados = TextUtil.normalizarSinPuntos(dto.nombres);
    const apellidosNormalizados = TextUtil.normalizarSinPuntos(dto.apellidos);

    const existeUsuario = await this.repositorioUsuarios.findOne({
      where: { correoElectronico: correoNormalizado! },
    });

    if (existeUsuario) {
      throw new BusinessException(ErrorCodes.USUARIO_CORREO_DUPLICADO);
    }

    const semilla = await bcrypt.genSalt(
      ConfiguracionSeguridad.RONDAS_SAL_BCRYPT,
    );
    const claveEncriptada = await bcrypt.hash(dto.clave, semilla);

    const nuevoUsuario = this.repositorioUsuarios.create({
      ...dto,
      nombres: nombresNormalizados!,
      apellidos: apellidosNormalizados!,
      correoElectronico: correoNormalizado!,
      clave: claveEncriptada,
    });

    return await this.repositorioUsuarios.save(nuevoUsuario);
  }

  @Transactional()
  async actualizar(id: number, dto: UpdateUserDto): Promise<User> {
    const usuarioExistente = await this.obtenerPorId(id);

    // REGLA: No permitir actualizar si está deshabilitado
    UserValidationHelper.verificarUsuarioHabilitado(usuarioExistente);

    if (dto.correoElectronico) {
      const correoNuevoNormalizado = TextUtil.normalizar(dto.correoElectronico);
      if (correoNuevoNormalizado !== usuarioExistente.correoElectronico) {
        const correoEnUsoPorOtro = await this.repositorioUsuarios.findOne({
          where: { correoElectronico: correoNuevoNormalizado!, id: Not(id) },
        });
        if (correoEnUsoPorOtro) {
          throw new BusinessException(ErrorCodes.USUARIO_CORREO_DUPLICADO);
        }
        dto.correoElectronico = correoNuevoNormalizado!;
      }
    }

    if (dto.nombres) dto.nombres = TextUtil.normalizarSinPuntos(dto.nombres)!;
    if (dto.apellidos)
      dto.apellidos = TextUtil.normalizarSinPuntos(dto.apellidos)!;

    const usuarioActualizado = this.repositorioUsuarios.merge(
      usuarioExistente,
      dto,
    );
    return await this.repositorioUsuarios.save(usuarioActualizado);
  }

  @Transactional()
  async cambiarClave(id: number, dto: ChangePasswordDto): Promise<void> {
    if (dto.nuevaClave !== dto.confirmarNuevaClave) {
      throw new BusinessException(ErrorCodes.CLAVES_NO_COINCIDEN);
    }

    const usuario = await this.repositorioUsuarios.findOne({
      where: { id },
      select: ['id', 'clave', 'estado'],
    });

    if (!usuario) {
      throw new BusinessException(ErrorCodes.USUARIO_NO_ENCONTRADO);
    }

    // REGLA: No permitir cambiar clave si está deshabilitado
    UserValidationHelper.verificarUsuarioHabilitado(usuario);

    const esCorrecta = await bcrypt.compare(dto.claveActual, usuario.clave);
    if (!esCorrecta) {
      throw new BusinessException(ErrorCodes.CLAVE_ACTUAL_INCORRECTA);
    }

    const semilla = await bcrypt.genSalt(
      ConfiguracionSeguridad.RONDAS_SAL_BCRYPT,
    );
    usuario.clave = await bcrypt.hash(dto.nuevaClave, semilla);

    await this.repositorioUsuarios.save(usuario);
  }

  async cambiarEstado(id: number, nuevoEstado: EstadoUsuario): Promise<User> {
    const usuario = await this.obtenerPorId(id);
    usuario.estado = nuevoEstado;
    return await this.repositorioUsuarios.save(usuario);
  }

  async obtenerPorId(id: number): Promise<User> {
    const usuario = await this.repositorioUsuarios.findOne({ where: { id } });
    if (!usuario) {
      throw new BusinessException(ErrorCodes.USUARIO_NO_ENCONTRADO);
    }
    return usuario;
  }

  async obtenerPorEstado(estado: EstadoUsuario): Promise<User[]> {
    return await this.repositorioUsuarios.find({ where: { estado } });
  }
}
