import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'skillsets' })
export class SkillSetEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'languages', type: 'simple-array', nullable: true })
  languages: string[];

  @Column({ name: 'lead_types', type: 'simple-array', nullable: true })
  leadTypes: string[];

  @Column({ name: 'vehicle_categories', type: 'simple-array', nullable: true })
  vehicleCategories: string[];

  @Column({ name: 'is_bdc', type: 'boolean', nullable: true })
  isBDC: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
