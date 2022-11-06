import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturaGastronomicaRestauranteService } from './cultura_gastronomica-restaurante.service';
import { CulturaGastronomicaRestauranteController } from './cultura_gastronomica-restaurante.controller';

@Module({
  providers: [CulturaGastronomicaRestauranteService],
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, RestauranteEntity])],
  controllers: [CulturaGastronomicaRestauranteController]
})
export class CulturaGastronomicaRestauranteModule {}
