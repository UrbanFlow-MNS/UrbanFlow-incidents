import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';

describe('AttachmentsController', () => {
  let controller: AttachmentsController;
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
      controllers: [AttachmentsController],
      providers: [{ provide: AttachmentsService, useValue: service }],
    }).compile();

    controller = module.get<AttachmentsController>(AttachmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates an attachment', async () => {
    const dto = { fileName: 'photo.jpg' };

    await controller.create(dto as never);

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('returns every attachment', async () => {
    await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
  });

  it('converts the id of the http routes', async () => {
    await controller.findOne('4');
    expect(service.findOne).toHaveBeenCalledWith(4);

    await controller.update('4', { fileName: 'autre.jpg' } as never);
    expect(service.update).toHaveBeenCalledWith(4, { fileName: 'autre.jpg' });

    await controller.remove('4');
    expect(service.remove).toHaveBeenCalledWith(4);
  });
});
