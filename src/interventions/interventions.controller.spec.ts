import { Test, TestingModule } from '@nestjs/testing';
import { InterventionsController } from './interventions.controller';
import { InterventionsService } from './interventions.service';

describe('InterventionsController', () => {
  let controller: InterventionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterventionsController],
      providers: [InterventionsService],
    }).compile();

    controller = module.get<InterventionsController>(InterventionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
