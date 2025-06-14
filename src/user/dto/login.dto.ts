import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  employeeId: string;

  @IsString()
  password: string;
}
