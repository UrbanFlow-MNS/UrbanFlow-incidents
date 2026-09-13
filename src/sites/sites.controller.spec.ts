import { Mock, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';

describe('SitesController', () => {
  let controller: SitesController;
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
      controllers: [SitesController],
      providers: [{ provide: SitesService, useValue: service }],
    }).compile();

    controller = module.get<SitesController>(SitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a site', async () => {
    const dto = { name: 'Depot Nord' };

    await controller.create(dto as never);

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('reads sites over http', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();

    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('updates and deletes a site', async () => {
    await controller.update(1, { name: 'Depot Sud' });
    expect(service.update).toHaveBeenCalledWith(1, { name: 'Depot Sud' });

    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('exposes the same operations over tcp', async () => {
    await controller.findAllTcp();
    expect(service.findAll).toHaveBeenCalled();

    await controller.findOneTcp(1);
    expect(service.findOne).toHaveBeenCalledWith(1);

    await controller.updateTcp({ id: 1, dto: { name: 'Depot Sud' } });
    expect(service.update).toHaveBeenCalledWith(1, { name: 'Depot Sud' });

    await controller.removeTcp(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
