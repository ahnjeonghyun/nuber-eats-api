import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity } from '../entities/users.entity';
import { CoreOutputDto } from '../../common/dto/core-output.dto';

@InputType()
export class LoginInputDto extends PickType(UserEntity, [
  'email',
  'password',
] as const) {}

@ObjectType()
export class LoginOutputDto extends CoreOutputDto {
  @Field(() => String, { nullable: true })
  token?: string;
}
