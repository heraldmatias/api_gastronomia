/* eslint-disable prettier/prettier */
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class PaisEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @OneToMany(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.pais)
    culturasGastronomicas: CulturaGastronomicaEntity[];
 

}
