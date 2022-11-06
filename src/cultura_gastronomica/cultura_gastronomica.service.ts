import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CulturaGastronomicaEntity } from './cultura_gastronomica.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CulturaGastronomicaService {
    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>
    ){}

    async findAll(): Promise<CulturaGastronomicaEntity[]> {
        return await this.culturaGastronomicaRepository.find({ relations: ["pais"] });
    }

    async findOne(id: string): Promise<CulturaGastronomicaEntity> {
        try{
            const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id}, relations: ["pais"] } );
            if (!culturaGastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id dado no ha sido encontrada", BusinessError.NOT_FOUND);
        
            return culturaGastronomica;
        } catch (error) {
            throw new BusinessLogicException("La cultura gastronomica con el id dado no ha sido encontrada", BusinessError.NOT_FOUND);
        }
    }

    async create(culturaGastronomica: CulturaGastronomicaEntity): Promise<CulturaGastronomicaEntity> {
        return await this.culturaGastronomicaRepository.save(culturaGastronomica);
    }

    async update(id: string, culturaGastronomica: CulturaGastronomicaEntity): Promise<CulturaGastronomicaEntity> {
        try {
            const persistedCulturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where:{id}});
            if (!persistedCulturaGastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id dado no ha sido encontrada", BusinessError.NOT_FOUND);
            
            culturaGastronomica.id = id;  
            
            return await this.culturaGastronomicaRepository.save(culturaGastronomica);
        } catch (error) {
            throw new BusinessLogicException("La cultura gastronomica con el id dado no ha sido encontrada", BusinessError.NOT_FOUND);
        }
    }

    async delete(id: string) {
        try {
            const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where:{id}});
            if (!culturaGastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id dado no ha sido encontrada", BusinessError.NOT_FOUND);
        
            return await this.culturaGastronomicaRepository.remove(culturaGastronomica);
        } catch (error) {
            throw new BusinessLogicException("La cultura gastronomica con el id dado no ha sido encontrada", BusinessError.NOT_FOUND);
        }
    }

}
