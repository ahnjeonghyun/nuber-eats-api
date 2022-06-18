import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { CoreEntity } from '../../common/entities/core.entity';
import { RestaurantsEntity } from './restaurants.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity('category')
export class CategoryEntity extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  @Length(5)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  iconImg: string;

  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  slug: string;

  @OneToMany(() => RestaurantsEntity, (restaurants) => restaurants.category)
  @Field(() => [RestaurantsEntity], { nullable: true })
  restaurants: RestaurantsEntity[];
}
