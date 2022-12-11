import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { DealershipEntity } from '../dealership/dealership.entity';
import { UsersEntity } from './users.entity';
import { RoleEntity } from '../user-roles/roles.entity';

@Entity({ name: 'user_roles' })
@Unique('uk_userroles', ['user', 'dealership', 'role'])
export class UserRoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RoleEntity, (role) => role.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  role: string | RoleEntity;

  @ManyToOne(() => DealershipEntity, (deaership) => deaership.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  dealership: string | DealershipEntity;

  @ManyToOne(() => UsersEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ referencedColumnName: 'id' })
  user: string | UsersEntity;
}
