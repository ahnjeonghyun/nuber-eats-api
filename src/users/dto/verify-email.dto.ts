import { CoreOutputDto } from '../../common/dto/core-output.dto';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { VerificationEntity } from '../entities/verification.entity';

@ObjectType()
export class VerifyEmailOutputDto extends CoreOutputDto {}

@InputType()
export class VerifyEmailInputDto extends PickType(VerificationEntity, [
  'code',
] as const) {}
