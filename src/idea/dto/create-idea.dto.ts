import { IsString, IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateIdeaDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsString()
  impactLevel: string;

  @IsArray()
  @IsOptional()
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as string[];
      } catch {
        return value.split(',').map((tag) => tag.trim());
      }
    }
    return value as string[];
  })
  hashtags?: string[];

  @IsString()
  @IsOptional()
  requiredResources?: string;
}
