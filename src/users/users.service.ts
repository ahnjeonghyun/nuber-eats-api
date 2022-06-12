import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtService } from '../jwt/jwt.service';
import { MailService } from '../mail/mail.service';
import { CreateUserDto, CreateUserOutPutDto } from './dto/create-user-dto';
import {
  EditProfileInputDto,
  EditProfileOutputDto,
} from './dto/edit-profile.dto';
import { LoginInputDto, LoginOutputDto } from './dto/login-dto';
import { UserProfileOutputDto } from './dto/user-profilet.dto';
import { VerifyEmailOutputDto } from './dto/verify-email.dto';
import { UserEntity } from './entities/users.entity';
import { VerificationEntity } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(VerificationEntity)
    private readonly verificationEntityRepository: Repository<VerificationEntity>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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
      const verification = await this.verificationEntityRepository.save(
        this.verificationEntityRepository.create({
          user,
        }),
      );
      this.mailService.sendVerificationEmail(user.email, verification.code);
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
        const verification = await this.verificationEntityRepository.save(
          this.verificationEntityRepository.create({ user }),
        );
        this.mailService.sendVerificationEmail(user.email, verification.code);
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
        await this.verificationEntityRepository.delete({ id: verification.id });
        return { ok: true };
      }

      return { ok: false, error: 'Verification not found.' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
