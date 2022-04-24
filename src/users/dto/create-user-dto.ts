import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity } from '../entities/users.entity';
import { MutationOutputDto } from '../../common/dto/mutation-output.dto';

@InputType()
export class CreateUserDto extends PickType(UserEntity, [
  'email',
  'password',
  'role',
] as const) {}

@ObjectType()
export class CreateUserOutPutDto extends MutationOutputDto {}
