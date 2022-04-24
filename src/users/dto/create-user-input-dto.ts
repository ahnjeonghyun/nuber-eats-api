import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity } from '../entities/users.entity';

@InputType()
export class CreateUserInputDto extends PickType(UserEntity, [
  'email',
  'password',
  'role',
] as const) {}

@ObjectType()
export class CreateUserOutPutDto {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
}
