import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './entities/users.entity';
import { CreateUserDto, CreateUserOutPutDto } from './dto/create-user-dto';
import { LoginInputDto, LoginOutputDto } from './dto/login-dto';

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
}
