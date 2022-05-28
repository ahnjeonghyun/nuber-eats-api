import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from '../../common/dto/core-output.dto';
import { UserEntity } from '../entities/users.entity';

@InputType()
export class EditProfileInputDto extends PickType(UserEntity, [
  'email',
  'password',
] as const) {}

@ObjectType()
export class EditProfileOutputDto extends CoreOutputDto {}
