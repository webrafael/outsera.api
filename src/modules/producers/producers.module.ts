import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../movies/models/movie.model';
import { ProducerController } from './controllers/producer/producer.controller';
import { ProducerService } from './services/producer/producer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [ProducerController],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class ProducersModule {}
