import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { DealershipEntity } from './dealership.entity';

@Entity({ name: 'dealership_lead_settings' })
@Unique('uk_dealership_lead_settings', ['country', 'leadTypeId', 'leadTierId', 'province', 'dealership'])
export class DealershipLeadSettingsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'country' })
    country: string;

    @Column({ name: 'province' })
    province: string;

    @Column({ name: 'lead_type_id' })
    leadTypeId: string;

    @Column({ name: 'lead_type_name' })
    leadTypeName: string;

    @Column({ name: 'lead_tier_id' })
    leadTierId: string;

    @Column({ name: 'lead_tier_name' })
    leadTierName: string;

    @Column({ name: 'postal_codes' })
    postalCodes: string;

    @Column({ name: 'active_zipcode', enum: ['inclusion', 'exclusion'] })
    activeZipCode: string;

    @ManyToOne(() => DealershipEntity, (dealership) => dealership.id, {
        onDelete: 'CASCADE',
    })
    dealership: string;

    @CreateDateColumn({ name: 'created_at', nullable: true, select: false })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true, select: false })
    updatedAt: Date;
}
