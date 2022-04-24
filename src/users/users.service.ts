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
  }: CreateUserInputDto): Promise<string | undefined> {
    try {
      const exists = await this.UserEntityRepository.findOne({ email });
      if (exists) {
        return 'There is a user with that email already';
      }
      await this.UserEntityRepository.save(
        this.UserEntityRepository.create({ email, password, role }),
      );
    } catch (e) {
      return "Couldn't create account";
    }
  }
}
