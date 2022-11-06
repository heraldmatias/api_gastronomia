import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CulturaGastronomicaProductoService } from './cultura_gastronomica-producto.service';
import { faker } from '@faker-js/faker';

describe('CulturaGastronomicaProductoService', () => {
  let service: CulturaGastronomicaProductoService;
  let culturaGatronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let culturaGastronomica: CulturaGastronomicaEntity;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaProductoService],
    }).compile();

    service = module.get<CulturaGastronomicaProductoService>(
      CulturaGastronomicaProductoService,
    );
    culturaGatronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    culturaGatronomicaRepository.clear();

    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.address.country(),
        descripcion: faker.lorem.paragraph(1),
        historia: faker.lorem.paragraph(5),
      });
      productosList.push(producto);
    }

    culturaGastronomica = await culturaGatronomicaRepository.save({
      nombre: faker.address.country(),
      descripcion: faker.address.direction(),
      productos: productosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductoCulturaGastronomica should add an producto to a culturaGastronomica', async () => {
    const newproducto: ProductoEntity = await productoRepository.save({
      nombre: faker.address.country(),
      descripcion: faker.lorem.paragraph(1),
      historia: faker.lorem.paragraph(5),
    });

    const newCulturaGastronomica: CulturaGastronomicaEntity =
      await culturaGatronomicaRepository.save({
        nombre: faker.address.country(),
        descripcion: faker.address.direction(),
      });

    const result: CulturaGastronomicaEntity =
      await service.addProductoCulturaGastronomica(
        newCulturaGastronomica.id,
        newproducto.id,
      );

    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(newproducto.nombre);
    expect(result.productos[0].descripcion).toBe(newproducto.descripcion);
  });

  it('addProductoCulturaGastronomica should thrown exception for an invalid producto', async () => {
    const newCulturaGastronomica: CulturaGastronomicaEntity =
      await culturaGatronomicaRepository.save({
        nombre: faker.address.country(),
        descripcion: faker.address.direction(),
      });

    await expect(() =>
      service.addProductoCulturaGastronomica(newCulturaGastronomica.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no ha sido encontrado',
    );
  });

  it('addProductoCulturaGastronomica should throw an exception for an invalid culturaGastronomica', async () => {
    const newproducto: ProductoEntity = await productoRepository.save({
      nombre: faker.address.country(),
      descripcion: faker.lorem.paragraph(1),
      historia: faker.lorem.paragraph(5),
    });

    await expect(() =>
      service.addProductoCulturaGastronomica('0', newproducto.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con el id dado no ha sido encontrada',
    );
  });

  it('findProductoByCulturaGastronomicaIdProductoId should return producto by culturaGastronomica', async () => {
    const producto: ProductoEntity = productosList[0];
    const storedproducto: ProductoEntity =
      await service.findProductoByCulturaGastronomicaIdProductoId(
        culturaGastronomica.id,
        producto.id,
      );
    expect(storedproducto).not.toBeNull();
    expect(storedproducto.nombre).toBe(producto.nombre);
    expect(storedproducto.descripcion).toBe(producto.descripcion);
    expect(storedproducto.historia).toBe(producto.historia);
  });

  it('findProductoByCulturaGastronomicaIdProductoId should throw an exception for an invalid producto', async () => {
    await expect(() =>
      service.findProductoByCulturaGastronomicaIdProductoId(
        culturaGastronomica.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no ha sido encontrado',
    );
  });

  it('findProductoByCulturaGastronomicaIdProductoId should throw an exception for an invalid culturaGastronomica', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() =>
      service.findProductoByCulturaGastronomicaIdProductoId('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con el id dado no ha sido encontrada',
    );
  });

  it('findProductoByCulturaGastronomicaIdProductoId should throw an exception for an producto not associated to the culturaGastronomica', async () => {
    const newproducto: ProductoEntity = await productoRepository.save({
      nombre: faker.address.country(),
      descripcion: faker.lorem.paragraph(1),
      historia: faker.lorem.paragraph(5),
    });

    await expect(() =>
      service.findProductoByCulturaGastronomicaIdProductoId(
        culturaGastronomica.id,
        newproducto.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no esta asociado a la cultura gastronomica',
    );
  });

  it('findProductosByCulturaGastronomicaId should return productos by culturaGastronomica', async () => {
    const productos: ProductoEntity[] =
      await service.findProductosByCulturaGastronomicaId(
        culturaGastronomica.id,
      );
    expect(productos.length).toBe(5);
  });

  it('findProductosByCulturaGastronomicaId should throw an exception for an invalid culturaGastronomica', async () => {
    await expect(() =>
      service.findProductosByCulturaGastronomicaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con el id dado no ha sido encontrada',
    );
  });

  it('associateProductosCulturaGastronomica should update productos list for a culturaGastronomica', async () => {
    const newproducto: ProductoEntity = await productoRepository.save({
      nombre: faker.address.country(),
      descripcion: faker.lorem.paragraph(1),
      historia: faker.lorem.paragraph(5),
    });

    const updatedCulturaGastronomica: CulturaGastronomicaEntity =
      await service.associateProductosCulturaGastronomica(
        culturaGastronomica.id,
        [newproducto],
      );
    expect(updatedCulturaGastronomica.productos.length).toBe(1);

    expect(updatedCulturaGastronomica.productos[0].nombre).toBe(
      newproducto.nombre,
    );
    expect(updatedCulturaGastronomica.productos[0].descripcion).toBe(
      newproducto.descripcion,
    );
    expect(updatedCulturaGastronomica.productos[0].historia).toBe(
      newproducto.historia,
    );
  });

  it('associateProductosCulturaGastronomica should throw an exception for an invalid culturaGastronomica', async () => {
    const newproducto: ProductoEntity = await productoRepository.save({
      nombre: faker.address.country(),
      descripcion: faker.lorem.paragraph(1),
      historia: faker.lorem.paragraph(5),
    });

    await expect(() =>
      service.associateProductosCulturaGastronomica('0', [newproducto]),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con el id dado no ha sido encontrada',
    );
  });

  it('associateProductosCulturaGastronomica should throw an exception for an invalid producto', async () => {
    const newproducto: ProductoEntity = productosList[0];
    newproducto.id = '0';

    await expect(() =>
      service.associateProductosCulturaGastronomica(culturaGastronomica.id, [
        newproducto,
      ]),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no ha sido encontrado',
    );
  });

  it('deleteproductoToCulturaGastronomica should remove an producto from a culturaGastronomica', async () => {
    const producto: ProductoEntity = productosList[0];

    await service.deleteProductoCulturaGastronomica(
      culturaGastronomica.id,
      producto.id,
    );

    const storedCulturaGastronomica: CulturaGastronomicaEntity =
      await culturaGatronomicaRepository.findOne({
        where: { id: culturaGastronomica.id },
        relations: ['productos'],
      });
    const deletedproducto: ProductoEntity =
      storedCulturaGastronomica.productos.find((a) => a.id === producto.id);

    expect(deletedproducto).toBeUndefined();
  });

  it('deleteproductoToCulturaGastronomica should thrown an exception for an invalid producto', async () => {
    await expect(() =>
      service.deleteProductoCulturaGastronomica(culturaGastronomica.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no ha sido encontrado',
    );
  });

  it('deleteproductoToCulturaGastronomica should thrown an exception for an invalid culturaGastronomica', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() =>
      service.deleteProductoCulturaGastronomica('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con el id dado no ha sido encontrada',
    );
  });

  it('deleteproductoToCulturaGastronomica should thrown an exception for an non asocciated producto', async () => {
    const newproducto: ProductoEntity = await productoRepository.save({
      nombre: faker.address.country(),
      descripcion: faker.lorem.paragraph(1),
      historia: faker.lorem.paragraph(5),
    });

    await expect(() =>
      service.deleteProductoCulturaGastronomica(
        culturaGastronomica.id,
        newproducto.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id dado no esta asociado a la cultura gastronomica',
    );
  });
});
