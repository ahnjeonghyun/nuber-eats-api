import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './entities/users.entity';
import { CreateUserInputDto } from './dto/create-user-input-dto';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => Boolean)
  async users(): Promise<boolean> {
    return true;
  }

  @Mutation(() => Boolean)
  async createUser(@Args('input') input: CreateUserInputDto): Promise<boolean> {
    return this.usersService.createUser(input);
  }
}
