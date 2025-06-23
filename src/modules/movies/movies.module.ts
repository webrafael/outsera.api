import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './models/movie.model';
import { CsvService } from './services/csv.service';

@Module({
    imports: [TypeOrmModule.forFeature([Movie])],
    providers: [CsvService],
    exports: [CsvService],
})
export class MoviesModule {}
