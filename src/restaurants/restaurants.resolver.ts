import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../auth/auth-user.decorator';
import { UserEntity } from '../users/entities/users.entity';
import {
  CreateRestaurantInputDto,
  CreateRestaurantOutputDto,
} from './dto/create-restaurants.dto';
import { RestaurantsService } from './restaurants.service';

@Resolver()
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Mutation(() => CreateRestaurantOutputDto)
  async createRestaurant(
    @CurrentUser() authUser: UserEntity,
    @Args('input') createRestaurantInput: CreateRestaurantInputDto,
  ): Promise<CreateRestaurantOutputDto> {
    return this.restaurantsService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }
}
