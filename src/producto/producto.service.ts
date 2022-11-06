import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({
      relations: ['cultura'],
    });
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const pais: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['cultura'],
    });
    if (!pais)
      throw new BusinessLogicException(
        'El producto con el id dado no ha sido encontrado',
        BusinessError.NOT_FOUND,
      );

    return pais;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    return await this.productoRepository.save(producto);
  }

  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    const persistedProducto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!persistedProducto)
      throw new BusinessLogicException(
        'El producto con el id dado no ha sido encontrado',
        BusinessError.NOT_FOUND,
      );

    producto.id = id;

    return await this.productoRepository.save(producto);
  }

  async delete(id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto con el id dado no ha sido encontrado',
        BusinessError.NOT_FOUND,
      );

    await this.productoRepository.remove(producto);
  }
}
