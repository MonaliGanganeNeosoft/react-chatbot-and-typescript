import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'scheduler_logs' })
export class SchedulerLogsEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ type: 'varchar', name: 'service_type' })
  serviceType: string;

  @Column({ type: 'varchar', name: 'serial_number', nullable: true })
  serialNumber: string;

  @Column({ name: 'start_time', type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ name: 'pbs_read_time', type: 'timestamp', nullable: true })
  pbsReadTime: Date;

  @Column({ name: 'error', type: 'text', nullable: true })
  error: string;

  @Column({ name: 'success', type: 'boolean', default: true })
  success: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
