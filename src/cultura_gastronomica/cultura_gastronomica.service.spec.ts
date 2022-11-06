import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulturaGastronomicaEntity } from './cultura_gastronomica.entity';
import { CulturaGastronomicaService } from './cultura_gastronomica.service';
import { faker } from '@faker-js/faker';
import {PaisEntity} from '../pais/pais.entity'
import { PaisService } from '../pais/pais.service';


describe('CulturaGastronomicaService', () => {
  let service: CulturaGastronomicaService;
  let repository: Repository<CulturaGastronomicaEntity>;
  let culturasGastronomicasList: CulturaGastronomicaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaService],
    }).compile();

    service = module.get<CulturaGastronomicaService>(CulturaGastronomicaService);
    repository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    culturasGastronomicasList = [];

    for(let i = 0; i < 5; i++){
        const culturaGastronomica: CulturaGastronomicaEntity = await repository.save({
        nombre: faker.address.country(),
        descripcion: faker.address.direction()
      })
        culturasGastronomicasList.push(culturaGastronomica);
    }

  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas las culturas gastronomicas', async () => {
    const culturasGastronomicas: CulturaGastronomicaEntity[] = await service.findAll();
    expect(culturasGastronomicas).not.toBeNull();
    expect(culturasGastronomicas).toHaveLength(culturasGastronomicasList.length);
  });

  it('findOne deberia retornar cultura gastronomica por id', async () => {
    const storedCulturaGastronomica: CulturaGastronomicaEntity = culturasGastronomicasList[0];
    const culturaGastronomica: CulturaGastronomicaEntity = await service.findOne(storedCulturaGastronomica.id);
    expect(culturaGastronomica).not.toBeNull();
    expect(culturaGastronomica.nombre).toEqual(storedCulturaGastronomica.nombre)
    expect(culturaGastronomica.descripcion).toEqual(storedCulturaGastronomica.descripcion)
  });

  it('findOne deberia arrojar un excepcion para una cultura gastronomica invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La cultura gastronomica con el id dado no ha sido encontrada")
  });

  it('Crear deberia retornar una nueva cultura gastronomica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = {
      id: '',
      nombre: faker.word.preposition(),
      descripcion: faker.address.direction(),
      pais: null,
      restaurantes: [],
      productos: [],
      recetas: [],
    }

    const newCulturaGastronomica: CulturaGastronomicaEntity = await service.create(culturaGastronomica);
    expect(newCulturaGastronomica).not.toBeNull();

    const storedCulturaGastronomica: CulturaGastronomicaEntity = await repository.findOne({where: {id: newCulturaGastronomica.id}})
    expect(storedCulturaGastronomica).not.toBeNull();
    expect(storedCulturaGastronomica.nombre).toEqual(newCulturaGastronomica.nombre)

  });

  it('update deberia modificar una cultura gastronomica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturasGastronomicasList[0];
    culturaGastronomica.nombre = "New name";
    culturaGastronomica.descripcion = "New description";

    const updatedCulturaGastronomica: CulturaGastronomicaEntity = await service.update(culturaGastronomica.id, culturaGastronomica);
    expect(updatedCulturaGastronomica).not.toBeNull();

    const storedCulturaGastronomica: CulturaGastronomicaEntity = await repository.findOne({ where: { id: `${culturaGastronomica.id}` } })
    expect(storedCulturaGastronomica).not.toBeNull();
    expect(storedCulturaGastronomica.nombre).toEqual(culturaGastronomica.nombre)
    expect(storedCulturaGastronomica.descripcion).toEqual(culturaGastronomica.descripcion)
  });

  it('update deberia arrojar una excepcion para una cultura gastronomica invalida', async () => {
    let culturaGastronomica: CulturaGastronomicaEntity = culturasGastronomicasList[0];
    culturaGastronomica = {
      ...culturaGastronomica, nombre: "New name", descripcion: "New descripcion"
    }
    await expect(() => service.update("0", culturaGastronomica)).rejects.toHaveProperty("message", "La cultura gastronomica con el id dado no ha sido encontrada")
  });

  it('delete deberia remover cultura gastronomica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturasGastronomicasList[0];
    await service.delete(culturaGastronomica.id);

    const deletedCulturaGastronomica: CulturaGastronomicaEntity = await repository.findOne({ where: { id: `${culturaGastronomica.id}` }})
    expect(deletedCulturaGastronomica).toBeNull();
  });

  it('delete deberia arrojar una excepcion para una cultura gastronomica invalida', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturasGastronomicasList[0];
    await service.delete(culturaGastronomica.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La cultura gastronomica con el id dado no ha sido encontrada")
  });


});
