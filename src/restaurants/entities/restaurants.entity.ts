import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { CoreEntity } from '../../common/entities/core.entity';
import { UserEntity } from '../../users/entities/users.entity';
import { CategoryEntity } from './category.entity';

@InputType('RestaurantsInputType', { isAbstract: true })
@ObjectType()
@Entity('restaurants')
export class RestaurantsEntity extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  @Length(5)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  coverImg: string;

  @Column()
  @Field(() => String, {
    defaultValue: '강남',
  })
  @IsString()
  address: string;

  @ManyToOne(() => CategoryEntity, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field(() => CategoryEntity, { nullable: true })
  category: CategoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.restaurants, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => UserEntity, { nullable: true })
  owner: UserEntity;
}
