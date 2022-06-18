import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

import { CoreEntity } from '../../common/entities/core.entity';
import { RestaurantsEntity } from '../../restaurants/entities/restaurants.entity';

enum UserRole {
  CLIENT,
  DELIVERY,
  OWNER,
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity('user')
export class UserEntity extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field()
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field(() => Boolean)
  @IsBoolean()
  verified: boolean;

  @OneToMany(() => RestaurantsEntity, (restaurants) => restaurants.owner)
  @Field(() => [RestaurantsEntity], { nullable: true })
  restaurants: RestaurantsEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashedPassword() {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      return bcrypt.compare(password, this.password);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
