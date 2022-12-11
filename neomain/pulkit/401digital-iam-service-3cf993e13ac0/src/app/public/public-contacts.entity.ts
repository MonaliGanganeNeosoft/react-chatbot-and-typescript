import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DealershipEntity } from '../dealership/dealership.entity';

@Entity({ name: 'public_contacts' })
export class PublicContactsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'email', type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'phone', type: 'varchar', length: 15 })
  phone: string;

  @ManyToOne(() => DealershipEntity, (dealer) => dealer.id, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'location', referencedColumnName: 'id' })
  location: string;

  @Column({ name: 'location_name', nullable: true })
  locationName: string;

  @Column({ name: 'message', type: 'varchar', length: 500 })
  message: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
