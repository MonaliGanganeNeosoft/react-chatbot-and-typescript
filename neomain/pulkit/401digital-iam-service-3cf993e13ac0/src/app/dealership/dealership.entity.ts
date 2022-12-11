import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DealerGroupEntity } from '../dealer-groups/dealers-group.entity';
import { UsersEntity } from '../users/users.entity';
import { DealershipImageEntity } from './dealership-image.entity';
import { DealershipOpeningEntity } from './dealership-openinghours.entity';
import { DealershipLeadSettingsEntity } from './dealership-leadsettings.entity';
import { DealershipDmsEntity } from '../dealership-dms-mapping/dealership-dms.entity';

@Entity({ name: 'dealerships' })
export class DealershipEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'omvic_license', nullable: true })
    omvicLicense: string;

    @Column({
        name: 'omvic_license_expiry',
        nullable: true,
        length: 10,
    })
    omvicLicenseExpiry: string;

    @Column({ name: 'monthly_limit', type: 'integer', default: 0 })
    monthlyLimit: number;

    @Column({ name: 'daily_limit', type: 'integer', default: 0 })
    dailyLimit: number;

    @Column({ name: 'is_hq', type: 'boolean', default: false })
    isHQ: boolean;

    @Column({ name: 'is_bdc', type: 'boolean', default: false })
    isBDC: boolean;

    @Column({ name: 'is_visible', type: 'boolean', default: false })
    isVisible: boolean;

    @Column({ name: 'name', length: 255 })
    name: string;

    @ManyToOne(() => UsersEntity, (user) => user.id)
    @JoinColumn({ name: 'general_manager' })
    generalManager: string | UsersEntity;

    @Column({ name: 'address_line_1', length: 255, nullable: true })
    addressLine1: string;

    @Column({ name: 'address_line_2', length: 255, nullable: true })
    addressLine2: string;

    @Column({ name: 'city', length: 255, nullable: true })
    city: string;

    @Column({ name: 'province', length: 255, nullable: true })
    province: string;

    @Column({ name: 'longitude', length: 20, nullable: true })
    longitude: string;

    @Column({ name: 'latitude', length: 20, nullable: true })
    latitude: string;

    @Column({ name: 'country', length: 20, nullable: true })
    country: string;

    @Column({ name: 'phone', length: 20, nullable: true })
    phone: string;

    @Column({ name: 'postal_code', nullable: true })
    postalCode: string;

    @Column({ name: 'fax', length: 20, nullable: true })
    fax: string;

    @Column({ name: 'email', length: 255, nullable: true })
    email: string;

    @Column({ name: 'logo', length: 255, nullable: true })
    logoUrl: string;

    @Column({ name: 'principle_first_name', length: 255, nullable: true })
    principleFirstName: string;

    @Column({ name: 'principle_last_name', length: 255, nullable: true })
    principleLastName: string;

    @Column({ name: 'google_placeid', length: 255, nullable: true })
    googlePlaceId: string;

    @Column({ name: 'hst_number', length: 255, nullable: true })
    hstNumber: string;

    /** Customer Service */
    @Column({ name: 'customer_service_number', nullable: true })
    customerServiceNumber: string;

    @Column({ name: 'customer_service_email', nullable: true })
    customerServiceEmail: string;

    @Column({ name: 'parts_service_number', nullable: true })
    partsServiceNumber: string;

    @Column({ name: 'parts_service_email', nullable: true })
    partsServiceEmail: string;

    @Column({ name: 'service_number', nullable: true })
    serviceNumber: string;

    @Column({ name: 'service_email', nullable: true })
    serviceEmail: string;

    @Column({ name: 'sales_service_number', nullable: true })
    salesServiceNumber: string;

    @Column({ name: 'sales_service_email', nullable: true })
    salesServiceEmail: string;

    @Column({
        name: 'status',
        type: 'enum',
        enum: ['DRAFT', 'ACTIVE', 'INACTIVE'],
        default: 'DRAFT',
    })
    status: string;

    @Column({ name: 'domain_url', nullable: true })
    domainUrl: string;

    @Column({ name: 'dmsProvider', nullable: true })
    dmsProvider: string;

    @Column({ name: 'dmsId', nullable: true })
    dmsId: string;

    @Column({ name: 'cpdId', nullable: true })
    cpdId: string;

    @Column({ name: 'carfaxApiKey', nullable: true })
    carfaxApiKey: string;

    @Column({ name: 'blackBookApiKey', nullable: true })
    blackBookApiKey: string;

    @Column({ name: 'equiFaxApiKey', nullable: true })
    equiFaxApiKey: string;


    @ManyToOne(() => DealerGroupEntity, (dealerGroup) => dealerGroup.id)
    @JoinColumn({ name: 'dealer_group_id' })
    dealerGroup: string | DealerGroupEntity;

    @OneToMany(
        () => DealershipImageEntity,
        (dealerImage) => dealerImage.dealership,
    )
    images: DealershipImageEntity[];

    @OneToMany(
        () => DealershipOpeningEntity,
        (dealerImage) => dealerImage.dealership,
        { cascade: true },
    )
    openingHours: DealershipOpeningEntity[];

    @OneToMany(
        () => DealershipLeadSettingsEntity,
        (dealer) => dealer.dealership,
        { cascade: true },
    )
    leadSettings: DealershipLeadSettingsEntity[];

    @CreateDateColumn({ name: 'created_at', select: false })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', select: false })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true, name: 'deleted_at', select: false })
    deletedAt?: string;

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

    @OneToMany(() => DealershipDmsEntity, (dealerhipDms) => dealerhipDms.dealership)
    dealerhipDms: string;
}
