import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { DealershipEntity } from './dealership.entity';

@Entity({ name: 'dealership_images' })
export class DealershipImageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => DealershipEntity, (dealership) => dealership.id, {
        onDelete: 'CASCADE',
    })
    dealership: string;

    @Column({ name: 'url' })
    url: string;

    @Column({ name: 'key', nullable: true })
    key: string;

    @Column({ name: 'original_name', select: false })
    originalName: string;

    @CreateDateColumn({ name: 'uploaded_at', nullable: true, select: false })
    uploadedAt: Date;
}
