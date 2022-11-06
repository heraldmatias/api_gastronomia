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
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { RecetaDto } from './receta.dto';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';

@Controller('recetas')
@UseInterceptors(BusinessErrorsInterceptor)
export class RecetaController {
  constructor(private readonly recetaService: RecetaService) {}

  @Get()
  async findAll() {
    return await this.recetaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.recetaService.findOne(id);
  }

  @Post()
  async create(@Body() RecetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, RecetaDto);
    return await this.recetaService.create(receta);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() RecetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, RecetaDto);
    return await this.recetaService.update(id, receta);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.recetaService.delete(id);
  }
}
