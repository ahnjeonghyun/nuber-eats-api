import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryEntity } from './entities/category.entity';
import { RestaurantsEntity } from './entities/restaurants.entity';
import { RestaurantsResolver } from './restaurants.resolver';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantsEntity, CategoryEntity])],
  providers: [RestaurantsResolver, RestaurantsService],
})
export class RestaurantsModule {}
