import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoController } from './producto.controller';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
  providers: [ProductoService],
  controllers: [ProductoController],
})
export class ProductoModule {}
