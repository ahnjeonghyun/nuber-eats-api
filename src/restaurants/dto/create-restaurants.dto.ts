import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

import { CoreOutputDto } from '../../common/dto/core-output.dto';
import { RestaurantsEntity } from '../entities/restaurants.entity';

@InputType()
export class CreateRestaurantInputDto extends PickType(RestaurantsEntity, [
  'name',
  'address',
  'coverImg',
] as const) {
  @Field(() => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutputDto extends CoreOutputDto {}
