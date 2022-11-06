import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity';
import { RecetaEntity } from 'src/receta/receta.entity';
import { CulturaGastronomicaRecetaService } from './cultura_gastronomica-receta.service';
import { CulturaGastronomicaRecetaController } from './cultura_gastronomica-receta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, RecetaEntity])],
  providers: [CulturaGastronomicaRecetaService],
  controllers: [CulturaGastronomicaRecetaController]
})
export class CulturaGastronomicaRecetaModule {}
