import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../users/entities/users.entity';
import {
  CreateRestaurantInputDto,
  CreateRestaurantOutputDto,
} from './dto/create-restaurants.dto';
import { CategoryEntity } from './entities/category.entity';
import { RestaurantsEntity } from './entities/restaurants.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(RestaurantsEntity)
    private readonly restaurantsEntityRepository: Repository<RestaurantsEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>,
  ) {}

  async createRestaurant(
    owner: UserEntity,
    createRestaurantInput: CreateRestaurantInputDto,
  ): Promise<CreateRestaurantOutputDto> {
    try {
      const newRestaurant = this.restaurantsEntityRepository.create(
        createRestaurantInput,
      );
      newRestaurant.owner = owner['user'];

      const categoryName = createRestaurantInput.categoryName
        .trim()
        .toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');

      let category = await this.categoryEntityRepository.findOne({
        slug: categorySlug,
      });

      if (!category) {
        category = await this.categoryEntityRepository.save(
          await this.categoryEntityRepository.create({
            slug: categorySlug,
            name: categoryName,
          }),
        );
      }
      newRestaurant.category = category;

      await this.restaurantsEntityRepository.save(newRestaurant);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }
}
