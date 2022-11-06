/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';

import { faker } from '@faker-js/faker';

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let restaurantesList: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    restaurantesList = [];
    for(let i = 0; i < 5; i++){
      const restaurante: RestauranteEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.address.city(),
        numeroEstrellas: faker.datatype.number({min: 1, max: 5}),
        fechaConsecusionEstrellas: faker.date.recent(),
        culturasGastronomicas: []
      })

      restaurantesList.push(restaurante);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurantes', async () => {
    const restaurantes: RestauranteEntity[] = await service.findAll();
    expect(restaurantes).not.toBeNull();
    expect(restaurantes).toHaveLength(restaurantesList.length);
  });

  it('findOne should return a restaurante by id', async () => {
    const storedrestaurante: RestauranteEntity = restaurantesList[0];
    const restaurante: RestauranteEntity = await service.findOne(storedrestaurante.id);
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(storedrestaurante.nombre)
  });

  it('findOne should throw an exception for an invalid restaurante', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "Restaurante no encontrado");
  });

  it('create should return a new restaurante', async () => {
    const restaurante: RestauranteEntity = {
      id: '',
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      numeroEstrellas: faker.datatype.number({min: 1, max: 5}),
      fechaConsecusionEstrellas: faker.date.recent(),
      culturasGastronomicas: []
    }

    const newrestaurante: RestauranteEntity = await service.create(restaurante);
    expect(newrestaurante).not.toBeNull();

    const storedrestaurante: RestauranteEntity = await repository.findOne({where: {id: `${newrestaurante.id}`}})
    expect(storedrestaurante).not.toBeNull();
    expect(storedrestaurante.nombre).toEqual(newrestaurante.nombre)
  });

  it('update should modify a restaurante', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    restaurante.nombre = "Nuevo nombre";
    restaurante.ciudad = "Nueva ciudad";
  
    const updatedrestaurante: RestauranteEntity = await service.update(restaurante.id, restaurante);
    expect(updatedrestaurante).not.toBeNull();
  
    const storedrestaurante: RestauranteEntity = await repository.findOne({ where: { id: `${restaurante.id}` } })
    expect(storedrestaurante).not.toBeNull();
    expect(storedrestaurante.nombre).toEqual(restaurante.nombre)
    expect(storedrestaurante.ciudad).toEqual(restaurante.ciudad)
  });
 
  it('update should throw an exception for an invalid restaurante', async () => {
    let restaurante: RestauranteEntity = restaurantesList[0];
    restaurante = {
      ...restaurante, nombre: "Nuevo nombre", ciudad: "Nueva ciudad"
    }
    await expect(() => service.update("0", restaurante)).rejects.toHaveProperty("message", "Restaurante no encontrado")
  });

  it('delete should remove a restaurante', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await service.delete(restaurante.id);
  
    const deletedrestaurante: RestauranteEntity = await repository.findOne({ where: { id: `${restaurante.id}` } })
    expect(deletedrestaurante).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurante', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await service.delete(restaurante.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "Restaurante no encontrado")
  });
});
