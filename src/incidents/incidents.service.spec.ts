import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { of } from 'rxjs';
import { IncidentsService } from './incidents.service';
import { IncidentEntity } from '../models/entity/incident.entity';
import { SiteEntity } from '../models/entity/site.entity';
import { CategoryEntity } from '../models/entity/category.entity';
import { IncidentPriority, IncidentStatus } from '../models/enums/enums';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let incidentRepository: Record<string, jest.Mock>;
  let siteRepository: Record<string, jest.Mock>;
  let categoryRepository: Record<string, jest.Mock>;
  let notificationsClient: Record<string, jest.Mock>;
  let tripsClient: Record<string, jest.Mock>;
  let findOneById: jest.Mock;

  const baseDto = {
    code: 'INC-001',
    name: 'panne',
    title: 'Panne de signalisation',
    description: 'feu hors service',
    estimateDuration: 30,
    createdBy: 7,
    siteId: 1,
    categoryId: 1,
    status: IncidentStatus.OPEN,
    priority: IncidentPriority.LOW,
  };

  beforeEach(async () => {
    incidentRepository = {
      create: jest.fn((dto: unknown) => dto),
      save: jest.fn((entity: object) => Promise.resolve({ id: 10, ...entity })),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    siteRepository = { findOne: jest.fn().mockResolvedValue({ id: 1 }) };
    categoryRepository = { findOne: jest.fn().mockResolvedValue({ id: 1 }) };
    notificationsClient = { emit: jest.fn() };
    tripsClient = { emit: jest.fn() };
    findOneById = jest.fn().mockReturnValue(of({ user: { id: 7, agencyId: 1 } }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        { provide: getRepositoryToken(IncidentEntity), useValue: incidentRepository },
        { provide: getRepositoryToken(SiteEntity), useValue: siteRepository },
        { provide: getRepositoryToken(CategoryEntity), useValue: categoryRepository },
        { provide: 'NOTIFICATIONS_SERVICE', useValue: notificationsClient },
        { provide: 'TRIPS_SERVICE', useValue: tripsClient },
        { provide: 'USER_PACKAGE', useValue: { getService: () => ({ findOneById }) } },
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('throws when the site does not exist', async () => {
      siteRepository.findOne.mockResolvedValue(null);

      await expect(service.create({ ...baseDto })).rejects.toThrow(NotFoundException);
      expect(incidentRepository.save).not.toHaveBeenCalled();
    });

    it('throws when the category does not exist', async () => {
      categoryRepository.findOne.mockResolvedValue(null);

      await expect(service.create({ ...baseDto })).rejects.toThrow(NotFoundException);
      expect(incidentRepository.save).not.toHaveBeenCalled();
    });

    it('resolves the agency of the caller through the user service', async () => {
      await service.create({ ...baseDto, callerId: 7 });

      expect(findOneById).toHaveBeenCalledWith({ id: 7 }, expect.anything());
      expect(incidentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ agencyId: 1 }),
      );
    });

    it('ignores an agency sent by the client', async () => {
      await service.create({ ...baseDto, callerId: 7, agencyId: 99 } as never);

      expect(incidentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ agencyId: 1 }),
      );
    });

    it('leaves the agency empty when there is no caller', async () => {
      await service.create({ ...baseDto });

      expect(findOneById).not.toHaveBeenCalled();
      expect(incidentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ agencyId: undefined }),
      );
    });

    it('notifies trips and notifications once saved', async () => {
      await service.create({ ...baseDto, callerId: 7 });

      expect(tripsClient.emit).toHaveBeenCalledWith(
        'incident.created',
        expect.objectContaining({ incidentId: 10, siteId: baseDto.siteId }),
      );
      const [event, payload] = notificationsClient.emit.mock.calls[0] as [
        string,
        { object: string },
      ];
      expect(event).toBe('notifications.sendEmail');
      expect(payload.object).toContain(baseDto.title);
    });
  });

  describe('findAll', () => {
    it('returns the incidents with their category and site', async () => {
      incidentRepository.find.mockResolvedValue([{ id: 1 }]);

      await expect(service.findAll()).resolves.toEqual([{ id: 1 }]);
      expect(incidentRepository.find).toHaveBeenCalledWith({ relations: ['category', 'site'] });
    });
  });

  describe('findOne', () => {
    it('looks the incident up by id', async () => {
      incidentRepository.findOne.mockResolvedValue({ id: 3 });

      await expect(service.findOne(3)).resolves.toEqual({ id: 3 });
      expect(incidentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 3 },
        relations: ['category', 'site'],
      });
    });
  });

  describe('update', () => {
    it('throws when the incident does not exist', async () => {
      incidentRepository.findOne.mockResolvedValue(null);

      await expect(service.update(3, {}, 7)).rejects.toThrow(NotFoundException);
      expect(incidentRepository.update).not.toHaveBeenCalled();
    });

    it('throws when the caller belongs to another agency', async () => {
      incidentRepository.findOne.mockResolvedValue({ id: 3, agencyId: 2 });

      await expect(service.update(3, {}, 7)).rejects.toThrow(NotFoundException);
      expect(incidentRepository.update).not.toHaveBeenCalled();
    });

    it('updates the incident when the caller shares its agency', async () => {
      incidentRepository.findOne.mockResolvedValue({ id: 3, agencyId: 1 });

      await service.update(3, { title: 'nouveau titre' }, 7);

      expect(incidentRepository.update).toHaveBeenCalledWith(3, { title: 'nouveau titre' });
    });

    it('lets a superadmin update any incident without checking the agency', async () => {
      incidentRepository.findOne.mockResolvedValue({ id: 3, agencyId: 2 });

      await service.update(3, { title: 'nouveau titre' }, 7, 'SUPERADMIN');

      expect(findOneById).not.toHaveBeenCalled();
      expect(incidentRepository.update).toHaveBeenCalled();
    });

    it('warns trips when the incident is resolved', async () => {
      incidentRepository.findOne.mockResolvedValue({ id: 3, agencyId: 1 });

      await service.update(3, { status: IncidentStatus.RESOLVED }, 7);

      expect(tripsClient.emit).toHaveBeenCalledWith('incident.closed', { incidentId: 3 });
    });

    it('stays silent when the status does not change', async () => {
      incidentRepository.findOne.mockResolvedValue({ id: 3, agencyId: 1 });

      await service.update(3, { title: 'nouveau titre' }, 7);

      expect(tripsClient.emit).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('throws when the caller belongs to another agency', async () => {
      incidentRepository.findOne.mockResolvedValue({ id: 3, agencyId: 2 });

      await expect(service.remove(3, 7)).rejects.toThrow(NotFoundException);
      expect(incidentRepository.delete).not.toHaveBeenCalled();
    });

    it('deletes the incident and warns trips', async () => {
      incidentRepository.findOne.mockResolvedValue({ id: 3, agencyId: 1 });
      incidentRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(3, 7)).resolves.toEqual({ affected: 1 });
      expect(tripsClient.emit).toHaveBeenCalledWith('incident.closed', { incidentId: 3 });
    });

    it('lets a superadmin delete any incident', async () => {
      incidentRepository.findOne.mockResolvedValue({ id: 3, agencyId: 2 });
      incidentRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(3, 7, 'SUPERADMIN');

      expect(incidentRepository.delete).toHaveBeenCalledWith(3);
    });
  });
});
