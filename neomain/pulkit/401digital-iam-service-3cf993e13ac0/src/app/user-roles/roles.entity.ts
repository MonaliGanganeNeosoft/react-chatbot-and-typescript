import { Level } from 'src/constants';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DealerGroupEntity } from '../dealer-groups/dealers-group.entity';
import { UsersEntity } from '../users/users.entity';
import { PermissionsEntity } from './permission.entity';
import { RoleDealershipEntity } from './role-dealership.entity';

@Entity({ name: 'roles' })
export class RoleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'is_default', type: 'boolean', default: false })
    isDefault: boolean;

    @Column({ name: 'is_gm', type: 'boolean', default: false })
    isGM: boolean;

    @Column({ name: 'level' })
    level: Level;

    @Column({ name: 'active', type: 'boolean', default: true })
    active: boolean;

    @OneToMany(() => PermissionsEntity, (rolePermission) => rolePermission.role, {
        cascade: true,
    })
    permissions: PermissionsEntity[];


    @OneToMany(() => RoleDealershipEntity, (roleDealership) => roleDealership.role, {
        cascade: true,
    })
    dealerships: RoleDealershipEntity[];

    @Column({ name: 'can_receive_leads', type: 'boolean', default: false })
    canReceiveLeads: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => UsersEntity, (user) => user.id, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'created_by' })
    createdBy: string;

    @ManyToOne(() => UsersEntity, (user) => user.id, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'updated_by' })
    updatedBy: string;
}
