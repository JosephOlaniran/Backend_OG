import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Idea } from '../idea/idea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Idea])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
