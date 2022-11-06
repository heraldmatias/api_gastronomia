/* eslint-disable prettier/prettier */
import { PaisEntity } from '../pais/pais.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { ProductoEntity } from "../producto/producto.entity";
import { RecetaEntity } from '../receta/receta.entity';

@Entity()
export class CulturaGastronomicaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @ManyToOne(() => PaisEntity, pais => pais.culturasGastronomicas)
    pais: CulturaGastronomicaEntity;

    @ManyToMany(() => RestauranteEntity, restaurante => restaurante.culturasGastronomicas)

    @JoinTable()
    restaurantes: RestauranteEntity[];

    @OneToMany(() => ProductoEntity, producto => producto.cultura)
    productos: ProductoEntity[];

    @OneToMany(() => RecetaEntity, receta => receta.culturasGastronomicas)
    recetas: RecetaEntity[];
}
