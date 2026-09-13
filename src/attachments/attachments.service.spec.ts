import { Mock, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttachmentsService } from './attachments.service';
import { AttachmentEntity } from '../models/entity/attachment.entity';

describe('AttachmentsService', () => {
  let service: AttachmentsService;
  let repository: Record<string, Mock>;

  beforeEach(async () => {
    repository = {
      create: vi.fn((payload: unknown) => payload),
      save: vi.fn((entity: object) => Promise.resolve({ id: 1, ...entity })),
      find: vi.fn().mockResolvedValue([]),
      findOne: vi.fn().mockResolvedValue({ id: 1 }),
      update: vi.fn().mockResolvedValue({ affected: 1 }),
      delete: vi.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttachmentsService,
        { provide: getRepositoryToken(AttachmentEntity), useValue: repository },
      ],
    }).compile();

    service = module.get<AttachmentsService>(AttachmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('saves a new attachment', async () => {
    const dto = { fileName: 'photo.jpg', url: 'https://cdn.local/photo.jpg' };

    await expect(service.create(dto as never)).resolves.toEqual({ id: 1, ...dto });
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('returns every attachment', async () => {
    repository.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    await expect(service.findAll()).resolves.toHaveLength(2);
  });

  it('looks an attachment up by id', async () => {
    await service.findOne(1);

    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('returns null when the attachment is unknown', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne(99)).resolves.toBeNull();
  });

  it('returns the attachment once updated', async () => {
    repository.findOne.mockResolvedValue({ id: 1, fileName: 'autre.jpg' });

    await expect(service.update(1, { fileName: 'autre.jpg' } as never)).resolves.toEqual({
      id: 1,
      fileName: 'autre.jpg',
    });
    expect(repository.update).toHaveBeenCalledWith(1, { fileName: 'autre.jpg' });
  });

  it('deletes an attachment', async () => {
    await expect(service.remove(1)).resolves.toEqual({ affected: 1 });

    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
