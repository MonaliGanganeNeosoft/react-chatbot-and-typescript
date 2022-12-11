import { DealershipEntity } from 'src/app/dealership/dealership.entity';
import { AccountStatus } from 'src/constants';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SkillSetEntity } from '../users/users-skillset.entity';
import { UsersEntity } from '../users/users.entity';

@Entity({ name: 'dealergroups' })
export class DealerGroupEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'int',
    })
    id: string;

    @Column({ name: 'name' })
    name: string;

    @OneToMany(() => DealershipEntity, (dealership) => dealership.dealerGroup)
    dealerships: string;

    @Column({
        name: 'status',
        type: 'enum',
        enum: [AccountStatus.ACTIVE, AccountStatus.INACTIVE],
        default: 'ACTIVE',
    })
    status: string;

    @Column({ name: 'address_line_1', nullable: true })
    addressLine1: string;

    @Column({ name: 'address_line_2', nullable: true })
    addressLine2: string;

    @Column({ name: 'city', nullable: true })
    city: string;

    @Column({ name: 'province', nullable: true })
    province: string;

    @Column({ name: 'country', nullable: true })
    country: string;

    @Column({ name: 'longitude', nullable: true })
    longitude: string;

    @Column({ name: 'latitude', nullable: true })
    latitude: string;

    @Column({ name: 'phone', nullable: true })
    phone: string;

    @Column({ name: 'fax', nullable: true })
    fax: string;

    @Column({ name: 'email', nullable: true })
    email: string;

    @Column({ name: 'principle_first_name', length: 255, nullable: true })
    principleFirstName: string;

    @Column({ name: 'principle_last_name', length: 255, nullable: true })
    principleLastName: string;

    @Column({ name: 'postal_code', nullable: true })
    postalCode: string;

    @ManyToOne(() => UsersEntity, (user) => user.id)
    @JoinColumn({ name: 'admin' })
    admin: string | UsersEntity

    @CreateDateColumn({ name: 'created_at', select: false })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', select: false })
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

    @Column({ name: 'logo', length: 255, nullable: true })
    logoUrl: string;

    @Column({ name: 'domain_url', nullable: true, default: '' })
    domainUrl: string;
}
