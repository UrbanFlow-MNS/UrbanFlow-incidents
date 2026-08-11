import { Test, TestingModule } from '@nestjs/testing';
import { InterventionsController } from './interventions.controller';
import { InterventionsService } from './interventions.service';

describe('InterventionsController', () => {
  let controller: InterventionsController;
  let service: Record<string, jest.Mock>;

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue({ id: 1 }),
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue({ id: 1 }),
      update: jest.fn().mockResolvedValue({ id: 1 }),
      remove: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterventionsController],
      providers: [{ provide: InterventionsService, useValue: service }],
    }).compile();

    controller = module.get<InterventionsController>(InterventionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates an intervention', async () => {
    const dto = { title: 'Remplacement du feu' };

    await controller.create(dto as never);

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('reads interventions over http', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();

    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('updates and deletes an intervention', async () => {
    await controller.update(1, { title: 'autre' } as never);
    expect(service.update).toHaveBeenCalledWith(1, { title: 'autre' });

    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('exposes the same operations over tcp', async () => {
    await controller.findAllTcp();
    expect(service.findAll).toHaveBeenCalled();

    await controller.findOneTcp(1);
    expect(service.findOne).toHaveBeenCalledWith(1);

    await controller.updateTcp({ id: 1, dto: { title: 'autre' } as never });
    expect(service.update).toHaveBeenCalledWith(1, { title: 'autre' });

    await controller.removeTcp(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
