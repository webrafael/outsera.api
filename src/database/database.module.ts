import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Movie } from 'src/modules/movies/models/movie.model';

@Module({
  imports: [
    // Configuração do banco de dados
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Movie], // Entidades do banco de dados
      synchronize: true,
      logging: false,
    }),

    // Necessário para usar via repository (Injeção de dependência)
    TypeOrmModule.forFeature([Movie]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}