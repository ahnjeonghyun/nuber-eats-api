import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class RestaurantsResolver {
  @Query(() => Boolean)
  async Restaurants(): Promise<boolean> {
    return true;
  }
}
