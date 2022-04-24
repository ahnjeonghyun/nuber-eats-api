import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { Repository } from 'typeorm';
import {
  CreateUserInputDto,
  CreateUserOutPutDto,
} from './dto/create-user-input-dto';

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
  }: CreateUserInputDto): Promise<CreateUserOutPutDto> {
    try {
      const exists = await this.UserEntityRepository.findOne({ email });

      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }

      await this.UserEntityRepository.save(
        this.UserEntityRepository.create({ email, password, role }),
      );

      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Couldn't create account" };
    }
  }
}
