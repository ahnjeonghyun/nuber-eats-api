import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, CreateUserOutPutDto } from './dto/create-user-dto';
import { LoginInputDto, LoginOutputDto } from './dto/login-dto';
import { JwtService } from '../jwt/jwt.service';
import {
  EditProfileInputDto,
  EditProfileOutputDto,
} from './dto/edit-profile.dto';
import { VerificationEntity } from './entities/verification.entity';
import { VerifyEmailOutputDto } from './dto/verify-email.dto';
import { UserProfileOutputDto } from './dto/user-profilet.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(VerificationEntity)
    private readonly verificationEntityRepository: Repository<VerificationEntity>,
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

      const user = await this.userEntityRepository.save(
        this.userEntityRepository.create({ email, password, role }),
      );
      await this.verificationEntityRepository.save(
        this.verificationEntityRepository.create({
          user,
        }),
      );
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({ email, password }: LoginInputDto): Promise<LoginOutputDto> {
    try {
      const user = await this.userEntityRepository.findOne(
        { email },
        { select: ['password', 'id'] },
      );
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

  async findById(id: number): Promise<UserProfileOutputDto> {
    try {
      const user = await this.userEntityRepository.findOne({ id });
      if (!user) {
        throw new Error('User Not Found');
      }
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async editProfile(
    id: number,
    input: EditProfileInputDto,
  ): Promise<EditProfileOutputDto> {
    try {
      const user = await this.userEntityRepository.findOne(id);
      if (input.email) {
        user.email = input.email;
        user.verified = false;
        await this.verificationEntityRepository.save(
          this.verificationEntityRepository.create({ user }),
        );
      }
      if (input.password) {
        user.password = input.password;
      }
      await this.userEntityRepository.save(user);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutputDto> {
    try {
      const verification = await this.verificationEntityRepository.findOne(
        { code },
        { relations: ['user'] },
      );
      if (verification) {
        verification.user.verified = true;
        await this.userEntityRepository.save(verification.user);
        return { ok: true };
      }
      return { ok: false, error: 'Verification not found.' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
