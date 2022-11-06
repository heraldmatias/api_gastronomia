import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CulturaGastronomicaDto } from './cultura_gastronomica.dto';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaEntity } from './cultura_gastronomica.entity';
import { CulturaGastronomicaService } from './cultura_gastronomica.service';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaController {
    constructor(private readonly culturaGastronomicaService: CulturaGastronomicaService){}

    @Get()
    async findAll() {
      return await this.culturaGastronomicaService.findAll();
    }
   
    @Get(':culturaGastronomicaId')
    async findOne(@Param('culturaGastronomicaId') culturaGastronomicaId: string) {
      return await this.culturaGastronomicaService.findOne(culturaGastronomicaId);
    }
   
    @Post()
    async create(@Body() culturaGastronomicaDto: CulturaGastronomicaDto) {
     const culturaGastronomica: CulturaGastronomicaEntity = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto)
     return await this.culturaGastronomicaService.create(culturaGastronomica);
    }
   
    @Put(':culturaGastronomicaId')
    async update(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Body() culturaGastronomicaDto: CulturaGastronomicaDto) {
     const culturaGastronomica: CulturaGastronomicaEntity = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto)
      return await this.culturaGastronomicaService.update(culturaGastronomicaId, culturaGastronomica);
    }
   
    @Delete(':culturaGastronomicaId')
    @HttpCode(204)
    async delete(@Param('culturaGastronomicaId') culturaGastronomicaId: string) {
      return await this.culturaGastronomicaService.delete(culturaGastronomicaId);
    }
}
