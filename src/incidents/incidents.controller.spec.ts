import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';

describe('IncidentsController', () => {
  let controller: IncidentsController;
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
      controllers: [IncidentsController],
      providers: [{ provide: IncidentsService, useValue: service }],
    }).compile();

    controller = module.get<IncidentsController>(IncidentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates an incident', async () => {
    const dto = { code: 'INC-001' };

    await controller.create(dto as never);

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('converts the id of the http routes', async () => {
    await controller.findOne('4');
    expect(service.findOne).toHaveBeenCalledWith(4);

    await controller.remove('4');
    expect(service.remove).toHaveBeenCalledWith(4);
  });

  it('forwards the caller to the service on update', async () => {
    await controller.updateTcp({ id: 4, dto: { title: 'x' }, callerId: 7, callerRole: 'TECHNICIAN' });

    expect(service.update).toHaveBeenCalledWith(4, { title: 'x' }, 7, 'TECHNICIAN');
  });

  it('forwards the caller to the service on remove', async () => {
    await controller.removeTcp({ id: 4, callerId: 7, callerRole: 'TECHNICIAN' });

    expect(service.remove).toHaveBeenCalledWith(4, 7, 'TECHNICIAN');
  });

  it('still accepts a plain id on remove', async () => {
    await controller.removeTcp(4);

    expect(service.remove).toHaveBeenCalledWith(4);
  });

  it('reads incidents over tcp', async () => {
    await controller.findAllTcp();
    expect(service.findAll).toHaveBeenCalled();

    await controller.findOneTcp(4);
    expect(service.findOne).toHaveBeenCalledWith(4);
  });
});
