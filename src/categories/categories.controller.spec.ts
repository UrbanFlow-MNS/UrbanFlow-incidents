import { Mock, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: Record<string, Mock>;

  beforeEach(async () => {
    service = {
      create: vi.fn().mockResolvedValue({ id: 1 }),
      findAll: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue({ id: 1 }),
      update: vi.fn().mockResolvedValue({ id: 1 }),
      remove: vi.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: service }],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a category', async () => {
    const dto = { name: 'Accident' };

    await controller.create(dto as never);

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('converts the id of the http routes', async () => {
    await controller.findOne('4');
    expect(service.findOne).toHaveBeenCalledWith(4);

    await controller.update('4', { name: 'Voirie' });
    expect(service.update).toHaveBeenCalledWith(4, { name: 'Voirie' });

    await controller.remove('4');
    expect(service.remove).toHaveBeenCalledWith(4);
  });

  it('exposes the same operations over tcp', async () => {
    await controller.findAllTcp();
    expect(service.findAll).toHaveBeenCalled();

    await controller.findOneTcp(4);
    expect(service.findOne).toHaveBeenCalledWith(4);

    await controller.updateTcp({ id: 4, dto: { name: 'Voirie' } });
    expect(service.update).toHaveBeenCalledWith(4, { name: 'Voirie' });

    await controller.removeTcp(4);
    expect(service.remove).toHaveBeenCalledWith(4);
  });
});
