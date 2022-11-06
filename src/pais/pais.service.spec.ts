import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import {PaisEntity} from './pais.entity'
import { PaisService } from './pais.service';
import { faker } from '@faker-js/faker';



describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let paisesList: PaisEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisService],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    paisesList = [];
    for(let i = 0; i < 5; i++){
        const pais: PaisEntity = await repository.save({
        nombre: faker.address.country(), })
        paisesList.push(pais);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todos los paises', async () => {
    const paises: PaisEntity[] = await service.findAll();
    expect(paises).not.toBeNull();
    expect(paises).toHaveLength(paisesList.length);
  });

  it('findOne debe retornar un pais por id', async () => {
    const storedPais: PaisEntity = paisesList[0];
    const pais: PaisEntity = await service.findOne(storedPais.id);
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual(storedPais.nombre)
  });

  it('findOne deberia arrojar un excepcion para un pais invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El pais con el id dado no ha sido encontrado")
  });

  it('Crear deberia retornar un nuevo pais', async () => {
    const pais: PaisEntity = {
      id: "",
      nombre: faker.address.country(), 
      culturasGastronomicas:[],

    }

    const newPais: PaisEntity = await service.create(pais);
    expect(newPais).not.toBeNull();

    const storedPais: PaisEntity = await repository.findOne({where: {id: `${newPais.id}`}})
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(newPais.nombre)

  });

  it('Update deberia modificar un pais', async () => {
    const pais: PaisEntity = paisesList[0];
    pais.nombre = "New name";
  
    const updatedPais: PaisEntity = await service.update(pais.id, pais);
    expect(updatedPais).not.toBeNull();
  
    const storedPais: PaisEntity = await repository.findOne({ where: { id: `${pais.id}` } })
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(pais.nombre)

  });

  it('update deberia arrojar un error para un pais invalido', async () => {
    let pais: PaisEntity = paisesList[0];
    pais = {
      ...pais, nombre: "New name"
    }
    await expect(() => service.update("0", pais)).rejects.toHaveProperty("message", "El pais con el id dado no ha sido encontrado")
  });

  it('delete deberia remover un pais', async () => {
    const pais: PaisEntity = paisesList[0];
    await service.delete(pais.id);
  
    const deletedPais: PaisEntity = await repository.findOne({ where: { id: `${pais.id}` } })
    expect(deletedPais).toBeNull();
  });

  it('delete deberia arrojar un error para un pais invalido', async () => {
    const pais: PaisEntity = paisesList[0];
    await service.delete(pais.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El pais con el id dado no ha sido encontrado")
  });

});
