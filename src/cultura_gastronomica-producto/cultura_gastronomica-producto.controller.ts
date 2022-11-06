import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ProductoDto } from '../producto/producto.dto';
import { ProductoEntity } from '../producto/producto.entity';
import { plainToInstance } from 'class-transformer';
import { CulturaGastronomicaProductoService } from './cultura_gastronomica-producto.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaProductoController {
  constructor(
    private readonly culturaGastrononomicaProductoService: CulturaGastronomicaProductoService,
  ) {}

  @Post(':culturaGastronomicaId/productos/:productoId')
  async addProductoCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.culturaGastrononomicaProductoService.addProductoCulturaGastronomica(
      culturaGastronomicaId,
      productoId,
    );
  }

  @Get(':culturaGastronomicaId/productos/:productoId')
  async findProductoByCulturaGastronomicaIdproductoId(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.culturaGastrononomicaProductoService.findProductoByCulturaGastronomicaIdProductoId(
      culturaGastronomicaId,
      productoId,
    );
  }

  @Get(':culturaGastronomicaId/Productos')
  async findProductosByculturaGastronomicaId(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    return await this.culturaGastrononomicaProductoService.findProductosByCulturaGastronomicaId(
      culturaGastronomicaId,
    );
  }

  @Put(':culturaGastronomicaId/Productos')
  async associateProductosCulturaGastronomica(
    @Body() ProductosDto: ProductoDto[],
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    const Productos = plainToInstance(ProductoEntity, ProductosDto);
    return await this.culturaGastrononomicaProductoService.associateProductosCulturaGastronomica(
      culturaGastronomicaId,
      Productos,
    );
  }

  @Delete(':culturaGastronomicaId/productos/:productoId')
  @HttpCode(204)
  async deleteProductoCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.culturaGastrononomicaProductoService.deleteProductoCulturaGastronomica(
      culturaGastronomicaId,
      productoId,
    );
  }
}
