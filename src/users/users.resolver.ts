import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './entities/users.entity';
import { CreateUserDto, CreateUserOutPutDto } from './dto/create-user-dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/auth-user.decorator';
import {
  UserProfileInputDto,
  UserProfileOutputDto,
} from './dto/user-profilet.dto';
import { LoginInputDto, LoginOutputDto } from './dto/login-dto';
import {
  EditProfileInputDto,
  EditProfileOutputDto,
} from './dto/edit-profile.dto';
import {
  VerifyEmailInputDto,
  VerifyEmailOutputDto,
} from './dto/verify-email.dto';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => CreateUserOutPutDto)
  async createUser(
    @Args('input') input: CreateUserDto,
  ): Promise<CreateUserOutPutDto> {
    return this.usersService.createUser(input);
  }

  @Mutation(() => LoginOutputDto)
  async login(@Args('input') loginDto: LoginInputDto): Promise<LoginOutputDto> {
    return this.usersService.login(loginDto);
  }

  @Query(() => UserEntity)
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  @Query(() => UserProfileOutputDto)
  @UseGuards(AuthGuard)
  async userProfile(
    @Args('input') input: UserProfileInputDto,
  ): Promise<UserProfileOutputDto> {
    return this.usersService.findById(input.id);
  }

  @Mutation(() => EditProfileOutputDto)
  @UseGuards(AuthGuard)
  async editProfile(
    @CurrentUser() user: UserEntity,
    @Args('input') input: EditProfileInputDto,
  ): Promise<EditProfileOutputDto> {
    return this.usersService.editProfile(user.id, input);
  }

  @Mutation(() => VerifyEmailOutputDto)
  @UseGuards(AuthGuard)
  async verifyEmail(
    @Args('input') { code }: VerifyEmailInputDto,
  ): Promise<VerifyEmailOutputDto> {
    return this.usersService.verifyEmail(code);
  }
}
