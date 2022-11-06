import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { Repository } from 'typeorm';
import { CulturaGastronomicaRecetaService } from './cultura_gastronomica-receta.service';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CulturaGastronomicaRecetaService', () => {
  let service: CulturaGastronomicaRecetaService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let recetaRepository: Repository<RecetaEntity>;
  let culturaGastronomica: CulturaGastronomicaEntity;
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaRecetaService],
    }).compile();

    service = module.get<CulturaGastronomicaRecetaService>(
      CulturaGastronomicaRecetaService,
    );
    culturaGastronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));
    recetaRepository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    recetaRepository.clear();
    culturaGastronomicaRepository.clear();
    recetasList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        foto: faker.image.imageUrl(),
        video: faker.image.imageUrl(),
        preparacion: faker.lorem.sentence(),
      });
      recetasList.push(receta);
    }

    culturaGastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      recetas: recetasList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('addRecetaToCulturaGastronomica deberia agregar una receta a la cultura gastronomica', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.imageUrl(),
      video: faker.image.imageUrl(),
      preparacion: faker.lorem.sentence(),
    });
    const newCulturaGastronomica: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });

    const result: CulturaGastronomicaEntity =
      await service.addRecetaToCulturaGastronomica(
        newCulturaGastronomica.id,
        newReceta.id,
      );
    expect(result.recetas.length).toBe(1);
    expect(result.recetas[0].id).not.toBeNull();
    expect(result.recetas[0].nombre).toBe(newReceta.nombre);
    expect(result.recetas[0].descripcion).toBe(newReceta.descripcion);
    expect(result.recetas[0].foto).toBe(newReceta.foto);
    expect(result.recetas[0].video).toBe(newReceta.video);
    expect(result.recetas[0].preparacion).toBe(newReceta.preparacion);
  });
  it('addRecetaCulturagastronomica deberia arrojar error con una receta invalida', async () => {
    const newCulturaGastronomica: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      });

    await expect(() =>
      service.addRecetaToCulturaGastronomica(newCulturaGastronomica.id, '0'),
    ).rejects.toHaveProperty('message', 'La receta con id 0 no existe');
  });

  it('addRecetaCultura deberia arrojar error con una cultura gastronomica invalida', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.imageUrl(),
      video: faker.image.imageUrl(),
      preparacion: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addRecetaToCulturaGastronomica('0', newReceta.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con id 0 no existe',
    );
  });

  it('findRecetasByCulturaGastronomicaIdRecetaId deberia arrojar una receta por cultura gastronomica', async () => {
    const receta: RecetaEntity = recetasList[0];

    const storedReceta: RecetaEntity =
      await service.findRecetasByCulturaGastronomicaIdRecetaId(
        culturaGastronomica.id,
        receta.id,
      );

    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toBe(receta.nombre);
    expect(storedReceta.descripcion).toBe(receta.descripcion);
    expect(storedReceta.foto).toBe(receta.foto);
    expect(storedReceta.video).toBe(receta.video);
    expect(storedReceta.preparacion).toBe(receta.preparacion);
  });

  it('findRecetasByCulturaGastronomicaIdRecetaId deberia arrojar error con una cultura gastronomica invalida', async () => {
    const receta: RecetaEntity = recetasList[0];

    await expect(() =>
      service.findRecetasByCulturaGastronomicaIdRecetaId('0', receta.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con id 0 no existe',
    );
  });

  it('findRecetasByCulturaGastronomicaIdRecetaId deberia arrojar error con una receta invalida', async () => {
    await expect(() =>
      service.findRecetasByCulturaGastronomicaIdRecetaId(
        culturaGastronomica.id,
        '0',
      ),
    ).rejects.toHaveProperty('message', 'La receta con id 0 no existe');
  });
  it('findRecetaByCulturagastronomicaIdRecetaId deberia arrojar el error de que la receta no esta asociada a la cultura gastronomica', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.imageUrl(),
      video: faker.image.imageUrl(),
      preparacion: faker.lorem.sentence(),
    });

    await expect(() =>
      service.findRecetasByCulturaGastronomicaIdRecetaId(
        culturaGastronomica.id,
        newReceta.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La receta con id ${newReceta.id} no esta asociada a la cultura gastronomica con id ${culturaGastronomica.id}`,
    );
  });

  it('findRecetasByCulturasGastronomicasId deberia retornar una receta por museo', async () => {
    const recetas: RecetaEntity[] =
      await service.findRecetasByCulturaGastronomicaId(culturaGastronomica.id);
    expect(recetas.length).toBe(5);
  });

  it('findRecetasByCulturasGastronomicasId deberia arrojar error con una cultura gastronomica invalida', async () => {
    await expect(() =>
      service.findRecetasByCulturaGastronomicaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con id 0 no existe',
    );
  });

  it('associateRecetasCulturaGastronomica deberia actualizar las recetas en una cultura gastronomica', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.imageUrl(),
      video: faker.image.imageUrl(),
      preparacion: faker.lorem.sentence(),
    });

    const updateCulturagastronomica: CulturaGastronomicaEntity =
      await service.associateRecetaToCulturaGastronomica(
        culturaGastronomica.id,
        [newReceta],
      );
    expect(updateCulturagastronomica.recetas.length).toBe(1);
    expect(updateCulturagastronomica.recetas[0].id).toBe(newReceta.id);
    expect(updateCulturagastronomica.recetas[0].nombre).toBe(newReceta.nombre);
    expect(updateCulturagastronomica.recetas[0].descripcion).toBe(
      newReceta.descripcion,
    );
    expect(updateCulturagastronomica.recetas[0].foto).toBe(newReceta.foto);
    expect(updateCulturagastronomica.recetas[0].video).toBe(newReceta.video);
    expect(updateCulturagastronomica.recetas[0].preparacion).toBe(
      newReceta.preparacion,
    );
  });

  it('associateRecetasCulturaGastronomica deberia arrojar error con una cultura gastronomica invalida', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.imageUrl(),
      video: faker.image.imageUrl(),
      preparacion: faker.lorem.sentence(),
    });

    await expect(() =>
      service.associateRecetaToCulturaGastronomica('0', [newReceta]),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con id 0 no existe',
    );
  });

  it('associateRecetasCulturaGastronomica deberia arrojar error con una receta invalida', async () => {
    const newReceta: RecetaEntity = recetasList[0];
    newReceta.id = '0';

    await expect(() =>
      service.associateRecetaToCulturaGastronomica(culturaGastronomica.id, [
        newReceta,
      ]),
    ).rejects.toHaveProperty('message', 'La receta con id 0 no existe');
  });

  it('deleteRecetaCulturaGastronomica deberia eliminar una receta de una cultura gastronomica', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.removeRecetaFromCulturaGastronomica(
      culturaGastronomica.id,
      receta.id,
    );
    const recetas: RecetaEntity[] =
      await service.findRecetasByCulturaGastronomicaId(culturaGastronomica.id);
    expect(recetas.length).toBe(4);
  });

  it('deleteRecetaCulturaGastronomica deberia arrojar error con una cultura gastronomica invalida', async () => {
    const receta: RecetaEntity = recetasList[0];
    await expect(() =>
      service.removeRecetaFromCulturaGastronomica('0', receta.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con id 0 no existe',
    );
  });

  it('deleteRecetaCulturaGastronomica deberia arrojar error con una receta invalida', async () => {
    await expect(() =>
      service.removeRecetaFromCulturaGastronomica(culturaGastronomica.id, '0'),
    ).rejects.toHaveProperty('message', 'La receta con id 0 no existe');
  });

  it('deleteRecetaCulturaGastronomica deberia arrojar error con una receta no asociada a la cultura gastronomica', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.imageUrl(),
      video: faker.image.imageUrl(),
      preparacion: faker.lorem.sentence(),
    });

    await expect(() =>
      service.removeRecetaFromCulturaGastronomica(
        culturaGastronomica.id,
        newReceta.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      `La receta con id ${newReceta.id} no esta asociada a la cultura gastronomica con id ${culturaGastronomica.id}`,
    );
  });
  
});
