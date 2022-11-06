import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RestauranteDto } from 'src/restaurante/restaurante.dto';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaRestauranteService } from './cultura_gastronomica-restaurante.service';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaRestauranteController {
  constructor(private readonly culturaGastrononomicaRestauranteService: CulturaGastronomicaRestauranteService){}

  @Post(':culturaGastronomicaId/restaurantes/:restauranteId')
  async addRestauranteCulturaGastronomica(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('restauranteId') restauranteId: string) {
    return await this.culturaGastrononomicaRestauranteService.addResturanteCulturaGastronomica(culturaGastronomicaId, restauranteId);
  }

  @Get(':culturaGastronomicaId/restaurantes/:restauranteId')
  async findRestauranteByCulturaGastronomicaIdRestauranteId(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('restauranteId') restauranteId: string) {
    return await this.culturaGastrononomicaRestauranteService.findRestauranteByCulturaGastronomicaIdRestauranteId(culturaGastronomicaId, restauranteId);
  }

  @Get(':culturaGastronomicaId/restaurantes')
  async findRestaurantesByculturaGastronomicaId(@Param('culturaGastronomicaId') culturaGastronomicaId: string) {
    return await this.culturaGastrononomicaRestauranteService.findRestaurantesCulturaGastronomicaId(culturaGastronomicaId);
  }

  @Put(':culturaGastronomicaId/restaurantes')
  async associateRestaurantesCulturaGastronomica(@Body() restaurantesDto: RestauranteDto[], @Param('culturaGastronomicaId') culturaGastronomicaId: string) {
    const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto)
    return await this.culturaGastrononomicaRestauranteService.associateRestaurantesCulturaGastronomica(culturaGastronomicaId, restaurantes);
  }

  @Delete(':culturaGastronomicaId/restaurantes/:restauranteId')
  @HttpCode(204)
  async deleteRestauranteCulturaGastronomica(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('restauranteId') restauranteId: string) {
    return await this.culturaGastrononomicaRestauranteService.deleteRestauranteCulturaGastronomica(culturaGastronomicaId, restauranteId);
  }
}