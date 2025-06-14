import { User } from '../../user/user.entity';
import { IdeaStatus } from '../idea.entity';

export class IdeaResponseDto {
  id: number;
  title: string;
  description: string;
  category: string;
  impactLevel: string;
  hashtags: string[];
  attachmentUrls: string[];
  requiredResources: string;
  anonymousId: string;
  status: IdeaStatus;
  createdAt: Date;
  updatedAt: Date;
  commentCount: number;
  upVotes: number;
  downVotes: number;
  user: Omit<User, 'password'>;
}
