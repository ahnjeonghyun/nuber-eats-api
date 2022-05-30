import { CoreEntity } from '../../common/entities/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UserEntity } from './users.entity';
import { v4 as uuidv4 } from 'uuid';

@InputType({ isAbstract: true })
@ObjectType()
@Entity('verification')
export class VerificationEntity extends CoreEntity {
  @Column()
  @Field(() => String)
  code: string;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
