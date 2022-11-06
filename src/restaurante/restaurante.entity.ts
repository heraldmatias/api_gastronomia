/* eslint-disable prettier/prettier */
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RestauranteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  ciudad: string;

  @Column()
  numeroEstrellas: number;

  @Column()
  fechaConsecusionEstrellas: Date;

  @ManyToMany(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.restaurantes)
  culturasGastronomicas: CulturaGastronomicaEntity[];
}
