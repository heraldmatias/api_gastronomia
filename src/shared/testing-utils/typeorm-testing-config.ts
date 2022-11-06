/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from '../../pais/pais.entity';
import { CulturaGastronomicaEntity } from '../../cultura_gastronomica/cultura_gastronomica.entity';
import { RestauranteEntity } from '../../restaurante/restaurante.entity';
import { ProductoEntity } from "../../producto/producto.entity";
import { RecetaEntity } from '../../receta/receta.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [PaisEntity,CulturaGastronomicaEntity, RestauranteEntity, ProductoEntity, RecetaEntity],
    synchronize: true,
    keepConnectionAlive: true
  }),
  TypeOrmModule.forFeature([PaisEntity,CulturaGastronomicaEntity, RestauranteEntity, ProductoEntity, RecetaEntity]),
];
