import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity } from '../entities/users.entity';
import { MutationOutputDto } from '../../common/dto/mutation-output.dto';

@InputType()
export class LoginInputDto extends PickType(UserEntity, [
  'email',
  'password',
] as const) {}

@ObjectType()
export class LoginOutputDto extends MutationOutputDto {
  @Field(() => String, { nullable: true })
  token?: string;
}
