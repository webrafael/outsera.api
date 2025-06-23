import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';

import { Movie } from '../models/movie.model';

@Injectable()
export class CsvService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) { }

  async loadMoviesFromCsv() {

    const movies: Movie[] = [];
    const csvFilePath = path.join(process.cwd(), 'src', 'assets', 'movielist.csv');

    // Verifica se o arquivo existe antes de ler
    if (!fs.existsSync(csvFilePath)) {
      throw new Error('File not found');
    }

    // Verifica se o banco de dados já está populado
    const existingMovies = await this.movieRepository.find();

    if (existingMovies.length > 0) {
      return existingMovies;
    }

    // Lê o arquivo CSV e popula o banco de dados em formato de stream/promise
    return new Promise((resolve, reject) => {

      // Executa a leitura do arquivo CSV e popula o banco de dados em formato de stream
      fs.createReadStream(csvFilePath)

        // Converte o arquivo CSV em um array de objetos
        .pipe(csv({ separator: ';' }))
        .on('data', (row: Movie) => movies.push(row))

        // Salva os filmes no banco de dados
        .on('end', async () => {

          try {
            await this.saveMovies(movies);
            resolve(movies);
          } catch (error) {
            reject(error);
          }

        })
        .on('error', reject);
    });
  }

  /**
   * Salva os filmes no banco de dados
   * 
   * Sempre gosto de manter as separações de responsabilidades, por isso criei um método para salvar os filmes.
   * 
   * @param movies - Array de filmes a serem salvos
   */
  async saveMovies(movies: Movie[]) {
    for (const movieData of movies) {
      const movie = new Movie();
      movie.year = movieData.year;
      movie.title = movieData.title;
      movie.studios = movieData.studios;
      movie.producers = movieData.producers;
      movie.winner = movieData.winner || 'no'; // Se não for informado, considera como não vencedor

      await this.movieRepository.save(movie);
    }
  }
}
