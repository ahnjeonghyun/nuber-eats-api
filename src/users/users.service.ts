import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, CreateUserOutPutDto } from './dto/create-user-dto';
import { LoginInputDto, LoginOutputDto } from './dto/login-dto';
import { JwtService } from '../jwt/jwt.service';
import { EditProfileInputDto } from './dto/edit-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser({
    email,
    password,
    role,
  }: CreateUserDto): Promise<CreateUserOutPutDto> {
    try {
      const exists = await this.userEntityRepository.findOne({ email });

      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }

      await this.userEntityRepository.save(
        this.userEntityRepository.create({ email, password, role }),
      );
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({ email, password }: LoginInputDto): Promise<LoginOutputDto> {
    try {
      const user = await this.userEntityRepository.findOne({ email });
      if (!user) {
        return { ok: false, error: 'User not found' };
      }

      const checkPassword = await user.checkPassword(password);
      if (!checkPassword) {
        return { ok: false, error: 'Wrong password' };
      }
      const token = this.jwtService.sign(user.id);

      return { ok: true, token };
    } catch (e) {
      return { ok: false, error: 'error' };
    }
  }

  async findById(id: number): Promise<UserEntity> {
    try {
      return await this.userEntityRepository.findOne({ id });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async editProfile(
    id: number,
    input: EditProfileInputDto,
  ): Promise<UserEntity> {
    const user = await this.userEntityRepository.findOne(id);
    if (input.email) {
      user.email = input.email;
    }
    if (input.password) {
      user.password = input.password;
    }
    return await this.userEntityRepository.save(user);
  }
}
