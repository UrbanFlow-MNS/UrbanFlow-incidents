import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from '../models/entity/category.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Record<string, jest.Mock>;

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
        CategoriesService,
        { provide: getRepositoryToken(CategoryEntity), useValue: repository },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('saves a new category', async () => {
    const dto = { name: 'Accident', isActive: true };

    await expect(service.create(dto as never)).resolves.toEqual({ id: 1, ...dto });
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('loads the incidents attached to the categories', async () => {
    await service.findAll();

    expect(repository.find).toHaveBeenCalledWith({ relations: ['incidents'] });
  });

  it('loads the incidents of a single category', async () => {
    await service.findOne(1);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['incidents'],
    });
  });

  it('returns null when the category is unknown', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(99)).resolves.toBeNull();
  });

  it('returns the category once updated', async () => {
    repository.findOne.mockResolvedValue({ id: 1, name: 'Voirie' });

    await expect(service.update(1, { name: 'Voirie' })).resolves.toEqual({
      id: 1,
      name: 'Voirie',
    });
    expect(repository.update).toHaveBeenCalledWith(1, { name: 'Voirie' });
  });

  it('deletes a category', async () => {
    await expect(service.remove(1)).resolves.toEqual({ affected: 1 });

    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
