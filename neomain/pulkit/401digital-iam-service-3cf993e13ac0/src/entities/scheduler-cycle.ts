import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'scheduler_cycles' })
@Unique('sc_uk', ['serviceType', 'serialNumber'])
export class SchedulerCycleEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', name: 'service_type' })
  serviceType: string;

  @Column({ type: 'timestamp', name: 'last_cycle' })
  lastCycle: Date;

  @Column({ type: 'varchar', name: 'serial_number' })
  serialNumber: string;

  @Column({ type: 'int', name: 'duration' })
  duration: number;

  @Column({ type: 'varchar', name: 'duration_unit' })
  durationUnit: string;

  @Column({ type: 'boolean', name: 'enable_read' })
  enableRead: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
