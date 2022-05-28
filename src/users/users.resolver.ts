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

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => Boolean)
  async users(): Promise<boolean> {
    return true;
  }

  @Mutation(() => CreateUserOutPutDto)
  async createUser(
    @Args('input') input: CreateUserDto,
  ): Promise<CreateUserOutPutDto> {
    try {
      const { ok, error } = await this.usersService.createUser(input);

      if (error) {
        return { ok, error };
      }

      return { ok, error };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Mutation(() => LoginOutputDto)
  async login(@Args('input') loginDto: LoginInputDto): Promise<LoginOutputDto> {
    return await this.usersService.login(loginDto);
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
    try {
      const user = await this.usersService.findById(input.id);
      if (!user) throw new Error('User Not Found');
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error };
    }
  }

  @Mutation(() => EditProfileOutputDto)
  @UseGuards(AuthGuard)
  async editProfile(
    @CurrentUser() user: UserEntity,
    @Args('input') input: EditProfileInputDto,
  ): Promise<EditProfileOutputDto> {
    try {
      await this.usersService.editProfile(user.id, input);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
