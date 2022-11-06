import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulturaGastronomicaRestauranteService } from './cultura_gastronomica-restaurante.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CulturaGastronomicaRestauranteService', () => {
  let service: CulturaGastronomicaRestauranteService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let culturaGastronomica: CulturaGastronomicaEntity;
  let restaurantesList : RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaRestauranteService],
    }).compile();

    service = module.get<CulturaGastronomicaRestauranteService>(CulturaGastronomicaRestauranteService);
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restauranteRepository.clear();
    culturaGastronomicaRepository.clear();

    restaurantesList = [];
    for(let i = 0; i < 5; i++){
      const restaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.address.city(),
        numeroEstrellas: faker.datatype.number({ min: 1, max: 5 }),
        fechaConsecusionEstrellas: faker.date.recent(),
        culturasGastronomicas: []

      })
      restaurantesList.push(restaurante);
    }

    culturaGastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.word.preposition(), 
      descripcion: faker.address.direction(),
      pais: null,
      restaurantes: restaurantesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addResturanteCulturaGastronomica should add an restaurante to a culturaGastronomica', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      numeroEstrellas: faker.datatype.number({ min: 1, max: 5 }),
      fechaConsecusionEstrellas: faker.date.recent(),
      culturasGastronomicas: []
    });

    const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.word.preposition(), 
      descripcion: faker.address.direction(),
      pais: null,
      restaurantes: []
    })

    const result: CulturaGastronomicaEntity = await service.addResturanteCulturaGastronomica(newCulturaGastronomica.id, newRestaurante.id);
    
    expect(result.restaurantes.length).toBe(1);
    expect(result.restaurantes[0]).not.toBeNull();
    expect(result.restaurantes[0].nombre).toBe(newRestaurante.nombre)
  });

  it('addResturanteCulturaGastronomica should thrown exception for an invalid restaurante', async () => {
    const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.word.preposition(), 
      descripcion: faker.address.direction(),
      pais: null,
      restaurantes: []
    })

    await expect(() => service.addResturanteCulturaGastronomica(newCulturaGastronomica.id, "0")).rejects.toHaveProperty("message", "Restaurante no encontrado");
  });

  it('addRestauranteCulturaGastronomica should throw an exception for an invalid culturaGastronomica', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      numeroEstrellas: faker.datatype.number({ min: 1, max: 5 }),
      fechaConsecusionEstrellas: faker.date.recent(),
      culturasGastronomicas: []
    });

    await expect(() => service.addResturanteCulturaGastronomica("0", newRestaurante.id)).rejects.toHaveProperty("message", "Cultura gastronomica no encontrada");
  });

  it('findRestauranteByCulturaGastronomicaIdRestauranteId should return restaurante by culturaGastronomica', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    const storedrestaurante: RestauranteEntity = await service.findRestauranteByCulturaGastronomicaIdRestauranteId(culturaGastronomica.id, restaurante.id, )
    expect(storedrestaurante).not.toBeNull();
    expect(storedrestaurante.nombre).toBe(restaurante.nombre);
  });

  it('findrestauranteByCulturaGastronomicaIdRestauranteId should throw an exception for an invalid restaurante', async () => {
    await expect(()=> service.findRestauranteByCulturaGastronomicaIdRestauranteId(culturaGastronomica.id, "0")).rejects.toHaveProperty("message", "Restaurante no encontrado"); 
  });

  it('findRestauranteByCulturaGastronomicaIdrestauranteId should throw an exception for an invalid culturaGastronomica', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0]; 
    await expect(()=> service.findRestauranteByCulturaGastronomicaIdRestauranteId("0", restaurante.id)).rejects.toHaveProperty("message", "Cultura gastronomica no encontrada");
  });

  it('findRestauranteByculturaGastronomicaIdRestauranteId should throw an exception for an restaurante not associated to the culturaGastronomica', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      numeroEstrellas: faker.datatype.number({ min: 1, max: 5 }),
      fechaConsecusionEstrellas: faker.date.recent(),
      culturasGastronomicas: []
    });

    await expect(()=> service.findRestauranteByCulturaGastronomicaIdRestauranteId(culturaGastronomica.id, newRestaurante.id)).rejects.toHaveProperty("message", "El restaurante no esta asociado a la cultura gastronomica");
  });

  it('findRestaurantesByculturaGastronomicaId should return restaurantes by culturaGastronomica', async ()=>{
    const restaurantes: RestauranteEntity[] = await service.findRestaurantesCulturaGastronomicaId(culturaGastronomica.id);
    expect(restaurantes.length).toBe(5)
  });

  it('findRestaurantesByculturaGastronomicaId should throw an exception for an invalid culturaGastronomica', async () => {
    await expect(()=> service.findRestaurantesCulturaGastronomicaId("0")).rejects.toHaveProperty("message", "Cultura gastronomica no encontrada");
  });

  it('associateRestaurantesCulturaGastronomica should update restaurantes list for a culturaGastronomica', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      numeroEstrellas: faker.datatype.number({ min: 1, max: 5 }),
      fechaConsecusionEstrellas: faker.date.recent(),
      culturasGastronomicas: []
    });

    const updatedculturaGastronomica: CulturaGastronomicaEntity = await service.associateRestaurantesCulturaGastronomica(culturaGastronomica.id, [newRestaurante]);
    expect(updatedculturaGastronomica.restaurantes.length).toBe(1);

    expect(updatedculturaGastronomica.restaurantes[0].nombre).toBe(newRestaurante.nombre);
  });

  it('associateRestaurantesCulturaGastronomica should throw an exception for an invalid culturaGastronomica', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      numeroEstrellas: faker.datatype.number({ min: 1, max: 5 }),
      fechaConsecusionEstrellas: faker.date.recent(),
      culturasGastronomicas: []
    });

    await expect(()=> service.associateRestaurantesCulturaGastronomica("0", [newRestaurante])).rejects.toHaveProperty("message", "Cultura gastronomica no encontrada");
  });

  it('associateRestaurantesCulturaGastronomica should throw an exception for an invalid restaurante', async () => {
    const newRestaurante: RestauranteEntity = restaurantesList[0];
    newRestaurante.id = "0";

    await expect(()=> service.associateRestaurantesCulturaGastronomica(culturaGastronomica.id, [newRestaurante])).rejects.toHaveProperty("message", "Restaurante no encontrado");
  });

  it('deleteRestauranteToCulturaGastronomica should remove an restaurante from a culturaGastronomica', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    
    await service.deleteRestauranteCulturaGastronomica(culturaGastronomica.id, restaurante.id);

    const storedculturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.findOne({where: {id: `${culturaGastronomica.id}`}, relations: ["restaurantes"]});
    const deletedRestaurante: RestauranteEntity = storedculturaGastronomica.restaurantes.find(a => a.id === restaurante.id);

    expect(deletedRestaurante).toBeUndefined();
  });

  it('deleteRestauranteToCulturaGastronomica should thrown an exception for an invalid restaurante', async () => {
    await expect(()=> service.deleteRestauranteCulturaGastronomica(culturaGastronomica.id, "0")).rejects.toHaveProperty("message", "Restaurante no encontrado");
  });

  it('deleteRestauranteToCulturaGastronomica should thrown an exception for an invalid culturaGastronomica', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await expect(()=> service.deleteRestauranteCulturaGastronomica("0", restaurante.id)).rejects.toHaveProperty("message", "Cultura gastronomica no encontrada");
  });

  it('deleteRestauranteToCulturaGastronomica should thrown an exception for an non asocciated restaurante', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      numeroEstrellas: faker.datatype.number({ min: 1, max: 5 }),
      fechaConsecusionEstrellas: faker.date.recent(),
      culturasGastronomicas: []
    });

    await expect(()=> service.deleteRestauranteCulturaGastronomica(culturaGastronomica.id, newRestaurante.id)).rejects.toHaveProperty("message", "El restaurante no esta asociado a la cultura gastronomica");
  }); 
});
