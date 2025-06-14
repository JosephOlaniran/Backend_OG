import { IsBoolean } from 'class-validator';

export class CreateVoteDto {
  @IsBoolean()
  isUpvote: boolean;
}
