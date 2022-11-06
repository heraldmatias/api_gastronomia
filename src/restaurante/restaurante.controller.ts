import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { plainToInstance } from 'class-transformer';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {
  constructor(private readonly restauranteService: RestauranteService) {}

  @Get()
  async findAll() {
    return await this.restauranteService.findAll();
  }

  @Get(':restauranteId')
  async findOne(@Param('restauranteId') restauranteId: string) {
    return await this.restauranteService.findOne(restauranteId);
  }

  @Post()
  async create(@Body() museumDto: RestauranteDto) {
    const museum: RestauranteEntity = plainToInstance(RestauranteEntity, museumDto);
    return await this.restauranteService.create(museum);
  }

  @Put(':restauranteId')
  async update(@Param('restauranteId') restauranteId: string, @Body() museumDto: RestauranteDto) {
    const museum: RestauranteEntity = plainToInstance(RestauranteEntity, museumDto);
    return await this.restauranteService.update(restauranteId, museum);
  }

  @Delete(':restauranteId')
  @HttpCode(204)
  async delete(@Param('restauranteId') restauranteId: string) {
    return await this.restauranteService.delete(restauranteId);
  }
}
