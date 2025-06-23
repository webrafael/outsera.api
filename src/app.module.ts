import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { MoviesModule } from './modules/movies/movies.module';
import { CsvService } from './modules/movies/services/csv.service';
import { ProducersModule } from './modules/producers/producers.module';

@Module({
  imports: [DatabaseModule, MoviesModule, ProducersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly csvService: CsvService) {}

  async onModuleInit() {
    await this.csvService.loadMoviesFromCsv();
  }
}
