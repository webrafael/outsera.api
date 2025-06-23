import { Controller, Get, Header, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ProducerService } from '../../services/producer/producer.service';

@Controller('producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Get('intervals')
  @Header('Content-Type', 'application/json')
  @Header('Cache-Control', 'public, max-age=3600')
  async getProducerIntervals(@Res() res: Response): Promise<void> {
    try {
      const intervals = await this.producerService.calculateProducerIntervals();

      res.status(HttpStatus.OK).json(intervals);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Erro interno do servidor',
        message: error.message,
      });
    }
  }

  @Get('intervals/min')
  @Header('Content-Type', 'application/json')
  @Header('Cache-Control', 'public, max-age=3600')
  async getMinProducerIntervals(@Res() res: Response): Promise<void> {

    try {
      const intervals = await this.producerService.calculateProducerIntervals();
  
      if (!intervals?.min || intervals.min.length === 0) {
        res.status(HttpStatus.OK).json({
          min: []
        });
        return;
      }
  
      res.status(HttpStatus.OK).json(intervals.min);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Erro interno do servidor',
        message: error.message,
      });
    }
  }

  @Get('intervals/max')
  @Header('Content-Type', 'application/json')
  @Header('Cache-Control', 'public, max-age=3600')
  async getMaxProducerIntervals(@Res() res: Response): Promise<void> {
    try {
      const intervals = await this.producerService.calculateProducerIntervals();

      if (!intervals?.max || intervals.max.length === 0) {
        res.status(HttpStatus.OK).json({
          max: []
        });
        return;
      }

      res.status(HttpStatus.OK).json(intervals.max);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Erro interno do servidor',
        message: error.message,
      });
    }
  }
}
