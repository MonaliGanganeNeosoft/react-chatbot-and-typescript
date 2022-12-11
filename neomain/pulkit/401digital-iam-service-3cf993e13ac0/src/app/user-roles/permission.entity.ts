import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RoleEntity } from './roles.entity';

@Entity({ name: 'role_permissions' })
@Unique('uk_permissions', ['role', 'serviceType'])
export class PermissionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RoleEntity, (role) => role.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role' })
  role: string;

  @Column({ name: 'service_type' })
  serviceType: string;

  @Column({ name: 'can_read', type: 'boolean', default: false })
  canRead: boolean;

  @Column({ name: 'can_write', type: 'boolean', default: false })
  canWrite: boolean;

  @Column({ name: 'can_delete', type: 'boolean', default: false })
  canDelete: boolean;

  @Column({ name: 'can_update', type: 'boolean', default: false })
  canUpdate: boolean;
}
