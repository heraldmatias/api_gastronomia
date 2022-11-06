import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { PaisController } from './pais.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PaisEntity])],
    providers: [PaisService],
    controllers: [PaisController],
})
export class PaisModule {}
