import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { InterventionsService } from './interventions.service';
import { InterventionEntity } from '../models/entity/intervention.entity';
import { SiteEntity } from '../models/entity/site.entity';
import { IncidentEntity } from '../models/entity/incident.entity';
import { InterventionStatus } from '../models/enums/enums';

describe('InterventionsService', () => {
  let service: InterventionsService;
  let interventionRepository: Record<string, jest.Mock>;
  let siteRepository: Record<string, jest.Mock>;
  let incidentRepository: Record<string, jest.Mock>;

  const dto = {
    title: 'Remplacement du feu',
    description: 'intervention sur site',
    status: InterventionStatus.PENDING,
    siteId: 1,
    incidentId: 1,
    startAt: new Date(),
  };

  beforeEach(async () => {
    interventionRepository = {
      create: jest.fn((payload: unknown) => payload),
      save: jest.fn((entity: object) => Promise.resolve({ id: 1, ...entity })),
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue({ id: 1 }),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    siteRepository = { findOne: jest.fn().mockResolvedValue({ id: 1 }) };
    incidentRepository = { findOne: jest.fn().mockResolvedValue({ id: 1 }) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterventionsService,
        { provide: getRepositoryToken(InterventionEntity), useValue: interventionRepository },
        { provide: getRepositoryToken(SiteEntity), useValue: siteRepository },
        { provide: getRepositoryToken(IncidentEntity), useValue: incidentRepository },
      ],
    }).compile();

    service = module.get<InterventionsService>(InterventionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('saves the intervention when the site and the incident exist', async () => {
      await expect(service.create(dto as never)).resolves.toEqual({ id: 1, ...dto });

      expect(interventionRepository.save).toHaveBeenCalled();
    });

    it('rejects an unknown site', async () => {
      siteRepository.findOne.mockResolvedValue(null);

      await expect(service.create(dto as never)).rejects.toThrow(RpcException);
      expect(interventionRepository.save).not.toHaveBeenCalled();
    });

    it('rejects an unknown incident', async () => {
      incidentRepository.findOne.mockResolvedValue(null);

      await expect(service.create(dto as never)).rejects.toThrow(RpcException);
      expect(interventionRepository.save).not.toHaveBeenCalled();
    });
  });

  it('loads the incident and the site of the interventions', async () => {
    await service.findAll();

    expect(interventionRepository.find).toHaveBeenCalledWith({
      relations: ['incident', 'site'],
    });
  });

  it('looks an intervention up by id', async () => {
    await service.findOne(1);

    expect(interventionRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['incident', 'site'],
    });
  });

  it('returns the intervention once updated', async () => {
    interventionRepository.findOne.mockResolvedValue({
      id: 1,
      status: InterventionStatus.COMPLETED,
    });

    await expect(
      service.update(1, { status: InterventionStatus.COMPLETED } as never),
    ).resolves.toEqual({ id: 1, status: InterventionStatus.COMPLETED });
    expect(interventionRepository.update).toHaveBeenCalledWith(1, {
      status: InterventionStatus.COMPLETED,
    });
  });

  it('deletes an intervention', async () => {
    await expect(service.remove(1)).resolves.toEqual({ affected: 1 });

    expect(interventionRepository.delete).toHaveBeenCalledWith(1);
  });
});
