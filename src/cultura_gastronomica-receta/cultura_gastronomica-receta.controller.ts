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
import { plainToInstance } from 'class-transformer';
import { RecetaEntity } from '../receta/receta.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaRecetaService } from './cultura_gastronomica-receta.service';
import { RecetaDto } from '../receta/receta.dto';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaRecetaController {
  constructor(
    private readonly culturaGastronomicaRecetaService: CulturaGastronomicaRecetaService,
  ) {}

  @Post(':culturaGastronomicaId/recetas/:recetaId')
  async addRecetaToCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaGastronomicaRecetaService.addRecetaToCulturaGastronomica(
      culturaGastronomicaId,
      recetaId,
    );
  }

  @Get(':culturaGastronomicaId/recetas')
  async findRecetasByCulturaGastronomicaId(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    return await this.culturaGastronomicaRecetaService.findRecetasByCulturaGastronomicaId(
      culturaGastronomicaId,
    );
  }

  @Put(':culturaGastronomicaId/recetas')
  async associateRecetasToCulturaGastronomica(
    @Body() recetasDto: RecetaDto[],
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    const recetas = plainToInstance(RecetaEntity, recetasDto);
    return await this.culturaGastronomicaRecetaService.associateRecetaToCulturaGastronomica(
      culturaGastronomicaId,
      recetas,
    );
  }

  @Get(':culturaGastronomicaId/recetas/:recetaId')
  async findRecetaByCulturasGastronomicaIdRecetaId(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaGastronomicaRecetaService.findRecetasByCulturaGastronomicaIdRecetaId(
      culturaGastronomicaId,
      recetaId,
    );
  }

  @Delete(':culturaGastronomicaId/recetas/:recetaId')
  @HttpCode(204)
  async deleteRecetaCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaGastronomicaRecetaService.removeRecetaFromCulturaGastronomica(
      culturaGastronomicaId,
      recetaId,
    );
  }
}
