import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity';
import { ProductoEntity } from 'src/producto/producto.entity';
import { CulturaGastronomicaProductoService } from './cultura_gastronomica-producto.service';
import { CulturaGastronomicaProductoController } from './cultura_gastronomica-producto.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CulturaGastronomicaEntity, ProductoEntity]),
  ],
  providers: [CulturaGastronomicaProductoService],
  controllers: [CulturaGastronomicaProductoController],
})
export class CulturaGastronomicaProductoModule {}
