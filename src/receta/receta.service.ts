import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RecetaEntity } from './receta.entity';

@Injectable()
export class RecetaService {
  constructor(
    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,
  ) {}

  async findAll(): Promise<RecetaEntity[]> {
    return await this.recetaRepository.find({
      relations: ['culturasGastronomicas'],
    });
  }

  async findOne(id: string): Promise<RecetaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
      relations: ['culturasGastronomicas'],
    });
    if (!receta)
      throw new BusinessLogicException(
        'Receta no encontrada',
        BusinessError.NOT_FOUND,
      );
    return receta;
  }

  async create(receta: RecetaEntity): Promise<RecetaEntity> {
    return await this.recetaRepository.save(receta);
  }

  async update(id: string, receta: RecetaEntity): Promise<RecetaEntity> {
    const recetaEncontrada = await this.recetaRepository.findOne({
      where: { id },
    });
    if (!recetaEncontrada)
      throw new BusinessLogicException(
        'Receta no encontrada',
        BusinessError.NOT_FOUND,
      );
    return await this.recetaRepository.save({ ...recetaEncontrada, ...receta });
  }

  async delete(id: string): Promise<RecetaEntity> {
    const recetaEncontrada = await this.recetaRepository.findOne({
      where: { id },
    });
    if (!recetaEncontrada)
      throw new BusinessLogicException(
        'Receta no encontrada',
        BusinessError.NOT_FOUND,
      );
    return await this.recetaRepository.remove(recetaEncontrada);
  }
}
