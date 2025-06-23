import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../../../movies/models/movie.model';
import { ProducerIntervalResponseDto } from '../../dto/producer-interval-response.dto';
import { ProducerIntervalDto } from '../../dto/producer-interval.dto';

@Injectable()
export class ProducerService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async calculateProducerIntervals(): Promise<ProducerIntervalResponseDto> {
    // Buscar todos os filmes vencedores
    const movieWinners = await this.movieRepository.find({
      where: { winner: 'yes' },
      order: { year: 'ASC' },
    });

    const producers = new Map<string, number[]>();

    // Criar uma lista única de produtores e adiciona os anos
    for (const movie of movieWinners) {
      // Quebra a lista de produtores por vírgula ou " and "
      const producersList = movie.producers?.split(/,|\s+and\s+/)?.map((producer) => producer.trim());

      for (const producer of producersList) {
        if (!producers.has(producer)) {
          producers.set(producer, []);
        }

        producers.get(producer)?.push(movie.year);
      }
    }

    const producerIntervals: ProducerIntervalDto[] = [];

    // Calcular intervalos para cada produtor
    for (const [producer, years] of producers.entries()) {
      // Ordenar os anos em ordem crescente
      years.sort((a, b) => a - b);

      // Só calcular intervalos se o produtor ganhou pelo menos 2 vezes
      if (years.length >= 2) {
        // Calcular intervalos
        for (let i = 0; i < years.length - 1; i++) {
          const previousWin = years[i];
          const followingWin = years[i + 1];
          const interval = followingWin - previousWin;

          producerIntervals.push(
            ProducerIntervalDto.fromEntity({
              producer,
              interval,
              previousWin,
              followingWin,
            }),
          );
        }
      }
    }

    // Se não houver intervalos, retorna um array vazio
    if (producerIntervals.length === 0) {
      return { min: [], max: [] };
    }

    // Encontrar o intervalo mínimo e máximo
    const minInterval = Math.min(...producerIntervals.map((interval) => interval.interval));
    const maxInterval = Math.max(...producerIntervals.map((interval) => interval.interval));

    // Encontrar os produtores com os intervalos mínimo e máximo
    const minProducers = producerIntervals.filter((interval) => interval.interval === minInterval);
    const maxProducers = producerIntervals.filter((interval) => interval.interval === maxInterval);

    return ProducerIntervalResponseDto.fromEntity({
      min: minProducers,
      max: maxProducers,
    });
  }
}
