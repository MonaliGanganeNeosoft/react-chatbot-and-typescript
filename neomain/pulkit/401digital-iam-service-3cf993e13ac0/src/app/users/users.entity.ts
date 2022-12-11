import { EmployeeEntity } from 'src/entities/employee';
import {
    Column,
    CreateDateColumn,
    Entity,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    OneToMany,
    Index,
    BeforeInsert,
    Tree,
    TreeChildren,
    TreeParent
} from 'typeorm';
import { DealerGroupEntity } from '../dealer-groups/dealers-group.entity';
import { DealershipEntity } from '../dealership/dealership.entity';
import { DepartmentEntity } from '../departments/departments.entity';
import { UserRoleEntity } from './user-roles.entity';
import { SkillSetEntity } from './users-skillset.entity';
import { UserDmsEntity } from '../user-dms-mapping/userDms.entity';

@Entity({ name: 'users' })
@Tree('materialized-path')
export class UsersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'username', update: false })
    username: string;

    @Column({ name: 'user_level' })
    userLevel: string;

    @Column({ name: 'password', select: false })
    password: string;

    @Column({
        name: 'is_default',
        type: 'boolean',
        default: false,
        update: false,
    })
    isDefault: boolean;

    @ManyToOne(() => DealershipEntity, (dealership) => dealership.id, {
        nullable: true,
    })
    @JoinColumn({ name: 'dealership' })
    dealership: string | DealershipEntity;

    @ManyToOne(() => DepartmentEntity, (department) => department.id, {
        nullable: true,
    })
    @JoinColumn({ name: 'department' })
    department: string | DepartmentEntity;

    @OneToMany(() => UserRoleEntity, (role) => role.user, { onDelete: 'CASCADE' })
    userRoles: UserRoleEntity[];

    @ManyToOne(() => DealerGroupEntity, (dealerGroup) => dealerGroup.id, {
        nullable: true,
    })
    @JoinColumn({ name: 'dealer_group' })
    dealerGroup: string | DealerGroupEntity;

    @OneToOne(() => EmployeeEntity, (employee) => employee.id, {
        cascade: true,
        nullable: true,
    })
    @JoinColumn({ name: 'profile' })
    profile: string | EmployeeEntity;

    @OneToOne(() => SkillSetEntity, (skillset) => skillset.id, {
        cascade: true,
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn({ name: 'skill_set' })
    skillSet: string | SkillSetEntity;

    @Column({
        name: 'last_login',
        type: 'timestamp with time zone',
        nullable: true,
    })
    lastLogin: Date;

    @Column({
        name: 'login_enabled',
        type: 'boolean',
        default: true,
    })
    loginEnabled: boolean;

    @Column({
        name: 'active',
        type: 'boolean',
        default: true,
    })
    active: boolean;

    @Column({
        name: 'required_password_update',
        type: 'boolean',
        default: false,
    })
    requiredPasswordUpdate: boolean;

    @Index()
    @Column({ type: 'date', name: 'password_expiry_date', nullable: true })
    passwordExpiryDate: Date;

    @TreeParent()
    reportsTo: string | UsersEntity

    @TreeChildren()
    reporters: UsersEntity[]

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

    @OneToMany(() => UserDmsEntity, (userDms) => userDms.user)
    dms: string;

    @BeforeInsert()
    beforeInsert() {
        this.username = this.username?.toLowerCase();
    }
}
