import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { PaisEntity } from './pais.entity';
import { Repository } from 'typeorm';


@Injectable()
export class PaisService {
    constructor(
        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>
    ){}

    async findAll(): Promise<PaisEntity[]> {
        return await this.paisRepository.find({ relations: ["culturasGastronomicas"] });
    }

    async findOne(id: string): Promise<PaisEntity> {
        try {
            const pais: PaisEntity = await this.paisRepository.findOne({where: {id}, relations: ["culturasGastronomicas"] } );
            if (!pais)
            throw new BusinessLogicException("El pais con el id dado no ha sido encontrado", BusinessError.NOT_FOUND);
        
            return pais;
        } catch (error) {
            throw new BusinessLogicException("El pais con el id dado no ha sido encontrado", BusinessError.NOT_FOUND);
        } 
    }

    async create(pais: PaisEntity): Promise<PaisEntity> {
        return await this.paisRepository.save(pais);
    }

    async update(id: string, pais: PaisEntity): Promise<PaisEntity> {
        try{
            const persistedPais: PaisEntity = await this.paisRepository.findOne({where:{id}});
            if (!persistedPais)
            throw new BusinessLogicException("El pais con el id dado no ha sido encontrado", BusinessError.NOT_FOUND);
            
            pais.id = id;  
            
            return await this.paisRepository.save(pais);

        } catch (error) {
            throw new BusinessLogicException("El pais con el id dado no ha sido encontrado", BusinessError.NOT_FOUND);
        } 
    }

    async delete(id: string) {
        try{
            const pais: PaisEntity = await this.paisRepository.findOne({where:{id}});
            if (!pais)
            throw new BusinessLogicException("El pais con el id dado no ha sido encontrado", BusinessError.NOT_FOUND);
        
            await this.paisRepository.remove(pais);
        } catch (error) {
            throw new BusinessLogicException("El pais con el id dado no ha sido encontrado", BusinessError.NOT_FOUND);
        }
    }
}
