import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { Exclude } from 'class-transformer';
import { RolUsuario } from '../enums/user-role.enum';
import { EstadoUsuario } from '../enums/user-status.enum';
import { obtenerFechaYHoraActual } from '@common/utils';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombres: string;

  @Column({ length: 100 })
  apellidos: string;

  @Column({ length: 9 })
  telefono: string;

  @Column({ unique: true, length: 150 })
  correoElectronico: string;

  @Exclude() // Evita que se incluya en la serialización JSON
  @Column({ select: false }) // Evita que TypeORM la traiga por defecto en consultas
  clave: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.USUARIO,
  })
  rol: RolUsuario;

  @Column({
    type: 'int',
    default: EstadoUsuario.HABILITADO,
  })
  estado: EstadoUsuario;

  @Column({ type: 'date', name: 'fecha_creacion' })
  fechaCreacion: string;

  @Column({ type: 'time', name: 'hora_creacion' })
  horaCreacion: string;

  @BeforeInsert()
  establecerFechaYHora() {
    const { fecha, hora } = obtenerFechaYHoraActual();
    this.fechaCreacion = fecha;
    this.horaCreacion = hora;
  }
}
