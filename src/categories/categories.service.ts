import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idea } from '../idea/idea.entity';
import * as _ from 'lodash';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Idea) private readonly ideaRepo: Repository<Idea>,
  ) {}

  async getAllUniqueCategories(): Promise<string[]> {
    const initialCategories = [
      'Technology',
      'Process Improvement',
      'Customer Experience',
      'Cost Reduction',
      'Innovation',
      'Sustainability',
      'Safety',
      'Training & Development',
      'Communication',
    ];

    const rawResult: { category: string }[] = await this.ideaRepo
      .createQueryBuilder('idea')
      .select('DISTINCT idea.category', 'category')
      .where('idea.category IS NOT NULL')
      .andWhere('idea.category != ""')
      .orderBy('idea.category', 'ASC')
      .getRawMany();

    const result = rawResult.map((row) => row.category);

    // Merge initial categories with database categories
    const mergedCategories = [...initialCategories, ...result];

    // Deduplicate with case-insensitive logic using lodash
    const uniqueCategories = _.uniqBy(mergedCategories, (category) =>
      category.toLowerCase(),
    );

    // Sort the final result alphabetically
    return _.sortBy(uniqueCategories);
  }
}
