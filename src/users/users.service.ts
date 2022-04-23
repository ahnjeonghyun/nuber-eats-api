import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserInputDto } from './dto/create-user-input-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserEntityRepository: Repository<UserEntity>,
  ) {}

  async createUser({
    email,
    password,
    role,
  }: CreateUserInputDto): Promise<boolean> {
    try {
      const exist = await this.UserEntityRepository.findOne({ email });
      if (exist) {
        return false;
      }

      await this.UserEntityRepository.save(
        await this.UserEntityRepository.create({ email, password, role }),
      );

      return true;
    } catch (error) {
      return false;
    }
  }
}
