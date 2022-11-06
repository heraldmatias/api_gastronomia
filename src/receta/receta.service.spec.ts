import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';
import { faker } from '@faker-js/faker';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetaList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    recetaList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        foto: faker.image.imageUrl(),
        video: faker.image.imageUrl(),
        preparacion: faker.lorem.sentence(),
      });
      recetaList.push(receta);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findAll should return all recetas', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetaList.length);
  });

  it('findOne should return a receta by id', async () => {
    const storedReceta: RecetaEntity = recetaList[0];
    const receta: RecetaEntity = await service.findOne(storedReceta.id);
    expect(receta).not.toBeNull();
    expect(receta.descripcion).toEqual(storedReceta.descripcion);
    expect(receta.foto).toEqual(storedReceta.foto);
    expect(receta.video).toEqual(storedReceta.video);
    expect(receta.preparacion).toEqual(storedReceta.preparacion);
  });

  it('findOne should throw an exception for an invalid receta', async () => {
    await expect(service.findOne('9999')).rejects.toHaveProperty(
      'message',
      'Receta no encontrada',
    );
  });

  it('create should create a new receta', async () => {
    const receta: RecetaEntity = await service.create({
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.imageUrl(),
      video: faker.image.imageUrl(),
      preparacion: faker.lorem.sentence(),
      culturasGastronomicas: [],
    });
    expect(receta).not.toBeNull();
    expect(receta.nombre).not.toBeNull();
    expect(receta.descripcion).not.toBeNull();
    expect(receta.foto).not.toBeNull();
    expect(receta.video).not.toBeNull();
    expect(receta.preparacion).not.toBeNull();
  });

  it('update should update a receta', async () => {
    const storedReceta: RecetaEntity = recetaList[0];
    const receta: RecetaEntity = await service.update(storedReceta.id, {
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.imageUrl(),
      video: faker.image.imageUrl(),
      preparacion: faker.lorem.sentence(),
      culturasGastronomicas: [],
      id: '',
    });
    expect(receta).not.toBeNull();
    expect(receta.nombre).not.toBeNull();
    expect(receta.descripcion).not.toBeNull();
    expect(receta.foto).not.toBeNull();
    expect(receta.video).not.toBeNull();
    expect(receta.preparacion).not.toBeNull();
  });

  it('update should throw an exception for an invalid receta', async () => {
    await expect(
      service.update('9999', {
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        foto: faker.image.imageUrl(),
        video: faker.image.imageUrl(),
        preparacion: faker.lorem.sentence(),
        culturasGastronomicas: [],
        id: '',
      }),
    ).rejects.toHaveProperty('message', 'Receta no encontrada');
  });

  it('delete should delete a receta', async () => {
    const storedReceta: RecetaEntity = recetaList[0];
    await service.delete(storedReceta.id);
    await expect(service.findOne(storedReceta.id)).rejects.toHaveProperty(
      'message',
      'Receta no encontrada',
    );
  });

  it('delete should throw an exception for an invalid receta', async () => {
    await expect(service.delete('9999')).rejects.toHaveProperty(
      'message',
      'Receta no encontrada',
    );
  });
});
