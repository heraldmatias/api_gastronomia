import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class CulturaGastronomicaRecetaService {
  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,
  ) {}

  async addRecetaToCulturaGastronomica(
    culturaGastronomicaId: string,
    recetaId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta)
      throw new BusinessLogicException(
        `La receta con id ${recetaId} no existe`,
        BusinessError.NOT_FOUND,
      );
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        `La cultura gastronomica con id ${culturaGastronomicaId} no existe`,
        BusinessError.NOT_FOUND,
      );
    culturaGastronomica.recetas = [...culturaGastronomica.recetas, receta];
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async findRecetasByCulturaGastronomicaIdRecetaId(
    culturaGastronomicaId: string,
    recetaId: string,
  ): Promise<RecetaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta)
      throw new BusinessLogicException(
        `La receta con id ${recetaId} no existe`,
        BusinessError.NOT_FOUND,
      );
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        `La cultura gastronomica con id ${culturaGastronomicaId} no existe`,
        BusinessError.NOT_FOUND,
      );

      const culturaGastronomicaReceta: RecetaEntity = culturaGastronomica.recetas.find((e) => e.id === receta.id);

    if (!culturaGastronomicaReceta)
      throw new BusinessLogicException(`La receta con id ${recetaId} no esta asociada a la cultura gastronomica con id ${culturaGastronomicaId}`, BusinessError.PRECONDITION_FAILED);
    return culturaGastronomicaReceta;
  }

  async findRecetasByCulturaGastronomicaId(
    culturaGastronomicaId: string,
  ): Promise<RecetaEntity[]> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        `La cultura gastronomica con id ${culturaGastronomicaId} no existe`,
        BusinessError.NOT_FOUND,
      );
    return culturaGastronomica.recetas;
  }

  async associateRecetaToCulturaGastronomica(
    culturaGastronomicaId: string,
    recetas: RecetaEntity[],
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        `La cultura gastronomica con id ${culturaGastronomicaId} no existe`,
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < recetas.length; i++) {
      const receta: RecetaEntity = await this.recetaRepository.findOne({
        where: { id: recetas[i].id },
      });
      if (!receta)
        throw new BusinessLogicException(
          `La receta con id ${recetas[i].id} no existe`,
          BusinessError.NOT_FOUND,
        );
    }
    culturaGastronomica.recetas = recetas;
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async removeRecetaFromCulturaGastronomica(
    culturaGastronomicaId: string,
    recetaId: string,
  ) {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta)
      throw new BusinessLogicException(
        `La receta con id ${recetaId} no existe`,
        BusinessError.NOT_FOUND,
      );
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        `La cultura gastronomica con id ${culturaGastronomicaId} no existe`,
        BusinessError.NOT_FOUND,
      );
    const culturaGastronomicaReceta: RecetaEntity =
      culturaGastronomica.recetas.find((e) => e.id === recetaId);

    if (!culturaGastronomicaReceta)
      throw new BusinessLogicException(
        `La receta con id ${recetaId} no esta asociada a la cultura gastronomica con id ${culturaGastronomicaId}`,
        BusinessError.NOT_FOUND,
      );
    culturaGastronomica.recetas = culturaGastronomica.recetas.filter(
      (e) => e.id !== recetaId,
    );
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }
}
