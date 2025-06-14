import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { Idea } from '../idea/idea.entity';
import { Vote } from '../vote/vote.entity';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(Idea) private ideaRepo: Repository<Idea>,
    @InjectRepository(Vote) private voteRepo: Repository<Vote>,
    private jwtService: JwtService,
  ) {}

  async login(employeeId: string, password: string) {
    const user = await this.repo.findOne({ where: { employeeId } });
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, employeeId: user.employeeId };
    const token = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  async findById(id: string): Promise<UserWithoutPassword> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as UserWithoutPassword;
  }

  async findByIdInternal(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserActivity(id: string) {
    // Count ideas submitted by the user
    const ideasSubmitted = await this.ideaRepo.count({
      where: { user: { id } },
    });

    return {
      ideasSubmitted,
    };
  }
}
