import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productoList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productoList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.address.country(),
        descripcion: faker.lorem.paragraph(1),
        historia: faker.lorem.paragraph(5),
      });
      productoList.push(producto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todos los productoes', async () => {
    const productoes: ProductoEntity[] = await service.findAll();
    expect(productoes).not.toBeNull();
    expect(productoes).toHaveLength(productoList.length);
  });

  it('findOne debe retornar un producto por id', async () => {
    const storedProducto: ProductoEntity = productoList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre);
  });

  it('findOne deberia arrojar un excepcion para un producto invalido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no ha sido encontrado',
    );
  });

  it('Crear deberia retornar un nuevo producto', async () => {
    const producto: ProductoEntity = {
      id: '',
      nombre: faker.address.country(),
      cultura: new CulturaGastronomicaEntity(),
      descripcion: 'Lorem ipsum dolor sit amet',
      historia: 'Lorem ipsum dolor sit amet',
    };

    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({
      where: { id: `${newProducto.id}` },
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre);
  });

  it('Update deberia modificar un producto', async () => {
    const producto: ProductoEntity = productoList[0];
    producto.nombre = 'New name';

    const updatedProducto: ProductoEntity = await service.update(
      producto.id,
      producto,
    );
    expect(updatedProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({
      where: { id: `${producto.id}` },
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre);
  });

  it('update deberia arrojar un error para un producto invalido', async () => {
    let producto: ProductoEntity = productoList[0];
    producto = {
      ...producto,
      nombre: 'New name',
    };
    await expect(() => service.update('0', producto)).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no ha sido encontrado',
    );
  });

  it('delete deberia remover un producto', async () => {
    const producto: ProductoEntity = productoList[0];
    await service.delete(producto.id);

    const deletedProducto: ProductoEntity = await repository.findOne({
      where: { id: `${producto.id}` },
    });
    expect(deletedProducto).toBeNull();
  });

  it('delete deberia arrojar un error para un producto invalido', async () => {
    const producto: ProductoEntity = productoList[0];
    await service.delete(producto.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no ha sido encontrado',
    );
  });
});
