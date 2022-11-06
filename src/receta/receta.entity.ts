/* eslint-disable prettier/prettier */
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RecetaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  foto: string;

  @Column()
  video: string;

  @Column()
  preparacion: string;

  @ManyToOne(
    () => CulturaGastronomicaEntity,
    (culturaGastronomica) => culturaGastronomica.recetas,
  )
  culturasGastronomicas: CulturaGastronomicaEntity[];
}
