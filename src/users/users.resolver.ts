import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './entities/users.entity';
import {
  CreateUserInputDto,
  CreateUserOutPutDto,
} from './dto/create-user-input-dto';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => Boolean)
  async users(): Promise<boolean> {
    return true;
  }

  @Mutation(() => CreateUserOutPutDto)
  async createUser(
    @Args('input') input: CreateUserInputDto,
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
}
