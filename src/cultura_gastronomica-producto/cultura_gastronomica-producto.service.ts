import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { ProductoEntity } from '../producto/producto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class CulturaGastronomicaProductoService {
  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async addProductoCulturaGastronomica(
    culturaGastronomicaId: string,
    productoId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id dado no ha sido encontrado',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['productos'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'La cultura gastronomica con el id dado no ha sido encontrada',
        BusinessError.NOT_FOUND,
      );

    culturaGastronomica.productos = [
      ...culturaGastronomica.productos,
      producto,
    ];
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async findProductoByCulturaGastronomicaIdProductoId(
    culturaGastronomicaId: string,
    productoId: string,
  ): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id dado no ha sido encontrado',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['productos'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'La cultura gastronomica con el id dado no ha sido encontrada',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomicaproducto: ProductoEntity =
      culturaGastronomica.productos.find((e) => e.id === producto.id);

    if (!culturaGastronomicaproducto)
      throw new BusinessLogicException(
        'El producto con el id dado no esta asociado a la cultura gastronomica',
        BusinessError.PRECONDITION_FAILED,
      );

    return culturaGastronomicaproducto;
  }

  async findProductosByCulturaGastronomicaId(
    culturaGastronomicaId: string,
  ): Promise<ProductoEntity[]> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['productos'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'La cultura gastronomica con el id dado no ha sido encontrada',
        BusinessError.NOT_FOUND,
      );

    return culturaGastronomica.productos;
  }

  async associateProductosCulturaGastronomica(
    culturaGastronomicaId: string,
    productos: ProductoEntity[],
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['productos'],
      });

    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'La cultura gastronomica con el id dado no ha sido encontrada',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < productos.length; i++) {
      const producto: ProductoEntity = await this.productoRepository.findOne({
        where: { id: productos[i].id },
      });
      if (!producto)
        throw new BusinessLogicException(
          'El producto con el id dado no ha sido encontrado',
          BusinessError.NOT_FOUND,
        );
    }

    culturaGastronomica.productos = productos;
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async deleteProductoCulturaGastronomica(
    culturaGastronomicaId: string,
    productoId: string,
  ) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id dado no ha sido encontrado',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['productos'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'La cultura gastronomica con el id dado no ha sido encontrada',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomicaproducto: ProductoEntity =
      culturaGastronomica.productos.find((e) => e.id === producto.id);

    if (!culturaGastronomicaproducto)
      throw new BusinessLogicException(
        'El producto con el id dado no esta asociado a la cultura gastronomica',
        BusinessError.PRECONDITION_FAILED,
      );

    culturaGastronomica.productos = culturaGastronomica.productos.filter(
      (e) => e.id !== productoId,
    );
    await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }
}
