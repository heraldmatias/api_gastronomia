import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';

@Injectable()
export class CulturaGastronomicaRestauranteService {
  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>
  ) { }

  async addResturanteCulturaGastronomica(culturaGastronomicaId: string, restauranteId: string): Promise<CulturaGastronomicaEntity> {
    const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({ where: { id: restauranteId } });

    if (!restaurante)
      throw new BusinessLogicException("Restaurante no encontrado", BusinessError.NOT_FOUND);

    const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["restaurantes"] })
    if (!culturaGastronomica)
      throw new BusinessLogicException("Cultura gastronomica no encontrada", BusinessError.NOT_FOUND);

    culturaGastronomica.restaurantes = [...culturaGastronomica.restaurantes, restaurante];
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async findRestauranteByCulturaGastronomicaIdRestauranteId(culturaGastronomicaId: string, restauranteId: string): Promise<RestauranteEntity> {
    const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({ where: { id: restauranteId } });

    if (!restaurante)
      throw new BusinessLogicException("Restaurante no encontrado", BusinessError.NOT_FOUND);

    const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["restaurantes"] })
    if (!culturaGastronomica)
      throw new BusinessLogicException("Cultura gastronomica no encontrada", BusinessError.NOT_FOUND);

    const culturaGastronomicaRestaurante: RestauranteEntity = culturaGastronomica.restaurantes.find(e => e.id === restaurante.id);

    if (!culturaGastronomicaRestaurante)
      throw new BusinessLogicException("El restaurante no esta asociado a la cultura gastronomica", BusinessError.PRECONDITION_FAILED)

    return culturaGastronomicaRestaurante;
  }

  async findRestaurantesCulturaGastronomicaId(culturaGastronomicaId: string): Promise<RestauranteEntity[]> {
    const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["restaurantes"] })
    if (!culturaGastronomica)
      throw new BusinessLogicException("Cultura gastronomica no encontrada", BusinessError.NOT_FOUND);

    return culturaGastronomica.restaurantes;
  }

  async associateRestaurantesCulturaGastronomica(culturaGastronomicaId: string, restaurantes: RestauranteEntity[]): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["restaurantes"] })
    if (!culturaGastronomica)
      throw new BusinessLogicException("Cultura gastronomica no encontrada", BusinessError.NOT_FOUND);

    for (let i = 0; i < restaurantes.length; i++) {
      const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({ where: { id: `${restaurantes[i].id}` } });
      if (!restaurante)
        throw new BusinessLogicException("Restaurante no encontrado", BusinessError.NOT_FOUND)
    }

    culturaGastronomica.restaurantes = restaurantes;
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async deleteRestauranteCulturaGastronomica(culturaGastronomicaId: string, restauranteId: string) {
    const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({ where: { id: restauranteId } });

    if (!restaurante)
      throw new BusinessLogicException("Restaurante no encontrado", BusinessError.NOT_FOUND);

    const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["restaurantes"] })
    if (!culturaGastronomica)
      throw new BusinessLogicException("Cultura gastronomica no encontrada", BusinessError.NOT_FOUND);

    const culturaGastronomicaRestaurante: RestauranteEntity = culturaGastronomica.restaurantes.find(e => e.id === restaurante.id);

    if (!culturaGastronomicaRestaurante)
      throw new BusinessLogicException("El restaurante no esta asociado a la cultura gastronomica", BusinessError.PRECONDITION_FAILED)

    culturaGastronomica.restaurantes = culturaGastronomica.restaurantes.filter(e => e.id !== restauranteId);
    await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }
}
