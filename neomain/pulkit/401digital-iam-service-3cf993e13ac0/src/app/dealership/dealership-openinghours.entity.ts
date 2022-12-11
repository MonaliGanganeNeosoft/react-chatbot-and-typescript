import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { DealershipEntity } from './dealership.entity';

@Entity({ name: 'dealership_openinghours' })
@Unique('uk_openinghours', ['day', 'dealership'])
export class DealershipOpeningEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'day' })
  day: string;

  @Column({ name: 'start_time', nullable: true })
  startTime: string;

  @Column({ name: 'end_time', nullable: true })
  endTime: string;

  @Column({ name: 'is_closed', type: 'boolean', default: false })
  isClosed: boolean;

  @Column({ name: 'notes', length: 255, nullable: true })
  notes: string;

  @ManyToOne(() => DealershipEntity, (dealership) => dealership.id, {
    onDelete: 'CASCADE',
  })
  dealership: string;

  @CreateDateColumn({ name: 'created_at', nullable: true, select: false })
  createdAt: Date;
}
