import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { DealerGroupEntity } from '../dealer-groups/dealers-group.entity';
import { DealershipEntity } from '../dealership/dealership.entity';
import { RoleEntity } from './roles.entity';

@Entity({ name: 'role_dealerships' })
@Unique('uk_role_dealerships', ['role', 'dealership', 'dealerGroup'])
export class RoleDealershipEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => RoleEntity, (role) => role.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role' })
    role: string;

    @ManyToOne(() => DealerGroupEntity, (dealerGroup) => dealerGroup.id, {
        nullable: true,
    })
    @JoinColumn({ name: 'dealergroup' })
    dealerGroup: string | DealerGroupEntity;

    @ManyToOne(() => DealershipEntity, (dealership) => dealership.id, {
        nullable: true,
        eager: true
    })
    @JoinColumn({ name: 'dealership' })
    dealership: string | DealershipEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date
}
