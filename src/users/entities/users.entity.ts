import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';

type UserRole = 'client' | 'owner' | 'delivery';

@Entity()
export class UserEntity extends CoreEntity {
  @Column()
  email: number;

  @Column()
  password: string;

  @Column()
  role: UserRole;
}
