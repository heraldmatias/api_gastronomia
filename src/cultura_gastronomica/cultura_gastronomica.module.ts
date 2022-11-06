import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from './cultura_gastronomica.entity';
import { CulturaGastronomicaService } from './cultura_gastronomica.service';
import { CulturaGastronomicaController } from './cultura_gastronomica.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity])],
    providers: [CulturaGastronomicaService],
    controllers: [CulturaGastronomicaController],
})
export class CulturaGastronomicaModule {}
