import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity } from '../entities/users.entity';
import { CoreOutputDto } from '../../common/dto/core-output.dto';

@InputType()
export class UserProfileInputDto extends PickType(UserEntity, [
  'id',
] as const) {}

@ObjectType()
export class UserProfileOutputDto extends CoreOutputDto {
  @Field(() => UserEntity, { nullable: true })
  user?: UserEntity;
}
