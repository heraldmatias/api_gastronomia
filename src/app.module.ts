import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';

import { PaisModule } from './pais/pais.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from './pais/pais.entity';
import { CulturaGastronomicaModule } from './cultura_gastronomica/cultura_gastronomica.module';
import { CulturaGastronomicaEntity } from './cultura_gastronomica/cultura_gastronomica.entity';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { CulturaGastronomicaRestauranteModule } from './cultura_gastronomica-restaurante/cultura_gastronomica-restaurante.module';
import { RecetaModule } from './receta/receta.module';
import { RecetaEntity } from './receta/receta.entity';
import { ProductoModule } from './producto/producto.module';
import { ProductoEntity } from './producto/producto.entity';
import { CulturaGastronomicaProductoModule } from './cultura_gastronomica-producto/cultura_gastronomica-producto.module';

@Module({
  imports: [
    PaisModule,
    CulturaGastronomicaModule,
    RestauranteModule,
    ProductoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'culturas_gastronomicas_db',
      entities: [
        PaisEntity,
        CulturaGastronomicaEntity,
        RestauranteEntity,
        ProductoEntity,
        RecetaEntity,
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    CulturaGastronomicaRestauranteModule,
    RecetaModule,
    CulturaGastronomicaProductoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
