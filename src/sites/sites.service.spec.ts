import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SitesService } from './sites.service';
import { SiteEntity } from '../models/entity/site.entity';

describe('SitesService', () => {
  let service: SitesService;
  let repository: Record<string, jest.Mock>;

  const dto = {
    name: 'Depot Nord',
    address: '12 rue des Ateliers',
    city: 'Metz',
    zipcode: '57000',
    latitude: 49.1193,
    longitude: 6.1757,
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn((payload: unknown) => payload),
      save: jest.fn((entity: object) => Promise.resolve({ id: 1, ...entity })),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue({ id: 1 }),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SitesService,
        { provide: getRepositoryToken(SiteEntity), useValue: repository },
      ],
    }).compile();

    service = module.get<SitesService>(SitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('saves a new site', async () => {
    await expect(service.create(dto as never)).resolves.toEqual({ id: 1, ...dto });

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalled();
  });

  it('returns every site', async () => {
    repository.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    await expect(service.findAll()).resolves.toHaveLength(2);
  });

  it('looks a site up by id', async () => {
    await service.findOne(1);

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('returns null when the site is unknown', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(99)).resolves.toBeNull();
  });

  it('returns the site once updated', async () => {
    repository.findOne.mockResolvedValue({ id: 1, name: 'Depot Sud' });

    await expect(service.update(1, { name: 'Depot Sud' })).resolves.toEqual({
      id: 1,
      name: 'Depot Sud',
    });
    expect(repository.update).toHaveBeenCalledWith(1, { name: 'Depot Sud' });
  });

  it('deletes a site', async () => {
    await expect(service.remove(1)).resolves.toEqual({ affected: 1 });

    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
