import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from '../../services/producer/producer.service';
import { ProducerController } from './producer.controller';

describe('ProducerController', () => {
  let controller: ProducerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducerController],
      providers: [
        {
          provide: ProducerService,
          useValue: {
            calculateProducerIntervals: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProducerController>(ProducerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
