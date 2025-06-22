import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [],
      synchronize: true,
      logging: false,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}