/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CulturaGastronomicaEntity } from "../cultura_gastronomica/cultura_gastronomica.entity";

@Entity()
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  historia: string;

  @ManyToOne(() => CulturaGastronomicaEntity, cultura => cultura.productos)
  cultura: CulturaGastronomicaEntity;
}
