import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';
import { RecetaController } from './receta.controller';

@Module({
  providers: [RecetaService],
  imports: [TypeOrmModule.forFeature([RecetaEntity])],
  controllers: [RecetaController],
})
export class RecetaModule {}
